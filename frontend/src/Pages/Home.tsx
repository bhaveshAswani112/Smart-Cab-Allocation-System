// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '@/services/AuthService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Home: React.FC = () => {
  const {toast} = useToast()
  return (
    <div className="container mx-auto text-center mt-10">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Cab Management System</h1>
      <p className="text-lg mb-6">Manage your cabs and trips with ease.</p>
      <div className="flex justify-center space-x-4">
        <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Register
        </Link>
        <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Login
        </Link>
        <Link to="/add-cab" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Cab
        </Link>
        <Link to="/cabs" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          View Cabs
        </Link>
        <Link to="/add-trip" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Trip
        </Link>
        <Button onClick={() => {
            logout()
            toast({
                title : "User logged out successfully"
            })
        }}>Logout</Button>
      </div>
    </div>
  );
};

export default Home;
