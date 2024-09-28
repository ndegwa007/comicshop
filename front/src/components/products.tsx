
import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"
import Cart from './cart'; 
import OrdersPage from './orders';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';

interface ComicPoster {
  id: number;
  title: string;
  price: number;
  image: string;
}

const comicPosters: ComicPoster[] = [
  {
    id: uuidv4(),
    title: "Spider-Man: Into the Spider-Verse",
    price: 24.99,
    image: "/images/spiderman_returns.jpg"
  },
  {
    id: uuidv4(),
    title: "Batman: The Dark Knight Returns",
    price: 29.99,
    image: "/images/batman_returns.jpg?height=400&width=300"
  },
  {
    id: uuidv4(),
    title: "Wonder Woman: Amazon Warrior",
    price: 22.99,
    image: "/images/wonder_woman.jpg?height=400&width=300"
  },
  {
    id: uuidv4(),
    title: "X-Men: Days of Future Past",
    price: 26.99,
    image: "/images/xmen.jpg?height=400&width=300"
  },
  {
    id: uuidv4(),
    title: "The Avengers: Infinity War",
    price: 28.99,
    image: "/images/avengers.jpg?height=400&width=300"
  },
  {
    id: uuidv4(),
    title: "Superman: Man of Steel",
    price: 23.99,
    image: "/images/superman.jpg?height=400&width=300"
  },
  {
    id: uuidv4(),
    title: "Black Panther: Wakanda Forever",
    price: 27.99,
    image: "/images/black_panther.jpg?height=400&width=300"
  },
  {
    id: uuidv4(),
    title: "Captain America: The First Avenger",
    price: 25.99,
    image: "/images/captain_america.jpg?height=400&width=300"
  },
  {
    id: uuidv4(),
    title: "Iron Man: Extremis",
    price: 26.99,
    image: "/images/iron_man.jpg?height=400&width=300"
  }
];

const ComicStore = () => {
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showOrders, setShowOrders] = useState(false);
  const [latestOrder, setLatestOrder] = useState(null);


  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
    
        
        const response = await fetch('http://localhost:8000/protected', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        // console.log(response)
        if (response.ok) {
          const data = await response.json();
          setUsername(data.name);
        } else if (response.status === 401) {
          setUsername(null);
        } else {
          console.error('Failed to fetch current user');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogin = () => {
    window.location.href = 'http://localhost:4321/login';
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'GET',
        credentials: 'include',
      });
  
      if (response.ok) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = 'http://localhost:4321/login';
      } else {
        console.error('Logout failed:', await response.text());
        window.location.href = 'http://localhost:4321/login';
      }
    } catch (error) {
      console.error('Error during logout:', error);
      window.location.href = 'http://localhost:4321/login';
    }
  };

  const addToCart = (posterId: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === posterId);
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prevCart, { id: posterId, quantity: 1 }];
      }
    });
  };
  //console.log(cart)
  const handleCheckout = async () => {

    const orderTime = new Date().toISOString();

  
    

    const transformedCart = cart.map(item => {
        const product = comicPosters.find(p => p.id === item.id)

            if (!product) {
                console.error(`Product not found for ID: ${item.id}`);
                return null; // or handle it as needed
            }
            const token = localStorage.getItem('access_token')
            const decodedToken = jwtDecode(token)
            const user_id = decodedToken["user_id"]

            return {
                //order_id: product.id,
                item_name: product.title,
                quantity: item.quantity,
                order_time: orderTime,
                user_id: user_id

                
            }
    }).filter(item => item !== item.null)

    console.log(transformedCart)
    try {
      const access_token  = localStorage.getItem('access_token')
      const response = await fetch('http://localhost:8000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify(transformedCart),
      });

      // console.log(response)

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error(`Failed to place order: ${response.status} ${response.statusText}`);
    }

      if (response.ok) {
        const newOrder = await response.json();
        setLatestOrder(newOrder);
        setCart([]);
        setShowCart(false);
        alert('Order placed successfully!');
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <nav className="py-4 px-6">
        <div className="flex justify-between items-center">
          <a href="/" className="text-xl font-bold">swifty</a>
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowOrders(true)} className="text-sm font-medium">My Comics</button>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setShowCart(!showCart)}>
              <ShoppingCart className="h-5 w-5" />
              <span>{cart.reduce((total, item) => total + item.quantity, 0)} items</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              {username ? (
                <>
                  <span className="text-sm font-medium">{username}</span>
                  <button onClick={handleLogout} className="text-sm font-medium flex items-center">
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <button onClick={handleLogin} className="text-sm font-medium">Login</button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Separator />
      <main className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Featured Comic Posters</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {comicPosters.map((poster) => (
            <Card key={poster.id} className="overflow-hidden">
              <img src={poster.image} alt={poster.title} className="w-full h-[400px] object-cover" />
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{poster.title}</h2>
              </CardContent>
              <CardFooter className="p-4 flex justify-between items-center">
                <span className="text-lg font-bold">${poster.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(poster.id)} 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                >
                  Add to Cart
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {showCart && (
          <Cart 
            cartItems={cart} 
            comicPosters={comicPosters} 
            onCheckout={handleCheckout} 
          />
        )}

        {showOrders && (
          <OrdersPage latestOrder={latestOrder} onClose={() => setShowOrders(false)} />
        )}
        
      </main>
    </div>
  );
}

export default ComicStore;