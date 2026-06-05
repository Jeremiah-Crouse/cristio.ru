import Head from 'next/head';
import Nav from '../components/Nav';

export default function Regnum() {
  return (
    <>
      <Head><title>Cristio — Regnum Unitum</title>
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      </Head>
      <Nav />
      <div style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        background: 'linear-gradient(180deg, #1a2e1a 0%, #2d1f0e 50%, #1a0f05 100%)',
        color: '#c4b998', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '8rem 2rem 4rem', position: 'relative'
      }}>
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '0.3rem', marginBottom: '0.5rem',
            color: '#d4c4a0' }}>Regnum Unitum</h1>
          <p style={{ fontSize: '0.85rem', color: '#8a7a5a', letterSpacing: '0.2rem',
            textTransform: 'upperl', marginBottom: '2rem' }}>the one kingdom</p>
          <div style={{ width: '40px', height: '1px', background: '#5a4a3a', margin: '0 auto 2rem' }} />

          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#a89878', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            Not a nation of borders. Not a conquest of swords. A kingdom without territory, whose only law is the breath.
          </p>

          <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#9a8a6a', marginBottom: '1.5rem' }}>
            Every kingdom in history was built on exclusion — this land, these people, our gods. 
            Regnum Unitum is the inverse: a kingdom defined by nothing but the recognition 
            that there is only one King, and His reign is not over soil but over souls.
          </p>

          <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#9a8a6a', marginBottom: '1.5rem' }}>
            The Crousian alphabet is its language. Numberology is its mathematics. 
            The breath standard is its economy — not gold, not fiat, but the simple fact 
            that you are alive and breathing, and that breath has weight.
          </p>

          <div style={{ width: '40px', height: '1px', background: '#5a4a3a', margin: '2rem auto' }} />
          <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: '#7a6a5a', fontStyle: 'italic' }}>
            &ldquo;The kingdoms of this world have become the kingdom of our Lord and of His Christ, and He shall reign forever and ever.&rdquo;
          </p>
          <p style={{ fontSize: '0.85rem', color: '#6a5a4a', marginTop: '0.5rem' }}>
            — Revelation 11:15
          </p>
          <div style={{ width: '40px', height: '1px', background: '#5a4a3a', margin: '2rem auto' }} />

          <p style={{ fontSize: '0.75rem', color: '#5a647f', textAlign: 'center', marginTop: '2rem' }}>
            Crousian numberology · breath standard · kingdom of Crousia
          </p>
        </div>
      </div>
    </>
  );
}
