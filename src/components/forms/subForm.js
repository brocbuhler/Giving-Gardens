'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '@/utils/context/authContext';
import { createSub, updateSub } from '@/api/subData';

const initialState = {
  paymentAmount: '',
  paymentType: '',
  subscribe: '',
  favorite: false,
  last_name: '',
};

function SubForm({ obj = initialState }) {
  const [formInput, setFormInput] = useState(obj);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj.firebaseKey) setFormInput(obj);
  }, [obj, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      updateSub(formInput).then(() => router.push(`/author/${obj.firebaseKey}`));
    } else {
      const payload = { ...formInput, uid: user.uid };
      createSub(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateSub(patchPayload).then(() => {
          router.push('/');
        });
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="text-black">
      <h2 className="text-white mt-5">{obj.firebaseKey ? 'Update' : 'Create'} Author</h2>

      {/* FIRST NAME INPUT  */}
      <FloatingLabel controlId="floatingInput1" label="First Name" className="mb-3">
        <Form.Control type="text" placeholder="Enter a first name" name="first_name" value={formInput.first_name} onChange={handleChange} required />
      </FloatingLabel>

      {/* DROPDOWN SELECT (NEEDS TO BE COMPLETED) */}
      <FloatingLabel controlId="floatingSelect" label="Payment Type">
        <Form.Select aria-label="Payment Type" name="paymentType" onChange={handleChange} className="mb-3" value={formInput.paymentType || ''} required>
          <option value="">Select a Payment Method</option>
        </Form.Select>
      </FloatingLabel>

      {/* SUBMIT BUTTON  */}
      <Button type="submit">{obj.firebaseKey ? 'Update' : 'Create'} Author</Button>
    </Form>
  );
}

SubForm.propTypes = {
  obj: PropTypes.shape({
    paymentAmount: PropTypes.string,
    paymentType: PropTypes.string,
    organizationId: PropTypes.string,
  }),
};

export default SubForm;
