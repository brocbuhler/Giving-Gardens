'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/utils/context/authContext';
import { clientCredentials } from '@/utils/client';
import Loading from '@/components/Loading';
import UpdateUserData from '@/api/userData';
import Link from 'next/link';

const endpoint = clientCredentials.databaseURL;

export default function UserComponent() {
  const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { user, userLoading } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const response = await fetch(`${endpoint}/users/${user.uid}.json`);
        const userData = await response.json();

        if (userData) {
          setUserProfile(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && !userLoading) {
      if (typeof window !== 'undefined') {
        UpdateUserData({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      }
      fetchUserData();
    } else if (!userLoading) {
      setIsLoading(false);
    }
  }, [user, userLoading]);

  if (userLoading || isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div>
      <div>{userProfile.photoURL && <img src={userProfile.photoURL} alt="Profile" width={100} height={100} className="rounded-full" />}</div>
      <h1>User Profile</h1>
      <div>Name: {userProfile.name || 'N/A'}</div>
      <div>Email: {userProfile.email || 'N/A'}</div>
      <div>Last Login: {userProfile.lastLogin ? new Date(userProfile.lastLogin).toLocaleString() : 'N/A'}</div>
      <Link className="org-btn" href="/org/new">
        Create an Organization
      </Link>
    </div>
  );
}
