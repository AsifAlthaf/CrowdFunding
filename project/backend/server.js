import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';
import documentRoutes from './routes/document.routes.js';
import investmentRoutes from './routes/investment.routes.js';
import reviewRoutes from './routes/review.routes.js';
import messageRoutes from './routes/message.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import companyRoutes from './routes/company.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import paymentRoutes from './routes/payment.routes.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { protect } from './middleware/auth.middleware.js';
import cron from 'node-cron';
import { lockExpiredProjects } from './controllers/project.controller.js';

// Initialize dotenv configuration first
dotenv.config();

const startServer = async () => {
  try {
    const app = express();
    const httpServer = createServer(app);

    // Configure Socket.IO
    const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
      }
    });

    // Middleware
    app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: false, // Disable CSP for local development stability
    }));

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
    app.use(cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86400
    }));

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Handle preflight requests
    app.options('*', cors());

    app.use(apiLimiter);

    // Serve uploaded files
    app.use('/uploads', express.static('uploads'));

    app.get('/uploads/:type/:filename', protect, (req, res) => {
      const { type, filename } = req.params;
      res.sendFile(`uploads/${type}/${filename}`);
    });

    // Socket.IO connection handling
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });

      // Handle project updates
      socket.on('projectUpdate', (data) => {
        io.emit('projectUpdated', data);
      });

      // Handle new projects
      socket.on('newProject', (data) => {
        io.emit('projectCreated', data);
      });
    });

    // Make io accessible to routes
    app.set('io', io);

    // Schedule project locking (every hour)
    cron.schedule('0 * * * *', () => {
      console.log('Running cron job for project locking...');
      lockExpiredProjects();
    });


    // Health check route
    app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString()
      });
    });

    // Root route
    app.get('/', (req, res) => {
      res.send('API is running...');
    });

    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/projects', projectRoutes);
    app.use('/api/documents', documentRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/investments', investmentRoutes);
    app.use('/api/payment', paymentRoutes);
    app.use('/api/reviews', reviewRoutes);
    app.use('/api/messages', messageRoutes);
    app.use('/api/complaints', complaintRoutes);
    app.use('/api/companies', companyRoutes);

    // Error Handler
    app.use(errorHandler);
    

    // Connect to MongoDB first
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');

    // Start the server
    const PORT = process.env.PORT || 5000;
    
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`WebSocket server is ready`);
      console.log(`Frontend URL: http://localhost:5173`);
      console.log(`API URL: http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer().catch(error => {
  console.error('Server startup error:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't crash the server, just log the error
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't crash the server, just log the error
});
