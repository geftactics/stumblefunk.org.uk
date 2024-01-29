import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import config from './config';

const GroupEdit = () => {
  const navigate = useNavigate();
  const { group_id } = useParams();
  const [group, setGroup] = useState({
    adult: 0,
    child: 0,
    vehicle: 0,
    group_name: '',
    adults_used: 0,
    child_used: 0,
    vehicle_used: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/group?group_id=${group_id}`, {
          headers: {
            'Authorization': group_id,
          },
        });
        const data = await response.json();
        setGroup(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [group_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroup((prevGroup) => ({ ...prevGroup, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${config.apiUrl}/groups`, {
        method: 'PATCH',
        headers: {
          'Authorization': group_id,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicle: group.vehicle,
          child: group.child,
          adult: group.adult,
          group_id: group.group_id,
          group_name: group.group_name,
        }),
      });
  
      if (response.ok) {
        console.log('Group updated successfully');
        navigate('/groups');
      } else {
        console.error('Failed to update group');
      }
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };
  

  const generateNumberOptions = (type) => {
    const options = [];
    const usedValue = type === 'adult' ? group.adult_used : type === 'child' ? group.child_used : group.vehicle_used;
    for (let i = usedValue; i <= 15; i++) {
      options.push(
        <option key={i} value={i} selected={i === group[type]}>
          {i}
        </option>
      );
    }
    return options;
  };

  return (
    <div className="container">
      <h2>Edit Group</h2>
      <p>Access Code: <span className="badge bg-secondary">{group.group_id}</span></p>

      <form className="alert alert-dark" method="POST" onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="group_name">Group Name</label>
          <input className="form-control" type="text" name="group_name" value={group.group_name} id="example-text-input" required onChange={handleInputChange}/>
          <input type="hidden" name="guid" value="65b6d952e7386" />
        </div>

        <div className="form-group row">
          <div className="form-group col-4">
            <label htmlFor="adults" className="col-form-label">Adults</label>
            <select className="form-control" name="adults" onChange={handleInputChange}>
              {generateNumberOptions('adult')}
            </select>
          </div>
          <div className="form-group col-4">
            <label htmlFor="children" className="col-form-label">Children</label>
            <select className="form-control" name="children" onChange={handleInputChange}>
              {generateNumberOptions('child')}
            </select>
          </div>
          <div className="form-group col-4">
            <label htmlFor="vehicles" className="col-form-label">Vehicles</label>
            <select className="form-control" name="vehicles" onChange={handleInputChange}>
              {generateNumberOptions('vehicle')}
            </select>
          </div>
        </div>

        <div className="form-group row">
          <div className="form-group col-6">
            <button className="btn btn-sm btn-outline-dark" onClick={() => { navigate('/groups'); }}>
              <i className="fa fa-mail-reply"></i> Back
            </button>
          </div>
          <div className="form-group col-6 text-right">
            <button type="submit" className="btn btn-sm btn-outline-dark"><i className="fa fa-edit"></i> Save</button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default GroupEdit;
