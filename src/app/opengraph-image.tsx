import { ImageResponse } from "next/og";

export const alt = "Team ALAZ #12368 | FIRST Robotics Competition";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          border: "4px solid #FF7800",
          fontFamily: "sans-serif",
          color: "#FFFFFF",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                background: "#FF7800",
                color: "#000000",
                fontSize: 24,
                fontWeight: 900,
                padding: "8px 18px",
                letterSpacing: "0.1em",
              }}
            >
              ALAZ #12368
            </span>
            <span
              style={{
                color: "#888888",
                fontSize: 20,
                letterSpacing: "0.15em",
              }}
            >
              FIRST ROBOTICS COMPETITION
            </span>
          </div>
          <span
            style={{
              color: "#FFD21C",
              fontSize: 18,
              fontFamily: "monospace",
            }}
          >
            IZMIR, TURKIYE
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 60,
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 1.1,
              }}
            >
              Engineering the Future.
            </span>
            <span
              style={{
                fontSize: 60,
                fontWeight: 900,
                color: "#FF7800",
                lineHeight: 1.1,
              }}
            >
              Building Beyond Limits.
            </span>
          </div>
          <span
            style={{
              fontSize: 24,
              color: "#AAAAAA",
              maxWidth: "900px",
            }}
          >
            Official web platform and robotics portfolio of Team ALAZ #12368.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #222222",
            paddingTop: "24px",
            fontSize: 20,
            color: "#666666",
            fontFamily: "monospace",
          }}
        >
          <span>ALAZFRC.ORG</span>
          <span>AUTONOMOUS SYSTEMS // INDUSTRIAL BRUTALISM</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
