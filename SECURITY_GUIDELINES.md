# Security Guidelines for Multi-Agent Collaboration

To ensure the safety of this project and prevent any accidental leaks of sensitive information while collaborating with multiple AI agents (Antigravity, Manus, etc.), please follow these guidelines.

## 1. Secrets Management (Local Only)
- **Do NOT commit secrets**: Never push `.env`, API keys, tokens, or passwords to the repository.
- **Local Context**: Sensitive configuration should stay in `mcp-integrations/.env` (which is ignored by Git).
- **GitHub CLI**: Prefer using `gh auth login` for local Git authentication instead of storing tokens in plaintext.

## 2. Gitignore Enforcement
Our `.gitignore` is configured to block:
- All `.env*` files.
- All JSON audit reports (except core config like `package.json`).
- All log files and temporary build artifacts.
- Sensitive scripts and binary data.

## 3. Human-in-the-Loop
- **Review Changes**: Always review commits made by AI agents (check the author name).
- **Critical Actions**: Before merging AI-proposed infrastructure changes, perform a manual audit.

## 4. Agent Baton Passing
- When an agent completes a task, they must update the `task.md` in the `brain/` directory.
- Use atomic commits with descriptive messages (e.g., `feat: updated task.md to [x]`).

## 5. Security Scanning
- This repository is equipped with GitHub's default secret scanning (if enabled in settings).
- If you suspect a leak, revoke the compromised token immediately and rotate keys.

---
*Created by Antigravity Agent for Secure Collaboration*
