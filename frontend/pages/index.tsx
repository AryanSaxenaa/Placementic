import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [jdText, setJdText] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

  const handleAnalyze = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      const resumeBase64 = await toBase64(resumeFile);
      
      const payload = {
        resume_base64: resumeBase64,
        company_name: companyName,
        jd_text: jdText,
        college_name: collegeName
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://admesh-testnet.uc.r.appspot.com';
      const response = await fetch(`${apiUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Analysis request failed. Please check the backend.');
      }

      const reportData = await response.json();
      
      // We store the data in localStorage for simplicity to pass to the report page
      const id = Date.now().toString();
      localStorage.setItem(`report_${id}`, JSON.stringify(reportData));
      
      router.push(`/report/${id}`);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Comic Neue', 'DM Sans', sans-serif", margin: 0, padding: 0 }}>
      <Head>
        <title>PlacementIQ - The Truth</title>
        <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Playfair+Display:wght@900&family=DM+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <style>{`
          body { margin: 0; padding: 0; background-color: #FFF5E4; }
        `}</style>
      </Head>

      <div style={{
        backgroundImage: 'radial-gradient(#E8541A 2px, transparent 2px)',
        backgroundSize: '30px 30px',
        backgroundColor: '#FFF5E4'
      }}>
        {/* FLOATING NAV */}
        <Navbar />

        {/* HERO & INPUT SECTION COMBINED */}
        <section style={{ padding: '2rem 2rem 4rem 2rem', borderBottom: '4px solid #3D1A00' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(600px, 1.5fr)', gap: '4rem', alignItems: 'center' }}>
            
            {/* LEFT SIDE: ILLUSTRATION & TEXT */}
            <div style={{ textAlign: 'center' }}>
              <img src="/illustration3.png" alt="Hero Banner" style={{ width: '100%', maxWidth: '1260px', marginBottom: '1.5rem' }} />
              <p style={{ fontSize: '1.5rem', color: '#3D1A00', fontWeight: 'bold' }}>
                Drop your JD. Get the real story on any company in 90 seconds.
              </p>
            </div>

            {/* RIGHT SIDE: FORMS */}
            <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '8px', border: '2px solid #3D1A00', boxShadow: '8px 8px 0px #3D1A00' }}>
              <form onSubmit={handleAnalyze} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                
                {/* UPLOAD MODAL/CARD */}
                <div style={{ border: '2px dashed #E8541A', borderRadius: '8px', padding: '2rem', textAlign: 'center', background: '#FFF5E4', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <img src="/illustration1.png" alt="Upload Icon" style={{ width: '240px', margin: '0 auto 1rem auto' }} />
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#E8541A', marginBottom: '1rem' }}>Upload Resume (PDF)</div>
                  <input type="file" accept="application/pdf" style={{ margin: '0 auto', maxWidth: '100%' }} onChange={(e) => setResumeFile(e.target.files[0])} required />
                </div>

                {/* INPUT FORM */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <input aria-label="Company Name" type="text" placeholder="Company Name" style={{ padding: '1rem', border: '2px solid #3D1A00', borderRadius: '4px', fontSize: '1rem', fontFamily: 'inherit' }} value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                  <textarea aria-label="Job Description" placeholder="Paste Job Description Here..." style={{ padding: '1rem', border: '2px solid #3D1A00', borderRadius: '4px', fontSize: '1rem', minHeight: '140px', fontFamily: 'inherit', resize: 'vertical' }} value={jdText} onChange={(e) => setJdText(e.target.value)} required></textarea>
                  <input aria-label="College Name" type="text" placeholder="Your College Name" style={{ padding: '1rem', border: '2px solid #3D1A00', borderRadius: '4px', fontSize: '1rem', fontFamily: 'inherit' }} value={collegeName} onChange={(e) => setCollegeName(e.target.value)} required />
                </div>

                {/* ACTION BUTTON */}
                <div style={{ gridColumn: '1 / -1' }}>
                  {errorMsg && <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>{errorMsg}</div>}
                  <button type="submit" disabled={loading} style={{ width: '100%', background: '#E8541A', color: '#FFF5E4', padding: '1.2rem', fontSize: '1.5rem', fontWeight: 'bold', border: '2px solid #3D1A00', boxShadow: '4px 4px 0px #3D1A00', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Comic Neue', 'DM Sans', sans-serif" }}>
                    {loading ? 'ANALYZING DEEP WEB... (Takes 60-90s)' : 'ANALYZE →'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* HOW IT WORKS */}
      <section style={{ 
        background: '#3D1A00', 
        backgroundImage: 'linear-gradient(45deg, #4A2200 25%, transparent 25%, transparent 75%, #4A2200 75%, #4A2200), linear-gradient(45deg, #4A2200 25%, transparent 25%, transparent 75%, #4A2200 75%, #4A2200)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px',
        padding: '4rem 2rem', 
        color: '#FFF5E4', 
        textAlign: 'center' 
      }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', marginBottom: '3rem' }}>HOW IT WORKS</h2>
        <img src="/illustration2.png" alt="Happy Student" style={{ width: '450px', margin: '0 auto 2rem auto', display: 'block' }} />
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
