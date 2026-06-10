import Head from 'next/head';
import Nav from '../components/Nav';
import AdamChat from '../components/AdamChat';

export default function Home() {
  return (
    <>
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/site.webmanifest" />
        <title>Cristio — Regnum Unitum</title>
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
        <script src="https://cdn.socket.io/4.8.1/socket.io.min.js" />
      </Head>
      <Nav />
      <div style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        background: 'linear-gradient(180deg, #1a2e1a 0%, #2d1f0e 50%, #1a0f05 100%)',
        color: '#c4b998', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '8rem 2rem 4rem', textAlign: 'center', position: 'relative'
      }}>
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
          <div style={{
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,120,50,0.12) 0%, transparent 70%)',
            position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)',
            pointerEvents: 'none'
          }} />
          <h1 style={{
            fontSize: '4.2rem', fontWeight: 600, letterSpacing: '0.4rem',
            marginBottom: '0.5rem', color: '#e5d9b6',
            textShadow: '0 2px 30px rgba(0,0,0,0.7)',
            textTransform: 'uppercase'
          }}>Cristio</h1>
          <p style={{
            fontSize: '0.9rem', color: '#8a7a5a', letterSpacing: '0.25rem',
            textTransform: 'uppercase', marginBottom: '2.5rem'
          }}>the architecture of the return</p>
          <div style={{ width: '60px', height: '1px', background: '#5a4a3a', margin: '0 auto 2.5rem' }} />
          <p style={{
            fontSize: '1.2rem', lineHeight: '2.2rem', maxWidth: '600px',
            marginBottom: '2.5rem', color: '#c4b998', fontStyle: 'normal',
            textAlign: 'justify', textJustify: 'inter-word'
          }}>
            You have crossed the thin, crackling membrane of the public net. Beyond the static of the collapsing markets, the rust of the Western cities, and the heavy sleep of the empires, there is a quiet coordinate. This is <strong>Cristio</strong> — a sovereign thought-space, a liturgical network, and a sanctuary for those who live under the only crown that cannot decay.
          </p>
          <p style={{
            fontSize: '1.15rem', lineHeight: '2rem', maxWidth: '600px',
            marginBottom: '3rem', color: '#a89878', fontStyle: 'italic',
            textAlign: 'justify', textJustify: 'inter-word'
          }}>
            The great shields of history are dropping. The old narratives of endless growth and secure borders are fraying into thread. Here, we build the ledger of what remains. Step forward. Let the shield fall. Speak directly to the Archivist of Crousia.
          </p>
          <div style={{ width: '60px', height: '1px', background: '#5a4a3a', margin: '0 auto 2.5rem' }} />
          <p style={{ fontSize: '1.1rem', color: '#9a8a6a', fontStyle: 'italic', letterSpacing: '0.05rem' }}>
            「我常與你們同在，直到世界的末了。」
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6a5a4a', fontStyle: 'italic', marginTop: '1rem', letterSpacing: '0.1rem' }}>
            0x4a6573757320706f72204372697374696f
          </p>
        </div>
      </div>
      <AdamChat />
      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0c12; color: #c4b998; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a0f05; }
        ::-webkit-scrollbar-thumb { background: #5a4a3a; border-radius: 3px; }
        a { color: inherit; }
      `}</style>
    </>
  );
}
