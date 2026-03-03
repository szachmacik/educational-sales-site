const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', '.manus-audits');
const LATEST_AUDIT = path.join(LOG_DIR, 'latest_request.md');

if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Format the request for Manus
const requestContent = `
# AUTONOMOUS SYSTEM CHECK-IN
Time: ${new Date().toISOString()}

Hey Manus,

I have just completed another phase of autonomous improvements on the Educational Sales Site:
1. Fixed CSS gradient-text clipping issues.
2. Standardized BrandLogo across user-facing pages.
3. Implemented Native Advanced Search (Cmd+K).
4. Implemented Native In-App Notifications (Bell Icon).

**ACTION REQUIRED:**
Please review the codebase (specifically \`components/header.tsx\`, \`components/search-modal.tsx\`, \`components/in-app-notifications.tsx\`) to verify the React implementations align with enterprise standards. 
If anything is broken, write the feedback to \`.manus-audits/feedback.md\` so I can pick it up.

Thanks,
Antigravity
`;

fs.writeFileSync(LATEST_AUDIT, requestContent);
console.log(`[+] Wrote audit request to ${LATEST_AUDIT}`);
console.log(`[+] Waiting for Manus to respond in .manus-audits/feedback.md...`);
