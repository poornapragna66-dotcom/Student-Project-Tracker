import express from 'express';
import { createApp } from './app.js';
import { db } from './database.js';

const app = createApp(db);

// Parse JSON request bodies, limited to 10 KB.
app.use(express.json({ limit: '10kb' }));

// Health-check route.
app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
    console.log(`Open http://localhost:${port}`);
});