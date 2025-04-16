'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
// import { getSub } from '../../api/subData';
import { createOrg, updateOrg } from '../../api/orgData';

const initialState = {
  description: '',
  image: '',
  price: '',
  sale: false,
  title: '',
  author_id: '',
};

function OrgForm({ obj = initialState }) {
  const [formInput, setFormInput] = useState(obj);
  // const [subs, setSubs] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  // useEffect(() => {
  //   getSub(user.uid).then(setSubs);

  //   if (obj.firebaseKey) setFormInput(obj);
  // }, [obj, user]);

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
      updateOrg(formInput).then(() => router.push(`/org/${obj.firebaseKey}`));
    } else {
      const payload = { ...formInput, uid: user.uid };
      createOrg(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateOrg(patchPayload).then(() => {
          router.push('/');
        });
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="text-black">
      <h2 className="text-white mt-5">{obj.firebaseKey ? 'Update' : 'Create'} New Organization?</h2>

      {/* TITLE INPUT  */}
      <FloatingLabel controlId="floatingInput1" label="Organization Title" className="mb-3">
        <Form.Control type="text" placeholder="Enter a title" name="title" value={formInput.title} onChange={handleChange} required />
      </FloatingLabel>

      <FloatingLabel controlId="floatingInput1" label="Organization Email" className="mb-3">
        <Form.Control type="text" placeholder="Enter a Email" name="email" value={formInput.email} onChange={handleChange} required />
      </FloatingLabel>

      {/* IMAGE INPUT  */}
      <FloatingLabel controlId="floatingInput2" label="Organization Image" className="mb-3">
        <Form.Control type="url" placeholder="Enter an image url" name="image" value={formInput.image} onChange={handleChange} required />
      </FloatingLabel>

      {/* DESCRIPTION TEXTAREA  */}
      <FloatingLabel controlId="floatingTextarea" label="Organization Description" className="mb-3">
        <Form.Control as="textarea" placeholder="Description" style={{ height: '100px' }} name="description" value={formInput.description} onChange={handleChange} required />
      </FloatingLabel>

      {/* SUBMIT BUTTON  */}
      <Button type="submit">{obj.firebaseKey ? 'Update' : 'Create'} Organization</Button>
    </Form>
  );
}

OrgForm.propTypes = {
  obj: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.string,
    email: PropTypes.string,
    title: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
};

export default OrgForm;
