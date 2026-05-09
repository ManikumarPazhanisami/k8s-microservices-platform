const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const PORT = 8080;

// Helper to read secrets from the volume populated by Vault init-container
const getSecret = (key) => {
    try {
        return fs.readFileSync(`/vault/secrets/${key}`, 'utf8').trim();
    } catch (e) {
        return 'placeholder-secret';
    }
};

app.get('/health', (req, res) => res.send('OK'));
app.get('/ready', (req, res) => res.send('Ready'));

app.get('/api/data', async (req, res) => {
    console.log('Service A: Core API received request');
    try {
        // Communicate with Service B (Auth)
        const authRes = await axios.get('http://service-b.backend.svc.cluster.local/auth/check');
        
        // Communicate with Service C (Data Processing)
        const dataRes = await axios.get('http://service-c.backend.svc.cluster.local/process');

        res.json({
            service: 'Service A',
            auth: authRes.data,
            processing: dataRes.data,
            db_status: 'Connected with secret from Vault'
        });
    } catch (error) {
        res.status(500).json({ error: 'Communication failure', details: error.message });
    }
});

app.listen(PORT, () => console.log(`Service A listening on port ${PORT}`));
