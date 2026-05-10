import React from 'react';
import Head from 'next/head';
import { VerdictBanner } from '../../components/VerdictBanner';
import { ScoreCard } from '../../components/ScoreCard';

export default function ReportPage() {
  const dummyReport = {
    verdict: "HARD PASS",
    verdict_reason: "This job is a classic field sales grind masquerading as a 'Business Analyst' role. The pay is 40% below your college median. Your resume is geared toward data science, making this a terrible fit.",
    company_scores: { culture: 4, pay_fairness: 3, growth: 6, survival: 8, work_life: 2 },
    resume_match_percent: 25,
    red_flags: ["Bond of 12 months", "Variable pay tied to extreme targets", "Stipend-trap in first 6 months"],
    college_reality: "Your college claims a 12LPA average, but similar placements here average 4.5LPA fixed.",
    what_this_job_is: {
      real_role: "Direct Field Sales",
      what_you_actually_do: "You will be knocking on doors and cold calling schools to sell ed-tech subscriptions. You will not be touching data pipelines or analytics."
    }
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#FFFFFF', color: '#3D1A00' }}>
      <Head>
        <title>Report - PlacementIQ</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Playfair+Display:wght@900&display=swap" rel="stylesheet" />
        <style>{`body { margin: 0; padding: 0; }`}</style>
      </Head>

      <VerdictBanner verdict={dummyReport.verdict} reason={dummyReport.verdict_reason} />

      <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
        
        {/* COMPANY SCORECARD */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
          <ScoreCard label="Culture" score={dummyReport.company_scores.culture} />
          <ScoreCard label="Pay" score={dummyReport.company_scores.pay_fairness} />
          <ScoreCard label="Growth" score={dummyReport.company_scores.growth} />
          <ScoreCard label="Survival" score={dummyReport.company_scores.survival} />
          <ScoreCard label="Work Life" score={dummyReport.company_scores.work_life} />
        </div>

        {/* TWO COLUMNS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', borderBottom: '4px solid #E8541A', paddingBottom: '0.5rem', marginBottom: '1rem' }}>WHAT THIS JOB REALLY IS</h2>
            <div style={{ background: '#FFF5E4', padding: '1.5rem', borderRadius: '8px', border: '2px solid #3D1A00' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem', color: '#E8541A' }}>{dummyReport.what_this_job_is.real_role}</div>
              <p style={{ margin: 0 }}>{dummyReport.what_this_job_is.what_you_actually_do}</p>
            </div>
          </div>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', borderBottom: '4px solid #E8541A', paddingBottom: '0.5rem', marginBottom: '1rem' }}>RED FLAGS</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {dummyReport.red_flags.map((flag, idx) => (
                <div key={idx} style={{ background: '#E8541A', color: '#FFF5E4', padding: '0.75rem 1rem', borderRadius: '4px', fontWeight: 'bold' }}>
                  🚩 {flag}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLLEGE REALITY CHECK */}
        <div style={{ background: '#3D1A00', padding: '2rem', textAlign: 'center', color: '#FFF5E4', borderRadius: '8px', marginBottom: '3rem' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", margin: '0 0 1rem 0', fontSize: '1.5rem', color: '#E8541A' }}>COLLEGE REALITY CHECK</h3>
          <p style={{ fontSize: '1.2rem', margin: 0 }}>{dummyReport.college_reality}</p>
        </div>

        {/* RESUME MATCH */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '1rem' }}>RESUME MATCH</h2>
          <div style={{ background: '#FFF5E4', border: '2px solid #3D1A00', borderRadius: '8px', overflow: 'hidden', height: '40px', display: 'flex' }}>
            <div style={{ width: `${dummyReport.resume_match_percent}%`, background: '#E8541A', display: 'flex', alignItems: 'center', paddingLeft: '1rem', color: '#FFF5E4', fontWeight: 'bold' }}>
              {dummyReport.resume_match_percent}%
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
