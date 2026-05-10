import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to FastAPI backend
    setTimeout(() => {
      setLoading(false);
      router.push('/report/demo');
    }, 2000);
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", margin: 0, padding: 0 }}>
      <Head>
        <title>PlacementIQ - The Truth</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Playfair+Display:wght@900&display=swap" rel="stylesheet" />
        <style>{`
          body { margin: 0; padding: 0; background-color: #FFF5E4; }
        `}</style>
      </Head>

      {/* NAV */}
      <nav style={{ background: '#E8541A', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFF5E4' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.5rem' }}>PlacementIQ</div>
        <div style={{ fontWeight: 'bold' }}>ABOUT | API | LOGIN</div>
      </nav>

      {/* HERO SECTION */}
      <section style={{ background: '#FFF5E4', padding: '4rem 2rem', textAlign: 'center', color: '#3D1A00' }}>
        <img src="/illustration3.png" alt="Hero Banner" style={{ maxWidth: '800px', width: '100%', marginBottom: '2rem' }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '4rem', textTransform: 'uppercase', lineHeight: '1.1', margin: '0 auto', maxWidth: '800px' }}>
          YOU BRING THE RESUME<br />WE BRING THE TRUTH
        </h1>
        <p style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
          Drop your JD. Get the real story on any company in 90 seconds.
        </p>
      </section>

      {/* INPUT SECTION */}
      <section style={{ background: '#FFFFFF', padding: '4rem 2rem', borderTop: '4px solid #3D1A00', borderBottom: '4px solid #3D1A00' }}>
        <form onSubmit={handleAnalyze} style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          <div style={{ border: '2px dashed #E8541A', borderRadius: '8px', padding: '2rem', textAlign: 'center', background: '#FFF5E4', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <img src="/illustration1.png" alt="Upload Icon" style={{ width: '80px', margin: '0 auto 1rem auto' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#E8541A', marginBottom: '1rem' }}>Upload Resume (PDF)</div>
            <input type="file" accept="application/pdf" style={{ margin: '0 auto' }} required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Company Name" style={{ padding: '1rem', border: '2px solid #3D1A00', borderRadius: '4px', fontSize: '1rem', fontFamily: 'inherit' }} required />
            <textarea placeholder="Paste Job Description Here..." style={{ padding: '1rem', border: '2px solid #3D1A00', borderRadius: '4px', fontSize: '1rem', minHeight: '150px', fontFamily: 'inherit' }} required></textarea>
            <input type="text" placeholder="Your College Name" style={{ padding: '1rem', border: '2px solid #3D1A00', borderRadius: '4px', fontSize: '1rem', fontFamily: 'inherit' }} required />
          </div>

          <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '1rem' }}>
            <button type="submit" disabled={loading} style={{ background: '#E8541A', color: '#FFF5E4', padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              {loading ? 'ANALYZING...' : 'ANALYZE →'}
            </button>
          </div>
        </form>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: '#3D1A00', padding: '4rem 2rem', color: '#FFF5E4', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', marginBottom: '3rem' }}>HOW IT WORKS</h2>
        <img src="/illustration2.png" alt="Happy Student" style={{ width: '150px', margin: '0 auto 2rem auto', display: 'block' }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', maxWidth: '900px', margin: '0 auto', flexWrap: 'wrap' }}>
          {[
            { step: '1', title: 'Upload Resume' },
            { step: '2', title: 'Paste JD + Company' },
            { step: '3', title: 'Get the Truth' }
          ].map((item, i) => (
            <div key={i} style={{ flex: '1', minWidth: '200px', padding: '2rem', border: '2px solid #FFF5E4', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#E8541A', marginBottom: '1rem' }}>{item.step}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item.title}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
