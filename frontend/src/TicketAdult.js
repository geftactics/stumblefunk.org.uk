import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TicketAdult = ({ groupCode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_phone: '',
    email: '',
    involvement: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${window.config.apiUrl}/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': groupCode,
        },
        body: JSON.stringify({
          group_id: groupCode,
          ticket_type: 'adult',
          ...formData,
        }),
      });

      if (response.ok) {
        await response.json();
        navigate('/accreditation/');
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

  return (
    <div className="container">
      <h2>Adult Ticket</h2>
      <div className="alert alert-info" role="alert">
        When arriving on site, ID will be required in order to gain entry - So please ensure that names are entered correctly!
      </div>

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
            <label htmlFor="mobile_phone">Mobile Phone</label>
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
          <div className="form-group col-md-6 col-xs-12">
            <label htmlFor="email">Email Address (for e-ticket)</label>
            <input
              className="form-control"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group row">
          <div className="form-group col-md-6 col-xs-12">
            <label htmlFor="involvement" className="col-form-label">Involvement</label>
            <select
              className="form-control"
              name="involvement"
              value={formData.involvement}
              onChange={handleChange}
              required
            >
              <option value="">Please select...</option>
              <option value="artist">Artist</option>
              <option value="guest">Guest</option>
              <option value="workshop">Workshop Staff</option>
              <option value="venue">Venue Staff</option>
            </select>
          </div>
        </div>

        <div className="form-group row">
          <div className="form-group col-6">
            <button className="btn btn-sm btn-outline-dark" onClick={() => { navigate('/accreditation/'); }}>
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

export default TicketAdult;
