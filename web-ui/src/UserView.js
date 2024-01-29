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
        console.log(tickets.adult)
      } catch (error) {
        console.error('Error fetching ticket data:', error);
      }
    };

    fetchData();
  }, [groupCode]);

  return (
    <div class="container">
      <h2>dasdsa - Ticket Management</h2>
      <p>Hi there! We've allocated you some tickets, please assign them to people so the we can get you on the correct guest lists...</p>
      <div class="row">
        <div class="col-md-4">
          <div class="card bg-light border-info">
            <div class="card-header bg-info text-white"><i class="fa fa-2x fa-drivers-license-o"></i> Adults (0 of 2)</div>
            <div class="card-body">
              <p class="card-text">
              &bull; Firstname Lastname <a href='remove_ticket.php?id=1' title='Remove'><small><i class='fa fa-window-close'></i></small></a><br/> 
              &bull; Firstname Lastname <a href='remove_ticket.php?id=1' title='Remove'><small><i class='fa fa-window-close'></i></small></a><br/> 
              <br/><a href='add_adult.php' class='btn btn-sm btn-outline-dark'><i class='fa fa-plus'></i> Add</a>        </p>
            </div>
          </div>
        </div>
        <br/>
        <div class="col-md-4">
          <div class="card bg-light border-info">
            <div class="card-header bg-info text-white"><i class="fa fa-2x fa-child"></i> Kids (0 of 3)</div>
            <div class="card-body">
              <p class="card-text">
              &bull; Firstname Lastname <a href='remove_ticket.php?id=1' title='Remove'><small><i class='fa fa-window-close'></i></small></a><br/> 
              &bull; Firstname Lastname <a href='remove_ticket.php?id=1' title='Remove'><small><i class='fa fa-window-close'></i></small></a><br/> 
              <br/><a href='add_kids.php' class='btn btn-sm btn-outline-dark'><i class='fa fa-plus'></i> Add</a>        </p>
            </div>
          </div>
        </div>
        <br/>
        <div class="col-md-4">
          <div class="card bg-light border-info">
            <div class="card-header bg-info text-white"><i class="fa fa-2x fa-car"></i> Vehicles (0 of 2)</div>
            <div class="card-body">
              <p class="card-text">
              &bull; Vehicle 1 <a href='remove_ticket.php?id=1' title='Remove'><small><i class='fa fa-window-close'></i></small></a><br/> 
              &bull; Vehicle 2 <a href='remove_ticket.php?id=1' title='Remove'><small><i class='fa fa-window-close'></i></small></a><br/> 
              <br/><a href='add_vehicle.php' class='btn btn-sm btn-outline-dark'><i class='fa fa-plus'></i> Add</a>        </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;
