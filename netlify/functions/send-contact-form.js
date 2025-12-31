// netlify/functions/send-contact-form.js

exports.handler = async function (event) {
  // Solo permitir peticiones POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body);
    const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, RESEND_API_KEY } = process.env;

    // Función para enviar a Telegram
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

    // Función para enviar Email con Resend
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
        <p>${message.replace(/\n/g, "<br>")}</p>
      `;

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Barbarita Web <onboarding@resend.dev>',
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

    // Ejecutar ambas promesas en paralelo
    const results = await Promise.allSettled([sendTelegram(), sendEmail()]);

    const successfulDeliveries = results.filter(r => r.status === 'fulfilled').length;

    if (successfulDeliveries === 0) {
      // Si ambas fallaron, lanzar un error con los detalles
      const errors = results.map(r => r.reason?.message || 'Error desconocido').join(', ');
      throw new Error(`Falló el envío a todos los servicios: ${errors}`);
    }

    // Éxito si al menos uno funcionó
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Mensaje enviado. Entregas exitosas: ${successfulDeliveries}` }),
    };

  } catch (error) {
    console.error('Error en la función de contacto:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
