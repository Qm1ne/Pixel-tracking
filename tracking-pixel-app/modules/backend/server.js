require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Event Ingestion Endpoint
app.post('/api/v1/event', async (req, res) => {
    try {
        const {
            event_type,
            page_url,
            referrer,
            source,
            campaign_id,
            session_id,
            anonymous_id,
            timestamp,
            ...metadata
        } = req.body;

        if (!event_type || !anonymous_id || !page_url) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Insert into DB
        const query = `
            INSERT INTO events (
                event_type, page_url, referrer, source, campaign_id, 
                session_id, anonymous_id, metadata, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `;

        const values = [
            event_type,
            page_url,
            referrer,
            source,
            campaign_id,
            session_id,
            anonymous_id,
            metadata,
            timestamp || new Date()
        ];

        await pool.query(query, values);

        console.log(`[${new Date().toISOString()}] Captured ${event_type} from ${anonymous_id}`);

        res.status(202).json({ status: 'accepted' });
    } catch (error) {
        console.error('Error processing event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
