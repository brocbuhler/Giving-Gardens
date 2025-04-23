'use client';

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Form, Button, Container, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { useAuth } from '@/utils/context/authContext';
import { createSub, updateSub } from '@/api/subData';
import { getSingleOrg } from '@/api/orgData';
import Link from 'next/link';

const initialState = {
  paymentAmount: '10',
  paymentType: 'monthly',
  subscribed_at: '',
  organizationId: '',
  organizationName: '',
  imageUrl: '',
  description: '',
};

function SubForm({ obj = initialState, params }) {
  const [formInput, setFormInput] = useState(obj);
  const [organization, setOrganization] = useState(null);
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj.firebaseKey) {
      setFormInput(obj);
      setIsLoading(false);
    } else if (params?.orgId) {
      getSingleOrg(params.orgId)
        .then((orgData) => {
          setOrganization(orgData);
          setFormInput({
            ...initialState,
            organizationId: params.orgId,
            organizationName: orgData.title,
            imageUrl: orgData.image,
            description: `Monthly donation to ${orgData.title}`,
          });
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching organization:', error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [obj, params, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for payment amount to enforce valid numbers
    if (name === 'paymentAmount') {
      // Remove non-numeric characters except decimal point
      const sanitizedValue = value.replace(/[^\d.]/g, '');
      // Ensure only one decimal point
      const parts = sanitizedValue.split('.');
      const formattedValue = parts.length > 1 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitizedValue;

      setFormInput((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
    } else {
      setFormInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Calculate the next payment date based on the subscription type
  const getNextPaymentDate = (startDate, paymentType) => {
    const date = new Date(startDate);

    switch (paymentType) {
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }

    return date.toISOString();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsSubmitting(true);

    const currentDate = new Date().toISOString();

    if (obj.firebaseKey) {
      updateSub(formInput)
        .then(() => router.push('/profilemain'))
        .catch((error) => {
          console.error('Error updating subscription:', error);
          setIsSubmitting(false);
        });
    } else {
      const payload = {
        ...formInput,
        uid: user.uid,
        subscribed_at: currentDate,
        nextPaymentDate: getNextPaymentDate(currentDate, formInput.paymentType),
      };

      createSub(payload)
        .then(({ name }) => {
          const patchPayload = { firebaseKey: name };
          updateSub(patchPayload).then(() => {
            router.push('/profilemain');
          });
        })
        .catch((error) => {
          console.error('Error creating subscription:', error);
          setIsSubmitting(false);
        });
    }
  };

  // Function to determine button text based on state
  const getButtonText = () => {
    if (isSubmitting) {
      return 'Processing...';
    }

    if (obj.firebaseKey) {
      return 'Update Subscription';
    }

    return 'Complete Donation';
  };

  if (isLoading) {
    return (
      <div>
        <Container className="text-center py-5">
          <p>Loading...</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="sub-form-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="mb-4">
                  <h2 className="mb-1">{obj.firebaseKey ? 'Update Subscription' : 'Support This Organization'}</h2>
                  <p className="text-muted">{obj.firebaseKey ? 'Update your donation details below.' : 'Set up your recurring donation to make a lasting impact.'}</p>
                </div>

                {organization && (
                  <Card className="mb-4 border-0 bg-light">
                    <Card.Body className="d-flex">
                      <img src={organization.image} alt={organization.title} style={{ width: '60px', height: '60px', objectFit: 'cover' }} className="me-3 rounded" />
                      <div>
                        <h5 className="mb-1">{organization.title}</h5>
                        <p className="text-muted mb-0">{organization.category}</p>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12} className="mb-4">
                      <Form.Group controlId="formPaymentAmount">
                        <Form.Label>Donation Amount</Form.Label>
                        <InputGroup hasValidation>
                          <InputGroup.Text>$</InputGroup.Text>
                          <Form.Control type="text" name="paymentAmount" value={formInput.paymentAmount} onChange={handleChange} placeholder="10.00" required pattern="^\d+(\.\d{1,2})?$" />
                          <Form.Control.Feedback type="invalid">Please provide a valid amount.</Form.Control.Feedback>
                        </InputGroup>
                        <Form.Text className="text-muted">Enter the amount you'd like to donate each period.</Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-4">
                      <Form.Group controlId="formPaymentType">
                        <Form.Label>Donation Frequency</Form.Label>
                        <Form.Select name="paymentType" value={formInput.paymentType} onChange={handleChange} required>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-4">
                      <Card className="border-0 shadow-sm p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h5 className="mb-0">
                              ${formInput.paymentAmount} {formInput.paymentType}
                            </h5>
                            <p className="text-muted mb-0">Supporting: {organization?.title || formInput.organizationName || 'Selected Organization'}</p>
                          </div>
                          <div>
                            <img src="/credit-card-icons.png" alt="Payment methods" style={{ height: '24px' }} />
                          </div>
                        </div>
                      </Card>
                    </Col>

                    <Col md={12} className="d-flex justify-content-between">
                      <Link href={params?.orgId ? `/org/${params.orgId}` : '/orgmain'}>
                        <Button variant="outline-secondary">Cancel</Button>
                      </Link>
                      <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {getButtonText()}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <footer className="text-white py-4">
        <Container className="text-center">
          <p className="mb-0">© 2025 Giving Gardens. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

SubForm.propTypes = {
  obj: PropTypes.shape({
    paymentAmount: PropTypes.string,
    paymentType: PropTypes.string,
    organizationId: PropTypes.string,
    organizationName: PropTypes.string,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
  params: PropTypes.shape({
    orgId: PropTypes.string,
  }),
};

export default SubForm;
