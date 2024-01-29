import React from 'react';
import { useParams } from 'react-router-dom';

const GroupEdit = () => {
  const { id } = useParams();

  // Fetch item details based on id

  return (
    <div>
      <h1>Edit Group</h1>
      <p>Editing item with ID: {id}</p>
    </div>
  );
};

export default GroupEdit;
