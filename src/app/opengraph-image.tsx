import { ImageResponse } from "next/og";

export const alt =
  "Muhammad Mudassar Bhatti — AI Systems & Automation Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#FAF8F5",
          padding: "80px",
          color: "#16130F",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            color: "#D9480F",
            marginBottom: "24px",
            letterSpacing: "2px",
            fontFamily: "monospace",
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
        >
          bhatti.dev · AI Systems & Automation
        </div>
        <div
          style={{
            fontSize: "64px",
            fontWeight: "normal",
            marginBottom: "20px",
            color: "#16130F",
            lineHeight: 1.1,
          }}
        >
          Muhammad Mudassar Bhatti
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#6B645B",
            maxWidth: "920px",
            lineHeight: 1.4,
            fontFamily: "sans-serif",
          }}
        >
          I build AI systems that do real work for your business.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
