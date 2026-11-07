import { content } from "@/data/content";

export function GET() {
  const cal = process.env.NEXT_PUBLIC_CAL_LINK ?? "bhatti/scoping-call";
  const lines = content.terminal.output.map((l) =>
    l.replace("<NEXT_PUBLIC_CAL_LINK>", cal)
  );
  return new Response(lines.join("\n") + "\n", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
