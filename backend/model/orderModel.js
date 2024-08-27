import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      flatNumber: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    totalPrice: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
  });
  

const Order = mongoose.model('Order', orderSchema);

export default Order;
