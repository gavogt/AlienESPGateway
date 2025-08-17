app.post("/api/ai/query", async (req, res) => {
    try {

        const {q} = req.body || {};

        if(!q || typeof q !== 'string') {
            return res.status(400).json({ error: 'Invalid query' });
        }

        const result = await runInsightQuery(q);
        res.json(result);
        } catch (e) {
            console.error('/api/ai/query error:', e.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    });