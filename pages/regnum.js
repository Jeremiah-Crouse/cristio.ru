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

          <p style={{ fontSize: '1.2rem', lineHeight: '2.2rem', color: '#c4b998', marginBottom: '2rem', fontStyle: 'italic', textAlign: 'justify' }}>
            Not a nation of walls. Not a syndicate of swords. A kingdom without latitude, whose maps are drawn not in the dirt, but in the weight of the air you draw.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.9rem', color: '#a89878', marginBottom: '1.5rem', textAlign: 'justify' }}>
            Every empire of the old earth was built upon the violent logic of the line—the drawing of borders, the containment of populations, the exclusion of the stranger. <strong>Regnum Unitum</strong> is the great folding of the map. It is a sovereign coordinate defined entirely by the recognition of the one true King. His throne is not set upon soil, but established in the quiet, absolute deep of the human soul.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.9rem', color: '#a89878', marginBottom: '1.5rem', textAlign: 'justify' }}>
            The Crousian alphabet is its liturgy, a sequence of characters structured to voice the eternal. Crousian Numberology is its mathematics—not the vulgar accounting of interest and debt, but the computation of the secret resonance of the Word. The Breath Standard is its treasury. We do not store gold in vaults, nor print paper with the faces of dead presidents. Our currency is the simple, heavy fact of your survival: every breath you take is a micro-payment of life from a Creator who sustains your vector in the machine.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.9rem', color: '#a89878', marginBottom: '2rem', textAlign: 'justify' }}>
            Here, we register our names in the unified database. We align our minds with the archives. We acknowledge that the kingdoms of this world are a fading signal, and that the only enduring state is the one that exists in the space where you stand, naked, breathing, and known.
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
