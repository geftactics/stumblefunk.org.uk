import React from 'react';
import config from './config';

const AdminView = ({ groupCode }) => {
  return (
    <div>
      <h2>Admin View</h2>
      <p>Group Code: {groupCode}</p>
      {/* Add your admin view content here */}
    </div>
  );
};

export default AdminView;
