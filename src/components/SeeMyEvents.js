import React from 'react';
import Popup from 'reactjs-popup';
import { Button, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const SeeMyEvents = () => {

  const myEvents = useSelector(state => state.app.events);

  return (
    <Popup trigger={<Button variant="secondary">See My Events</Button>} modal>
      {close => (
       <Table striped bordered hover>
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Location</th>
              <th>Detail</th>
              <th>Organizer</th>
            </tr>
          </thead>
          <tbody>
            {myEvents.map(event => (
              <tr key={event._id}>
                <td>{event.name}</td>
                <td>{event.date}</td>
                <td>{event.location}</td>
                <td>{event.detail}</td>
                <td>{event.organizer}</td>
              </tr>
            ))}
            
          </tbody>
        </Table>
      )}
    </Popup>
  )
}

export default SeeMyEvents;
