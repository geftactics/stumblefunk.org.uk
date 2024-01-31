import React, { useState, useEffect } from 'react';
import config from './config';

const ListTickets = ({ groupCode, ticketType }) => {
  const [groups, setGroups] = useState([]);
  const [tickets, setTickets] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGroupsData = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/groups`, {
          headers: {
            'Authorization': groupCode,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          setGroups(responseData.groups);
        } else {
          console.error('Error fetching groups data:', response.statusText);
        }
      } catch (error) {
        console.error('Error during groups data fetch:', error);
      }
    };

    fetchGroupsData();
  }, [groupCode]);

  useEffect(() => {
    const fetchDataForGroups = async () => {
      for (const group of groups) {
        try {
          const ticketsResponse = await fetch(`${config.apiUrl}/tickets?group_id=${group.group_id}`, {
            headers: {
              'Authorization': groupCode,
            },
          });

          if (ticketsResponse.ok) {
            const ticketsData = await ticketsResponse.json();
            const selectedTickets = ticketsData[ticketType] || [];
            setTickets(prevTickets => ({
              ...prevTickets,
              [group.group_name]: selectedTickets,
            }));

          } else {
            console.error('Error fetching tickets data:', ticketsResponse.statusText);
          }
        } catch (error) {
          console.error('Error during tickets data fetch:', error);
        }
      }
    };

    if (groups.length > 0) {
      fetchDataForGroups();
    }
  }, [groups, groupCode, ticketType]);

  const filterTickets = (ticket, groupName) => {
    const ticketFields = {
      adult: ['first_name', 'last_name', 'involvement', 'mobile_phone', 'email'],
      child: ['first_name', 'last_name', 'ticket_id', 'child_age', 'mobile_phone'],
      vehicle: ['driver_id', 'vehicle_reg', 'vehicle_size', 'vehicle_parking', 'mobile_phone'],
    };
  
    const groupFields = ['group_name']; // Add group_name to the fields to search
  
    const fieldsToSearch = ticketFields[ticketType].concat(groupFields);
    const searchableText = fieldsToSearch.map(field => {
      if (field === 'group_name') {
        return groupName; // Use group name for the 'group_name' field
      }
      return ticket[field];
    }).join(' ');
  
    return searchableText.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <div className="container">
      <h2>List of {ticketType.charAt(0).toUpperCase() + ticketType.slice(1)} tickets</h2>
      <input
        className="form-control"
        id="myInput"
        type="text"
        placeholder="Search..."
        onChange={(e) => setSearchTerm(e.target.value)}
      /><br/>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Collective</th>
            {ticketType === 'adult' && (
              <>
                <th>Name</th>
                <th>Involvement</th>
                <th>Mobile Phone</th>
                <th>Email</th>
              </>
            )}
            {ticketType === 'child' && (
              <>
                <th>Name</th>
                <th>Child Age</th>
                <th>Parent</th>
                <th>Mobile Phone</th>
              </>
            )}
            {ticketType === 'vehicle' && (
              <>
                <th>Driver</th>
                <th>Vehicle Type</th>
                <th>Vehicle Parking</th>
                <th>Mobile Phone</th>
              </>
            )}
          </tr>
        </thead>
        <tbody id="myTable">
          {Object.entries(tickets).map(([groupName, groupTickets]) => (
            <React.Fragment key={groupName}>
              {groupTickets.filter(ticket => filterTickets(ticket, groupName)).map(ticket => (
                <tr key={ticket.ticket_id}>
                  <td>{groupName}</td>
                  {ticketType === 'adult' && (
                    <>
                      <td>{`${ticket.first_name} ${ticket.last_name}`}</td>
                      <td>{ticket.involvement}</td>
                      <td>{ticket.mobile_phone}</td>
                      <td>{ticket.email}</td>
                    </>
                  )}
                  {ticketType === 'child' && (
                    <>
                      <td>{`${ticket.first_name} ${ticket.last_name}`}</td>
                      <td>{ticket.child_age}</td>
                      <td>{ticket.parent_id}</td>
                      <td>{ticket.mobile_phone}</td>
                    </>
                  )}
                  {ticketType === 'vehicle' && (
                    <>
                      <td>{`${ticket.driver_id}`}</td>
                      <td>{ticket.vehicle_size}</td>
                      <td>{ticket.vehicle_parking}</td>
                      <td>{ticket.mobile_phone}</td>
                    </>
                  )}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListTickets;
