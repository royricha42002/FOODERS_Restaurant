// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Checkout.css'; // Make sure to style it according to your needs

// const Checkout = () => {
//   const navigate = useNavigate();
  
//   const handleProceedToPayment = () => {
//     navigate('/successfullpayment');
//   };

//   const handleBackToOrderOnline = () => {
//     navigate('/orderonline');
//   };

//   // Load cart and customer details from localStorage
//   const cart = JSON.parse(localStorage.getItem('cart')) || [];
//   const customerDetails = JSON.parse(localStorage.getItem('customerDetails')) || {};

//   const getTotalPrice = () => {
//     const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
//     return total.toFixed(2);
//   };

//   const getGST = (amount) => {
//     const gstRate = 0.18; // 18% GST
//     return (amount * gstRate).toFixed(2);
//   };

//   const getFinalAmount = () => {
//     const total = parseFloat(getTotalPrice());
//     const gst = parseFloat(getGST(total));
//     return (total + gst).toFixed(2);
//   };

//   return (
//     <div className="checkout">
//       <h1>Checkout</h1>
//       <div className="checkout-summary">
//         <h2>Order Summary</h2>
//         <ul>
//           {cart.map((item, index) => (
//             <li key={index}>
//               {item.name} x {item.quantity}: Rs {item.price * item.quantity}
//             </li>
//           ))}
//         </ul>
//         <p>Subtotal: Rs {getTotalPrice()}</p>
//         <p>GST (18%): Rs {getGST(getTotalPrice())}</p>
//         <h2>Total Amount: Rs {getFinalAmount()}</h2>
//         <div className="delivery-details">
//           <h2>Delivery Address</h2>
//           <p>Name: {customerDetails.name}</p>
//           <p>Phone: {customerDetails.phone}</p>
//           <p>Address: {customerDetails.address}</p>
//         </div>
//         <div className="checkout-buttons">
//           <button className="back-to-order-button" onClick={handleBackToOrderOnline}>Make Changes</button>
//           <button className="proceed-button" onClick={handleProceedToPayment}>Proceed to Pay</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';
import { load } from '@cashfreepayments/cashfree-js';

const Checkout = () => {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const customerDetails = JSON.parse(localStorage.getItem('customerDetails')) || {};

  const getTotalPrice = () => {
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    return total.toFixed(2);
  };

  const getGST = (amount) => {
    const gstRate = 0.18; // 18% GST
    return (amount * gstRate).toFixed(2);
  };

  const getFinalAmount = () => {
    const total = parseFloat(getTotalPrice());
    const gst = parseFloat(getGST(total));
    return (total + gst).toFixed(2);
  };

  let cashfree;

  let initializeSDK = async function () {
    cashfree = await load({
      mode: "sandbox",
    });
  };

  initializeSDK();

  const [orderId, setOrderId] = useState(""); 

  const getSessionId = async () => {
    try {
      const finalAmount = getFinalAmount(); // Get the final amount
      let res = await axios.post("https://fooders-restaurant-backendcode.onrender.com/payment", { finalAmount }); // Pass finalAmount to backend
      if (res.data && res.data.payment_session_id) {
        console.log(res.data);
        setOrderId(res.data.order_id);
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyPayment = async (orderId) => {
    try {
      let res = await axios.post("https://fooders-restaurant-backendcode.onrender.com/verify", {
        orderId: orderId
      });

      if (res && res.data) {
        alert("Payment verified successfully");

        // Save the order in the backend after successful payment
        const orderData = {
          customerDetails,
          items: cart,
          totalPrice: getFinalAmount(),
        };

        await axios.post('https://fooders-restaurant-backendcode.onrender.com/api/v1/orders', orderData);

        navigate('/successfullpayment'); // Navigate to /successfullpayment after successful payment
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    try {
      let sessionId = await getSessionId();
      let checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then((res) => {
        console.log("Payment initialized");
        verifyPayment(orderId); // Pass the orderId here
      });

    } catch (error) {
      console.log(error);
    }
  };

  const handleBackToOrderOnline = () => {
    navigate('/orderonline');
  };

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <div className="checkout-summary">
        <h2>Order Summary</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} x {item.quantity}: Rs {item.price * item.quantity}
            </li>
          ))}
        </ul>
        <p>Subtotal: Rs {getTotalPrice()}</p>
        <p>GST (18%): Rs {getGST(getTotalPrice())}</p>
        <h2>Total Amount: Rs {getFinalAmount()}</h2>
        <div className="delivery-details">
          <h2>Delivery Address</h2>
          <p>Name: {customerDetails.name}</p>
          <p>Phone: {customerDetails.phone}</p>
          <p>Address: {customerDetails.flatNumber}, {customerDetails.street}, {customerDetails.city}, {customerDetails.state} - {customerDetails.postalCode}</p>
        </div>
        <div className="checkout-buttons">
          <button className="back-to-order-button" onClick={handleBackToOrderOnline}>Make Changes</button>
          <button className="proceed-button" onClick={handleProceedToPayment}>Proceed to Pay</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

