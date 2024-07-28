import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './orderOnline.css'; // Import your CSS for styling
const menuData = [
  {
    "cuisine": "Indian",
    "sections": [
      {
        "name": "Starters",
        "items": [
          { "name": "Paneer Tikka", "price": 180, "image": "./paneertikka.jpeg" },
          { "name": "Samosa", "price": 25, "image": "./samosa.jpeg" },
          { "name": "Chole Bhature", "price": 150, "image": "./cholebhature.jpeg" },
          { "name": "Aloo Tikki", "price": 100, "image": "./alootikki.jpeg" },
          { "name": "Veg Pakora", "price": 150, "image": "./vegpakoda.jpeg" }
        ]
      },
      {
        "name": "Main Course",
        "items": [
          { "name": "Butter Chicken", "price": 250, "image": "./butterchicken.jpeg" },
          { "name": "Palak Paneer", "price": 180, "image": "./palakpaneer.jpeg" },
          { "name": "Biryani", "price": 300, "image": "./biryani.jpeg" },
          { "name": "Dal Makhani", "price": 180, "image": "./dalmakhani.jpeg" },
          { "name": "Rogan Josh", "price": 300, "image": "./roganjosh.jpeg" }
        ]
      },
      {
        "name": "Breads",
        "items": [
          { "name": "Naan", "price": 25, "image": "./naan.jpeg" },
          { "name": "Roti", "price": 10, "image": "./roti.jpeg" },
          { "name": "Aloo Paratha", "price": 60, "image": "./paratha.jpeg" }
        ]
      }
      ,{
        "name": "Desserts",
        "items": [
          { "name": "Gulab Jamun", "price": 30, "image": "./gulab-jamun.jpeg" },
          { "name": "Malai Rabdi", "price": 30, "image": "./malairabdi.jpeg" }
        ]
      },
      {
        "name": "Beverages",
        "items": [
          { "name": "Milk Tea", "price": 30, "image": "./milktea.jpeg" },
          { "name": "Lassi", "price": 40, "image": "/lassi.jpeg" }
        ]
      }
    ]
  },
  {
    "cuisine": "Chinese",
    "sections": [
      {
        "name": "Starters",
        "items": [
          { "name": "Spring Rolls", "price": 100, "image": "./spring-roll.jpeg" },
          { "name": "Manchow Soup", "price": 100, "image": "./manchaw-soup.jpeg" },
          { "name": "Veg Momos", "price": 70, "image": "./veg-momos.jpeg" },
          { "name": "Chilli Paneer", "price": 120, "image": "./chilli-paneer.jpeg" },
          { "name": "Honey Chilli Potato", "price": 100, "image": "./honey-chili-potato.jpeg" }
        ]
      },
      {
        "name": "Main Course",
        "items": [
          { "name": "Fried Rice", "price": 100, "image": "./fried-rice.jpeg" },
          { "name": "Hakka Noodles", "price": 120, "image": "./hakka-noodles.jpeg" },
          { "name": "Schezwan Noodles", "price": 130, "image": "./schezwan-noodles.jpeg" },
          { "name": "Kung Pao Tofu", "price": 100, "image": "./kung-pao-tofu.jpeg" },
          { "name": "Sweet and Sour Vegetables", "price": 100, "image": "./sweet-and-sour-vegetables.jpeg" }
        ]
      },
      {
        "name": "Desserts",
        "items": [
          { "name": "Fortune Cookies", "price": 40, "image": "./fortune-cookies.jpeg" },
          { "name": "Mango Pudding", "price": 50, "image": "./mango-pudding.jpeg" }
        ]
      },
      {
        "name": "Beverages",
        "items": [
          { "name": "Green Tea", "price": 50, "image": "./green-tea.jpeg" },
          { "name": "Iced Lemon Tea", "price": 40, "image": "./iced-lemon-tea.jpeg" }
        ]
      }
    ]
  },
  {
    "cuisine": "Italian",
    "sections": [
      {
        "name": "Starters",
        "items": [
          { "name": "Bruschetta", "price": 170, "image": "./bruschetta.jpeg" },
          { "name": "Garlic Bread", "price": 100, "image": "./garlic-bread.jpeg" },
          { "name": "Caprese Salad", "price": 80, "image": "./caprese-salad.jpeg" }
        ]
      },
      {
        "name": "Main Course",
        "items": [
          { "name": "Margherita Pizza", "price": 200, "image": "./margherita-pizza.jpeg" },
          { "name": "Spaghetti Carbonara", "price": 140, "image": "./sphagetti-carbonara.jpeg" },
          { "name": "Lasagna", "price": 160, "image": "./lasagne.jpeg" },
          { "name": "Penne Arrabbiata", "price": 130, "image": "./penne-arrabbita.jpeg" }
        ]
      }
    ]
  }
];


const OrderOnline = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenu, setFilteredMenu] = useState(menuData);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    // Update localStorage whenever cart changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      setFilteredMenu(menuData);
    } else {
      const newFilteredMenu = menuData.map(cuisine => ({
        ...cuisine,
        sections: cuisine.sections.map(section => ({
          ...section,
          items: section.items.filter(item =>
            item.name.toLowerCase().includes(term)
          ),
        })),
      })).filter(cuisine =>
        cuisine.sections.some(section => section.items.length > 0)
      );
      setFilteredMenu(newFilteredMenu);
    }
  };

  const handleAddToCart = (item) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.name === item.name);
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        const newQuantity = Math.min(updatedCart[existingItemIndex].quantity + 1, 100);
        updatedCart[existingItemIndex].quantity = newQuantity;
        return updatedCart;
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (item) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.name === item.name);
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        if (updatedCart[existingItemIndex].quantity > 1) {
          updatedCart[existingItemIndex].quantity -= 1;
        } else {
          updatedCart.splice(existingItemIndex, 1);
        }
        return updatedCart;
      }
      return prevCart;
    });
  };

  const handleCartClick = () => {
    window.location.href = '/cart';
  };

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

  return (
    <div className="order-online">
      <div className="header">
        <a href="/" className="main-page-button">Main Page</a>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
          placeholder="Search for items..."
        />
         <Link to="/cart">
        <button className="cart-button">Cart</button>
        </Link>
      </div>
      <div className="menu">
        {filteredMenu.length === 0 ? (
          <p className="not-found">No items found!</p>
        ) : (
          filteredMenu.map((cuisine, idx) => (
            <div key={idx} className="cuisine-category">
              <h1 className="cuisine-title">{cuisine.cuisine}</h1>
              {cuisine.sections.map((section, idx) => (
                <div key={idx} className="section">
                  <h2 className="section-title">{section.name}</h2>
                  <div className="items">
                    {section.items.map((item, idx) => (
                      <div key={idx} className="item-card">
                        <img
                          src={item.image}  // Use the image URL from the JSON data
                          alt={item.name}
                          className="item-image"
                        />
                        <div className="item-info">
                          <h2 className="item-name">{item.name}</h2>
                          <p className="item-price">Rs {item.price.toFixed(2)}</p>
                          <div className="item-controls">
                            <button className="control-button" onClick={() => handleRemoveFromCart(item)}>-</button>
                            <span className="quantity">{cart.find(cartItem => cartItem.name === item.name)?.quantity || 0}</span>
                            <button className="control-button" onClick={() => handleAddToCart(item)}>+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderOnline;
