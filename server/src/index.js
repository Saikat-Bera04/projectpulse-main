const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const githubRoutes = require("./routes/github.routes");
const tasksRoutes = require("./routes/tasks.routes");
const { authenticateToken } = require('./middleware/auth');

const app = express();

// Configure CORS with proper credentials support
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ];
        
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET || 'your-secret-key'));

// Session configuration
const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
};

// Use Redis for session store in production
if (process.env.REDIS_URL) {
    const redisClient = createClient({
        url: process.env.REDIS_URL
    });
    redisClient.connect().catch(console.error);
    
    sessionConfig.store = new RedisStore({
        client: redisClient,
        prefix: 'sess:',
        ttl: 86400 // 24 hours
    });
}

app.use(session(sessionConfig));

// Log session info for debugging
app.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session data:', req.session);
    next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/github", authenticateToken, githubRoutes);
app.use("/api/tasks", authenticateToken, tasksRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ 
        status: "OK", 
        timestamp: new Date().toISOString(),
        session: req.sessionID ? 'active' : 'none'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`CORS allowed origins: ${corsOptions.origin}`);
});


