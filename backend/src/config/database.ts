//database config file
import { logger } from "@/utils/Logger";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();


interface DatabaseConfig {
  url: string;
  options: mongoose.ConnectOptions;
}

export const dbConfig: DatabaseConfig = {
  url: process.env.MONGODB_URI,
  options: {
    autoIndex: true,
  },
};

export const connectDatabase = async (): Promise<void> => {
    try{
        const res= await mongoose.connect(dbConfig.url, dbConfig.options);
        logger.info('Successfully connected to database');

    }catch(error){
        logger.error('Error connecting to database:', error);
        process.exit(1);
    }
};
