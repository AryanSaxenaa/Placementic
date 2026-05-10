export function ScoreCard({ label, score }) {
  return (
    <div style={{ background: "#FFF5E4", border: "2px solid #3D1A00",
                  padding: "1.5rem", textAlign: "center", borderRadius: "8px" }}>
      <div style={{ fontSize: "3rem", fontWeight: 900, fontFamily: "'Playfair Display', serif",
                    color: "#E8541A" }}>
        {score}<span style={{ fontSize: "1rem" }}>/10</span>
      </div>
      <div style={{ fontSize: "0.8rem", textTransform: "uppercase",
                    letterSpacing: "0.1em", color: "#3D1A00", marginTop: "0.5rem", fontFamily: "'DM Sans', sans-serif", fontWeight: "bold" }}>
        {label}
      </div>
    </div>
  );
}
