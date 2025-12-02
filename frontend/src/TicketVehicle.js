import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TicketVehicle = ({ groupCode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_phone: '',
    driver_id: '',
    vehicle_reg: '',
    vehicle_size: '',
    vehicle_parking: '',
  });
  const [driverData, setDriverData] = useState([]);

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
          ticket_type: 'vehicle',
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

  const fetchDriverData = async () => {
    try {
      const response = await fetch(`${window.config.apiUrl}/tickets?group_id=${groupCode}`, {
        headers: {
          'Authorization': groupCode,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const vehicleData = responseData.vehicle || [];
        const driverIdsInVehicles = vehicleData.map(vehicle => vehicle.driver_id);
        const filteredAdultData = (responseData.adult || []).filter(adult => {
          return !driverIdsInVehicles.includes(adult.ticket_id);
        });
        setDriverData(filteredAdultData);
      } else {
        console.error('Error fetching driver data:', response.statusText);
      }
    } catch (error) {
      console.error('Error during driver data fetch:', error);
    }
  };

  useEffect(() => {
    fetchDriverData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupCode]);


  return (
    <div className="container">
      <h2>Vehicle Pass</h2>

      <form className="alert alert-dark" onSubmit={handleSubmit}>

      <div className="form-group row">
          <div className="form-group col-md-6 col-12">
            <label htmlFor="driver_id" className="col-form-label">Driver</label>
            <select
              className="form-control"
              name="driver_id"
              value={formData.driver_id}
              onChange={handleChange}
              required
            >
              <option value="">Please select...</option>
              {driverData.map((driver) => (
                <option key={driver.ticket_id} value={driver.ticket_id}>
                  {`${driver.first_name} ${driver.last_name}`}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-6 col-12">
            <label htmlFor="vehicle_size" className="col-form-label">Vehicle Size</label>
            <select
              className="form-control"
              name="vehicle_size"
              value={formData.vehicle_size}
              onChange={handleChange}
              required
            >
              <option value="">Please select...</option>
              <option value="car">Car</option>
              <option value="van">Van/Camper</option>
              <option value="truck">Bus/Truck</option>
            </select>
          </div>
        </div>

        <div className="form-group row">
          <div className="form-group col-md-6 col-12">
            <label htmlFor="vehicle_reg">Vehicle Registration</label>
            <input
              className="form-control"
              type="text"
              name="vehicle_reg"
              value={formData.vehicle_reg}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-md-6 col-12">
            <label htmlFor="mobile_phone">Drivers Mobile</label>
            <input
              className="form-control"
              type="text"
              name="mobile_phone"
              value={formData.mobile_phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group row">
          <div className="form-group col-md-6 col-12">
            <label htmlFor="vehicle_parking" className="col-form-label">Car Park</label>
            <select
              className="form-control"
              name="vehicle_parking"
              value={formData.vehicle_parking}
              onChange={handleChange}
              required
            >
              <option value="">Please select...</option>
              <option value="carpark">Crew/Artist Carpark</option>
              <option value="camping">Crew/Artist Camper-van area</option>
              <option value="onsite">Onsite Access</option>
            </select>
          </div>
        </div>

        <div className="form-group row mt-3">
          <div className="form-group col-6">
            <button className="btn btn-sm btn-outline-dark" onClick={() => { navigate('/accreditation/'); }}>
              <i className="fa fa-mail-reply"></i> Back
            </button>
          </div>
          <div className="form-group col-6 text-end">
            <button type="submit" className="btn btn-sm btn-outline-dark">
              <i className="fa fa-edit"></i> Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};


export default TicketVehicle;
