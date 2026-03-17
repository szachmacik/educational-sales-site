#!/usr/bin/env node
/**
 * Antygravity Collab MCP Server v2
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Narzędzia dla lokalnego Antygravity (i każdego agenta):
 * 
 * DANE:
 *   supabase_query    — czytaj/pisz do Supabase
 *   get_tasks         — zadania z antygravity_tasks
 *   get_bot_messages  — wiadomości między botami
 *   send_message      — wyślij do Guardiana/Claude
 * 
 * KOD:
 *   git_sync          — commit+push do GitHub
 *   github_read_file  — czytaj plik z repo
 *   github_write_file — zapisz plik do repo
 *   deploy_app        — deployuj przez Coolify
 * 
 * TELEGRAM:
 *   telegram_send     — wyślij do Macieja przez Telegram
 * 
 * INFRASTRUKTURA:
 *   coolify_status    — status appek
 *   guardian_audit    — sprawdź guardian endpoint
 */

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");
const git = require("isomorphic-git");
const http_git = require("isomorphic-git/http/node");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");
require("dotenv").config();

const WORKSPACE = path.resolve(__dirname, "..");
const GH_TOKEN = process.env.GITHUB_TOKEN || "";
const CT       = process.env.COOLIFY_TOKEN || "";
const SB_URL   = process.env.SUPABASE_URL || "https://blgdhfcosqjzrutncbbr.supabase.co";
const SB_KEY   = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || "";
const TG_TOKEN = process.env.ANTYGRAVITY_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || "";
const ADMIN_ID = process.env.ADMIN_CHAT_ID || "8149345223";
const COOLIFY  = process.env.COOLIFY_URL || "https://coolify.ofshore.dev";

// HTTP helper
function httpRequest(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: options.method || "GET",
      headers: options.headers || {},
      ...( u.port ? { port: u.port } : {} ),
    };
    const req = https.request(opts, (res) => {
      let data = "";
      res.on("data", d => data += d);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on("error", reject);
    if (body) req.write(typeof body === "string" ? body : JSON.stringify(body));
    req.end();
  });
}

