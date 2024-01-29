import React, { useState, useEffect } from 'react';
import config from './config';


const UserView = ({ groupCode }) => {
  const [tickets, setTickets] = useState({
    adult: [],
    child: [],
    vehicle: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/tickets?group_id=${groupCode}`, {
          headers: {
            'Authorization': groupCode,
          },
        });

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching ticket data:', error);
      }
    };

    fetchData();
  }, [groupCode]);

  return (
    <div className="container">
      <h2>dddddd - Ticket Management</h2>
      <p>Hi there! We've allocated you some tickets, please assign them to people so the we can get you on the correct guest lists...</p>
      <div className="row">
        <div className="col-md-4">
          <div className="card bg-light border-info">
            <div className="card-header bg-info text-white"><i className="fa fa-2x fa-drivers-license-o"></i> Adults (0 of 2)</div>
            <div className="card-body">
              <p className="card-text">
              &bull; Firstname Lastname <a href='remove_ticket.php?id=1' title='Remove'><small><i className='fa fa-window-close'></i></small></a><br/> 
              &bull; Firstname Lastname <a href='remove_ticket.php?id=1' title='Remove'><small><i className='fa fa-window-close'></i></small></a><br/> 
              <br/><a href='add_adult.php' className='btn btn-sm btn-outline-dark'><i className='fa fa-plus'></i> Add</a>        </p>
            </div>
          </div>
        </div>
        <br/>
        <div className="col-md-4">
          <div className="card bg-light border-info">
            <div className="card-header bg-info text-white"><i className="fa fa-2x fa-child"></i> Kids (0 of 3)</div>
            <div className="card-body">
              <p className="card-text">
              &bull; Firstname Lastname <a href='remove_ticket.php?id=1' title='Remove'><small><i className='fa fa-window-close'></i></small></a><br/> 
              &bull; Firstname Lastname <a href='remove_ticket.php?id=1' title='Remove'><small><i className='fa fa-window-close'></i></small></a><br/> 
              <br/><a href='add_kids.php' className='btn btn-sm btn-outline-dark'><i className='fa fa-plus'></i> Add</a>        </p>
            </div>
          </div>
        </div>
        <br/>
        <div className="col-md-4">
          <div className="card bg-light border-info">
            <div className="card-header bg-info text-white"><i className="fa fa-2x fa-car"></i> Vehicles (0 of 2)</div>
            <div className="card-body">
              <p className="card-text">
              &bull; Vehicle 1 <a href='remove_ticket.php?id=1' title='Remove'><small><i className='fa fa-window-close'></i></small></a><br/> 
              &bull; Vehicle 2 <a href='remove_ticket.php?id=1' title='Remove'><small><i className='fa fa-window-close'></i></small></a><br/> 
              <br/><a href='add_vehicle.php' className='btn btn-sm btn-outline-dark'><i className='fa fa-plus'></i> Add</a>        </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;
