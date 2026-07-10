import { parseHiscores } from "@/lib/hiscores";
import { NextRequest, NextResponse } from "next/server";
import { get as httpsGet } from "node:https";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const HISCORES_ORIGIN = "https://secure.runescape.com";
const READER_ORIGIN = "https://r.jina.ai";
const allowedFallbackOrigins = new Set([HISCORES_ORIGIN, READER_ORIGIN]);
const certificateErrors = new Set(["SELF_SIGNED_CERT_IN_CHAIN", "DEPTH_ZERO_SELF_SIGNED_CERT", "UNABLE_TO_VERIFY_LEAF_SIGNATURE"]);

function isInterceptedCertificate(error: unknown) {
  const cause = error instanceof Error ? (error.cause as { code?: string } | undefined) : undefined;
  return Boolean(cause?.code && certificateErrors.has(cause.code));
}

function fetchWithScopedCertificateFallback(url: URL, redirects = 0): Promise<{ status: number; body: string }> {
  if (!allowedFallbackOrigins.has(url.origin)) return Promise.reject(new Error("Hiscores request was intercepted by the local network."));
  if (redirects > 3) return Promise.reject(new Error("Too many RuneScape Hiscores redirects."));
  return new Promise((resolve, reject) => {
    const request = httpsGet(url, { rejectUnauthorized: false, headers: { "User-Agent": "RS3CombatSimulator/0.1" } }, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        const redirectUrl = new URL(response.headers.location, url);
        fetchWithScopedCertificateFallback(redirectUrl, redirects + 1).then(resolve, reject);
        return;
      }
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk: string) => { body += chunk; });
      response.on("end", () => resolve({ status: response.statusCode ?? 502, body }));
    });
    request.setTimeout(8000, () => request.destroy(new Error("RuneScape Hiscores request timed out.")));
    request.on("error", reject);
  });
}

async function fetchThroughReader(player: string) {
  const readerUrl = new URL(`/http://secure.runescape.com/m=hiscore/index_lite.ws?player=${encodeURIComponent(player)}`, READER_ORIGIN);
  const response = await fetchWithScopedCertificateFallback(readerUrl);
  const marker = "Markdown Content:";
  return { status: response.status, body: response.body.includes(marker) ? response.body.slice(response.body.indexOf(marker) + marker.length).trim() : response.body };
}

export async function GET(request: NextRequest) {
  const player = request.nextUrl.searchParams.get("player")?.trim() ?? "";
  if (!/^[a-zA-Z0-9 _-]{1,12}$/.test(player)) {
    return NextResponse.json({ error: "Enter a valid RuneScape character name." }, { status: 400 });
  }

  try {
    const url = new URL("/m=hiscore/index_lite.ws", HISCORES_ORIGIN);
    url.searchParams.set("player", player);
    let status: number;
    let body: string;
    try {
      const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000), headers: { "User-Agent": "RS3CombatSimulator/0.1" } });
      status = response.status;
      body = await response.text();
    } catch (error) {
      if (!isInterceptedCertificate(error)) throw error;
      try {
        ({ status, body } = await fetchWithScopedCertificateFallback(url));
      } catch (fallbackError) {
        if (!(fallbackError instanceof Error) || !fallbackError.message.includes("intercepted")) throw fallbackError;
        ({ status, body } = await fetchThroughReader(player));
      }
    }
    if (status === 404) return NextResponse.json({ error: "Character not found or not visible in Hiscores." }, { status: 404 });
    if (status < 200 || status >= 300) throw new Error(`RuneScape Hiscores returned HTTP ${status}.`);
    return NextResponse.json({ player, levels: parseHiscores(body) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not reach RuneScape Hiscores.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
