const express = require('express');
const app = express();
const PORT = 8080;

app.get('/health', (req, res) => res.send('OK'));
app.get('/auth/check', (req, res) => {
    console.log('Service B: Auth check');
    res.json({ status: 'Authenticated', user: 'internal-system' });
});

app.listen(PORT, () => console.log(`Service B listening on port ${PORT}`));
