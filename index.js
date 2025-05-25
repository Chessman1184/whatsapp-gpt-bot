require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const client = new Client({ authStrategy: new LocalAuth() });

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp bot is ready!');
});

client.on('message', async (message) => {
  if (!message.body) return;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.MODEL || 'gpt-4o',
      messages: [{ role: "user", content: message.body }],
    });

    const reply = response.choices[0].message.content.trim();
    message.reply(reply);
  } catch (err) {
    console.error('OpenAI error:', err);
    message.reply("Oops! Something went wrong.");
  }
});

client.initialize();
