const localtunnel = require('localtunnel');

async function startTunnel() {
    while (true) {
        console.log('[Tunnel] Attempting to establish tunnel on port 3000...');
        try {
            const tunnel = await localtunnel({ port: 3000 });
            console.log(`[Tunnel] Established: ${tunnel.url}`);

            await new Promise((resolve) => {
                tunnel.on('close', () => {
                    console.warn('[Tunnel] Closed. Reconnecting in 5s...');
                    resolve();
                });
                tunnel.on('error', (err) => {
                    console.error('[Tunnel] Error:', err.message);
                    tunnel.close();
                    resolve();
                });
            });
        } catch (err) {
            console.error('[Tunnel] Critical Failure:', err.message);
        }
        await new Promise(r => setTimeout(r, 5000));
    }
}

// Keep the process alive
process.on('uncaughtException', (err) => {
    console.error('[Process] Uncaught Exception:', err);
});

startTunnel();
