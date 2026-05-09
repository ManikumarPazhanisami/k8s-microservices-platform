const express = require('express');
const app = express();
app.use(express.json());
const PORT = 8080;

app.get('/health', (req, res) => res.send('OK'));
app.post('/notify', (req, res) => {
    console.log('Service D (Worker): Notification Received:', req.body.message);
    res.json({ status: 'Sent' });
});

app.listen(PORT, () => console.log(`Service D listening on port ${PORT}`));
