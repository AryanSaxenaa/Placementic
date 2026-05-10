export function VerdictBanner({ verdict, reason }) {
  const colors = {
    "GO":        { bg: "#F5C842", text: "#3D1A00" },
    "MAYBE":     { bg: "#FFFFFF", text: "#E8541A" },
    "HARD PASS": { bg: "#3D1A00", text: "#FFF5E4" },
  };

  const currentColors = colors[verdict] || colors["MAYBE"];
  const { bg, text } = currentColors;
  
  return (
    <div style={{ background: bg, color: text, padding: "3rem 2rem", textAlign: "center" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "5rem",
                   fontWeight: 900, textTransform: "uppercase", margin: 0 }}>
        {verdict}
      </h1>
      <p style={{ fontSize: "1.1rem", maxWidth: "600px", margin: "1rem auto 0 auto", fontFamily: "'DM Sans', sans-serif" }}>
        {reason}
      </p>
    </div>
  );
}
