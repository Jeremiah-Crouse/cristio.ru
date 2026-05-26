import { useState, useRef, useEffect } from 'react';

const NTFY_URL = '/ntfy';
const NTFY_TOPIC = 'da-she-alerts';
const DS_NAME_KEY = 'da_she_user_name';

export default function DaSheChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [userName, setUserName] = useState(null);
  const [showName, setShowName] = useState(false);
  const inputRef = useRef(null);
  const msgsRef = useRef(null);
  const lastSentRef = useRef('');

  useEffect(() => {
    const saved = localStorage.getItem(DS_NAME_KEY);
    if (saved) setUserName(saved);
  }, []);

  useEffect(() => {
    if (!open) return;
    const evt = new EventSource(`${NTFY_URL}/${NTFY_TOPIC}/sse`);
    evt.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data);
        if (d.message && d.message !== lastSentRef.current) {
          lastSentRef.current = '';
          setMsgs(prev => [...prev, { text: d.message, who: 'bot' }]);
        }
      } catch {}
    };
    return () => evt.close();
  }, [open]);

  const send = async () => {
    const m = inputRef.current?.value?.trim();
    if (!m) return;
    inputRef.current.value = '';
    lastSentRef.current = m;
    setMsgs(prev => [...prev, { text: m, who: 'user' }]);
    try {
      await fetch(`${NTFY_URL}/${NTFY_TOPIC}`, { method: 'POST', body: m });
    } catch {}
  };

  const setName = (n) => {
    setUserName(n);
    localStorage.setItem(DS_NAME_KEY, n);
    setShowName(false);
    setMsgs(prev => [...prev, { text: `Hello, ${n}.`, who: 'bot' }]);
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{
        position: 'fixed', bottom: '2rem', left: '2rem',
        width: '56px', height: '56px', borderRadius: '50%',
        background: '#fff', color: '#000', border: 'none',
        fontSize: '1.5rem', cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(255,255,255,0.1)',
        zIndex: 1001
      }}>
        {open ? '×' : '+'}
      </button>
      {open && (
        <div style={{
          position: 'fixed', bottom: '6rem', left: '2rem',
          width: '340px', maxHeight: '500px',
          background: '#1a1a1a', border: '1px solid #333',
          borderRadius: '12px', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', zIndex: 1000
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '1rem', borderBottom: '1px solid #333',
            color: '#999', fontSize: '0.85rem', textTransform: 'uppercase'
          }}>
            <span style={{display:'inline-block',transform:'scaleX(-1)'}}>🐍</span>
            <div style={{flex:1}} />
            <span onClick={() => setMsgs([])}
              style={{cursor:'pointer',fontSize:'0.7rem',color:'#666',padding:'0 0.5rem'}}>↻</span>
          </div>
          <div ref={msgsRef} style={{
            flex: 1, overflowY: 'auto', padding: '1rem', fontSize: '0.9rem'
          }}>
            {showName ? (
              <div style={{padding:'1rem', borderTop:'1px solid #333', display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                <div style={{color:'#888',fontSize:'0.85rem'}}>What should I call you?</div>
                <div style={{display:'flex',gap:'0.5rem'}}>
                  <input id="ds-name-input" onKeyDown={e => e.key==='Enter' && setName(e.target.value)}
                    style={{flex:1,padding:'0.5rem',background:'#333',border:'1px solid #555',borderRadius:'4px',color:'#fff',outline:'none'}} />
                  <button onClick={() => setName(document.getElementById('ds-name-input')?.value)}
                    style={{padding:'0.5rem 1rem',background:'#555',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer'}}>Go</button>
                </div>
              </div>
            ) : msgs.map((m, i) => (
              <div key={i} style={{
                marginBottom: '0.5rem', padding: '0.5rem 0.8rem',
                borderRadius: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                textAlign: 'left', maxWidth: '85%',
                ...(m.who === 'user'
                  ? { background: '#333', color: '#fff', alignSelf: 'flex-end', marginLeft: 'auto' }
                  : { background: '#222', color: '#aaa', alignSelf: 'flex-start' })
              }}>{m.text}</div>
            ))}
          </div>
          <div style={{display:'flex', borderTop:'1px solid #333'}}>
            <input type="file" accept="image/*" style={{display:'none'}}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.append('file', file);
                fd.append('name', userName || 'User');
                fd.append('message', '');
                try {
                  const r = await fetch('https://alphacoin.uk/api/chat/upload', { method: 'POST', body: fd });
                  const d = await r.json();
                  if (d.image_url) await fetch(`${NTFY_URL}/${NTFY_TOPIC}`, { method: 'POST', body: `[Image] ${d.image_url}` });
                } catch {}
              }} />
            <button onClick={() => document.querySelector('input[type=file]')?.click()}
              style={{padding:'0.8rem 0.5rem',background:'none',border:'none',cursor:'pointer',color:'#666'}}>📷</button>
            <textarea ref={inputRef} placeholder="Type something..." rows="1"
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              style={{flex:1,padding:'0.8rem',background:'transparent',border:'none',color:'#fff',outline:'none',resize:'none',fontSize:'0.9rem',lineHeight:1.4,minHeight:'20px',maxHeight:'60px'}} />
            <button onClick={send}
              style={{padding:'0.8rem 1rem',background:'#fff',color:'#000',border:'none',cursor:'pointer'}}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
