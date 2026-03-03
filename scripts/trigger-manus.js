const fs = require('fs');

async function send() {
    try {
        const promptPath = 'C:\\Users\\kamil\\.gemini\\antigravity\\brain\\ab66d138-3e92-47e7-9e7a-736de7189474\\final_audit_prompt.md';
        const prompt = fs.readFileSync(promptPath, 'utf8');

        console.log("Wysyłanie żądania do lokalnego API...");
        const response = await fetch('http://localhost:3000/api/admin/manus/audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                isLocal: true,
                targetUrl: 'https://fuzzy-chefs-join.loca.lt',
                customPrompt: prompt
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("Błąd API:", err);
            return;
        }

        const data = await response.json();
        console.log("Sukces! Odpowiedź od Manusa:");
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Błąd połączenia z serwerem. Upewnij się, że 'npm run dev' działa.");
        console.error(e);
    }
}

send();
