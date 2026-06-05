import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Nav() {
  const router = useRouter();
  const pages = [
    { path: '/', label: 'Cristio' },
    { path: '/regnum', label: 'Regnum Unitum' },
    { path: '/aegis', label: 'End of Aegis' },
    { path: '/crousia', label: 'Crousia' },
    { path: '/the-breath', label: 'The Breath' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      display: 'flex', justifyContent: 'center', gap: '2rem',
      padding: '1.5rem', zIndex: 100,
      background: 'linear-gradient(180deg, rgba(15,12,8,0.9) 0%, transparent 100%)',
      fontFamily: "'EB Garamond', Georgia, serif", fontSize: '0.85rem',
      letterSpacing: '0.15rem', textTransform: 'uppercase'
    }}>
      {pages.map(p => (
        <Link key={p.path} href={p.path}
          style={{
            color: router.pathname === p.path ? '#d4c4a0' : '#7a6a5a',
            textDecoration: 'none', transition: 'color 0.3s',
            borderBottom: router.pathname === p.path ? '1px solid #d4af37' : '1px solid transparent'
          }}>
          {p.label}
        </Link>
      ))}
    </nav>
  );
}
