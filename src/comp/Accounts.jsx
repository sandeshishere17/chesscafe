import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Account = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:4000/api/account', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching account data:', error);
        });
    }
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Account Information</h1>
      <p>Username: {userData.username}</p>
      {/* Add more account information as needed */}
    </div>
  );
};

export default Account;
