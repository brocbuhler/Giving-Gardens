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
  paymentAmount: '10.00',
  payFrequency: 'monthly',
  paymentType: 'visa',
  subscribed_at: '',
  organizationId: '',
  title: '',
  image: '',
  description: '',
};

function SubForm({ obj = initialState, params }) {
  const [formInput, setFormInput] = useState({ ...initialState });
  const [organization, setOrganization] = useState(null);
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj.firebaseKey) {
      setFormInput({
        ...initialState,
        ...obj,
        paymentAmount: obj.paymentAmount || initialState.paymentAmount,
        payFrequency: obj.payFrequency || initialState.payFrequency,
        paymentType: obj.paymentType || initialState.paymentType,
      });
      setIsLoading(false);
    } else if (params?.orgId) {
      getSingleOrg(params.orgId)
        .then((orgData) => {
          setOrganization(orgData);
          setFormInput({
            ...initialState,
            organizationId: params.orgId,
            title: orgData.title,
            image: orgData.image,
            description: `${initialState.payFrequency} donation to ${orgData.title}`,
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
    } else if (name === 'payFrequency') {
      // Update description when payment frequency changes
      const newDescription = `${value} donation to ${organization?.title || formInput.title || 'Selected Organization'}`;

      setFormInput((prevState) => ({
        ...prevState,
        [name]: value,
        description: newDescription,
      }));
    } else {
      setFormInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Calculate the next payment date based on the subscription frequency
  const getNextPaymentDate = (startDate, payFrequency) => {
    const date = new Date(startDate);

    switch (payFrequency) {
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

    console.log('Form Input:', formInput);

    if (obj.firebaseKey) {
      // Make sure we're including the firebaseKey in the update
      const updatePayload = {
        ...formInput,
        firebaseKey: obj.firebaseKey,
      };

      updateSub(updatePayload)
        .then(() => router.push('/profilemain'))
        .catch((error) => {
          console.error('Error updating subscription:', error);
          setIsSubmitting(false);
        });
    } else {
      // Get the next payment date
      const nextPaymentDate = getNextPaymentDate(currentDate, formInput.payFrequency);

      // Create a payload that matches the C# model
      const payload = {
        // Match C# property names (PascalCase)
        UserId: user.uid,
        // Get organizationId from formInput which was set in useEffect
        OrganizationId: parseInt(formInput.organizationId, 10),
        // Format date for C# DateTime
        Subscribed_at: currentDate,
        // Keep PaymentType as-is since it matches the C# model
        PaymentType: formInput.paymentType,
        // Convert string to number for PaymentAmount
        PaymentAmount: parseFloat(formInput.paymentAmount),
        // Store additional data if your C# model has been updated to include these
        PayFrequency: formInput.payFrequency,
        NextPaymentDate: nextPaymentDate,
        // These fields might not be in your C# model, but including for completeness
        Title: formInput.title,
        Image: formInput.image,
        Description: formInput.description,
      };

      console.log('Sending payload to API:', payload);

      createSub(payload)
        .then((response) => {
          console.log('Create subscription response:', response);
          router.push('/profilemain');
        })
        .catch((error) => {
          console.error('Error creating subscription:', error);
          setIsSubmitting(false);
        });
    }
  };

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
                        <p className="text-muted mb-0">{organization.categoryName}</p>
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
                      <Form.Group controlId="formPayFrequency">
                        <Form.Label>Donation Frequency</Form.Label>
                        <Form.Select name="payFrequency" value={formInput.payFrequency} onChange={handleChange} required>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </Form.Select>
                        <Form.Text className="text-muted">Select how often you want to make this donation.</Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-4">
                      <Form.Group controlId="formPaymentType">
                        <Form.Label>Payment Method</Form.Label>
                        <Form.Select name="paymentType" value={formInput.paymentType} onChange={handleChange} required>
                          <option value="visa">Visa</option>
                          <option value="mastercard">Mastercard</option>
                          <option value="paypal">PayPal</option>
                          <option value="cryptocurrency">Cryptocurrency</option>
                          <option value="debit">Debit</option>
                        </Form.Select>
                        <Form.Text className="text-muted">Choose your preferred payment method.</Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-4">
                      <Card className="border-0 shadow-sm p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h5 className="mb-0">
                              ${formInput.paymentAmount} {formInput.payFrequency}
                            </h5>
                            <p className="text-muted mb-0">Supporting: {organization?.title || formInput.title || 'Selected Organization'}</p>
                            <p className="text-muted mb-0">Payment Method: {formInput.paymentType.charAt(0).toUpperCase() + formInput.paymentType.slice(1)}</p>
                          </div>
                          <div>
                            {/* Replace with text to avoid missing image error */}
                            <span className="text-muted">{formInput.paymentType.charAt(0).toUpperCase() + formInput.paymentType.slice(1)}</span>
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
    payFrequency: PropTypes.string,
    paymentType: PropTypes.string,
    organizationId: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
  params: PropTypes.shape({
    orgId: PropTypes.string,
  }),
};

export default SubForm;
