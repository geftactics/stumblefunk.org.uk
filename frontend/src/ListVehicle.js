import React, { useState, useEffect } from 'react';
import config from './config';

const ListVehicle = ({ groupCode }) => {
  const [groups, setGroups] = useState([]);

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

  return (
    <div className="container">
      <h2>List of Vehicles</h2>
    </div>
  );
};

export default ListVehicle;
