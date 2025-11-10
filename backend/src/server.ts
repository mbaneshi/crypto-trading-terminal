import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server and Socket.IO
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.get('/api/tokens', (req: Request, res: Response) => {
  // TODO: Implement token listing
  res.json({ tokens: [] });
});

app.get('/api/tokens/:id', (req: Request, res: Response) => {
  // TODO: Implement token details
  res.json({ token: null });
});

app.get('/api/tokens/:id/price', (req: Request, res: Response) => {
  // TODO: Implement price fetching
  res.json({ price: 0 });
});

app.get('/api/charts/:id/ohlcv', (req: Request, res: Response) => {
  // TODO: Implement OHLCV data
  res.json({ data: [] });
});

app.get('/api/portfolio', (req: Request, res: Response) => {
  // TODO: Implement portfolio fetching
  res.json({ portfolio: null });
});

app.get('/api/transactions', (req: Request, res: Response) => {
  // TODO: Implement transaction history
  res.json({ transactions: [] });
});

app.post('/api/alerts', (req: Request, res: Response) => {
  // TODO: Implement alert creation
  res.json({ alert: null });
});

app.get('/api/alerts', (req: Request, res: Response) => {
  // TODO: Implement alert listing
  res.json({ alerts: [] });
});

// WebSocket connections
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle token subscription
  socket.on('subscribe', ({ tokenId }) => {
    socket.join(`token:${tokenId}`);
    console.log(`Client ${socket.id} subscribed to token: ${tokenId}`);
  });

  // Handle token unsubscription
  socket.on('unsubscribe', ({ tokenId }) => {
    socket.leave(`token:${tokenId}`);
    console.log(`Client ${socket.id} unsubscribed from token: ${tokenId}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Price update broadcaster (example)
// In production, this would fetch real prices from blockchain/APIs
setInterval(() => {
  // Broadcast price updates to all subscribed clients
  io.to('token:SOL').emit('priceUpdate', {
    tokenId: 'SOL',
    price: Math.random() * 100,
    change24h: (Math.random() - 0.5) * 10,
    volume24h: Math.random() * 1000000,
    timestamp: Date.now(),
  });
}, 1000);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`WebSocket server ready`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export { app, io };
