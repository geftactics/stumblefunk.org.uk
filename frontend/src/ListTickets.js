import React, { useState, useEffect } from 'react';

const ListTickets = ({ groupCode, ticketType }) => {
  const [groups, setGroups] = useState([]);
  const [tickets, setTickets] = useState({});
  const [allTickets, setAllTickets] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGroupsData = async () => {
      try {
        const response = await fetch(`${window.config.apiUrl}/groups`, {
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
      const fetchPromises = groups.map(group => 
        fetch(`${window.config.apiUrl}/tickets?group_id=${group.group_id}`, {
          headers: { 'Authorization': groupCode },
        })
          .then(response => response.json())
          .catch(error => console.error('Error fetching tickets:', error))
      );
  
      const ticketsDataArray = await Promise.all(fetchPromises);
  
      ticketsDataArray.forEach((ticketsData, index) => {
        const groupName = groups[index].group_name;
        const allTickets = ticketsData || [];
        const selectedTickets = ticketsData[ticketType] || [];
        setTickets(prevTickets => ({
          ...prevTickets,
          [groupName]: selectedTickets,
        }));
        setAllTickets(prevTickets => ({
          ...prevTickets,
          [groupName]: allTickets,
        }));
      });
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
  
    const groupFields = ['group_name'];
  
    const fieldsToSearch = ticketFields[ticketType].concat(groupFields);
    const searchableText = fieldsToSearch.map(field => {
      if (field === 'group_name') {
        return groupName;
      }
      return ticket[field];
    }).join(' ');
  
    return searchableText.toLowerCase().includes(searchTerm.toLowerCase());
  };


  function findLinkedName(id) {
    for (const groupName in allTickets) {
      const groupTickets = allTickets[groupName]['adult'];
      const linkedTicket = groupTickets.find(ticket => ticket.ticket_id === id);
      if (linkedTicket) {
        return `${linkedTicket.first_name} ${linkedTicket.last_name}`;
      }
    }
    return 'unknown';
  }

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
                <th>Registration</th>
                <th>Type</th>
                <th>Parking</th>
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
                      <td>{ticket.first_name} {ticket.last_name}</td>
                      <td><big><span className='badge bg-info text-dark'>{ticket.involvement}</span></big></td>
                      <td>{ticket.mobile_phone}</td>
                      <td>{ticket.email}</td>
                    </>
                  )}
                  {ticketType === 'child' && (
                    <>
                      <td>{ticket.first_name} {ticket.last_name}</td>
                      <td>{ticket.child_age}</td>
                      <td>{findLinkedName(ticket.parent_id)}</td>
                      <td>{ticket.mobile_phone}</td>
                    </>
                  )}
                  {ticketType === 'vehicle' && (
                    <>
                      <td>{findLinkedName(ticket.driver_id)}</td>
                      <td><big><span className='badge bg-warning text-dark'>{ticket.vehicle_reg}</span></big></td>
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
