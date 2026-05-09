const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 8080;

app.get('/health', (req, res) => res.send('OK'));
app.get('/', async (req, res) => {
    console.log('Service E: Frontend request');
    try {
        const response = await axios.get('http://service-a.backend.svc.cluster.local/api/data');
        res.send(`
            <h1>Microservices Platform Dashboard</h1>
            <pre>${JSON.stringify(response.data, null, 2)}</pre>
        `);
    } catch (error) {
        res.status(500).send('<h1>Frontend Error</h1><p>Could not reach Core API</p>');
    }
});

app.listen(PORT, () => console.log(`Service E listening on port ${PORT}`));
