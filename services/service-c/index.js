const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 8080;

app.get('/health', (req, res) => res.send('OK'));
app.get('/process', async (req, res) => {
    console.log('Service C: Processing data');
    
    // Trigger notification in Service D
    try {
        await axios.post('http://service-d.workers.svc.cluster.local/notify', {
            message: 'Data processing complete'
        });
    } catch (e) {
        console.error('Failed to notify Service D');
    }

    res.json({ status: 'Processed', timestamp: new Date() });
});

app.listen(PORT, () => console.log(`Service C listening on port ${PORT}`));
