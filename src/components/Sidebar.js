import { AiFillGithub } from 'react-icons/ai';
import { formatDate } from '@fullcalendar/react'
import React from 'react';
import { useSelector } from 'react-redux';
import Login from './Login';
import Signup from './Signup';
import ManageUsers from './ManageUsers';

const logo_url = "https://edebiyat.deu.edu.tr/wp-content/uploads/DEU-Logo-JPEG-250x250.jpg"

function renderSidebarEvent(event) {
  return (
    <li key={event._id}>
      <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
      <i>{event.title}</i>
    </li>
  )
}

const Sidebar = ({
  currentEvents,
}) => {
  const user = useSelector(state =>  state.app?.user);

  return (
    <div className='home-sidebar'>
      <div className='home-sidebar-section'>
        <img alt="logo" src={logo_url} className="logo"></img>
      </div>
      <div className='home-sidebar-section'>
        <h2>All Events ({currentEvents.length})</h2>
        <ul>
          {currentEvents.map(renderSidebarEvent)}
        </ul>
      </div>
      <div className='home-sidebar-section'>
        {
          user?.email && <div>Welcome <strong>{user.name}</strong>!</div>
        }
        {!user?.email && (
          <>
            <Login />
            <Signup />
          </>
        )}

        {user.name === 'admin' && <ManageUsers />}
      </div>
      <div className='home-sidebar-section'>
        <a className="social-media" href="#"><AiFillGithub /></a>
      </div>
    </div>
  )
}

export default Sidebar;