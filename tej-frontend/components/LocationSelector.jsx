import React from 'react';
import { useNavigate } from 'react-router-dom';

const LocationSelector = () => {
  const navigate = useNavigate();

  const handleLocationClick = (location) => {
    navigate(`/bilty/${location}`); // This will route to the BiltyForm for that location
  };

  return (
    <div className="container mt-5">
      <h3>Select a Location</h3>
      <button className="btn btn-outline-primary m-2" onClick={() => handleLocationClick('pune')}>Pune</button>
      <button className="btn btn-outline-primary m-2" onClick={() => handleLocationClick('mumbai')}>Mumbai</button>
      <button className="btn btn-outline-primary m-2" onClick={() => handleLocationClick('bangalore')}>Bangalore</button>
      <button className="btn btn-outline-primary m-2" onClick={() => handleLocationClick('delhi')}>Delhi</button>
    </div>
  );
};

export default LocationSelector;
