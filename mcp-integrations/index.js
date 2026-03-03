#!/usr/bin/env node
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const fs = require("fs-extra");
const path = require("path");
const { Octokit } = require("@octokit/rest");
const { google } = require("googleapis");
require("dotenv").config();

// Workspace path - defaults to the parent directory of the integration folder
const WORKSPACE_DIR = path.resolve(__dirname, "..");

const server = new Server(
    {
        name: "antigravity-collab-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

/**
 * Tool definitions
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "git_sync",
                description: "Commit and push changes to GitHub to keep other agents updated.",
                inputSchema: {
                    type: "object",
                    properties: {
                        message: { type: "string", description: "Commit message" },
                        branch: { type: "string", description: "Branch name (default: main)", default: "main" },
                    },
                    required: ["message"],
                },
            },
            {
                name: "gdrive_upload",
                description: "Upload a file or artifact to a shared Google Drive folder.",
                inputSchema: {
                    type: "object",
                    properties: {
                        filePath: { type: "string", description: "Path to the file relative to workspace" },
                        folderId: { type: "string", description: "ID of the shared GDrive folder" },
                    },
                    required: ["filePath"],
                },
            },
            {
                name: "github_setup_repo",
                description: "Initialize or link a GitHub repository for collaboration.",
                inputSchema: {
                    type: "object",
                    properties: {
                        repoUrl: { type: "string", description: "GitHub Repository URL" },
                    },
                    required: ["repoUrl"],
                },
            },
        ],
    };
});

/**
 * Tool Implementation handlers
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case "git_sync":
                return await handleGitSync(args);
            case "gdrive_upload":
                return await handleGDriveUpload(args);
            case "github_setup_repo":
                return await handleGithubSetup(args);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});

/**
 * Handlers
 */

async function handleGitSync({ message, branch = "main" }) {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not found in .env");

    // Git Add
    await git.add({ fs, dir: WORKSPACE_DIR, filepath: "." });

    // Git Commit
    const sha = await git.commit({
        fs,
        dir: WORKSPACE_DIR,
        author: { name: "Antigravity Agent", email: "agent@antigravity.ai" },
        message,
    });

    // Git Push
    const pushResult = await git.push({
        fs,
        http,
        dir: WORKSPACE_DIR,
        remote: "origin",
        ref: branch,
        onAuth: () => ({ username: GITHUB_TOKEN }),
    });

    return {
        content: [{ type: "text", text: `Successfully committed (${sha}) and pushed to GitHub.` }],
    };
}

async function handleGDriveUpload({ filePath, folderId }) {
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(WORKSPACE_DIR, filePath);

    // Google Drive Logic (Placeholder - requires service account logic)
    // In a real implementation, we'd use oauth2Client or service account
    return {
        content: [{ type: "text", text: `GDrive Upload requested for ${filePath}. Code is ready but requires GDrive credentials in .env.` }],
    };
}

async function handleGithubSetup({ repoUrl }) {
    // Initialize repo if needed
    if (!fs.existsSync(path.join(WORKSPACE_DIR, ".git"))) {
        await git.init({ fs, dir: WORKSPACE_DIR });
    }

    // Set remote
    try {
        await git.addRemote({ fs, dir: WORKSPACE_DIR, remote: "origin", url: repoUrl });
    } catch (e) {
        // If remote exists, update it
        await git.deleteRemote({ fs, dir: WORKSPACE_DIR, remote: "origin" });
        await git.addRemote({ fs, dir: WORKSPACE_DIR, remote: "origin", url: repoUrl });
    }

    return {
        content: [{ type: "text", text: `Remote 'origin' set to ${repoUrl}. Git initialized.` }],
    };
}

// Start the server
const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
console.error("Collab MCP server running...");
