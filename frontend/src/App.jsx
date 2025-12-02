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
import ListTickets from './ListTickets';


const App = () => {
  const [userType, setUserType] = useState('');
  const [groupCode, setGroupCode] = useState();

  const handleLogout = () => {
    setUserType('');
    setGroupCode('');
  };

  const handleLogin = (message, code) => {
    if (message === 'USER' || message === 'ADMIN') {
      setUserType(message);
      setGroupCode(code);
    } else {
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
              <Route path="/accreditation/" element={<UserView groupCode={groupCode} userType={userType} />} />
              <Route path="/accreditation/add/adult" element={<TicketAdult groupCode={groupCode} userType={userType} />} />
              <Route path="/accreditation/add/child" element={<TicketChild groupCode={groupCode} userType={userType} />} />
              <Route path="/accreditation/add/vehicle" element={<TicketVehicle groupCode={groupCode} userType={userType} />} />
            </>
          )}

          {userType === 'ADMIN' && (
            <>
              <Route path="/accreditation/" element={<Groups groupCode={groupCode} userType={userType} onUpdateLogin={handleLogin} />} />
              <Route path="/accreditation/groups" element={<Groups groupCode={groupCode} userType={userType} onUpdateLogin={handleLogin}/>} />
              <Route path="/accreditation/groups/edit/:group_id" element={<GroupEdit groupCode={groupCode} />} />
              <Route path="/accreditation/list/adult" element={<ListTickets ticketType='adult' groupCode={groupCode} />} />
              <Route path="/accreditation/list/child" element={<ListTickets ticketType='child' groupCode={groupCode} />} />
              <Route path="/accreditation/list/vehicle" element={<ListTickets ticketType='vehicle' groupCode={groupCode} />} />
              <Route path="/accreditation/totals" element={<Totals groupCode={groupCode} />} />
            </>
          )}

          {userType === '' && (
            <>
              <Route path="/accreditation/" element={<Login onLogin={handleLogin} />} />
              <Route path="/accreditation/logout" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
