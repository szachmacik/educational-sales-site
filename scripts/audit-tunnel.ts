import localtunnel from 'localtunnel';

/**
 * Creates a temporary public tunnel for the local development server.
 * @param port - The local port to tunnel (default: 3000).
 * @returns {Promise<{url: string, close: () => void}>}
 */
export async function createAuditTunnel(port: number = 3000): Promise<{ url: string, close: () => void }> {
    try {
        const tunnel = await localtunnel({ port });
        console.log(`[Tunnel] Created: ${tunnel.url}`);

        tunnel.on('close', () => {
            console.log('[Tunnel] Closed');
        });

        return {
            url: tunnel.url,
            close: () => tunnel.close()
        };
    } catch (err) {
        console.error('[Tunnel] Error:', err);
        throw err;
    }
}
