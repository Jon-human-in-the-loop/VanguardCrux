import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, language, chatHistory } = req.body;

    // Validar datos
    if (!email || !name || !chatHistory) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Crear ID único para la conversación
    const leadId = `lead:${email}:${Date.now()}`;

    // Guardar en Vercel KV con expiración de 90 días
    const leadData = {
      leadId,
      email,
      name,
      language: language || 'es',
      chatHistory,
      createdAt: new Date().toISOString(),
      calendlyBooked: false
    };

    // Guardar en KV (expira en 90 días = 7,776,000 segundos)
    await kv.set(leadId, JSON.stringify(leadData), { ex: 7776000 });

    // También guardar en un índice por email para búsqueda rápida
    await kv.lpush(`leads:by-email:${email}`, leadId);

    return res.status(200).json({
      success: true,
      message: 'Chat lead saved successfully',
      leadId
    });

  } catch (error) {
    console.error('Error saving chat lead:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
