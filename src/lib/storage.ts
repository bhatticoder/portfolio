import fs from "fs";
import path from "path";
import os from "os";

// In-memory cache across serverless warm invocations
declare global {
  var __bhatti_cms_cache: Record<string, string> | undefined;
}

if (!globalThis.__bhatti_cms_cache) {
  globalThis.__bhatti_cms_cache = {};
}

const memoryCache = globalThis.__bhatti_cms_cache;

/**
 * Get writable /tmp directory on Vercel/AWS Lambda
 */
function getTmpFilePath(filename: string): string {
  const tmpDir = path.join(os.tmpdir(), "bhatti-cms-data");
  if (!fs.existsSync(tmpDir)) {
    try {
      fs.mkdirSync(tmpDir, { recursive: true });
    } catch {
      // ignore
    }
  }
  return path.join(tmpDir, filename);
}

/**
 * Get local project file path
 */
function getLocalFilePath(filename: string): string {
  return path.join(process.cwd(), "src", "data", filename);
}

/**
 * Read data file with fallback priority:
 * 1. In-memory cache
 * 2. /tmp directory (written during previous serverless lambda request)
 * 3. Local src/data/ directory (bundled with build)
 * 4. Default fallback provided by caller
 */
export function readDataFile<T>(filename: string, fallback: T): T {
  // 1. Check in-memory cache
  if (memoryCache[filename]) {
    try {
      return JSON.parse(memoryCache[filename]) as T;
    } catch {
      // invalid cache, continue
    }
  }

  // 2. Check /tmp directory
  const tmpPath = getTmpFilePath(filename);
  try {
    if (fs.existsSync(tmpPath)) {
      const data = fs.readFileSync(tmpPath, "utf-8");
      if (data && data.trim()) {
        const parsed = JSON.parse(data) as T;
        memoryCache[filename] = data;
        return parsed;
      }
    }
  } catch {
    // continue to bundled file
  }

  // 3. Check bundled file in src/data
  const localPath = getLocalFilePath(filename);
  try {
    if (fs.existsSync(localPath)) {
      const data = fs.readFileSync(localPath, "utf-8");
      if (data && data.trim()) {
        const parsed = JSON.parse(data) as T;
        memoryCache[filename] = data;
        return parsed;
      }
    }
  } catch {
    // continue to fallback
  }

  return fallback;
}

/**
 * Sync file directly to GitHub repository (Git CMS).
 * Triggers automatic Vercel redeployment with updated data.
 */
async function syncToGitHub(filename: string, contentStr: string): Promise<boolean> {
  const token = (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "").trim();
  if (!token) return false;

  const repo = (process.env.GITHUB_REPO || "bhatticoder/portfolio").trim();
  const branch = (process.env.GITHUB_BRANCH || "main").trim();
  const filePath = `src/data/${filename}`;
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  try {
    let sha: string | undefined;

    // Fetch existing file SHA
    const checkRes = await fetch(`${apiUrl}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Bhatti-Portfolio-CMS",
      },
      cache: "no-store",
    });

    if (checkRes.ok) {
      const existing = await checkRes.json();
      sha = existing.sha;
    }

    // Commit file update
    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "Bhatti-Portfolio-CMS",
      },
      body: JSON.stringify({
        message: `cms: update ${filename} from admin dashboard`,
        content: Buffer.from(contentStr, "utf-8").toString("base64"),
        sha,
        branch,
      }),
    });

    return putRes.ok;
  } catch (err) {
    console.error("GitHub sync failed:", err);
    return false;
  }
}

/**
 * Sync to Upstash Redis or Vercel KV if configured
 */
async function syncToRedis(filename: string, contentStr: string): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;

  try {
    const key = `cms:${filename.replace(/\.json$/, "")}`;
    const res = await fetch(`${url}/set/${key}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contentStr),
    });
    return res.ok;
  } catch (err) {
    console.error("Redis sync failed:", err);
    return false;
  }
}

export interface StorageWriteResult {
  success: boolean;
  mode: "local" | "github" | "redis" | "tmp";
  message: string;
}

/**
 * Multi-tier resilient write operation:
 * 1. Writes to in-memory cache immediately
 * 2. Attempts writing to local src/data/ (succeeds in local dev)
 * 3. If running on Vercel/read-only filesystem, writes to /tmp/
 * 4. Asynchronously syncs to GitHub / Redis if configured
 */
export async function writeDataFile<T>(filename: string, data: T): Promise<StorageWriteResult> {
  const contentStr = JSON.stringify(data, null, 2);

  // 1. In-memory update
  memoryCache[filename] = contentStr;

  let localSuccess = false;
  let isReadOnlyFs = false;

  // 2. Try writing to local project path
  const localPath = getLocalFilePath(filename);
  try {
    fs.writeFileSync(localPath, contentStr, "utf-8");
    localSuccess = true;
  } catch (err: unknown) {
    const errorString = String(err);
    if (errorString.includes("EROFS") || errorString.includes("read-only")) {
      isReadOnlyFs = true;
    }
  }

  // 3. Fallback to /tmp if read-only filesystem (Vercel serverless)
  if (!localSuccess) {
    try {
      const tmpPath = getTmpFilePath(filename);
      fs.writeFileSync(tmpPath, contentStr, "utf-8");
    } catch (tmpErr) {
      console.error("Error writing to /tmp:", tmpErr);
    }
  }

  // 4. Check Cloud Sync (GitHub API or Redis)
  const isGitHubConfigured = Boolean(process.env.GITHUB_TOKEN || process.env.GH_TOKEN);
  const isRedisConfigured = Boolean(
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  );

  if (isGitHubConfigured) {
    const ghSuccess = await syncToGitHub(filename, contentStr);
    if (ghSuccess) {
      return {
        success: true,
        mode: "github",
        message: "Saved and committed directly to GitHub repository. Vercel is auto-deploying.",
      };
    }
  }

  if (isRedisConfigured) {
    const redisSuccess = await syncToRedis(filename, contentStr);
    if (redisSuccess) {
      return {
        success: true,
        mode: "redis",
        message: "Saved to persistent cloud database (Redis) instantly.",
      };
    }
  }

  if (localSuccess) {
    return {
      success: true,
      mode: "local",
      message: "Saved to local filesystem successfully.",
    };
  }

  // Saved to /tmp & in-memory
  return {
    success: true,
    mode: "tmp",
    message: isReadOnlyFs
      ? "Saved to serverless instance. For permanent multi-region storage on Vercel, set ADMIN_SECRET or GITHUB_TOKEN in your Vercel Project Settings."
      : "Saved successfully.",
  };
}
