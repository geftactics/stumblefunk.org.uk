import { compareNames, fullName } from './sortNames';
import React, { useState, useEffect } from 'react';

const ListTickets = ({ groupCode, ticketType }) => {
  const [data, setData] = useState({ groupCode: null, tickets: {}, status: 'loading' });
  const status = data.groupCode === groupCode ? data.status : 'loading';
  const allTickets = status === 'ready' ? data.tickets : {};
  const tickets = Object.fromEntries(
    Object.entries(allTickets).map(([groupName, groupTickets]) => [groupName, groupTickets[ticketType] || []])
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState({ key: 'name', direction: 'ascending' });

  useEffect(() => {
    setSort({ key: 'name', direction: 'ascending' });
  }, [ticketType]);

  const columns = [
    ['groupName', 'Collective'],
    ...{
      adult: [['name', 'Name'], ['involvement', 'Involvement'], ['mobile_phone', 'Mobile Phone'], ['email', 'Email']],
      child: [['name', 'Name'], ['child_age', 'Child Age'], ['parent', 'Parent'], ['mobile_phone', 'Mobile Phone']],
      vehicle: [['name', 'Driver'], ['vehicle_reg', 'Registration'], ['vehicle_size', 'Type'], ['vehicle_parking', 'Parking'], ['mobile_phone', 'Mobile Phone']],
    }[ticketType],
  ];

  const toggleSort = (key) => {
    setSort(current => ({
      key,
      direction: current.key === key && current.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  const sortValue = (row) => {
    if (sort.key === 'groupName') return row.groupName;
    if (sort.key === 'name') return row.name;
    if (sort.key === 'parent') return findLinkedName(row.ticket.parent_id);
    return row.ticket[sort.key] ?? '';
  };

  const compareRows = (a, b) => {
    const left = sortValue(a);
    const right = sortValue(b);
    const comparison = sort.key === 'child_age'
      ? Number(left) - Number(right)
      : compareNames(String(left), String(right));
    return (sort.direction === 'ascending' ? comparison : -comparison)
      || compareNames(a.name, b.name);
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchJson = async (url) => {
      const response = await fetch(url, {
        headers: { Authorization: groupCode },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      return response.json();
    };

    const loadTickets = async () => {
      setData({ groupCode, tickets: {}, status: 'loading' });
      try {
        const { groups } = await fetchJson(`${window.config.apiUrl}/groups`);
        const entries = await Promise.all(groups.map(async (group) => [
          group.group_name,
          await fetchJson(`${window.config.apiUrl}/tickets?group_id=${group.group_id}`),
        ]));
        if (!controller.signal.aborted) {
          setData({ groupCode, tickets: Object.fromEntries(entries), status: 'ready' });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Error fetching tickets:', error);
          setData({ groupCode, tickets: {}, status: 'error' });
        }
      }
    };

    loadTickets();
    return () => controller.abort();
  }, [groupCode]);

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
      const groupTickets = allTickets[groupName]['adult'] || [];
      const linkedTicket = groupTickets.find(ticket => ticket.ticket_id === id);
      if (linkedTicket) {
        return `${linkedTicket.first_name} ${linkedTicket.last_name}`;
      }
    }
    return 'unknown';
  }

  const visibleTickets = Object.entries(tickets)
    .flatMap(([groupName, groupTickets]) =>
      groupTickets
        .filter(ticket => filterTickets(ticket, groupName))
        .map(ticket => ({
          groupName,
          ticket,
          name: ticketType === 'vehicle' ? findLinkedName(ticket.driver_id) : fullName(ticket),
        }))
    )
    .sort(compareRows);

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
      <table className="table table-striped" aria-busy={status === 'loading'}>
        <thead>
          <tr>
            {columns.map(([key, label]) => (
              <th key={key} scope="col" aria-sort={sort.key === key ? sort.direction : 'none'}>
                <button
                  type="button"
                  className="table-sort-button"
                  onClick={() => toggleSort(key)}
                  aria-label={`${label}: sort ${sort.key === key && sort.direction === 'ascending' ? 'descending' : 'ascending'}`}
                >
                  {label}{' '}
                  <span aria-hidden="true">{sort.key === key ? (sort.direction === 'ascending' ? '▲' : '▼') : '↕'}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody id="myTable">
          {status === 'loading' && (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                <span className="spinner-border ticket-loading-spinner" role="status">
                  <span className="visually-hidden">Loading tickets…</span>
                </span>
              </td>
            </tr>
          )}
          {status === 'error' && (
            <tr><td colSpan={columns.length}><span role="alert">Could not load tickets. Please refresh to try again.</span></td></tr>
          )}
          {status === 'ready' && visibleTickets.length === 0 && (
            <tr><td colSpan={columns.length}>No tickets found.</td></tr>
          )}
          {visibleTickets.map(({ groupName, ticket }) => (
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
        </tbody>
      </table>
    </div>
  );
};

export default ListTickets;
