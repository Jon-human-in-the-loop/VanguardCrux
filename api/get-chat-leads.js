import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Nota: Para producción, agregar autenticación aquí
    // Por ahora, cualquiera puede acceder (cambiar según necesidad)

    const { email, limit = 50 } = req.query;

    if (email) {
      // Obtener conversaciones de un email específico
      const leadIds = await kv.lrange(`leads:by-email:${email}`, 0, -1);

      if (!leadIds || leadIds.length === 0) {
        return res.status(200).json({
          success: true,
          leads: [],
          message: 'No conversations found for this email'
        });
      }

      // Obtener detalles de cada conversación
      const leads = [];
      for (const leadId of leadIds) {
        const leadData = await kv.get(leadId);
        if (leadData) {
          leads.push(JSON.parse(leadData));
        }
      }

      return res.status(200).json({
        success: true,
        leads: leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      });
    } else {
      // Retornar error: se debe especificar email
      return res.status(400).json({
        error: 'Email parameter is required',
        hint: 'Usage: /api/get-chat-leads?email=example@domain.com'
      });
    }

  } catch (error) {
    console.error('Error fetching chat leads:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
