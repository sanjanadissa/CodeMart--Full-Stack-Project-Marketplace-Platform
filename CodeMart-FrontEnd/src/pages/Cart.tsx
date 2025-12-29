import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { getCurrentUser } from "@/services/api";
import api from "../services/api";

const Cart = () => {

  const [cartItems, setCartItems] = useState([]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const user = getCurrentUser();

 useEffect(() => {
  const fetchCart = async () => {
    try {
      const response = await api.users.getCartItems(user.id);
      console.log("getting cart items successful:", response);

      const normalized = response.map((p) => ({
        id: p.id,
        Name: p.name,
        Category: p.category,
        Owner: p.owner,
        Description: p.description,
        Price: p.price,
        ImageUrls: p.imageUrls ?? [],
        PrimaryLanguages: p.primaryLanguages ?? [],
        SecondryLanguages: p.secondaryLanguages ?? [],
        Review: p.review ?? [],
        quantity: 1,
      }));

      setCartItems(normalized);
    } catch (err) {
      console.error("getting cart items failed:", err);
    }
  };

  fetchCart();
}, [user.id]);

  const removeItem = async (id) => {
    try {
      await api.users.removeFromCart(user.id, id);
      setCartItems(items => items.filter(item => item.id !== id));
      // Dispatch event to update navbar cart count
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.Price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Discover amazing projects and start building your collection</p>
          <Link
            to="/projects"
            className="btn-primary text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center"
          >
            Browse Projects
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Cart Items</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-6 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.ImageUrls[0]}
                        alt={item.Name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">{item.Name}</h2>
                        {/* <p className="text-gray-600">by {item.seller}</p> */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-gray-600 hover:text-gray-800"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 text-center border border-gray-300 py-1 rounded">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-gray-600 hover:text-gray-800"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <span className="text-xl font-bold text-gray-900">
                              ${item.Price * item.quantity}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-800 p-2"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/projects"
                className="text-indigo-600 hover:text-indigo-500 font-medium inline-flex items-center"
              >
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-[#4500A5] to-[#6A00A5] text-white py-4 rounded-xl text-lg font-semibold mt-6 hover:shadow-lg hover:from-[#5800A5] hover:to-[#7B00A5] transition-all duration-300">
                Proceed to Checkout
              </button>
              
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure checkout guaranteed</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mt-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">We Accept</h3>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-gray-100 rounded p-2 text-center">
                  <span className="text-xs text-gray-600">VISA</span>
                </div>
                <div className="bg-gray-100 rounded p-2 text-center">
                  <span className="text-xs text-gray-600">MC</span>
                </div>
                <div className="bg-gray-100 rounded p-2 text-center">
                  <span className="text-xs text-gray-600">AMEX</span>
                </div>
                <div className="bg-gray-100 rounded p-2 text-center">
                  <span className="text-xs text-gray-600">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;