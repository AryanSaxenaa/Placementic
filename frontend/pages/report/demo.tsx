import React from 'react';
import Head from 'next/head';

const colors = {
  "GO":        { bg: "#F5C842", text: "#3D1A00" },
  "MAYBE":     { bg: "#FFFFFF", text: "#E8541A" },
  "HARD PASS": { bg: "#3D1A00", text: "#FFF5E4" },
};

function VerdictBanner({ verdict, reason }) {
  const colorSet = colors[verdict] || colors["MAYBE"];
  return (
    <div style={{ background: colorSet.bg, color: colorSet.text, padding: "3rem 2rem", borderBottom: '4px solid #3D1A00' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "5rem", maxWidth: '1200px', margin: '0 auto', fontWeight: 900, textTransform: "uppercase" }}>
        {verdict}
      </h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "1rem auto 0 auto", lineHeight: '1.6', fontFamily: "'DM Sans', sans-serif" }}>
        {reason}
      </p>
    </div>
  );
}

function ScoreCard({ label, score }) {
  return (
    <div style={{ background: "#FFF5E4", border: "2px solid #3D1A00", padding: "1.5rem", textAlign: "center", borderRadius: "8px", flex: 1, minWidth: '120px' }}>
      <div style={{ fontSize: "3rem", fontWeight: 900, fontFamily: "'Playfair Display', serif", color: "#E8541A" }}>
        {score}<span style={{ fontSize: "1rem" }}>/10</span>
      </div>
      <div style={{ fontSize: "0.9rem", fontWeight: 'bold', textTransform: "uppercase", letterSpacing: "0.1em", color: "#3D1A00", marginTop: "0.5rem" }}>
        {label}
      </div>
    </div>
  );
}

export default function ReportPage() {
  // Dummy data for demo
  const reportData = {
    verdict: "HARD PASS",
    verdict_reason: "This 'management trainee' role is actually an aggressive field sales job with unrealistic targets. The pay is 40% below your college's median package for this domain, and the company has high turnover. Your resume is built for product management—don't get trapped here.",
    company_scores: { culture: 3, pay_fairness: 4, growth: 2, survival: 7, work_life: 2 },
    real_role: "field_sales",
    what_you_actually_do: "You will be cold calling 100+ prospects daily and traveling locally to close deals. There is no strategic management involved.",
    red_flags: ["High attrition mentioned in reviews", "Salary requires hitting strict targets", "Bond requirement disguised as training cost"],
    college_reality: "This role offers 4 LPA, while the median for your college is 9.5 LPA overall.",
    resume_match_percent: 15
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", margin: 0, padding: 0, background: '#FFF5E4', color: '#3D1A00' }}>
      <Head>
        <title>PlacementIQ - Report</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Playfair+Display:wght@900&display=swap" rel="stylesheet" />
        <style>{`
          body { margin: 0; padding: 0; }
        `}</style>
      </Head>

      {/* NAV */}
      <nav style={{ background: '#E8541A', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFF5E4', borderBottom: '4px solid #3D1A00' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => window.location.href='/'}>PlacementIQ</div>
      </nav>

      <VerdictBanner verdict={reportData.verdict} reason={reportData.verdict_reason} />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        
        {/* COMPANY SCORECARD */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <ScoreCard label="Culture" score={reportData.company_scores.culture} />
          <ScoreCard label="Pay" score={reportData.company_scores.pay_fairness} />
          <ScoreCard label="Growth" score={reportData.company_scores.growth} />
          <ScoreCard label="Survival" score={reportData.company_scores.survival} />
          <ScoreCard label="WLB" score={reportData.company_scores.work_life} />
        </div>

        {/* TWO COLUMNS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ background: '#FFFFFF', border: '2px solid #3D1A00', padding: '2rem', borderRadius: '8px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginTop: 0, color: '#E8541A', textTransform: 'uppercase' }}>What this job really is</h2>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'uppercase', color: '#3D1A00' }}>Real Role: {reportData.real_role.replace('_', ' ')}</div>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{reportData.what_you_actually_do}</p>
          </div>

          <div style={{ background: '#FFFFFF', border: '2px solid #3D1A00', padding: '2rem', borderRadius: '8px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginTop: 0, color: '#E8541A', textTransform: 'uppercase' }}>Red Flags</h2>
            <ul style={{ paddingLeft: '1.5rem', fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>
              {reportData.red_flags.map((flag, i) => (
                <li key={i} style={{ marginBottom: '0.8rem' }}>{flag}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* COLLEGE REALITY CHECK */}
        <div style={{ background: '#3D1A00', color: '#FFF5E4', padding: '2rem', borderRadius: '8px', marginBottom: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginTop: 0, textTransform: 'uppercase' }}>College Reality Check</h2>
          <p style={{ fontSize: '1.3rem', margin: 0 }}>{reportData.college_reality}</p>
        </div>

        {/* RESUME MATCH */}
        <div style={{ background: '#FFFFFF', border: '2px solid #3D1A00', padding: '2rem', borderRadius: '8px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginTop: 0, textTransform: 'uppercase', color: '#3D1A00' }}>Resume Match</h2>
          <div style={{ width: '100%', background: '#FFF5E4', height: '40px', borderRadius: '20px', border: '2px solid #3D1A00', overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: `${reportData.resume_match_percent}%`, background: '#E8541A', height: '100%', transition: 'width 1s ease-in-out' }}></div>
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 'bold', color: '#3D1A00' }}>{reportData.resume_match_percent}% Match</span>
          </div>
        </div>

      </main>
    </div>
  );
}
