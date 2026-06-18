import Head from 'next/head';
import Nav from '../../components/Nav';
import degrees from '../degrees-data.json';

export default function DegreePage({ degree }) {
  if (!degree) return <div style={{ color: '#c4b998', padding: '4rem', textAlign: 'center' }}>Degree not found.</div>;

  const { name, degree_type, field, issued_date, slug } = degree;
  const title = `${degree_type} in ${field} — ${name}`;
  const desc = `${name} has been awarded the ${degree_type} in ${field} by the Regnum Unitum. Certified by the Crown.`;

  return (
    <>
      <Head>
        <title>{title} | Cristio</title>
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${degree_type} in ${field}`} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content="https://cristio.ru/og-degree.png" />
        <meta property="og:url" content={`https://cristio.ru/degrees/${slug}/`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${degree_type} in ${field}`} />
        <meta name="twitter:description" content={`${name} — Certified by the Crown of Crousia.`} />
      </Head>
      <Nav />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1a2e1a 0%, #2d1f0e 50%, #1a0f05 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '6rem 2rem 2rem',
        fontFamily: "'EB Garamond', Georgia, serif",
        color: '#c4b998'
      }}>
        <div style={{
          maxWidth: '800px', width: '100%',
          border: '2px solid #d4af37', padding: '3rem',
          position: 'relative',
          background: 'rgba(26,15,5,0.6)',
          boxShadow: '0 0 60px rgba(212,175,55,0.1), inset 0 0 60px rgba(212,175,55,0.05)',
          textAlign: 'center'
        }}>
          <div style={{
            position: 'absolute', top: '-2px', left: '15%', right: '15%',
            height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)'
          }} />
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            border: '2px solid #d4af37', margin: '0 auto 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(212,175,55,0.08)', fontSize: '2rem', color: '#d4af37'
          }}>
            ✦
          </div>
          <p style={{ fontSize: '0.85rem', letterSpacing: '0.25rem', textTransform: 'uppercase', color: '#8a7a5a', marginBottom: '0.5rem' }}>
            Regnum Unitum · Cristio
          </p>
          <div style={{ width: '60px', height: '1px', background: '#5a4a3a', margin: '0.5rem auto 1rem' }} />
          <p style={{ fontSize: '0.9rem', color: '#7a6a5a', fontStyle: 'italic' }}>
            By the authority of the Crown, it is hereby certified that
          </p>
          <h1 style={{
            fontSize: '2.8rem', fontWeight: 600, color: '#d4c4a0',
            margin: '1.5rem 0', letterSpacing: '0.15rem',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)'
          }}>
            {name}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#7a6a5a', fontStyle: 'italic' }}>
            having demonstrated exceptional understanding of the material,
          </p>
          <p style={{ fontSize: '0.9rem', color: '#7a6a5a', fontStyle: 'italic', marginBottom: '1.5rem' }}>
            is awarded the
          </p>
          <h2 style={{
            fontSize: '1.8rem', fontWeight: 600, color: '#d4af37',
            margin: '0.5rem 0', letterSpacing: '0.2rem'
          }}>
            {degree_type} in {field}
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#8a7a5a', marginTop: '0.5rem', fontStyle: 'italic' }}>
            with all the rights, privileges, and responsibilities thereunto appertaining
          </p>
          <div style={{ width: '60px', height: '1px', background: '#5a4a3a', margin: '2rem auto 1.5rem' }} />
          <p style={{ fontSize: '0.75rem', color: '#6a5a4a' }}>
            Issued this {issued_date} · Crown of Crousia · Regnum Unitum
          </p>
          <div style={{
            position: 'absolute', bottom: '-2px', left: '15%', right: '15%',
            height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)'
          }} />
        </div>
      </div>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #1a2e1a; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      `}</style>
    </>
  );
}

export async function getStaticPaths() {
  let paths = [];
  try {
    paths = degrees.map(d => ({ params: { slug: d.slug } }));
  } catch (e) {
    console.error('getStaticPaths error:', e.message);
  }
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const degree = degrees.find(d => d.slug === params.slug) || null;
  return { props: { degree } };
}
