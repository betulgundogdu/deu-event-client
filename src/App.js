import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css'
import 'react-notifications/lib/notifications.css';
import Sidebar from './components/Sidebar';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setEvents } from './slices/appSlice'
import { useSelector } from 'react-redux'
import { Modal, Button, Form } from 'react-bootstrap';

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

const App = () => {
  const dispatch = useDispatch();
  const events = useSelector(state => state.app.events);
  const user = useSelector(state => state.app.user);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [detail, setDetail] = useState('');
  const [addModal, setAddModal] = useState({
    show: false,
    info: {}
  });
  const [removeModal, setRemoveModal] = useState({
    show: false,
    info: {}
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await axios.get(`${process.env.REACT_APP_DEU_EVENT_SERVER}events`);
        dispatch(setEvents(result.data));
      } catch {
  
      }
    }
    fetch();
  }, [])
 
  const handleDateSelect = async (selectInfo) => {
    if (!user?.email || !user?.validation) {
      return false;
    }

    setAddModal({show: true, info: selectInfo});
  }

  const handleAddEvent = async () => {
    if (!title || !location || !category || !detail) {
      NotificationManager.error('All fields are required!');
    }
    let calendarApi = addModal.info.view.calendar

    calendarApi.unselect() // clear date selection
    
    if (title) {
      const result = await axios.post(`${process.env.REACT_APP_DEU_EVENT_SERVER}events`, {
        date: addModal.info.startStr,
        title,
        organization: user._id,
        location,
        category,
        detail
      });
    
      dispatch(setEvents([...events, result.data]));
      setAddModal({show: false, info: {}})
      setLocation('');
      setCategory('');
      setTitle('');
      setDetail('');
    }
  }

  const handleEventClick = async (clickInfo) => {
    if (clickInfo.event.extendedProps.organization === user._id || user.name === 'admin') {
      setRemoveModal({
        show: true,
        info: clickInfo.event
      })
    }
  }

  const handleEventRemove = async () => {
    await axios.delete(`${process.env.REACT_APP_DEU_EVENT_SERVER}events/${removeModal.info.id}`);
    dispatch(setEvents(events.filter(event => event._id !== removeModal.info.id)));
    removeModal.info.remove();
    setRemoveModal({
      show: false,
      info: {}
    })
  }

  return (
    <div className='home'>
      <Sidebar 
        currentEvents={events}
      />
      <div className='home-main'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events.map(event => ({ start:event.date, title: event.title, id: event._id, extendedProps: {organization: event.organization} }))} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
        />
      </div>
      <NotificationContainer />
      {addModal.show && <Modal show={addModal.show} onHide={() => setAddModal({show: false, info: {}})}>
        <Modal.Header closeButton>
          <Modal.Title>Add new event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Title</Form.Label>
              <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Enter a title" />
            </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Location</Form.Label>
              <Form.Control value={location} onChange={(e) => setLocation(e.target.value)} type="text" placeholder="Enter a location" />
            </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Category</Form.Label>
              <Form.Control value={category} onChange={(e) => setCategory(e.target.value)} type="text" placeholder="Enter a category" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Detail</Form.Label>
              <Form.Control as="textarea" value={detail} onChange={(e) => setDetail(e.target.value)} type="text" placeholder="Enter details" />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAddModal({show: false, info: {}})}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddEvent}>
            Save Event
          </Button>
        </Modal.Footer>
      </Modal>}
      {removeModal.show && <Modal show={removeModal.show} onHide={() => {setRemoveModal({show: false, info: {}})}}>
        <Modal.Header closeButton>
          <Modal.Title>{removeModal.info.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRemoveModal({show: false, info: {}})}>
            No
          </Button>
          <Button variant="danger" onClick={handleEventRemove}>
            Yes, delete!
          </Button>
        </Modal.Footer>
      </Modal>}
      
    </div>
  )
}

export default App;