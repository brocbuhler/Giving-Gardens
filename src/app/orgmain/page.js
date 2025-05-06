'use client';

/* eslint-disable react/no-unescaped-entities */

import React, { useEffect, useState } from 'react';
import { getEveryOrg, getOrg } from '@/api/orgData';
import OrgCard from '@/components/orgCard';
import { useAuth } from '@/utils/context/authContext';
import { Container, Row, Col, Form, InputGroup, Button, Tabs, Tab } from 'react-bootstrap';

export default function OrgMain() {
  const [organizations, setOrganizations] = useState([]);
  const [userOrgs, setUserOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { user } = useAuth();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const allOrgs = await getEveryOrg();
        setOrganizations(allOrgs);

        const myOrgs = await getOrg(user.uid);
        setUserOrgs(myOrgs);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [user.uid]);

  const handleUpdate = async () => {
    setLoading(true);
    const allOrgs = await getEveryOrg();
    setOrganizations(allOrgs);
    const myOrgs = await getOrg(user.uid);
    setUserOrgs(myOrgs);
    setLoading(false);
  };

  const filteredOrganizations = organizations.filter((org) => org.title?.toLowerCase().includes(searchTerm.toLowerCase()) || org.description?.toLowerCase().includes(searchTerm.toLowerCase()));

  const displayedOrganizations = activeTab === 'all' ? filteredOrganizations : userOrgs;

  const renderContent = () => {
    if (loading) {
      console.log(displayedOrganizations);
      console.log('this is my user Id', user.uid);
      return (
        <div className="text-center py-5">
          <p>Loading organizations...</p>
        </div>
      );
    }

    if (displayedOrganizations.length === 0) {
      if (activeTab === 'all') {
        return (
          <div className="text-center py-5">
            <p>No organizations found matching your search.</p>
          </div>
        );
      }
      return (
        <div className="text-center py-5">
          <p>You haven't created any organizations yet.</p>
          <Button variant="primary" as="a" href="/org/new" className="mt-3">
            Create Your First Organization
          </Button>
        </div>
      );
    }

    // When there are organizations to display
    return (
      <Row>
        {displayedOrganizations.map((org) => (
          <Col key={org.id} md={4} className="mb-4">
            <OrgCard orgObj={org} onUpdate={handleUpdate} />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className="org-main-page">
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Organizations</h1>
        </div>

        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
          <Tab eventKey="all" title="All Organizations">
            {/* Search Bar */}
            <div className="mb-4">
              <InputGroup>
                <Form.Control placeholder="Search organizations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                  Clear
                </Button>
              </InputGroup>
            </div>
          </Tab>
          <Tab eventKey="yours" title="Your Organizations">
            <p className="mb-4">Organizations you've created</p>
          </Tab>
        </Tabs>

        {renderContent()}
      </Container>

      {/* Footer */}
      <footer className="text-white py-4">
        <Container className="text-center">
          <p className="mb-0">© 2025 Giving Gardens. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}
