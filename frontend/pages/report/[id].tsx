import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

interface ReportData {
  verdict: string;
  verdict_reason: string;
  company_scores: { culture: number; pay_fairness: number; growth: number; survival: number; work_life: number };
  real_role: string;
  what_you_actually_do: string;
  red_flags: string[];
  college_reality: string;
  resume_match_percent?: number;
}

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
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    const { id } = router.query;
    if (id) {
      const data = localStorage.getItem(`report_${id}`);
      if (data) {
        try {
          setReportData(JSON.parse(data));
        } catch {
          setError('Failed to parse report data.');
        }
      } else {
        setError('Report not found. It may have been cleared from your browser. Please run a new analysis.');
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
        <Navbar />
        {error ? (
          <div style={{ padding: "5rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#E8541A", marginBottom: "1rem" }}>{error}</div>
            <Link href="/" style={{ fontSize: "1.2rem", color: "#3D1A00", fontWeight: "bold", textDecoration: "underline" }}>
              Go back and run a new analysis
            </Link>
          </div>
        ) : !reportData ? (
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
            {reportData.resume_match_percent != null && (
              <ScoreCard label="Resume Match" score={reportData.resume_match_percent} />
            )}
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
