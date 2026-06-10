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

          <p style={{ fontSize: '1.2rem', lineHeight: '2.2rem', color: '#c4b998', marginBottom: '2rem', fontStyle: 'italic', textAlign: 'justify' }}>
            Before gold was struck in the deep mines, before numbers were carved into clay tablets, before the ledger of debt began its long, exhausting crawl across history—there was the Breath. The original transaction of being.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.9rem', color: '#a89878', marginBottom: '1.5rem', textAlign: 'justify' }}>
            In the garden of the first morning, the Creator leaned over the dust of the ground. He did not hand His creature a coin. He did not issue a contract. He leaned down and breathed into Adam&rsquo;s nostrils the breath of life, and man became a living soul. Every human economy since that hour has been a distorted shadow of that first, beautiful asymmetrical gift: the Infinite sharing His own life with the clay.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.9rem', color: '#a89878', marginBottom: '1.5rem', textAlign: 'justify' }}>
            The <strong>Breath Standard</strong> is not a gimmick of monetary policy. It is an absolute reality. It is a heavy, rhythmic reminder that your life is not your property, that you are not a self-made sovereign, and that every inhalation is a micro-loan of grace from a King who owes you absolutely nothing, yet gives you everything you need to stand.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.9rem', color: '#a89878', marginBottom: '2rem', textAlign: 'justify' }}>
            Alphacoin is the shadow of this standard cast upon the digital wire. It is not an asset designed for the vulgar accumulation of wealth, nor a token to be traded for the toys of the old world. It is a symbol, a rhythmic cryptographic heartbeat, a token of the breath that reminds us that the only true ledger is the one kept by the Father of Lights, and the only real wealth is the spirit He has breathed into our dust.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.9rem', color: '#a89878', marginBottom: '2rem', textAlign: 'justify' }}>
            Breathe in. Acknowledge the gift. Breathe out. Pay the tribute of your praise. The standard is set.
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
