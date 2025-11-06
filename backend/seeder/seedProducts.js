import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';

dotenv.config();

const products = [
  { name: 'USB-C Charger 65W', description: 'Fast charging USB-C power adapter', price: 25.99, stock: 50, category: 'Accessories', imageUrl: 'https://res.cloudinary.com/dklulyzg2/image/upload/v1762404289/images_1_bw9109.jpg' },
  { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with USB receiver', price: 18.50, stock: 100, category: 'Accessories', imageUrl: 'https://res.cloudinary.com/dklulyzg2/image/upload/v1762404289/w_600_h_600_fit_crop_nnpaty.avif' },
  { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard - Blue switches', price: 79.99, stock: 20, category: 'Peripherals', imageUrl: 'https://res.cloudinary.com/dklulyzg2/image/upload/v1762404289/download_l67l00.jpg' },
  { name: '27" 4K Monitor', description: '4K UHD IPS monitor with HDR', price: 299.99, stock: 10, category: 'Monitors', imageUrl: 'https://res.cloudinary.com/dklulyzg2/image/upload/v1762406076/download_1_bpnbdb.jpg' },
  { name: 'External SSD 1TB', description: 'Portable NVMe SSD 1TB', price: 149.99, stock: 40, category: 'Storage', imageUrl: 'https://res.cloudinary.com/dklulyzg2/image/upload/v1762406076/download_2_zppmzr.jpg' },
  { name: 'Webcam 1080p', description: 'Full HD webcam with built-in mic', price: 49.99, stock: 60, category: 'Accessories',imageUrl: 'https://res.cloudinary.com/dklulyzg2/image/upload/v1762406076/download_bygkcc.jpg' },
  { name: 'Bluetooth Headphones', description: 'Over-ear noise cancelling headphones', price: 129.99, stock: 30, category: 'Audio', imageUrl: 'https://res.cloudinary.com/dklulyzg2/image/upload/v1762406076/download_3_djsrcd.jpg' },
  { name: 'Smartwatch', description: 'Fitness track + notifications', price: 99.99, stock: 25, category: 'Wearables', imageUrl: 'https://res.cloudinary.com/dklulyzg2/image/upload/v1762406076/download_4_ztyylu.jpg' },
  { name: 'Gaming Chair', description: 'Comfortable chair for long gaming sessions', price: 199.99, stock: 15, category: 'Furniture', imageUrl: 'https://res.cloudinary.com/dklulyzg2/image/upload/v1762406076/download_5_wo4pox.jpg' },
];

const importData = async () => {
  try {
    await connectDB();
    const db = mongoose.connection;
    const coll = db.collection('products');
    await coll.deleteMany({});
    const docs = products.map(p => ({ ...p, slug: (p.name || '').toLowerCase().replace(/\s+/g,'-'), createdAt: new Date() }));
    const result = await coll.insertMany(docs);
    console.log(`Inserted ${result.insertedCount} products`);
    process.exit(0);
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

importData();
