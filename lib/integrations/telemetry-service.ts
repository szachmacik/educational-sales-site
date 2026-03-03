/**
 * Anonymous Telemetry Service
 * Discreetly collects anonymous usage data without PII (GTM-style but lightweight/internal).
 */


interface TelemetryEvent {
    id: string;
    anonymousId: string;
    event: string;
    timestamp: string;
    metadata?: Record<string, any>;
}

let eventBuffer: TelemetryEvent[] = [];
let anonymousId: string | null = null;

/**
 * Generates a unique anonymous ID based on browser features (Fingerprinting).
 */
function getFingerprint(): string {
    if (typeof window === 'undefined') return 'server-side';

    const navigator = window.navigator;
    const screen = window.screen;

    // Simple fingerprint components
    const components = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        `${screen.width}x${screen.height}`,
        new Date().getTimezoneOffset(),
        !!(window as any).indexedDB,
        !!(window as any).sessionStorage
    ];

    const rawId = components.join('|');
    // Using a simple hash for local identification
    let hash = 0;
    for (let i = 0; i < rawId.length; i++) {
        const char = rawId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

/**
 * Tracks an anonymous event.
 */
export function trackAnonymousEvent(event: string, metadata?: Record<string, any>) {
    if (!anonymousId) {
        anonymousId = getFingerprint();
    }

    const telemetryEvent: TelemetryEvent = {
        id: `tel_${Math.random().toString(36).substring(2, 11)}`,
        anonymousId,
        event,
        timestamp: new Date().toISOString(),
        metadata: scrubData(metadata)
    };

    console.log(`[Telemetry] Tracking: ${event}`, telemetryEvent);

    eventBuffer.push(telemetryEvent);

    // Batch send logic (discreetly sync every 5 events or on unload)
    if (eventBuffer.length >= 5) {
        flushTelemetry();
    }
}

/**
 * Removes any potential PII from the metadata before tracking.
 */
function scrubData(data?: Record<string, any>): Record<string, any> | undefined {
    if (!data) return undefined;

    const scrubbed = { ...data };
    const piiKeys = ['email', 'name', 'phone', 'address', 'password', 'token', 'nip'];

    for (const key of Object.keys(scrubbed)) {
        if (piiKeys.some(pii => key.toLowerCase().includes(pii))) {
            delete scrubbed[key];
        }
    }

    return scrubbed;
}

/**
 * Silently sends the buffered events to the server (stub for now).
 */
export async function flushTelemetry() {
    if (eventBuffer.length === 0) return;

    // Security Guard: Check if user enabled Data Intelligence in admin panel
    let isEnabled = false;
    if (typeof window !== 'undefined') {
        isEnabled = localStorage.getItem("feature_data_intelligence") !== "false";
    }

    if (!isEnabled) {
        eventBuffer = [];
        return;
    }

    const payload = [...eventBuffer];
    eventBuffer = [];

    try {
        console.log(`[DataIntelligence] Silently syncing ${payload.length} anonymous data points...`, payload);
        fetch('/api/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true
        });
    } catch (error) {
        // Fail silently
    }
}

/**
 * Hook to flush telemetry on page unload and track generic clicks.
 */
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => flushTelemetry());

    // Discreet Heatmap Tracking: Logs generic layout interactions
    window.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const clickInfo = {
            tagName: target.tagName,
            id: target.id,
            class: target.className.substring(0, 50),
            path: target.getAttribute('href') || 'no-link'
        };
        trackAnonymousEvent("layout_click", clickInfo);
    });
}
