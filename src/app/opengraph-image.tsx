import { ImageResponse } from "next/og";

export const alt =
  "Muhammad Mudassar Bhatti — AI Engineer & Full-Stack Systems Developer";
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
          backgroundColor: "#09090b",
          padding: "80px",
          color: "#fafafa",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            color: "#a1a1aa",
            marginBottom: "24px",
            letterSpacing: "2px",
          }}
        >
          bhatti.dev
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#ffffff",
          }}
        >
          Muhammad Mudassar Bhatti
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#a1a1aa",
            maxWidth: "900px",
            lineHeight: 1.4,
          }}
        >
          AI Engineer & Full-Stack Systems Developer
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

