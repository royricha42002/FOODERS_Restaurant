import express from 'express';
import Order from '../model/orderModel.js'; 

const router = express.Router();

router.post('/orders', async (req, res) => {
  try {
    console.log("Order data received:", req.body); // Log the incoming order data
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: 'Order saved successfully' });
  } catch (error) {
    console.error("Error saving the order:", error);
    res.status(500).json({ message: 'Error saving the order', error });
  }
});



// import express from 'express';
// import Order from '../model/orderModel.js'; 
// import { sendSms } from '../service/smsService.js'; // Import the sendSms function

// const router = express.Router();

// router.post('/orders', async (req, res) => {
//   try {
//     console.log("Order data received:", req.body); // Log the incoming order data
//     const newOrder = new Order(req.body);
//     await newOrder.save();
//     res.status(201).json({ message: 'Order saved successfully' });
//     // Prepare the SMS content
//     const { customerDetails, items, totalPrice } = req.body;
//     const orderDetails = items
//       .map(item => `${item.name} x ${item.quantity}: Rs ${item.price * item.quantity}`)
//       .join('\n');
//     const messageBody = `
//       Your order has been placed successfully!
//       Order Details:
//       ${orderDetails}
//       Total Price: Rs ${totalPrice}

//       Delivery Address:
//       ${customerDetails.flatNumber}, ${customerDetails.street}, ${customerDetails.city}, ${customerDetails.state} - ${customerDetails.postalCode}

//       Thank you for shopping with us!
//     `;

//     // Send SMS to the customer
//     await sendSms(customerDetails.phone, messageBody);

//     res.status(201).json({ message: 'Order saved and SMS sent successfully.' });
//   } catch (error) {
//     console.error("Error saving the order:", error);
//     res.status(500).json({ message: 'Error saving the order', error });
//   }
// });

export default router;
