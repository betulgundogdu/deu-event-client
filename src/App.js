import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { formatDate } from '@fullcalendar/react'
import Sidebar from './components/Sidebar';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { BsCalendarDate } from 'react-icons/bs';
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setEvents } from './slices/appSlice'
import { useSelector } from 'react-redux'
import { Modal, Button, Carousel, Form, Container, Col, Tab, Row, ListGroup, InputGroup, FormControl } from 'react-bootstrap';
import Login from './components/Login';
import Signup from './components/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css'
import 'react-notifications/lib/notifications.css';

const logo_url = "https://edebiyat.deu.edu.tr/wp-content/uploads/DEU-Logo-JPEG-250x250.jpg"


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
    if (!title || !location || !category || !detail) {
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

  function renderTabPane(event) {
    return (
      <Tab.Pane eventKey={'#' + event._id}>
        <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
        <p>{event.detail}</p>
    </Tab.Pane>
    )
  }

  return (
    <Container>
      <Row className="top-menu">
        {user?.verified && <Sidebar />}
        <div className='buttons'>

        {
          !user?.email && (  
          <>
            <Login />
            <Signup />
            </>
          )
        }
        </div>
      </Row>

      <Carousel variant="dark" className="carousel">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="holder.js/800x400?text=First slide&bg=f5f5f5"
            alt="First slide"
          />
          <Carousel.Caption>
            <h5>First slide label</h5>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="holder.js/800x400?text=Second slide&bg=eee"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h5>Second slide label</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="holder.js/800x400?text=Third slide&bg=e5e5e5"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h5>Third slide label</h5>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <Col className="list-events">
        <h4>Latest Events ({events.length})</h4>
        <div className="filters">
          <InputGroup className="filter search">
            <InputGroup.Text id="inputGroup-sizing-default"><IoMdSearch className="md-icon"/></InputGroup.Text>
            <FormControl
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
            </InputGroup>
          <InputGroup className="filter">
            <InputGroup.Text id="inputGroup-sizing-default"><BsCalendarDate className="md-icon"/> Start </InputGroup.Text>
            <Form.Control type="date" name='starting_date' />
          </InputGroup>
          <InputGroup className="filter">
            <InputGroup.Text id="inputGroup-sizing-default"><BsCalendarDate className="md-icon"/> End</InputGroup.Text>
            <Form.Control type="date" name='ending_date' />
          </InputGroup>
          <Button variant="outline-primary" onClick={() => setAddModal({show: true, info: {}})}><IoMdAdd className="md-icon"/></Button>
        </div>
        <hr/>
        <Tab.Container id="list-group-tabs-example">
          <Row>
            <Col sm={4}>
              <ListGroup>
                {events.map(renderListGroupItem)}
              </ListGroup>
            </Col>
            <Col sm={8}>
              <Tab.Content>
                {events.map(renderTabPane)}
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
          events={events.map(event => ({ start_date:event.start_date, end_date:event.end_date, title: event.title, id: event._id, extendedProps: {organizer: event.organizer} }))} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          windowResize={true}
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
