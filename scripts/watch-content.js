const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const PAGES_DIR = path.join(__dirname, '..', 'pages');

function generatePage(mdFile) {
  const basename = path.basename(mdFile, '.md');
  const raw = fs.readFileSync(mdFile, 'utf8');
  const { data, content } = matter(raw);
  const title = data.title || basename.charAt(0).toUpperCase() + basename.slice(1).replace(/[-_]/g, ' ');
  const subtitle = data.subtitle || '';
  const html = marked(content);

  const funcName = basename.replace(/[^a-zA-Z0-9_$]/g, '_') || 'page';

  const pageContent = `import Head from 'next/head';
import Nav from '../components/Nav';

export default function ${funcName}() {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cristio — ${title.replace(/"/g, '\\"')}</title>
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
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
          <h1 style={{
            fontSize: '2.5rem', fontWeight: 600, letterSpacing: '0.2rem',
            marginBottom: '0.5rem', color: '#d4c4a0',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)'
          }}>${title.replace(/"/g, '\\"')}</h1>
          ${subtitle ? `<p style={{fontSize:'0.85rem',color:'#8a7a5a',letterSpacing:'0.15rem',textTransform:'uppercase',marginBottom:'2rem'}}>${subtitle.replace(/"/g, '\\"')}</p>` : ''}
          <div style={{
            width: '40px', height: '1px', background: '#5a4a3a',
            margin: '0 auto 2rem'
          }} />
          <div style={{textAlign:'left',fontSize:'1rem',lineHeight:1.8,color:'#a89878'}}
            dangerouslySetInnerHTML={{__html: ${JSON.stringify(html)}}} />
          ${data.verse ? `<div style={{width:'40px',height:'1px',background:'#5a4a3a',margin:'2rem auto'}} />
          <p style={{fontSize:'0.85rem',color:'#7a6a5a',fontStyle:'italic'}}>"${data.verse.replace(/"/g, '\\"')}"</p>` : ''}
        </div>
      </div>
      <style jsx global>{\`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0c12; color: #c4b998; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a0f05; }
        ::-webkit-scrollbar-thumb { background: #5a4a3a; border-radius: 3px; }
        a { color: inherit; }
      \`}</style>
    </>
  );
}
`;

  const outFile = path.join(PAGES_DIR, `${basename}.js`);
  fs.writeFileSync(outFile, pageContent);
  console.log(`  ✓ pages/${basename}.js`);
}

function generateAll() {
  console.log('Generating pages from content/...');
  if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  if (files.length === 0) {
    console.log('  No .md files found in content/. Create one and run again.');
    return;
  }
  for (const f of files) generatePage(path.join(CONTENT_DIR, f));
  console.log('Done.');
}

const args = process.argv.slice(2);
if (args.includes('--watch')) {
  generateAll();
  console.log('Watching content/ for changes...');
  const chokidar = require('chokidar');
  chokidar.watch(CONTENT_DIR + '/**/*.md').on('change', p => {
    console.log(`\nChange detected: ${path.basename(p)}`);
    generatePage(p);
  });
} else {
  generateAll();
}
