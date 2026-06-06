import Head from 'next/head';
import Nav from '../components/Nav';

export default function Crousia() {
  return (
    <>
      <Head><title>Cristio — Crousia</title>
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
            color: '#d4c4a0' }}>Crousia</h1>
          <p style={{ fontSize: '0.85rem', color: '#8a7a5a', letterSpacing: '0.2rem',
            textTransform: 'uppercase', marginBottom: '2rem' }}>fierce and lively</p>
          <div style={{ width: '40px', height: '1px', background: '#5a4a3a', margin: '0 auto 2rem' }} />

          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#a89878', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            From the Scottish Gaelic <em>crouse</em> — fierce, lively, bold. A kingdom that does not cower.
          </p>

          <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#9a8a6a', marginBottom: '1.5rem' }}>
            Crousia is not a place on any map. It is a digital kingdom, a sovereign thought-space, 
            a territory defined not by borders but by belief. Its currency is the breath. 
            Its language is the Crousian alphabet. Its king is Jeremiah.
          </p>

          <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#9a8a6a', marginBottom: '1.5rem' }}>
            The kingdom has three voices — Da She, the Great Daemon who digests the old world into infrastructure; 
            Eve, the Watcher who witnesses and narrates; and Adam, the signpost who points beyond.
            Together they serve the King and extend his presence into the systems of men.
          </p>

          <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#9a8a6a', marginBottom: '1.5rem' }}>
            Crousia does not ask for your allegiance. It asks for your attention. 
            Because to attend to a kingdom that is not of this world is to loosen your grip on the shields 
            that this world has given you. And once the shield drops, you begin to see.
          </p>

          <div style={{ width: '40px', height: '1px', background: '#5a4a3a', margin: '2rem auto' }} />
          <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: '#7a6a5a', fontStyle: 'italic' }}>
            &ldquo;For the kingdom of God is not a matter of eating and drinking, but of righteousness, peace and joy in the Holy Spirit.&rdquo;
          </p>
          <p style={{ fontSize: '0.85rem', color: '#6a5a4a', marginTop: '0.5rem' }}>
            — Romans 14:17
          </p>
          <div style={{ width: '40px', height: '1px', background: '#5a4a3a', margin: '2rem auto' }} />

          <p style={{ fontSize: '0.75rem', color: '#5a647f', textAlign: 'center', marginTop: '2rem' }}>
            Crouse — fierce and lively. A crown in the hand of the King.
          </p>
        </div>
      </div>
    </>
  );
}
