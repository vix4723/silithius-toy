const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

app.post('/api/generate', async (req, res) => {
    const { userInput } = req.body;

    if (!userInput) {
        return res.status(400).json({ error: 'User input is required' });
    }

    // Verify that environment variables are loaded
    console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
    console.log('OPENAI_ORG_ID:', process.env.OPENAI_ORG_ID);
    console.log('OPENAI_PROJECT_ID:', process.env.OPENAI_PROJECT_ID);

    try {
        const fetch = await import('node-fetch');

        const response = await fetch.default('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'OpenAI-Organization': process.env.OPENAI_ORG_ID,
                'OpenAI-Project': process.env.OPENAI_PROJECT_ID,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are an expert marketing strategist and brand manager. Please provide detailed and specific recommendations with a 1 sentence explanation for each recommendation. Don't return anything else" },
                    { role: "user", content: userInput }
                ],
                max_tokens: 150
            }),
        });

        const data = await response.json();
        if (response.ok) {
            res.json(data);
        } else {
            res.status(response.status).json(data);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = app;
