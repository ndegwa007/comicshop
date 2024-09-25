
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Mail } from 'lucide-react'
import { useState, useEffect } from "react"
import { navigate } from 'astro:transitions/client'


export default function Login() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('');



  // regular login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email}),
      });
      
      if (!response.ok) {
        alert("wrong username or password!")
        throw new Error('Login failed');
      }
      
      const { access_token} = await response.json();
      localStorage.setItem('access_token', access_token);
      navigate('http://localhost:4321/products');
    } catch (error) {
      alert('try to signup!')
      console.error(error);
      // Handle error (e.g., show a notification)
    }
  };


  const handleGoogleLogin = (e) => { 
    e.preventDefault()

    window.location.href = "http://localhost:8000/signup"
  }



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your username and email to log in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Enter your username" required  value={username} onChange={(e) => setUsername(e.target.value)}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type='submit' onClick={handleLogin}>Log in</Button>
          <div className="relative w-full">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
              Or
            </span>
          </div>
  
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            <Mail className="mr-2 h-4 w-4" />
            Sign up with Gmail
          </Button>
          
        </CardFooter>
      </Card>
    </div>
  )
}
