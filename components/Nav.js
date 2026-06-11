import Link from 'next/link';
import { useRouter } from 'next/router';

const navPages = [
  {
    "path": "/",
    "label": "Cristio"
  },
  {
    "path": "/Regnum-Unitum",
    "label": "Regnum Unitum"
  }
];

export default function Nav() {
  const router = useRouter();

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
      gap: '0.8rem 1.5rem', padding: '1.2rem 1rem', zIndex: 100,
      background: 'linear-gradient(180deg, rgba(15,12,8,0.9) 0%, transparent 100%)',
      fontFamily: "'EB Garamond', Georgia, serif", fontSize: '0.8rem',
      letterSpacing: '0.12rem', textTransform: 'uppercase'
    }}>
      {navPages.map(p => (
        <Link key={p.path} href={p.path}
          style={{
            color: router.pathname === p.path ? '#d4c4a0' : '#7a6a5a',
            textDecoration: 'none', transition: 'color 0.3s',
            borderBottom: router.pathname === p.path ? '1px solid #d4af37' : '1px solid transparent',
            whiteSpace: 'nowrap'
          }}>
          {p.label}
        </Link>
      ))}
    </nav>
  );
}
