require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./src/db');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const boardRoutes = require('./src/routes/board');
const postRoutes = require('./src/routes/post');
const { registerSocketHandlers } = require('./src/socket');

const app = express();
const httpServer = http.createServer(app);

const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
  .split(',').map((o) => o.trim());

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());

const io = new Server(httpServer, {
  cors: { origin: corsOrigins, methods: ['GET', 'POST'], credentials: true },
});

app.locals.io = io;

// REST Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/boards', boardRoutes);
app.use('/posts', postRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CollabSpace API' });
});

// Root
app.get('/', (req, res) => {
  res.json({ message: 'CollabSpace API', version: '2.0.0', docs: '/health' });
});

// Socket.io - register all real-time event handlers
io.on('connection', (socket) => {
  registerSocketHandlers(io, socket);
});

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log('CollabSpace API running on port ' + PORT);
  });
});

module.exports = { app, io };