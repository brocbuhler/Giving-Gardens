'use client';

import React, { useEffect, useState } from 'react';
import { getOrg } from '../../api/orgData';
import OrgCard from '../../components/orgCard';
import { useAuth } from '../../utils/context/authContext';

export default function OrgMain() {
  const [org, setOrg] = useState([]);

  const { user } = useAuth();
  const getUserOrgs = () => {
    getOrg(user.uid).then(setOrg);
  };

  useEffect(() => {
    getUserOrgs();
  }, []);

  return (
    <div className="text-center my-4">
      <div className="d-flex flex-wrap">
        {org.map((orgs) => (
          <OrgCard key={orgs.firebaseKey} orgObj={orgs} onUpdate={getUserOrgs} />
        ))}
      </div>
    </div>
  );
}
