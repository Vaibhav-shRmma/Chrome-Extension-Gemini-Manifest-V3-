const GEMINI_API_KEY = 'ADD YOUR OWN API KEY'; 

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());


async function callGemini(prompt) {
if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
throw new Error('Please set your API key inside service_worker.js');
}


const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const payload = {
contents: [{ parts: [{ text: prompt }] }]
};


const resp = await fetch(url, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'x-goog-api-key': GEMINI_API_KEY
},
body: JSON.stringify(payload)
});


if (!resp.ok) {
const txt = await resp.text();
throw new Error(`Gemini API error ${resp.status}: ${txt}`);
}


const data = await resp.json();
const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No text found in response';
return text;
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
if (message?.type === 'CALL_GEMINI') {
(async () => {
try {
const text = await callGemini(message.prompt);
sendResponse({ text });
} catch (err) {
sendResponse({ error: err.message });
}
})();
return true; 
}

});
