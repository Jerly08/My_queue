import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const [rows] = await db.query('SELECT * FROM tickets');
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Database query failed' });
    }
  } else if (req.method === 'POST') {
    try {
      // Get the last ticket number
      const [rows]: any = await db.query('SELECT ticketNumber FROM tickets ORDER BY id DESC LIMIT 1');
      const lastTicketNumber = rows.length ? parseInt(rows[0].ticketNumber, 10) : 0;
      const newTicketNumber = (lastTicketNumber + 1).toString().padStart(3, '0'); // Pad the ticket number to 5 digits

      await db.query('INSERT INTO tickets (ticketNumber) VALUES (?)', [newTicketNumber]);
      res.status(201).json({ message: 'Ticket created', ticketNumber: newTicketNumber });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;