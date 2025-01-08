//database config file
import { logger } from "@/utils/Logger";
import mongoose from "mongoose";


interface DatabaseConfig {
  url: string;
  options: mongoose.ConnectOptions;
}

export const dbConfig: DatabaseConfig = {
  url: process.env.MONGODB_URI || "mongodb+srv://mmayankconnect:s3c9p1IjMMv9hfoR@cluster0.edkq9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
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
