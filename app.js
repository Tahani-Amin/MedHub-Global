import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import userRoutes from './userRoutes/userRoute.js';
import productRoutes from './userRoutes/productRoute.js';
import path from 'path';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));


// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
