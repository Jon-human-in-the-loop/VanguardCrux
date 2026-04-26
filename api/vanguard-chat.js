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

    const apiKey = process['GROK_API_KEY'];
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const grokUrl = 'https://api.x.ai/v1/chat/completions';

    const requestBody = {
      model: 'grok-beta',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    };

    const response = await fetch(grokUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({
        error: 'Failed to process message'
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response received';

    return res.status(200).json({ reply, stage, lang });

  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
}
