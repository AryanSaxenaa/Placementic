import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Comic Neue', 'DM Sans', sans-serif", margin: 0, padding: 0, backgroundColor: '#FFF5E4' }}>
      <Head>
        <title>About - PlacementIQ</title>
        <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Playfair+Display:wght@900&display=swap" rel="stylesheet" />
        <style>{`
          body { margin: 0; padding: 0; background-color: #FFF5E4; }
        `}</style>
      </Head>

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

      <section style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem', background: '#FFFFFF', borderRadius: '16px', border: '3px solid #3D1A00', boxShadow: '8px 8px 0px #3D1A00', color: '#3D1A00' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', borderBottom: '4px dashed #E8541A', paddingBottom: '1rem', marginBottom: '2rem' }}>What is PlacementIQ?</h1>
        <p style={{ fontSize: '1.3rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          Finding a job shouldn't mean flying blind! We built <strong>PlacementIQ</strong> to cut through the corporate fluff and give you the real truth about your next potential workplace.
        </p>
        <p style={{ fontSize: '1.3rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          By combining advanced AI resume parsing with automated deep-web scraping from places like Reddit, Glassdoor, and LinkedIn, we surface real employee experiences, alumni connections, and red flags <em>before</em> you apply.
        </p>
        <p style={{ fontSize: '1.3rem', lineHeight: '1.8', fontWeight: 'bold', color: '#E8541A' }}>
          Stop guessing. Start knowing. Drop your JD and let's get the truth!
        </p>
      </section>
    </div>
  );
}
