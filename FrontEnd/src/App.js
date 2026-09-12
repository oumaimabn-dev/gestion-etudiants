import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Professeurs from './AdminPages/Professeurs';
import Surveillant from './AdminPages/Surveillant';
import SurveillanceDirector from './DirectorPages/surveillanceDirector'; 
import LayoutAdmin from './Layout/Layout';
import Login from './LoginPages/Login';
import Etablissement from './AdminPages/Etablissement';
import Users from './AdminPages/Users';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); 
  const [role, setRole] = useState(null); 

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('role'); 
    setIsLoggedIn(loggedIn);
    setRole(userRole);
  }, []);

  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    setRole(role);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', role);
  };

  if (isLoggedIn === null) {
    return <div className="p-10 text-center">جاري التحميل...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to={role === 'مدير' ? "/admin/surveillant/director" : "/admin/surveillant"} />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        {isLoggedIn ? (
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route path="surveillant" element={<Surveillant />} />
            {role === 'مدير' && (
              <Route path="surveillant/director" element={<SurveillanceDirector />} /> 
            )}
            <Route path="professeurs" element={<Professeurs />} />
            <Route path="etablissement" element={<Etablissement />} />
            <Route path="users" element={<Users />} />
          </Route>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
