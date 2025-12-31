// netlify/functions/send-telegram.js

exports.handler = async function (event) {
  // Solo permitir peticiones POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    // Obtener los datos del formulario enviados desde el script del cliente
    const { name, email, message } = JSON.parse(event.body);

    // Obtener las variables de entorno seguras de Netlify
    const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Las variables de entorno de Telegram no están configuradas en Netlify.');
    }

    // Construir el mensaje para Telegram
    const telegramMessage = [
      `🔔 *Nuevo mensaje desde la web* 🔔`,
      `*Nombre:* ${name}`,
      `*Email:* ${email}`,
      `*Mensaje:*`,
      `${message}`,
    ].join('\n');

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    // Enviar el mensaje a Telegram
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'Markdown', // Permite usar negritas, cursivas, etc.
      }),
    });

    const responseData = await response.json();

    if (!responseData.ok) {
      // Si Telegram devuelve un error
      throw new Error(`Error de la API de Telegram: ${responseData.description}`);
    }

    // Éxito
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Mensaje enviado a Telegram correctamente.' }),
    };

  } catch (error) {
    console.error('Error en la función de Telegram:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
