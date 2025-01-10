import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from 'dotenv';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import {logger} from "./utils/Logger"
import authRoutes from './routes/auth';
import managerRoutes from './routes/manager';
import pantryRoutes from './routes/pantry';
import deliveryRoutes from './routes/delivery';
import dotenv from 'dotenv';
import path = require('path');

dotenv.config();
// import dietRoutes from './routes/diet';
// import deliveryRoutes from './routes/delivery';


// Load environment variables
config();
const _dirname= path.resolve();
const app: Express = express();

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(cors({
  origin: 'https://hospital-food-management-eight.vercel.app/login'  // Frontend URL
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')) // HTTP request logger



app.use('/api/auth', authRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/deliveries', deliveryRoutes);

// Error handling middleware
app.use(errorHandler);
app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get('*', (req,res)=>{
  res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
})
// Start server
const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
