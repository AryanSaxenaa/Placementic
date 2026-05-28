import Link from 'next/link';

export default function Navbar() {
  return (
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
  );
}
