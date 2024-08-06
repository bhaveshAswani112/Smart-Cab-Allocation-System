// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RegistrationForm } from './components/RegistrationForm';
import { LoginForm } from './components/LoginForm';
import { AddCabForm } from './components/AddCabForm';
import CabList from './components/CabList';
import Home from './Pages/Home'; 
import TripForm from './components/AddTrip';
import { Toaster } from "@/components/ui/toaster"

const App: React.FC = () => {
  return (
    <Router>
      <div className="container mx-auto mt-10">
        <Routes>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/add-cab" element={<AddCabForm />} />
          <Route path="/cabs" element={<CabList />} />
          <Route path="/" element={<Home />} />
          <Route path="/add-trip" element={<TripForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
