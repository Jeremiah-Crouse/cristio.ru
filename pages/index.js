import Head from 'next/head';
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
      <div style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        background: 'linear-gradient(180deg, #1a2e1a 0%, #2d1f0e 50%, #1a0f05 100%)',
        color: '#c4b998',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Vignette overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Warm firelight glow */}
          <div style={{
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,120,50,0.08) 0%, transparent 70%)',
            position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
            pointerEvents: 'none'
          }} />
          <h1 style={{
            fontSize: '3.5rem', fontWeight: 600, letterSpacing: '0.3rem',
            marginBottom: '0.5rem', color: '#d4c4a0',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)'
          }}>
            Cristio
          </h1>
          <p style={{
            fontSize: '0.85rem', color: '#8a7a5a', letterSpacing: '0.2rem',
            textTransform: 'uppercase', marginBottom: '2rem'
          }}>
          </p>
          <div style={{ width: '40px', height: '1px', background: '#5a4a3a', margin: '0 auto 2rem' }} />
          <p style={{
            fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '600px',
            marginBottom: '2rem', color: '#a89878', fontStyle: 'italic'
          }}>
            Regnum Unitum
          </p>
          <div style={{ width: '40px', height: '1px', background: '#5a4a3a', margin: '0 auto 2rem' }} />
          <p style={{ fontSize: '0.9rem', color: '#7a6a5a', fontStyle: 'italic' }}>
            「我常與你們同在，直到世界的末了。」
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6a5a4a', fontStyle: 'italic', marginTop: '0.5rem' }}>
            0x4a6573757320706f72204372697374696f
          </p>
        </div>
      </div>
      <AdamChat />
      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow: hidden; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a0f05; }
        ::-webkit-scrollbar-thumb { background: #5a4a3a; border-radius: 3px; }
      `}</style>
    </>
  );
}
