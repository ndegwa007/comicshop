import React from 'react';

interface CartItem {
  id: string;
  quantity: number;
}

interface CartProps {
  cartItems?: CartItem[]; // Optional prop with default value
  comicPosters?: { id: number; title: string; price: number }[];
  onCheckout?: () => void;
}

const Cart: React.FC<CartProps> = ({ cartItems = [], comicPosters = [], onCheckout }) => {
  
    // Calculate total price for items in the cart
    const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
        const poster = comicPosters.find(p => p.id === item.id);
        return total + (poster ? poster.price * item.quantity : 0);
        },0);
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        {cartItems.length ===0 ? (
            <p>Your cart is empty.</p>
            ) : (
            <div>
            <ul className="mb-4">
        {cartItems.map(item => {
            const poster = comicPosters.find(p => p.id === item.id);
                return (
                    <li key={item.id} className="flex justify-between mb-2">
                    <span>{poster ? poster.title : 'Unknown Item'}</span>
                    <span>{item.quantity} x ${poster ? poster.price.toFixed(2) : '0.00'}</span>
                    </li>
            );
        })}
        </ul>
        <div className="flex justify-between font-bold">
        <span>Total:</span>
        <span>${calculateTotal().toFixed(2)}</span>
        </div>
        <button 
        onClick={onCheckout} 
        className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
        >
        Checkout
        </button>        
        </div>
        )}
        </div>
    );
};

export default Cart;