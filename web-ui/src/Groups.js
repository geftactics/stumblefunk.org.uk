// AdminView.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from './config';

const AdminView = ({ groupCode, userType, onAddGroup }) => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/groups`, {
          headers: {
            'Authorization': groupCode,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        const sortedGroups = data.groups.sort((a, b) => a.group_name.localeCompare(b.group_name));
        setGroups(sortedGroups);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [groupCode]);

  const handleEdit = (groupId) => {
    console.log(`Edit group with ID: ${groupId}`);
  };

  const handleDelete = (groupId) => {
    console.log(`Delete group with ID: ${groupId}`);
  };

  const handleNew = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/group`, {
        method: 'POST',
        headers: {
          'Authorization': groupCode,
          'Content-Type': 'application/json',
        }
      });
  
      const data = await response.json();
      if (data.Operation === 'CREATE_GROUP' && data.Message === 'SUCCESS' && data.group_id) {
        console.log('New group created with ID:', data.group_id);
        navigate(`/groups/edit/${data.group_id}`);
      } else {
        console.error('Failed to create a new group:', data);
      }
    } catch (error) {
      console.error('Error creating a new group:', error);
    }
  };

  return (
    <div className="container">
      <h2>Group Management</h2>
      <p>
      <button onClick={handleNew} className="btn btn-sm btn-outline-dark">
        <i className="fa fa-plus"></i> Add New Group
      </button>
      </p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Collective</th>
            <th>Adults</th>
            <th>Children</th>
            <th>Vehicles</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.group_id}>
              <td>{group.group_name}</td>
              <td>
                <span className="badge bg-success">{`? / ${group.adult}`}</span>
              </td>
              <td>
                <span className="badge bg-primary">{`? / ${group.child}`}</span>
              </td>
              <td>
                <span className="badge bg-primary">{`? / ${group.child}`}</span>
              </td>
              <td>
              <Link to={`/groups/edit/${group.group_id}`} className="btn btn-sm btn-outline-dark">
                <i className="fa fa-edit"></i> Edit
              </Link>
                {' '}
                <a
                  href={`#guid=${group.group_id}`}
                  className="btn btn-sm btn-outline-dark"
                  onClick={() => window.confirm('This will remove the group and any tickets that have been created by the group! Are you sure?')}
                >
                  <i className="fa fa-trash"></i> Delete
                </a>
                {' '}
                <a href={`#guid=${group.group_id}`} className="btn btn-sm btn-outline-dark">
                  <i className="fa fa-user"></i> Login
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminView;
