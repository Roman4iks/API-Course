const pool = require('../utils/pool');

async function getMembersOfEvent(req, res) {
  const eventId = req.params.id;
  if (!eventId) {
    return res.status(400).json({ error: 'Event ID is required' });
  }
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT m.* FROM public."Members" m INNER JOIN public."EventsParticipants" ep ON m.members_id = ep.member_id WHERE ep.event_id = $1',
      [eventId]
    );
    const members = result.rows;
    client.release();
    if(members.length == 0){
      return res.status(404).json({ error: 'Members not found' });
    };
    return res.json(members)
  } catch (error) {
    console.error('Error executing query', error);
    return res.status(500).send('Internal Server Error');
  }
}

async function getEventsOfMember(req, res) {
  const memberId = req.params.id;
    if (!memberId) {
    return res.status(400).json({ error: 'Member ID is required' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT e.* FROM public."Events" e INNER JOIN public."EventsParticipants" ep ON e.event_id = ep.event_id WHERE ep.member_id = $1',
      [memberId]
    );
    const events = result.rows;
    client.release();

    if(!events){  
      return res.status(404).send('Events not found');
    };
    return res.json(events)
  } catch (error) {
    console.error('Error executing query', error);
    return res.status(500).send('Internal Server Error');
  }
}

module.exports = { getMembersOfEvent, getEventsOfMember };
