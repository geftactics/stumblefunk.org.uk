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
    const searchTermLowerCase = searchTerm.toLowerCase();
    return (
      ticket.first_name.toLowerCase().includes(searchTermLowerCase) ||
      ticket.last_name.toLowerCase().includes(searchTermLowerCase) ||
      ticket.involvement.toLowerCase().includes(searchTermLowerCase) ||
      ticket.mobile_phone.toLowerCase().includes(searchTermLowerCase) ||
      ticket.email.toLowerCase().includes(searchTermLowerCase) ||
      groupName.toLowerCase().includes(searchTermLowerCase)
    );
  };

  return (
    <div className="container">
      <h2>List of {ticketType.charAt(0).toUpperCase() + ticketType.slice(1)} tickets</h2>
      <input
        className="form-control"
        id="myInput"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <br/>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Collective</th>
            <th>Name</th>
            <th>Involvement</th>
            <th>Mobile Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody id="myTable">
          {Object.entries(tickets).map(([groupName, groupTickets]) => (
            <React.Fragment key={groupName}>
              {groupTickets
                .filter(ticket => filterTickets(ticket, groupName))
                .map((ticket, index) => (
                  <tr key={`${groupName}-${index}`}>
                    <td>{groupName}</td>
                    <td>{ticket.first_name} {ticket.last_name}</td>
                    <td>{ticket.involvement}</td>
                    <td>{ticket.mobile_phone}</td>
                    <td>{ticket.email}</td>
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