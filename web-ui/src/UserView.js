import React from 'react';
import config from './config';

const UserView = ({ groupCode }) => {
  return (
    <div>
      <h2>User View</h2>
      <p>Group Code: {groupCode}</p>
      {/* Add your user view content here */}
    </div>
  );
};

export default UserView;
