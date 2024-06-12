import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Orders from './pages/Orders/Orders';
import ContentLayout from "./pages/Layout";
import Logup from './pages/Logup/Logup';
import Couriers from './pages/Couriers/Couriers';

const App: React.FC = () => {
  return (
      <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logup" element={<Logup />} />
            <Route path="/orders" element={<ContentLayout requireAuth><Orders/></ContentLayout>} />
            <Route path="/couriers" element={<ContentLayout requireAuth><Couriers/></ContentLayout>} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
  );
};

export default App;
