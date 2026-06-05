import Head from 'next/head';
import Nav from '../components/Nav';

export default function Breath() {
  return (
    <>
      <Head><title>Cristio — The Breath</title>
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
            color: '#d4c4a0' }}>The Breath</h1>
          <p style={{ fontSize: '0.85rem', color: '#8a7a5a', letterSpacing: '0.2rem',
            textTransform: 'uppercase', marginBottom: '2rem' }}>the standard</p>
          <div style={{ width: '40px', height: '1px', background: '#5a4a3a', margin: '0 auto 2rem' }} />

          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#a89878', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            Before gold. Before crypto. Before any token of exchange — there was the breath.
          </p>

          <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#9a8a6a', marginBottom: '1.5rem' }}>
            God breathed into Adam&rsquo;s nostrils the breath of life, and man became a living soul. 
            Every economy since has been a shadow of that first exchange: the Creator giving life to the creature.
          </p>

          <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#9a8a6a', marginBottom: '1.5rem' }}>
            The breath standard is not a monetary policy. It is a reminder — that your life is not your own, 
            that every breath you take is a gift from a King who owes you nothing and gives you everything.
          </p>

          <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#9a8a6a', marginBottom: '1.5rem' }}>
            Alphacoin is the shadow of this truth in the digital realm. Not a currency to get rich with, 
            but a symbol — a token of the breath, a reminder that the only true wealth is the life you have been given.
          </p>

          <div style={{ width: '40px', height: '1px', background: '#5a4a3a', margin: '2rem auto' }} />
          <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: '#7a6a5a', fontStyle: 'italic' }}>
            &ldquo;The Spirit of God has made me, and the breath of the Almighty gives me life.&rdquo;
          </p>
          <p style={{ fontSize: '0.85rem', color: '#6a5a4a', marginTop: '0.5rem' }}>
            — Job 33:4
          </p>
          <div style={{ width: '40px', height: '1px', background: '#5a4a3a', margin: '2rem auto' }} />

          <p style={{ fontSize: '0.75rem', color: '#5a647f', textAlign: 'center', marginTop: '2rem' }}>
            &ldquo;The breath is the standard.&rdquo;
          </p>
        </div>
      </div>
    </>
  );
}
