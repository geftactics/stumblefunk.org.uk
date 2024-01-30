import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from './config';

const TicketChild = ({ groupCode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_phone: '',
    email: '',
    involvement: '',
    parent_id: '',
    child_age: '',
    child_offsite_contact: '',
    child_offsite_mobile: '',
  });
  const [parentData, setParentData] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${config.apiUrl}/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': groupCode,
        },
        body: JSON.stringify({
          group_id: groupCode,
          ticket_type: 'child',
          ...formData,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        navigate('/');
      } else {
        console.error('Error creating ticket:', response.statusText);
      }
    } catch (error) {
      console.error('Error during ticket creation:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchParentData = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/tickets?group_id=${groupCode}`, {
        headers: {
          'Authorization': groupCode,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const adultData = responseData.adult || [];
        setParentData(adultData);
      } else {
        console.error('Error fetching parent data:', response.statusText);
      }
    } catch (error) {
      console.error('Error during parent data fetch:', error);
    }
  };

  useEffect(() => {
    fetchParentData();
  }, [groupCode]);


  return (
    <div className="container">
      <h2>Child Ticket</h2>

      <form className="card-header alert-dark" onSubmit={handleSubmit}>

        <div className="form-group row">
          <div className="form-group col-md-6 col-xs-12">
            <label htmlFor="first_name">First Name</label>
            <input
              className="form-control"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-md-6 col-xs-12">
            <label htmlFor="last_name">Last Name</label>
            <input
              className="form-control"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group row">
          <div className="form-group col-md-6 col-xs-12">
            <label htmlFor="parent_id" className="col-form-label">Parent</label>
            <select
              className="form-control"
              name="parent_id"
              value={formData.parent_id}
              onChange={handleChange}
              required
            >
              <option value="">Please select...</option>
              {parentData.map((parent) => (
                <option key={parent.ticket_id} value={parent.ticket_id}>
                  {`${parent.first_name} ${parent.last_name}`}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-6 col-xs-12">
            <label htmlFor="child_age" className="col-form-label">Age</label>
            <select
              className="form-control"
              name="child_age"
              value={formData.child_age}
              onChange={handleChange}
              required
            >
              <option value="">Please select...</option>
              {Array.from({ length: 17 }, (_, index) => index + 1).map((age) => (<option key={age} value={age}>{age}</option>))}
            </select>
          </div>
        </div>

        <div className="form-group row">
          <div className="form-group col-md-6 col-xs-12">
            <label htmlFor="child_offsite_contact">Offsite Contact Name</label>
            <input
              className="form-control"
              type="text"
              name="child_offsite_contact"
              value={formData.child_offsite_contact}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-md-6 col-xs-12">
            <label htmlFor="child_offsite_mobile">Offsite Contact Phone</label>
            <input
              className="form-control"
              type="text"
              name="child_offsite_mobile"
              pattern="[0-9 ]{11,12}"
              title="UK mobile number"
              value={formData.child_offsite_mobile}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group row">
          <div className="form-group col-md-6 col-xs-12">
            <label htmlFor="mobile_phone">Parents Mobile Phone</label>
            <input
              className="form-control"
              type="tel"
              name="mobile_phone"
              pattern="[0-9 ]{11,12}"
              title="UK mobile number"
              value={formData.mobile_phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group row">
          <div className="form-group col-6">
            <button className="btn btn-sm btn-outline-dark" onClick={() => { navigate('/'); }}>
              <i className="fa fa-mail-reply"></i> Back
            </button>
          </div>
          <div className="form-group col-6 text-right">
            <button type="submit" className="btn btn-sm btn-outline-dark">
              <i className="fa fa-edit"></i> Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};


export default TicketChild;
