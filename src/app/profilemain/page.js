'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/utils/context/authContext';
import { clientCredentials } from '@/utils/client';
import Loading from '@/components/Loading';
import UpdateUserData from '@/api/userData';
import Link from 'next/link';
import UserProfileCard from '@/components/userCard';
import SubCard from '@/components/subCard';

const endpoint = clientCredentials.databaseURL;

export default function UserComponent() {
  const [userProfile, setUserProfile] = useState({});
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, userLoading } = useAuth();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getAllUserSubscriptions = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(`${endpoint}/subscriptions.json?orderBy="uid"&equalTo="${user.uid}"`);
      const data = await response.json();

      if (data) {
        // Convert Firebase object to array
        const subscriptionsArray = Object.keys(data).map((key) => ({
          firebaseKey: key,
          ...data[key],
        }));
        setUserSubscriptions(subscriptionsArray);
      } else {
        setUserSubscriptions([]);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setUserSubscriptions([]);
    }
  }, [user]);

  const handleSubscriptionUpdate = () => {
    // Refresh the subscriptions list
    getAllUserSubscriptions();
  };

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
      getAllUserSubscriptions();
    } else if (!userLoading) {
      setIsLoading(false);
    }
  }, [user, userLoading, getAllUserSubscriptions]);

  if (userLoading || isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4 mb-4">
          <UserProfileCard userProfile={userProfile} />
        </div>
      </div>

      <div className="mt-5">
        <h2>Your Subscriptions</h2>
        {userSubscriptions.length === 0 ? (
          <p>You dont have any subscriptions yet.</p>
        ) : (
          <div className="row">
            {userSubscriptions.map((subscription) => (
              <div key={subscription.firebaseKey} className="col-md-4 mb-4">
                <SubCard subObj={subscription} onUpdate={handleSubscriptionUpdate} />
              </div>
            ))}
          </div>
        )}
      </div>
      <Link className="org-btn" href="/org/new">
        Create an Organization
      </Link>
    </div>
  );
}
