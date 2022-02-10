import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { formatDate } from '@fullcalendar/react'
import Sidebar from './components/Sidebar';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setEvents } from './slices/appSlice'
import { useSelector } from 'react-redux'
import { Modal, Button, Carousel, Form, Container, Col, Tab, Row, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css'
import 'react-notifications/lib/notifications.css';
import Login from './components/Login';
import Signup from './components/Signup';

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
  const [url, setUrl] = useState('');
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
        const result = await axios.get(`${process.env.REACT_APP_DEU_EVENT_SERVER}/events`);
        dispatch(setEvents(result.data));
      } catch {
  
      }
    }
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
 
  const handleDateSelect = async (selectInfo) => {
    if (!user?.email || !user?.is_organizer) {
      return false;
    }

    setAddModal({show: true, info: selectInfo});
  }

  const handleAddEvent = async () => {
    if (!title || !location || !category || !detail || !url) {
      NotificationManager.error('All fields are required!');
    }
    let calendarApi = addModal.info.view.calendar

    calendarApi.unselect() // clear date selection
    
    if (title) {
      const result = await axios.post(`${process.env.REACT_APP_DEU_EVENT_SERVER}/events`, {
        start_date: addModal.info.startStr,
        end_date: addModal.info.endStr,
        title,
        organizer: user._id,
        location,
        category,
        detail,
        url
      });
    
      dispatch(setEvents([...events, result.data]));
      setAddModal({show: false, info: {}})
      setLocation('');
      setCategory('');
      setTitle('');
      setDetail('');
      setUrl('');
    }
  }

  const handleEventClick = async (clickInfo) => {
    if (clickInfo.event.extendedProps.organizer === user._id || user.is_admin === true) {
      setRemoveModal({
        show: true,
        info: clickInfo.event
      })
    }
  }

  const handleEventRemove = async () => {
    await axios.delete(`${process.env.REACT_APP_DEU_EVENT_SERVER}/events/${removeModal.info.id}`);
    dispatch(setEvents(events.filter(event => event._id !== removeModal.info.id)));
    removeModal.info.remove();
    setRemoveModal({
      show: false,
      info: {}
    })
  }

  function renderListGroupItem(event) {
    return (
      <ListGroup.Item action href={'#' + event._id}>
        {event.title}
      </ListGroup.Item>
    )
  }

  /*
  function getMyEvents(events) {
    const userEvents = events.find({
      "attendees": user._id
    })

    return userEvents.map(event => (
      <span>{event.title}</span>
    ));
  }

  function getEventAttendess(event, users) {
    const attendeesOnEvent = users.find({
      "_id": event.attendees
    })

    attendeesOnEvent.map(user => (
      <span>{user.photo}</span>
    ));
  }
  */

  const onClickJoin = (user_id, event_id) => async (e) => {

    try {
      const response = await axios.post(`${process.env.REACT_APP_DEU_EVENT_SERVER}/events/${event_id}/join/${user_id}`, {
        event_id,
        user_id
      });
      dispatch(setEvents(events.map(event => event._id === event_id ? response.data : event)));
    } catch {
  
    }
  }

  function renderTabPane(user_id, event) {
    const isJoined = event?.attendees.indexOf(user_id) > -1;
    return (
      <Tab.Pane eventKey={'#' + event._id}>
        <b>{formatDate(event.start_date, {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}) + ' - ' + formatDate(event.end_date, {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</b>
        <br/>
        <i>{event.location}</i>
        <p>{event.detail}</p>
        {
        }
        <Button disabled={isJoined} onClick={onClickJoin(user_id, event._id)}> {isJoined ? 'Joined' : 'Join'}</Button>
    </Tab.Pane>
    )
  }

  return (
    <Container>
      <Row className="top-menu">
        {!user?.verified && (  
          <div className='buttons'>
            <Login />
            <Signup />
          </div>
          )
        }
        {user.verified && <Sidebar /> }
      </Row>

      <Carousel variant="dark" className="carousel">
        {
          events.filter(event => event?.is_featured).map(event => {
            return (
              <Carousel.Item>
              <img
                className="d-block w-100 resize-img"
                src={event?.url}
                alt="First slide"
              />
            </Carousel.Item>
            )
          })
        }
    
      </Carousel>

      <Col className="list-events">
        <h4>Upcoming Events ({events.length})</h4>
        <hr/>
        <Tab.Container id="list-group-tabs-example">
          <Row>
            <Col sm={4}>
              <ListGroup>
              <ListGroup.Item action href='#list-header' disabled>
                Events
              </ListGroup.Item> 
                {events.map(renderListGroupItem)}
              </ListGroup>
            </Col>
            <Col sm={8}>
              <Tab.Content>
                {events.map((event) => renderTabPane(user._id, event))}
              </Tab.Content>
              
            </Col>
          </Row>
        </Tab.Container>
      </Col>

      <Col className='calendar-wrapper'>
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
          showNonCurrentDates={false}
          events={events.map(event => ({ start:event.start_date, end:event.end_date, title: event.title, id: event._id, extendedProps: {organizer: event.organizer} }))} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          windowResize={true}
          maintainDuration={true}
        />
      </Col>

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
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Detail</Form.Label>
              <Form.Control value={url} onChange={(e) => setUrl(e.target.value)} type="text" placeholder="Enter image url" />
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
      
    </Container>
  )
}

export default App;
