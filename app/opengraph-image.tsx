import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/content/site";

export const alt = `${siteConfig.name} — Technology built around your business`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background: "#f7f4ef",
          backgroundImage:
            "radial-gradient(circle at 90% 10%, rgba(15,92,92,0.18), transparent 45%), linear-gradient(160deg, #efeae2 0%, #f7f4ef 50%, #e8f0f0 100%)",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#0f5c5c",
            marginBottom: 24,
          }}
        >
          Rkyves
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            lineHeight: 1.15,
            color: "#141414",
            maxWidth: 900,
          }}
        >
          Building a website is easy. Keeping it alive is not.
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            color: "#5c5a56",
            maxWidth: 800,
          }}
        >
          Technology built around your business.
        </div>
      </div>
    ),
    { ...size }
  );
}
