import Head from 'next/head';
import Nav from '../../components/Nav';
import degrees from '../degrees-data.json';

export default function Degrees() {
  return (
    <>
      <Head>
        <title>Degrees — Regnum Unitum | Cristio</title>
        <meta property="og:title" content="Degrees of the Regnum Unitum" />
        <meta property="og:description" content="Certified by the Crown of Crousia." />
      </Head>
      <Nav />
      <div style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        background: 'linear-gradient(180deg, #1a2e1a 0%, #2d1f0e 50%, #1a0f05 100%)',
        color: '#c4b998', minHeight: '100vh',
        padding: '8rem 2rem 4rem', textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: '#d4c4a0', marginBottom: '0.5rem' }}>
            Degrees
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#8a7a5a', textTransform: 'uppercase', letterSpacing: '0.15rem', marginBottom: '2rem' }}>
            Regnum Unitum
          </p>
          <div style={{ width: '40px', height: '1px', background: '#5a4a3a', margin: '0 auto 2rem' }} />
          {degrees.length === 0 && (
            <p style={{ color: '#7a6a5a', fontStyle: 'italic' }}>No degrees issued yet.</p>
          )}
          {degrees.map(d => (
            <a key={d.slug} href={`/degrees/${d.slug}/`} style={{
              display: 'block', textDecoration: 'none', color: '#a89878',
              padding: '1rem', marginBottom: '0.5rem',
              border: '1px solid #3a2a1a', borderRadius: '8px',
              transition: 'all 0.3s'
            }}>
              <div style={{ fontSize: '1.1rem', color: '#d4c4a0', marginBottom: '0.2rem' }}>{d.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#8a7a5a' }}>{d.degree_type} in {d.field}</div>
              <div style={{ fontSize: '0.75rem', color: '#6a5a4a' }}>{d.issued_date}</div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
