import Product from '../models/productModel.js';
import User from '../models/userModel.js';


// Handles creatipn of a new product

export const createProduct = async (req, res) => {
    const { name, category, price, availability } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (!name) {
        return res.status(400).json({ message: 'Product name is required' });
    }

    try {
        const newProduct = new Product({
            name, category, price, availability,
            userId: req.user.userId,
            imageUrl: imageUrl
        });

        await newProduct.save();

        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create product', error: err.message });
    }
};


// Retrieves all products from the database

// Retrieves a single product by its ID
export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id).populate('userId', 'name email');
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({ message: 'Product retrieved successfully', product });
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve product', error: err.message });
    }
};


// Updates an existing product by its ID
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        Object.assign(product, updates);
        await product.save();

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update product', error: err.message });
    }
};

// Deletes a product by its ID
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // If user is not admin, they can only delete their own product
        if (req.user.role !== 'admin' && product.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete product', error: err.message });
    }
};


// Retrieves users along with their products using aggregation
export const usersWithProducts = async (req, res) => {
    try {
        const result = await User.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'products'
                }
            },
            { $project: { name: 1, email: 1, products: 1 } }
        ]);
        res.status(200).json({ message: 'Users with their products retrieved', data: result });
    } catch (err) {
        res.status(500).json({ message: 'Aggregation failed', error: err.message });
    }
};

// Retrieves product count by category using aggregation
export const productCountByCategory = async (req, res) => {
    try {
        const result = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $project: { category: '$_id', count: 1, _id: 0 } }
        ]);
        res.status(200).json({ message: 'Product count by category', data: result });
    } catch (err) {
        res.status(500).json({ message: 'Aggregation failed', error: err.message });
    }
};



export const getAllProducts = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Search & Filtering
        const { name, category, minPrice, maxPrice, available } = req.query;
        let filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (category) {
            filter.category = { $regex: category, $options: 'i' };
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }
        if (available !== undefined) {
            filter.availability = available === 'true';
        }

        const products = await Product.find(filter)
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            message: 'Products retrieved successfully',
            page,
            limit,
            total,
            products
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve products', error: err.message });
    }
};

import { createObjectCsvStringifier } from 'csv-writer';

// Admin: Export product data as CSV
export const exportProductsCSV = async (req, res) => {
    try {
        const products = await Product.find();

        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'name', title: 'Name' },
                { id: 'category', title: 'Category' },
                { id: 'price', title: 'Price' },
                { id: 'availability', title: 'Availability' },
                { id: 'userId', title: 'UserID' },
                { id: 'imageUrl', title: 'Image' }
            ]
        });

        const header = csvStringifier.getHeaderString();
        const records = csvStringifier.stringifyRecords(products.map(prod => ({
            name: prod.name,
            category: prod.category,
            price: prod.price,
            availability: prod.availability,
            userId: prod.userId,
            imageUrl: prod.imageUrl
        })));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
        res.status(200).send(header + records);
    } catch (err) {
        res.status(500).json({ message: 'Failed to export CSV', error: err.message });
    }
};
