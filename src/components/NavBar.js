/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav, Button, Image } from 'react-bootstrap';
import { signOut } from '@/utils/auth';
import { useAuth } from '@/utils/context/authContext';

export default function NavBar() {
  const { user } = useAuth();

  return (
    <Navbar collapseOnSelect expand="lg" className="py-3" style={{ backgroundColor: '#5cb85c' }} variant="dark">
      <Container>
        <Link passHref href="/" className="navbar-brand">
          Giving Gardens
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link" href="/orgmain">
              Organizations
            </Link>
            <Link className="nav-link" href="/profilemain">
              Profile
            </Link>
          </Nav>

          {user && (
            <div className="d-flex align-items-center me-2">
              {user.photoURL && <Image src={user.photoURL} alt="Profile" width={30} height={30} roundedCircle className="me-2 border border-light" />}
              <span className="text-white me-3">{user.displayName}</span>
            </div>
          )}

          <Button variant="danger" onClick={signOut}>
            Sign Out
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
