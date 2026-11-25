// netlify/functions/send-contact-form.js

const MAX_BODY_BYTES = 10 * 1024;
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 250;

function jsonResponse(statusCode, payload, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...extraHeaders,
    },
    body: JSON.stringify(payload),
  };
}

function getHeader(headers, name) {
  const key = Object.keys(headers || {}).find(
    (headerName) => headerName.toLowerCase() === name.toLowerCase()
  );
  return key ? headers[key] : undefined;
}

function validateContactData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { error: 'El cuerpo de la solicitud debe ser un objeto JSON.' };
  }

  const allowedFields = new Set(['name', 'email', 'message']);
  if (Object.keys(data).some((field) => !allowedFields.has(field))) {
    return { error: 'La solicitud contiene campos no permitidos.' };
  }

  if (
    typeof data.name !== 'string' ||
    typeof data.email !== 'string' ||
    typeof data.message !== 'string'
  ) {
    return { error: 'Nombre, correo y mensaje deben ser textos.' };
  }

  const name = data.name.trim();
  const email = data.email.trim();
  const message = data.message.trim();

  if (name.length < 2 || name.length > MAX_NAME_LENGTH) {
    return { error: `El nombre debe tener entre 2 y ${MAX_NAME_LENGTH} caracteres.` };
  }

  if (
    email.length === 0 ||
    email.length > MAX_EMAIL_LENGTH ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)
  ) {
    return { error: 'El correo electrónico no tiene un formato válido.' };
  }

  if (message.length < 1 || message.length > MAX_MESSAGE_LENGTH) {
    return { error: `El mensaje debe tener entre 1 y ${MAX_MESSAGE_LENGTH} caracteres.` };
  }

  return { value: { name, email, message } };
}

exports.handler = async function (event) {
  // Solo permitir peticiones POST.
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Método no permitido.' }, { Allow: 'POST' });
  }

  // Exigir JSON para evitar interpretar cuerpos con formatos inesperados.
  const contentType = getHeader(event.headers, 'content-type') || '';
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    return jsonResponse(415, { error: 'El tipo de contenido debe ser application/json.' });
  }

  if (typeof event.body !== 'string' || event.body.length === 0) {
    return jsonResponse(400, { error: 'La solicitud no contiene datos válidos.' });
  }

  // Medir el tamaño real del cuerpo, no confiar en Content-Length.
  let rawBody;
  try {
    rawBody = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body, 'utf8');
  } catch {
    return jsonResponse(400, { error: 'No se pudo leer el contenido de la solicitud.' });
  }

  if (rawBody.length > MAX_BODY_BYTES) {
    return jsonResponse(413, { error: 'La solicitud supera el tamaño permitido.' });
  }

  let data;
  try {
    data = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return jsonResponse(400, { error: 'El contenido JSON no es válido.' });
  }

  const validation = validateContactData(data);
  if (validation.error) {
    return jsonResponse(400, { error: validation.error });
  }

  const { name, email, message } = validation.value;

  try {
    const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, RESEND_API_KEY } = process.env;

    // Función para enviar a Telegram.
    const sendTelegram = async () => {
      if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        throw new Error('Las variables de entorno de Telegram no están configuradas.');
      }
      const telegramMessage = `🔔 *Nuevo mensaje desde la web* 🔔\n\n*Nombre:*\n${name}\n\n*Email:*\n${email}\n\n*Mensaje:*\n${message}`;
      const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

      const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'Markdown',
        }),
      });

      const responseData = await response.json();
      if (!responseData.ok) {
        throw new Error(`Error de la API de Telegram: ${responseData.description}`);
      }
      return { service: 'Telegram', status: 'success' };
    };

    // Función para enviar Email con Resend.
    const sendEmail = async () => {
      if (!RESEND_API_KEY) {
        throw new Error('La variable de entorno RESEND_API_KEY no está configurada.');
      }
      const emailHtml = `
        <h1>Nuevo mensaje desde la web</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr>
        <p><strong>Mensaje:</strong></p>
        <div style="padding: 12px; border: 1px solid #e0e0e0; background-color: #f9f9f9; border-radius: 6px; white-space: pre-wrap; word-wrap: break-word;">
          ${message}
        </div>
      `;

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Wendy Web <onboarding@resend.dev>',
          to: ['anapaolacaviades@gmail.com'],
          subject: '🔔 Nuevo mensaje de tu página web',
          html: emailHtml,
        }),
      });

      const responseData = await response.json();
      if (responseData.error) {
        throw new Error(`Error de la API de Resend: ${responseData.error.message}`);
      }
      return { service: 'Email', status: 'success' };
    };

    // Mantener el comportamiento actual: basta con que un destino funcione.
    const results = await Promise.allSettled([sendTelegram(), sendEmail()]);
    const successfulDeliveries = results.filter((result) => result.status === 'fulfilled').length;

    if (successfulDeliveries === 0) {
      const errors = results
        .map((result) => result.reason?.message || 'Error desconocido')
        .join(', ');
      throw new Error(`Falló el envío a todos los servicios: ${errors}`);
    }

    return jsonResponse(200, {
      message: `Mensaje enviado. Entregas exitosas: ${successfulDeliveries}`,
    });
  } catch (error) {
    console.error('Error en la función de contacto:', error);
    // La respuesta genérica al visitante se completará en la etapa de errores seguros.
    return jsonResponse(500, { error: error.message });
  }
};
