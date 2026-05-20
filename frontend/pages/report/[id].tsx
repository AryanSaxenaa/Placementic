import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const VERDICT_COLORS: Record<string, { bg: string; text: string }> = {
  "GO":        { bg: "#F5C842", text: "#3D1A00" },
  "MAYBE":     { bg: "#FFFFFF", text: "#E8541A" },
  "HARD PASS": { bg: "#3D1A00", text: "#FFF5E4" },
};

function VerdictBanner({ verdict, reason }: { verdict: string; reason: string }) {
  const colorSet = VERDICT_COLORS[verdict] || VERDICT_COLORS["MAYBE"];
  return (
    <div style={{ background: colorSet.bg, color: colorSet.text, padding: "3rem 2rem", borderBottom: '4px solid #3D1A00' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "5rem", maxWidth: '1200px', margin: '0 auto', fontWeight: 900, textTransform: "uppercase" }}>
        {verdict}
      </h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "1rem auto 0 auto", lineHeight: '1.6', fontFamily: "'Comic Neue', 'DM Sans', sans-serif" }}>
        {reason}
      </p>
    </div>
  );
}

function ScoreCard({ label, score }: { label: string; score: number }) {
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
  const router = useRouter();
  const [reportData, setReportData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    const { id } = router.query;
    if (id) {
      const data = localStorage.getItem(`report_${id}`);
      if (data) {
        setReportData(JSON.parse(data));
      } else {
        console.error("Report data not found!");
      }
    }
  }, [router.isReady, router.query]);

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#FFFFFF', color: '#3D1A00' }}>
      <Head>
        <title>PlacementIQ - Report</title>
        <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Playfair+Display:wght@900&family=DM+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <style>{`body { margin: 0; padding: 0; }`}</style>
      </Head>

      <div style={{
        backgroundImage: 'radial-gradient(#E8541A 2px, transparent 2px)',
        backgroundSize: '30px 30px',
        backgroundColor: '#FFF5E4'
      }}>
        {/* FLOATING NAV */}
        <div style={{ padding: '1.5rem', position: 'sticky', top: 0, zIndex: 100 }}>
          <nav style={{ 
            background: '#E8541A', 
            padding: '1rem 2rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            color: '#FFF5E4',
            borderRadius: '50px',
            boxShadow: '0px 8px 0px #3D1A00',
            border: '2px solid #3D1A00',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#FFF5E4' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.8rem', cursor: 'pointer' }}>PlacementIQ</div>
            </Link>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              <Link href="/about" style={{ color: '#FFF5E4', textDecoration: 'none' }}>ABOUT</Link>
            </div>
          </nav>
        </div>
        {!reportData ? (
          <div style={{ padding: "5rem", textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}>
            Loading Truth...
          </div>
        ) : (
          <VerdictBanner verdict={reportData.verdict} reason={reportData.verdict_reason} />
        )}
      </div>

      {reportData && (
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
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'uppercase', color: '#3D1A00' }}>Real Role: {(reportData.real_role || '').replace('_', ' ')}</div>
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
        </main>
      )}
    </div>
  );
}
