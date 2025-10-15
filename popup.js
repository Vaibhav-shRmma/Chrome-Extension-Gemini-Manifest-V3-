const sendBtn = document.getElementById('send');
const clearBtn = document.getElementById('clear');
const promptEl = document.getElementById('prompt');
const output = document.getElementById('output');


sendBtn.addEventListener('click', async () => {
const prompt = promptEl.value.trim();
if (!prompt) return;
output.textContent = 'Thinking...';


chrome.runtime.sendMessage({ type: 'CALL_GEMINI', prompt }, (response) => {
if (!response) {
output.textContent = 'No response from background script.';
return;
}
if (response.error) {
output.textContent = 'Error: ' + response.error;
return;
}
output.textContent = response.text || 'No output received.';
});
});


clearBtn.addEventListener('click', () => {
output.textContent = '';
});