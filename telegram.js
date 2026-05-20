#!/usr/bin/env node
const dotenv = require('dotenv');
dotenv.config();

const TOKEN = process.env.TELEGRAM_TOKEN;
const BOT_ID = Number(TOKEN?.split(':')[0]); // Bot's own user ID, from the token
if (!TOKEN) {
    console.error('TELEGRAM_TOKEN required');
    process.exit(1);
}

let lastUpdateId = 0;

async function poll() {
    try {
        const url = `https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data.ok || !data.result) return;

        const messages = [];
        for (const update of data.result) {
            lastUpdateId = Math.max(lastUpdateId, update.update_id);
            if (!update.message?.text) continue;
            const from = update.message.from;
            if (from?.id === BOT_ID) continue; // skip own bot's messages
            const sender = from?.username || from?.first_name || 'unknown';
            messages.push({ sender, text: update.message.text, chatId: update.message.chat.id });
        }

        if (messages.length > 0 && process.send) {
            process.send({ type: 'telegram', messages });
        }
    } catch (e) {
        if (e.code !== 'ETIMEDOUT') process.send?.({ type: 'error', message: e.message });
    }
}

// Handle reply requests from parent
process.on('message', async msg => {
    if (msg.type === 'reply') {
        try {
            const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: msg.chatId, text: msg.text })
            });
        } catch (e) {
            process.send?.({ type: 'error', message: 'sendMessage: ' + e.message });
        }
    }
});

setInterval(poll, 1000);
poll();
