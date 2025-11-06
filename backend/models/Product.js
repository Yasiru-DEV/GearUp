import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, trim: true, lowercase: true, index: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  price: { type: Number, required: true, default: 0 },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
