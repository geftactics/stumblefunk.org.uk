import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from './config';

const UserView = ({ groupCode }) => {
  const [groupInfo, setGroupInfo] = useState({
    group_name: '',
    adult_used: 0,
    adult: 0,
    child_used: 0,
    child: 0,
    vehicle_used: 0,
    vehicle: 0,
  });
  const [tickets, setTickets] = useState({
    adult: [],
    child: [],
    vehicle: [],
  });
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      // Make API call to fetch ticket data
      const ticketResponse = await fetch(`${config.apiUrl}/tickets?group_id=${groupCode}`, {
        headers: {
          'Authorization': groupCode,
        },
      });
      const ticketData = await ticketResponse.json();
      setTickets(ticketData);

      // Make additional API call to fetch group info
      const groupResponse = await fetch(`${config.apiUrl}/group?group_id=${groupCode}`, {
        headers: {
          'Authorization': groupCode,
        },
      });

      const groupData = await groupResponse.json();
      setGroupInfo(groupData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupCode]);

  const handleRemoveTicket = async (ticketId) => {
    try {
      const response = await fetch(`${config.apiUrl}/ticket?ticket_id=${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': groupCode,
        },
      });

      if (response.ok) {
        console.log(`Ticket with ID ${ticketId} removed successfully`);
        fetchData();
      } else {
        const responseData = await response.json();
        if (response.status === 403 && responseData.Message === 'EXISTING_LINK') {
          setError('Cannot remove ticket because it has a linked child or vehicle. Please remove these first!');
        } else {
          setError(`Error removing ticket: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error during ticket removal:', error);
      setError('Error during ticket removal. Please try again.');
    }
  };

  const generateTickets = (ticketType) => {
    return tickets[ticketType].map((ticket, index) => (
      <div key={index}>
        &bull; {ticket.first_name} {ticket.last_name}{' '}
        <span onClick={() => handleRemoveTicket(ticket.ticket_id)} title="Remove" style={{ cursor: 'pointer' }}>
          <small>
            <i className="text-primary fa fa-window-close"></i>
          </small>
        </span>
        <br />
      </div>
    ));
  };

  const generateVehicles = () => {
    return tickets['vehicle'].map((ticket, index) => (
      <div key={index}>
        &bull; <big><span className="badge badge-warning">{ticket.vehicle_reg}</span>{' '}</big>
        <span onClick={() => handleRemoveTicket(ticket.ticket_id)} title="Remove" style={{ cursor: 'pointer' }}>
          <small>
            <i className="text-primary fa fa-window-close"></i>
          </small>
        </span>
        <br />
      </div>
    ));
  };

  return (
    <div className="container">
      <h2>Ticket Management - {groupInfo.group_name}</h2>
      {error ? (<p className="text-danger">{error}</p>) : (
          <p className="text-secondary">Hi there! We've allocated you some tickets. Please assign them to people so that we can get you on the correct guest lists...</p>
      )}
      <div className="row">
        <div className="col-md-4">
          <div className="card bg-light border-info">
            <div className="card-header bg-info text-white"><i className="fa fa-2x fa-drivers-license-o"></i> Adults ({groupInfo.adult_used} of {groupInfo.adult})</div>
            <div className="card-body">
              <div className="card-text">
                {generateTickets('adult')}
                {(groupInfo.adult_used < groupInfo.adult) && <div><br /><Link to="/add/adult" className='btn btn-sm btn-outline-dark'><i className='fa fa-plus'></i> Add</Link></div>}
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="col-md-4">
          <div className="card bg-light border-info">
            <div className="card-header bg-info text-white"><i className="fa fa-2x fa-child"></i> Children ({groupInfo.child_used} of {groupInfo.child})</div>
            <div className="card-body">
              <div className="card-text">
                {generateTickets('child')}
                {(groupInfo.child_used < groupInfo.child) && <div><br /><Link to="/add/child" className='btn btn-sm btn-outline-dark'><i className='fa fa-plus'></i> Add</Link></div>}
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="col-md-4">
          <div className="card bg-light border-info">
            <div className="card-header bg-info text-white"><i className="fa fa-2x fa-car"></i> Vehicles ({groupInfo.vehicle_used} of {groupInfo.vehicle})</div>
            <div className="card-body">
              <div className="card-text">
                {generateVehicles()}
                {(groupInfo.vehicle_used < groupInfo.vehicle) && <div><br /><Link to="/add/vehicle" className='btn btn-sm btn-outline-dark'><i className='fa fa-plus'></i> Add</Link></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;
