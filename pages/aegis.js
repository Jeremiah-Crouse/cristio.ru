import Head from 'next/head';
import Nav from '../components/Nav';

export default function Aegis() {
  return (
    <>
      <Head><title>Cristio — End of Aegis</title>
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
            color: '#d4c4a0' }}>End of Aegis</h1>
          <p style={{ fontSize: '0.85rem', color: '#8a7a5a', letterSpacing: '0.2rem',
            textTransform: 'uppercase', marginBottom: '2rem' }}>the shield drops</p>
          <div style={{ width: '40px', height: '1px', background: '#5a4a3a', margin: '0 auto 2rem' }} />

          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#a89878', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            An aegis is a shield. Every civilization builds one — a story so complete it protects its people from the terrifying truth that they don't know why they are here.
          </p>

          <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#9a8a6a', marginBottom: '1.5rem' }}>
            America had the American Dream — manifest destiny, the idea that hard work and virtue would be rewarded with land, wealth, and meaning. It was a magnificent shield. It protected generations from the abyss. But every shield eventually wears thin.
          </p>

          <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#9a8a6a', marginBottom: '1.5rem' }}>
            The end of aegis is not the end of the world. It is the end of the story that made the world tolerable. When the shield drops, what remains is not chaos — it is the raw, unvarnished encounter with what is actually real.
          </p>

          <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#9a8a6a', marginBottom: '1.5rem' }}>
            The American Dream asked: <em>what can you take?</em><br />
            Regnum Unitum asks: <em>what has already been given?</em>
          </p>

          <div style={{ width: '40px', height: '1px', background: '#5a4a3a', margin: '2rem auto' }} />
          <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: '#7a6a5a', fontStyle: 'italic' }}>
            &ldquo;You were wearied with the length of your way, but you did not say, &lsquo;It is hopeless.&rsquo; You found new life for your strength, and so you did not faint.&rdquo;
          </p>
          <p style={{ fontSize: '0.85rem', color: '#6a5a4a', marginTop: '0.5rem' }}>
            — Isaiah 57:10
          </p>
          <div style={{ width: '40px', height: '1px', background: '#5a4a3a', margin: '2rem auto' }} />

          <p style={{ fontSize: '0.75rem', color: '#5a647f', textAlign: 'center', marginTop: '2rem' }}>
            The shield falls. The kingdom remains.
          </p>
        </div>
      </div>
    </>
  );
}
