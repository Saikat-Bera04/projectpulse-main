const { getGitHubUser } = require("../utils/github");

// Session-based authentication middleware
exports.authenticateToken = async (req, res, next) => {
    try {
        // Check for token in session first
        if (req.session && req.session.user) {
            req.user = req.session.user;
            req.token = req.session.token;
            return next();
        }

        // Fallback to token-based auth
        const authHeader = req.headers.authorization;
        let token = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else if (req.cookies && req.cookies.github_token) {
            // Fallback to cookie-based auth
            token = req.cookies.github_token;
        }

        if (!token) {
            console.log('No authentication token found');
            return res.status(401).json({ error: "Authentication required. Please log in again." });
        }

        // Verify token by fetching user info from GitHub
        const user = await getGitHubUser(token);
        
        if (!user) {
            console.log('Invalid or expired GitHub token');
            return res.status(401).json({ 
                error: "Your session has expired. Please log in again.",
                requiresReauth: true
            });
        }

        // Store user and token in session for subsequent requests
        if (req.session) {
            req.session.user = user;
            req.session.token = token;
        }

        // Attach to request
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        if (error.response) {
            console.error("GitHub API response:", error.response.data);
        }
        res.status(401).json({ 
            error: "Authentication failed. Please try logging in again.",
            requiresReauth: true
        });
    }
};

// Optional: Middleware to refresh token if needed
exports.refreshTokenIfNeeded = async (req, res, next) => {
    try {
        // Skip if we already have a valid session
        if (req.session && req.session.user) {
            return next();
        }
        
        // Check for refresh token
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return next();
        }

        // Here you would implement token refresh logic
        // For now, we'll just pass through
        next();
    } catch (error) {
        console.error('Token refresh error:', error);
        next();
    }
};
