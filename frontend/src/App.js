import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Navbar from './Navbar';
import Groups from './AdminView';
import UserView from './UserView';
import Totals from './Totals';
import GroupEdit from './GroupEdit';
import TicketAdult from './TicketAdult';
import TicketChild from './TicketChild';
import TicketVehicle from './TicketVehicle';
import ListAdult from './ListAdult';
import ListChild from './ListChild';
import ListVehicle from './ListVehicle';

const App = () => {
  const [userType, setUserType] = useState('');
  const [groupCode, setGroupCode] = useState();

  const handleLogout = () => {
    setUserType('');
    setGroupCode('');
  };

  const handleLogin = (message, code) => {
    if (message === 'USER' || message === 'ADMIN') {
      // Login success, set variables
      setUserType(message);
      setGroupCode(code);
    } else {
      // Bad login, clear variables
      setUserType('');
      setGroupCode('');
    }
  };

  return (
    <Router>
      <div>
        
        {userType !== '' && !window.location.pathname.includes('/logout') && (<Navbar userType={userType} onLogout={handleLogout} />)}

        <Routes>

          {userType === 'USER' && (
            <>
              <Route path="/" element={<UserView groupCode={groupCode} userType={userType} />} />
              <Route path="/add/adult" element={<TicketAdult groupCode={groupCode} userType={userType} />} />
              <Route path="/add/child" element={<TicketChild groupCode={groupCode} userType={userType} />} />
              <Route path="/add/vehicle" element={<TicketVehicle groupCode={groupCode} userType={userType} />} />
            </>
          )}

          {userType === 'ADMIN' && (
            <>
              <Route path="/" element={<Groups groupCode={groupCode} userType={userType} onUpdateLogin={handleLogin} />} />
              <Route path="/groups" element={<Groups groupCode={groupCode} userType={userType} onUpdateLogin={handleLogin}/>} />
              <Route path="/groups/edit/:group_id" element={<GroupEdit groupCode={groupCode} />} />
              <Route path="/list/adult" element={<ListAdult groupCode={groupCode} />} />
              <Route path="/list/child" element={<ListChild groupCode={groupCode} />} />
              <Route path="/list/vehicle" element={<ListVehicle groupCode={groupCode} />} />
              <Route path="/totals" element={<Totals groupCode={groupCode} />} />
            </>
          )}

          {userType === '' && (
            <>
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route path="/logout" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
