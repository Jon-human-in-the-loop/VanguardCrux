export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, lang = 'es', stage = 0, systemPrompt } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    if (!systemPrompt) {
      return res.status(400).json({ error: 'System prompt is required' });
    }

    const puterUrl = 'https://api.puter.com/v1/llm/chat/completions';

    const requestBody = {
      model: 'grok',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    };

    const response = await fetch(puterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Puter API Error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'API request failed',
        details: errorText
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response received';

    return res.status(200).json({ reply, stage, lang });

  } catch (error) {
    console.error('Chatbot error:', error.message);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
