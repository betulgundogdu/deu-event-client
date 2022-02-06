import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Popup from 'reactjs-popup';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { setEvents } from '../slices/appSlice';
import { useSelector } from 'react-redux';

const ManageEvents = () => {

  const events = useSelector(state => state.app.events);

  const dispatch = useDispatch();
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
  }, []);

  const onChange = (id, is_featured) => async (e) => {

    const checked = e.target.checked;

    try {
      await axios.post(`${process.env.REACT_APP_DEU_EVENT_SERVER}/events/featured`, {
        id,
        is_featured: checked
      });

      const newEvents = events.map(event => {
        if (event._id === id) {
          return {...event, is_featured: !event.is_featured}
        }
        return event;
      })
      dispatch(setEvents(newEvents));
    } catch {

    }
  } 

  return (
    <Popup trigger={<Button variant="secondary">Manage Events</Button>} modal>
      {close => (
       <Table striped bordered hover>
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Is Featured</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td><input type="checkbox" checked={event.is_featured} onChange={onChange(event._id, event.is_featured)} /></td>
              </tr>
            ))}
            
          </tbody>
        </Table>
      )}
    </Popup>
  )
}

export default ManageEvents;