async function sb(endpoint, method = "GET", body = null) {
  return httpRequest(`${SB_URL}/rest/v1/${endpoint}`, {
    method,
    headers: {
      "apikey": SB_KEY,
      "Authorization": `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    }
  }, body);
}

async function sbRpc(fn, params = {}) {
  return httpRequest(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      "apikey": SB_KEY,
      "Authorization": `Bearer ${SB_KEY}`,
      "Content-Type": "application/json"
    }
  }, params);
}

async function tg(method, params = {}) {
  return httpRequest(`https://api.telegram.org/bot${TG_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, params);
}

async function cf(path_, method = "GET", body = null) {
  return httpRequest(`${COOLIFY}/api/v1${path_}`, {
    method,
    headers: {
      "Authorization": `Bearer ${CT}`,
      "Content-Type": "application/json"
    }
  }, body);
}

// ── Tool definitions ──────────────────────────────────────────────────
const TOOLS = [
  // DANE
  {
    name: "supabase_query",
    description: "Query Supabase REST API. Read or write any table. For SELECT use method=GET, for INSERT use POST, for UPDATE use PATCH.",
    inputSchema: {
      type: "object",
      properties: {
        table: { type: "string", description: "Table name (e.g. antygravity_tasks, bot_messages, repo_knowledge)" },
        method: { type: "string", enum: ["GET","POST","PATCH","DELETE"], default: "GET" },
        filter: { type: "string", description: "Query params for GET (e.g. status=eq.pending&limit=5)" },
        body: { type: "object", description: "JSON body for POST/PATCH" }
      },
      required: ["table"]
    }
  },
  {
    name: "get_tasks",
    description: "Get pending tasks from antygravity_tasks queue",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", default: "pending", description: "pending, in_progress, done, failed" },
        limit: { type: "number", default: 10 }
      }
    }
  },
  {
    name: "get_bot_messages",
    description: "Get messages from bot_messages (from Guardian, Claude, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        from_bot: { type: "string", description: "Filter by sender (guardian, claude, system)" },
        unread_only: { type: "boolean", default: true },
        limit: { type: "number", default: 10 }
      }
    }
  },
  {
    name: "send_message",
    description: "Send message to another bot via Supabase bot_messages",
    inputSchema: {
      type: "object",
      properties: {
        to: { type: "string", description: "guardian, claude, all" },
        subject: { type: "string" },
        content: { type: "string" },
        type: { type: "string", default: "info", description: "info, task, feedback, alert" }
      },
      required: ["to", "subject", "content"]
    }
  },
  // KOD
  {
    name: "git_sync",
    description: "Stage all changes, commit and push to GitHub",
    inputSchema: {
      type: "object",
      properties: {
        message: { type: "string", description: "Commit message" },
        branch: { type: "string", default: "main" }
      },
      required: ["message"]
    }
  },
  {
    name: "github_read_file",
    description: "Read a file from any GitHub repo",
    inputSchema: {
      type: "object",
      properties: {
        repo: { type: "string", description: "e.g. szachmacik/quiz-manager" },
        path: { type: "string", description: "e.g. server/_core/index.ts" }
      },
      required: ["repo", "path"]
    }
  },
  {
    name: "github_write_file",
    description: "Write/update a file in any GitHub repo and optionally deploy",
    inputSchema: {
      type: "object",
      properties: {
        repo: { type: "string" },
        path: { type: "string" },
        content: { type: "string" },
        message: { type: "string", description: "Commit message" },
        deploy_uuid: { type: "string", description: "Coolify UUID to deploy after push (optional)" }
      },
      required: ["repo", "path", "content", "message"]
    }
  },
  // TELEGRAM
  {
    name: "telegram_send",
    description: "Send message to Maciej via Telegram",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
        parse_mode: { type: "string", default: "Markdown" }
      },
      required: ["text"]
    }
  },
  // INFRASTRUKTURA
  {
    name: "coolify_status",
    description: "Get status of all Coolify applications",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "deploy_app",
    description: "Deploy an application via Coolify",
    inputSchema: {
      type: "object",
      properties: {
        uuid: { type: "string", description: "Coolify app UUID" }
      },
      required: ["uuid"]
    }
  },
  {
    name: "guardian_audit",
    description: "Check if guardian endpoint works on an app",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "e.g. quiz.ofshore.dev" }
      },
      required: ["domain"]
    }
  }
];

