const http = require('http');
const https = require('https');

console.log("🚀 Starting Background Audit Service for Manus AI...");
console.log("⏱️  Interval set to run every 60 minutes.");

const auditEndpoints = [
    { name: 'Store Readiness', url: 'http://localhost:3000/api/admin/manus/audit' },
    // You can add more specific endpoints here if needed
];

async function runAudits() {
    console.log(`\n--- Running Audits: ${new Date().toISOString()} ---`);
    for (const endpoint of auditEndpoints) {
        try {
            console.log(`PING: ${endpoint.name} (${endpoint.url})`);
            
            // Wait for response, but don't strictly require it to succeed immediately
            // as this is a background recurring check
            await new Promise((resolve, reject) => {
                const req = http.get(endpoint.url, (res) => {
                    let data = '';
                    res.on('data', chunk => { data += chunk; });
                    res.on('end', () => {
                        console.log(`✅ [${res.statusCode}] ${endpoint.name} audit completed.`);
                        // console.log(data); // Uncomment for full verbosity
                        resolve(true);
                    });
                }).on('error', (err) => {
                    console.error(`❌ Failed to reach ${endpoint.name}: ${err.message}`);
                    resolve(false); // resolve anyway so loop continues
                });

                // Set a timeout of 10s
                req.setTimeout(10000, () => {
                    console.error(`⏱️ Timeout reaching ${endpoint.name}`);
                    req.destroy();
                    resolve(false);
                });
            });
        } catch (error) {
            console.error(`Crash inside loop:`, error);
        }
    }
}

// Run immediately on start
runAudits();

// Then run every 60 minutes
// 60 minutes * 60 seconds * 1000 ms
const INTERVAL = 60 * 60 * 1000;
setInterval(runAudits, INTERVAL);

// Keep script alive indefinitely
process.on('SIGINT', () => {
    console.log("Stopping Background Audit Service...");
    process.exit();
});
