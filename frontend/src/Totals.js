import React, { useState, useEffect } from 'react';
import config from './config';

const Totals = ({ groupCode }) => {
  const [totalsData, setTotalsData] = useState({});

  useEffect(() => {
    const fetchTotalsData = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/groups?`, {
          headers: {
            'Authorization': groupCode,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          setTotalsData(responseData);
        } else {
          console.error('Error fetching totals data:', response.statusText);
        }
      } catch (error) {
        console.error('Error during totals data fetch:', error);
      }
    };

    fetchTotalsData();
  }, [groupCode]);


  const totalAdults = totalsData.groups ? totalsData.groups.reduce((acc, group) => acc + parseInt(group.adult), 0) : 0;
  const totalChildren = totalsData.groups ? totalsData.groups.reduce((acc, group) => acc + parseInt(group.child), 0) : 0;
  const totalVehicles = totalsData.groups ? totalsData.groups.reduce((acc, group) => acc + parseInt(group.vehicle), 0) : 0;

  const totalUsedAdults = totalsData.groups ? totalsData.groups.reduce((acc, group) => acc + group.adult_used, 0) : 0;
  const totalUsedChildren = totalsData.groups ? totalsData.groups.reduce((acc, group) => acc + group.child_used, 0) : 0;
  const totalUsedVehicles = totalsData.groups ? totalsData.groups.reduce((acc, group) => acc + group.vehicle_used, 0) : 0;

  return (
    <div className="container">
      <h2>Ticket Totals</h2>
      <br/>
      <div className="row">
        <div className="col-sm-4">
          <div className="card">
            <div className="card-header">Adults</div>
            <div className="card-body">
              <span className="card-text"><h1 className="text-muted">{totalUsedAdults} of {totalAdults}</h1></span>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card">
            <div className="card-header">Children</div>
            <div className="card-body">
              <span className="card-text"><h1 className="text-muted">{totalUsedChildren} of {totalChildren}</h1></span>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card">
            <div className="card-header">Vehicles</div>
            <div className="card-body">
              <span className="card-text"><h1 className="text-muted">{totalUsedVehicles} of {totalVehicles}</h1></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Totals;
