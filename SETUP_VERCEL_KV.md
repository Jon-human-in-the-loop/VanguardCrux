# Configurar Vercel KV para almacenar conversaciones

## ¿Qué es Vercel KV?
Vercel KV es una base de datos Redis (almacenamiento de clave-valor) gratis incluida con Vercel. Perfecto para guardar conversaciones del chatbot.

## Pasos de configuración:

### 1. Ve al panel de Vercel
- Ve a https://vercel.com/dashboard
- Selecciona tu proyecto `vanguardcrux-local`

### 2. Ir a Storage
- Click en la pestaña **"Storage"**
- Click en **"Create Database"**
- Selecciona **"KV"** (no SQL ni Postgres)
- Nombre: `vanguardcrux-kv` (o el que prefieras)
- Region: Elige la más cercana a ti (Europa → `eu-west-1` para Dublin)
- Click en **"Create"**

### 3. Copiar credenciales
Una vez creada la BD:
- Vercel te mostrará variables de entorno automáticamente:
  - `KV_URL`
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`

**Estas se agregan AUTOMÁTICAMENTE a tu proyecto.** No necesitas hacer nada más.

### 4. Deploy
- Push tu código a GitHub
- Vercel deployará automáticamente
- Las variables de entorno estarán disponibles en producción

## Verificar que funciona

1. **Test en local** (si usas Vercel CLI):
   ```bash
   npm install -g vercel
   vercel link  # Conecta tu proyecto local
   vercel env pull  # Descarga variables de entorno
   ```

2. **Test en producción**:
   - Abre tu sitio: https://vanguard-crux.vercel.app
   - Abre el chatbot
   - Pregunta algo
   - Click en "Agendar Análisis Gratis"
   - Ingresa nombre + email
   - Debería guardarse la conversación

## Ver conversaciones guardadas

### Opción A: Dashboard admin (recomendado)
- Ve a: `https://vanguard-crux.vercel.app/admin/conversations.html`
- Ingresa el email del cliente
- Verás todas sus conversaciones

### Opción B: Vercel KV Studio
- En https://vercel.com/dashboard → Storage → Click en tu KV
- Verás los datos en tiempo real
- Busca claves que empiecen con `lead:`

## Límites (plan gratis)
- ✅ 500 comandos/mes (más que suficiente para vuestro caso)
- ✅ 500MB de almacenamiento
- ✅ Sin costo si no superas los límites

## Troubleshooting

**Problema:** "Cannot find module '@vercel/kv'"
- **Solución:** Corre `npm install` después de actualizar `package.json`

**Problema:** Error 500 al guardar conversaciones
- **Solución:** Verifica que:
  1. KV está creado en Vercel
  2. Las variables de entorno están configuradas
  3. Mira los logs en Vercel: https://vercel.com/dashboard → Logs

**Problema:** No encuentra conversaciones en el admin
- **Solución:** 
  1. Verifica que enviaste email + nombre al agendar
  2. Usa el mismo email para buscar
  3. Espera unos segundos (la latencia de la BD)

## Próximos pasos opcionales

1. **Agregar autenticación al admin** (proteger /admin/conversations.html)
2. **Enviar email cuando se agenda** (Resend, SendGrid)
3. **Integrar con Zapier** (guardar automáticamente en Notion/Sheets)
4. **Webhook de Calendly** (marcar conversación como "booked")
