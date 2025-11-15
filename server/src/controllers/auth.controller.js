import { getGitHubAccessToken, getGitHubUser } from "../utils/github.js";
import prisma from '../config/prisma.js';

export const githubLogin = (req, res) => {
    const redirectURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email repo&redirect_uri=${process.env.GITHUB_CALLBACK_URL}`;
    
    res.redirect(redirectURL);
};

export const githubCallback = async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).json({ error: "Authorization code not provided" });
    }

    try {
        // Get access token using utility function
        const accessToken = await getGitHubAccessToken(code);
        
        if (!accessToken) {
            return res.status(400).json({ error: "Failed to get access token" });
        }

        // Fetch GitHub user profile using utility function
        const githubUser = await getGitHubUser(accessToken);

        // Find or create user in database
        let user = await prisma.user.upsert({
            where: { githubId: String(githubUser.id) },
            update: {
                githubAccessToken: accessToken,
                name: githubUser.name || githubUser.login,
                email: githubUser.email,
                avatarUrl: githubUser.avatar_url,
                githubUsername: githubUser.login,
                bio: githubUser.bio,
                location: githubUser.location,
                company: githubUser.company,
                website: githubUser.blog,
                lastLogin: new Date(),
            },
            create: {
                githubId: String(githubUser.id),
                githubUsername: githubUser.login,
                email: githubUser.email || `${githubUser.login}@github.local`,
                name: githubUser.name || githubUser.login,
                githubAccessToken: accessToken,
                avatarUrl: githubUser.avatar_url,
                bio: githubUser.bio,
                location: githubUser.location,
                company: githubUser.company,
                website: githubUser.blog,
                lastLogin: new Date(),
            },
        });

        // Set user session
        req.session.userId = user.id;

        // Store token and user info in secure cookies
        res.cookie("github_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.cookie("user", JSON.stringify({
            id: user.id,
            login: user.githubUsername,
            name: user.name,
            email: user.email,
            avatar_url: user.avatarUrl
        }), {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Redirect to frontend dashboard
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?auth=success`);
    } catch (err) {
        console.error("GitHub OAuth Error:", err.message);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
    }
};

export const logout = (req, res) => {
    // Clear session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
    });

    // Clear cookies
    res.clearCookie("github_token");
    res.clearCookie("user");
    res.clearCookie("connect.sid");
    
    res.json({ message: "Logged out successfully" });
};

export const getUser = async (req, res) => {
    try {
        // Check if user is authenticated via session
        if (req.session.userId) {
            const user = await prisma.user.findUnique({
                where: { id: req.session.userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    githubUsername: true,
                    avatarUrl: true,
                    bio: true,
                    location: true,
                    company: true,
                    website: true,
                    role: true,
                    skills: true,
                    interests: true,
                },
            });

            if (user) {
                return res.json({ 
                    user: {
                        id: user.id,
                        login: user.githubUsername,
                        name: user.name,
                        email: user.email,
                        avatar_url: user.avatarUrl,
                        bio: user.bio,
                        location: user.location,
                        company: user.company,
                        website: user.website,
                        role: user.role,
                        skills: user.skills,
                        interests: user.interests,
                    }
                });
            }
        }

        // Fallback to cookie-based auth
        const userCookie = req.cookies.user;
        if (userCookie) {
            return res.json({ user: JSON.parse(userCookie) });
        }

        res.status(401).json({ error: "Not authenticated" });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

export const exchangeCode = async (req, res) => {
    const { code, callback_url } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Authorization code not provided" });
    }

    try {
        // Get access token using utility function
        const accessToken = await getGitHubAccessToken(code);
        
        if (!accessToken) {
            return res.status(400).json({ error: "Failed to get access token" });
        }

        // Fetch GitHub user profile using utility function
        const user = await getGitHubUser(accessToken);

        res.json({
            access_token: accessToken,
            user: {
                id: user.id,
                login: user.login,
                name: user.name,
                email: user.email,
                avatar_url: user.avatar_url
            }
        });
    } catch (err) {
        console.error("GitHub OAuth Error:", err.message);
        res.status(400).json({ error: "OAuth exchange failed" });
    }
};

export const verifyToken = async (req, res) => {
    try {
        // Token verification is handled by middleware
        res.json({ valid: true, user: req.user });
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};
