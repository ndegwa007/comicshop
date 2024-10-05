import React from 'react';
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';


interface CartProps {
  cartItems: { id: number; quantity: number }[];
  comicPosters?: {id: number, title: string, price: number}[];
  onCheckout: () => void;
  onRemoveFromCart: (id: number) => void;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ cartItems, comicPosters, onCheckout, onRemoveFromCart, onClose }) => {
  const cartTotal = cartItems.reduce((total, item) => {
    const poster = comicPosters.find(p => p.id === item.id);
    return total + (poster ? poster.price * item.quantity : 0);
  }, 0);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-background shadow-lg p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {cartItems.length === 0 ? (
            <div>
                <p>Your cart is empty.</p>
                <Button onClick={onClose} className="w-full flex items-center justify-center">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Button>
            </div>
        ) : (
          <>
            {cartItems.map((item) => {
              const poster = comicPosters.find(p => p.id === item.id);
              if (!poster) return null;
              return (
                <div key={item.id} className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{poster.title}</h3>
                    <p>${poster.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onRemoveFromCart(item.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => cartItems.find(i => i.id === item.id)?.quantity === 1 ? null : onRemoveFromCart(item.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="ml-2"
                      onClick={() => {
                        for (let i = 0; i < item.quantity; i++) {
                          onRemoveFromCart(item.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            <div className="mt-6">
              <p className="text-xl font-bold mb-4">Total: ${cartTotal.toFixed(2)}</p>
              <Button onClick={onCheckout} className="w-full">
                Checkout
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full mt-2">
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;