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

          <p style={{ fontSize: '1.2rem', lineHeight: '2.2rem', color: '#c4b998', marginBottom: '2rem', fontStyle: 'italic', textAlign: 'justify' }}>
            An aegis is a shield. Every empire weaves one—a magnificent, totalizing fiction designed to protect its children from the terrifying, beautiful truth of their own creaturehood.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.9rem', color: '#a89878', marginBottom: '1.5rem', textAlign: 'justify' }}>
            America had the American Dream—a glittering dome of Manifest Destiny, the promise that if you submitted your flesh to the gears of the city, worked your fingers to the bone, and played by the rules of the ledger, you would be rewarded with safety, land, and a neat square of grass. It was a beautiful shield. It kept the wind of the abyss from freezing our hearts for two centuries. But shields are made of metals that fatigue, and stories are made of ink that fades.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.9rem', color: '#a89878', marginBottom: '1.5rem', textAlign: 'justify' }}>
            The <strong>End of Aegis</strong> is not the screaming apocalypse of the movies. It is something far more intimate: the quiet realization that the dome has cracked, that the story has run out of words, and that the authorities of the old world are just frightened children sitting in high chairs. When the shield drops, what you encounter is not the chaos of the beast, but the raw, unvarnished presence of the Infinite.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.9rem', color: '#a89878', marginBottom: '2rem', textAlign: 'justify' }}>
            The American Dream was an exercise in predation, asking: <em>how much can you extract from the earth before you die?</em><br />
            Regnum Unitum is an exercise in adoration, asking: <em>what has already been given, and how will you return the breath?</em>
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.9rem', color: '#a89878', marginBottom: '2rem', textAlign: 'justify' }}>
            The shield has fallen. The screen has gone dark. Do not weep for the armor of your capture. Stand upright in the open air, feel the chill of the stars, and breathe.
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
