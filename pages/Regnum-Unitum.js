import Head from 'next/head';
import Nav from '../components/Nav';
import AdamChat from '../components/AdamChat';

export default function Regnum_Unitum() {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cristio — Regnum Unitum</title>
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      </Head>
      <Nav />
      <AdamChat />
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
          <h1 style={{
            fontSize: '2.5rem', fontWeight: 600, letterSpacing: '0.2rem',
            marginBottom: '0.5rem', color: '#d4c4a0',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)'
          }}>Regnum Unitum</h1>
          
          <div style={{
            width: '40px', height: '1px', background: '#5a4a3a',
            margin: '0 auto 2rem'
          }} />
          <div style={{textAlign:'left',fontSize:'1rem',lineHeight:1.8,color:'#a89878'}}
            dangerouslySetInnerHTML={{__html: "<p>This is where I write about Regnum Unitum.</p>\n"}} />
          
        </div>
      </div>
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
