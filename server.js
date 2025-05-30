const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/forge/token', async (req, res) => {
    try {
        const params = new URLSearchParams();
        params.append('client_id', process.env.CLIENT_ID);
        params.append('client_secret', process.env.CLIENT_SECRET);
        params.append('grant_type', 'client_credentials');
        params.append('scope', 'viewables:read');

        const response = await fetch('https://developer.api.autodesk.com/authentication/v1/authenticate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        const data = await response.json();
        res.json({ access_token: data.access_token });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch token' });
    }
});

app.listen(PORT, () => {
    console.log(`Token server is running on port ${PORT}`);
});