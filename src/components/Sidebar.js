/* eslint-disable jsx-a11y/anchor-is-valid */
import {React, useState} from 'react';
import { useSelector } from 'react-redux';
import ManageUsers from './ManageUsers';
import SeeMyEvents from './SeeMyEvents';
import ProfileSettings from './ProfileSettings';
import { Button, Offcanvas } from 'react-bootstrap';
import {HiMenu} from 'react-icons/hi';


const Sidebar = () => {
  const user = useSelector(state =>  state.app?.user);

  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  return (
    <>
      <Button onClick={handleShow} className="me-2 open-left-menu">
        <HiMenu />
      </Button>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="sidebar-menu">
            <div className="header">
              <h4>Welcome <strong>{user.name}</strong>!</h4> 
              <br/>
              <img src={"https://ui-avatars.com/api/?name=" + user.name} alt=""/>
            </div>
            <div className="control">
              <p> Activities</p>
              {user.is_admin === true && <ManageUsers />}
              <SeeMyEvents />
              <ProfileSettings />
            </div>
            <div className="footer">
              <a href="" className='logout'>logout</a>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Sidebar;