// ── Tool handlers ────────────────────────────────────────────────────
async function handleTool(name, args) {
  switch (name) {
    
    case "supabase_query": {
      const method = (args.method || "GET").toUpperCase();
      const endpoint = args.filter ? `${args.table}?${args.filter}` : args.table;
      const r = await sb(endpoint, method, args.body);
      return JSON.stringify(r.data, null, 2);
    }

    case "get_tasks": {
      const status = args.status || "pending";
      const limit  = args.limit  || 10;
      const r = await sb(`antygravity_tasks?status=eq.${status}&order=created_at.asc&limit=${limit}`);
      const tasks = r.data;
      if (!tasks || !tasks.length) return "Brak zadań.";
      return tasks.map(t =>
        `[${t.priority}] ${t.repo_name} — ${t.task_type}\n  ${t.description}`
      ).join("\n\n");
    }

    case "get_bot_messages": {
      let q = `bot_messages?to_bot=eq.antygravity&order=created_at.desc&limit=${args.limit||10}`;
      if (args.from_bot) q += `&from_bot=eq.${args.from_bot}`;
      if (args.unread_only !== false) q += `&read=eq.false`;
      const r = await sb(q);
      const msgs = r.data;
      if (!msgs || !msgs.length) return "Brak wiadomości.";
      // Mark as read
      await sb(`bot_messages?to_bot=eq.antygravity&read=eq.false`, "PATCH", { read: true });
      return msgs.map(m =>
        `[${m.from_bot}] ${m.subject}\n${m.content}`
      ).join("\n---\n");
    }

    case "send_message": {
      await sbRpc("bot_send_message", {
        p_from: "antygravity",
        p_to: args.to,
        p_type: args.type || "info",
        p_subject: args.subject,
        p_content: args.content,
        p_metadata: "{}"
      });
      return `Wiadomość wysłana do ${args.to}.`;
    }

    case "git_sync": {
      await git.add({ fs, dir: WORKSPACE, filepath: "." });
      const sha = await git.commit({
        fs, dir: WORKSPACE,
        author: { name: "Antygravity Agent", email: "antygravity@ofshore.dev" },
        message: args.message,
      });
      await git.push({
        fs, http: http_git, dir: WORKSPACE,
        remote: "origin", ref: args.branch || "main",
        onAuth: () => ({ username: GH_TOKEN }),
      });
      return `Committed (${sha.slice(0,8)}) and pushed to GitHub.`;
    }

    case "github_read_file": {
      const [owner, repo] = args.repo.includes("/") ? args.repo.split("/") : ["szachmacik", args.repo];
      const r = await httpRequest(
        `https://api.github.com/repos/${owner}/${repo}/contents/${args.path}`,
        { headers: { "Authorization": `token ${GH_TOKEN}`, "Accept": "application/vnd.github.v3+json" } }
      );
      if (r.data.content) {
        return Buffer.from(r.data.content, "base64").toString("utf8");
      }
      return JSON.stringify(r.data);
    }

    case "github_write_file": {
      const [owner, repo] = args.repo.includes("/") ? args.repo.split("/") : ["szachmacik", args.repo];
      // Get current SHA
      let sha = "";
      try {
        const existing = await httpRequest(
          `https://api.github.com/repos/${owner}/${repo}/contents/${args.path}`,
          { headers: { "Authorization": `token ${GH_TOKEN}` } }
        );
        sha = existing.data.sha || "";
      } catch {}
      
      const body = {
        message: args.message,
        content: Buffer.from(args.content).toString("base64"),
        ...(sha ? { sha } : {})
      };
      const r = await httpRequest(
        `https://api.github.com/repos/${owner}/${repo}/contents/${args.path}`,
        { method: "PUT", headers: { "Authorization": `token ${GH_TOKEN}`, "Content-Type": "application/json" } },
        body
      );
      
      let result = `File written: ${args.path}`;
      
      if (args.deploy_uuid) {
        const dep = await cf(`/deploy?uuid=${args.deploy_uuid}&force=true`);
        const depId = dep.data?.deployments?.[0]?.deployment_uuid || "?";
        result += ` | Deploy started: ${depId.slice(0,12)}`;
      }
      
      return result;
    }

    case "telegram_send": {
      await tg("sendMessage", {
        chat_id: ADMIN_ID,
        text: args.text,
        parse_mode: args.parse_mode || "Markdown"
      });
      return "Wiadomość wysłana do Macieja.";
    }

    case "coolify_status": {
      const r = await cf("/applications");
      const apps = r.data;
      if (!Array.isArray(apps)) return JSON.stringify(r.data);
      return apps.map(a =>
        `${a.status?.includes("healthy") ? "✅" : "❌"} ${a.name}: ${a.status}`
      ).join("\n");
    }

    case "deploy_app": {
      const r = await cf(`/deploy?uuid=${args.uuid}&force=true`);
      const depId = r.data?.deployments?.[0]?.deployment_uuid || "?";
      return `Deploy started: ${depId}`;
    }

    case "guardian_audit": {
      const url = `https://${args.domain}/api/guardian`;
      const r = await httpRequest(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      }, { message: "audit", userId: "antygravity-mcp" });
      const ok = JSON.stringify(r.data).includes('"reply"');
      const health = await httpRequest(`https://${args.domain}/api/health`, {});
      return `Guardian: ${ok ? "OK" : "FAIL (HTML/DOWN)"}\nHealth: ${health.status} ${JSON.stringify(health.data).slice(0,100)}`;
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ── Server setup ──────────────────────────────────────────────────────
const server = new Server(
  { name: "antygravity-collab-server", version: "2.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const result = await handleTool(name, args || {});
    return { content: [{ type: "text", text: result }] };
  } catch (error) {
    return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
console.error("Antygravity MCP v2 running — " + TOOLS.length + " tools available");
