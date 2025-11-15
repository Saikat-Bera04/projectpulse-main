import { getGitHubAccessToken, getGitHubUser } from "../utils/github.js";
import prisma from '../config/prisma.js';

export const githubLogin = (req, res) => {
    // Validate required env vars before redirecting
    const missing = [];
    if (!process.env.GITHUB_CLIENT_ID) missing.push('GITHUB_CLIENT_ID');
    if (!process.env.GITHUB_CALLBACK_URL) missing.push('GITHUB_CALLBACK_URL');
    if (missing.length) {
        console.error('Missing required env vars for GitHub OAuth:', missing);
        return res.status(500).json({
            error: 'Server is not configured for GitHub OAuth',
            missing
        });
    }

    const redirectURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email repo&redirect_uri=${encodeURIComponent(process.env.GITHUB_CALLBACK_URL)}`;

    res.redirect(redirectURL);
};

export const githubCallback = async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

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
        
        if (!githubUser || !githubUser.id) {
            throw new Error("Failed to fetch GitHub user data");
        }

        // Find or create user in database
        let user = await prisma.user.upsert({
            where: { githubId: String(githubUser.id) },
            update: {
                githubAccessToken: accessToken,
                name: githubUser.name || githubUser.login,
                email: githubUser.email || undefined,
                avatarUrl: githubUser.avatar_url,
                githubUsername: githubUser.login,
                bio: githubUser.bio || null,
                location: githubUser.location || null,
                company: githubUser.company || null,
                website: githubUser.blog || null,
                lastLogin: new Date(),
            },
            create: {
                githubId: String(githubUser.id),
                githubUsername: githubUser.login,
                email: githubUser.email || `${githubUser.login}@github.local`,
                name: githubUser.name || githubUser.login,
                githubAccessToken: accessToken,
                avatarUrl: githubUser.avatar_url,
                bio: githubUser.bio || null,
                location: githubUser.location || null,
                company: githubUser.company || null,
                website: githubUser.blog || null,
                lastLogin: new Date(),
            },
            select: {
                id: true,
                name: true,
                email: true,
                githubUsername: true,
                avatarUrl: true,
                role: true
            }
        });

        // Set user session
        req.session.userId = user.id;
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Failed to save session' });
            }

            // Set user info in a non-httpOnly cookie for client-side access
            res.cookie('user', JSON.stringify({
                id: user.id,
                login: user.githubUsername,
                name: user.name,
                email: user.email,
                avatar_url: user.avatarUrl,
                role: user.role
            }), {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost'
            });

            // Set secure httpOnly token cookie
            res.cookie('token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost'
            });

            // Redirect to frontend with success state
            const redirectUrl = state 
                ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}${decodeURIComponent(state)}`
                : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
                
            res.redirect(redirectUrl);
        });
    } catch (err) {
        console.error("GitHub OAuth Error:", err.message);
        if (err.response) {
            console.error('GitHub OAuth error response:', err.response.data);
        }
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

export const authDebug = (req, res) => {
    // Expose only non-sensitive diagnostics
    const allowedOrigins = [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ];
    res.json({
        node_env: process.env.NODE_ENV,
        has_github_client_id: Boolean(process.env.GITHUB_CLIENT_ID),
        has_github_client_secret: Boolean(process.env.GITHUB_CLIENT_SECRET),
        github_callback_url: process.env.GITHUB_CALLBACK_URL,
        frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',
        session_cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        },
        cors_allowed_origins: allowedOrigins
    });
};
