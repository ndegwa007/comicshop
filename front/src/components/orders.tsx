import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { jwtDecode } from 'jwt-decode';

interface Order {
  order_id: string;
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
      try {
        const token = localStorage.getItem('access_token')
        const decodedToken = jwtDecode(token)
        const userid = decodedToken["user_id"]

        const response = await fetch(`http://localhost:8000/orders/${userid}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
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

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Orders</h2>
          <Button onClick={onClose}>Close</Button>
        </div>
        <div className="rounded-md border mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Order Placed At</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell className="font-medium">{order.item_name}</TableCell>
                  <TableCell>{new Date(order.order_time).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{order.quantity}</TableCell>
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