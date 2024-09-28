import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'
import { jwtDecode } from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';

interface Order {
  order_id: uuidv4;
  item_name: string;
  order_time: string;
  quantity: number;
}

interface OrdersPageProps {
  latestOrder: Order | null;
  onClose: () => void;
}

const OrdersPage: React.FC<OrdersPageProps> = ({ latestOrder, onClose }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [openPhoneDialog, setOpenPhoneDialog] = useState(false);



  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('access_token')
      const decodedToken = jwtDecode(token)
      const userid = decodedToken['user_id']
     
      try {
        const response = await fetch(`http://localhost:8000/orders/${userid}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        console.log(response)
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();

    if (latestOrder) {
      setOrders(prevOrders => [latestOrder, ...prevOrders]);
    }
  }, [latestOrder]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/update-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ phoneNumber: mobileNumber }),
      });

      if (response.ok) {
        alert('Phone number updated successfully!');
        setOpenPhoneDialog(false);
      } else {
        throw new Error('Failed to update phone number');
      }
    } catch (error) {
      console.error('Error updating phone number:', error);
      alert('Failed to update phone number. Please try again.');
    }
  };

  /*
  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const decodedToken = jwtDecode(token)
      const userid = decodedToken['user_id']
      const response = await fetch(`http://localhost:8000/orders/${userid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      console.log(response)
      if (response.ok) {
        setOrders([]);
        alert('Cart cleared successfully!');
      } else {
        throw new Error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart. Please try again.');
    }
  };
  */

  const handleRemoveOrder = async (order_id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/order/${order_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== order_id));
        alert('Order removed successfully!');
      } else {
        throw new Error('Failed to remove order');
      }
    } catch (error) {
      console.error('Error removing order:', error);
      alert('Failed to remove order. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Comics</h2>
          <div className="space-x-2">
             
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
        <div className="rounded-md border mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Order Placed At</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell className="font-medium">{order.item_name}</TableCell>
                  <TableCell>{new Date(order.order_time).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{order.quantity}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleRemoveOrder(order.order_id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={openPhoneDialog} onOpenChange={setOpenPhoneDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">Update Phone Number</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enter Your Mobile Number</DialogTitle>
            </DialogHeader>
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Update</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrdersPage;