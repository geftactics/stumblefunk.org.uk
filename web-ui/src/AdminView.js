import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from './config';

const AdminView = ({ groupCode, onUpdateLogin }) => {
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

  const handleDelete = async (groupId) => {
    if (window.confirm('This will remove the group and any tickets that have been created by the group! Are you sure?')) {
      try {
        const response = await fetch(`${config.apiUrl}/group?group_id=${groupId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': groupCode,
          },
        });

        if (response.ok) {
          console.log(`Group with ID ${groupId} deleted successfully`);
          const updatedGroups = groups.filter((group) => group.group_id !== groupId);
          setGroups(updatedGroups);
        } else {
          console.error('Error deleting group:', response.statusText);
        }
      } catch (error) {
        console.error('Error during group deletion:', error);
      }
    }
  };

  const handleLoginSwitch = (newGroupCode) => {
    onUpdateLogin('USER', newGroupCode);
    navigate('/')
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
                <span className={`badge text-light ${group.adult_used === 0 ? 'bg-secondary' : group.adult == group.adult_used ? 'bg-success' : 'bg-primary'}`}>{group.adult_used} / {group.adult}</span>
              </td>
              <td>
                <span className={`badge text-light ${group.child_used === 0 ? 'bg-secondary' : group.child == group.child_used ? 'bg-success' : 'bg-primary'}`}>{group.child_used} / {group.child}</span>
              </td>
              <td>
                <span className={`badge text-light ${group.vehicle_used === 0 ? 'bg-secondary' : group.vehicle == group.vehicle_used ? 'bg-success' : 'bg-primary'}`}>{group.vehicle_used} / {group.vehicle}</span>
              </td>
              <td>
                <Link to={`/groups/edit/${group.group_id}`} className="btn btn-sm btn-outline-dark">
                  <i className="fa fa-edit"></i> Edit
                </Link>
                {' '}
                <button
                  className="btn btn-sm btn-outline-dark"
                  onClick={() => handleDelete(group.group_id)}
                >
                  <i className="fa fa-trash"></i> Delete
                </button>
                {' '}
                <button
                className="btn btn-sm btn-outline-dark"
                onClick={() => handleLoginSwitch(group.group_id)}
              >
                <i className="fa fa-user"></i> Login
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminView;
