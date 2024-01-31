import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import config from './config';

const GroupEdit = (groupCode) => {
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

  const saveGroup = (e) => {
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiUrl}/group`, {
        method: 'PATCH',
        headers: {
          'Authorization': groupCode.groupCode,
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
        navigate('/accreditation/groups');
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
        <option key={i} value={i}>{i}</option>
      );
    }
    return options;
  };

  return (
    <div className="container">
      <h2>Edit Group</h2>
      <p>Access Code: <span className="badge text-light bg-secondary">{group.group_id}</span></p>

      <form className="alert alert-dark" method="POST" onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="group_name">Group Name</label>
          <input className="form-control" type="text" name="group_name" value={group.group_name} id="example-text-input" required onChange={handleInputChange}/>
          <input type="hidden" name="guid" value="65b6d952e7386" />
        </div>

        <div className="form-group row">
          <div className="form-group col-4">
            <label htmlFor="adult" className="col-form-label">Adults</label>
            <select className="form-control" name="adult" value={group.adult} onChange={handleInputChange}>
              {generateNumberOptions('adult')}
            </select>
          </div>
          <div className="form-group col-4">
            <label htmlFor="child" className="col-form-label">Children</label>
            <select className="form-control" name="child" value={group.child} onChange={handleInputChange}>
              {generateNumberOptions('child')}
            </select>
          </div>
          <div className="form-group col-4">
            <label htmlFor="vehicle" className="col-form-label">Vehicles</label>
            <select className="form-control" name="vehicle" value={group.vehicle} onChange={handleInputChange}>
              {generateNumberOptions('vehicle')}
            </select>
          </div>
        </div>

        <div className="form-group row">
          <div className="form-group col-6">
            <button className="btn btn-sm btn-outline-dark" onClick={() => { navigate('/accreditation/groups'); }}>
              <i className="fa fa-mail-reply"></i> Back
            </button>
          </div>
          <div className="form-group col-6 text-right">
            <button className="btn btn-sm btn-outline-dark" onClick={saveGroup}><i className="fa fa-edit"></i> Save</button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default GroupEdit;
