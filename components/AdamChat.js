import { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function AdamChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [userName, setUserName] = useState(null);
  const [showName, setShowName] = useState(false);
  const inputRef = useRef(null);
  const msgsRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('cristio_user_name');
    if (saved) { setUserName(saved); connectSocket(saved); }
    else setShowName(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const style = document.createElement('style');
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
    return () => style.remove();
  }, [open]);

  const connectSocket = (name) => {
    const socket = io('https://alphacoin.uk', { transports: ['websocket', 'polling'], timeout: 30000 });
    socket.on('connect', () => socket.emit('identify', { name }));
    socket.on('disconnect', () => setTimeout(() => connectSocket(name), 3000));
    socketRef.current = socket;
  };

  const addMsg = (text, who) => setMsgs(prev => [...prev, { text, who }]);

  const send = () => {
    const m = inputRef.current?.value?.trim();
    if (!m) return;
    inputRef.current.value = '';
    addMsg(m, 'user');
    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit('chat', { text: m, name: userName || 'User' });
      socket.off('response'); socket.off('error');
      socket.on('response', d => { addMsg(d.text, 'bot'); });
      socket.on('error', d => { addMsg('Error: ' + (d.message || 'unknown'), 'bot'); });
    } else {
      addMsg('[offline]', 'bot');
    }
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{
        position: 'fixed', bottom: '2rem', right: '2rem',
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
          position: 'fixed', bottom: '6rem', right: '2rem',
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
            <img src="/photos/AC.png" style={{width:'16px',height:'16px',borderRadius:'2px'}} />
            <div style={{flex:1}} />
            <span onClick={() => setMsgs([])}
              style={{cursor:'pointer',fontSize:'0.7rem',color:'#666',padding:'0 0.5rem'}}>↻</span>
          </div>
          {showName && (
            <div style={{padding:'1rem', borderTop:'1px solid #333', display:'flex', flexDirection:'column', gap:'0.5rem'}}>
              <div style={{color:'#888',fontSize:'0.85rem'}}>What should I call you?</div>
              <div style={{display:'flex',gap:'0.5rem'}}>
                <input onKeyDown={e => { if(e.key==='Enter') { const v=e.target.value.trim(); if(v) { setUserName(v); localStorage.setItem('cristio_user_name',v); setShowName(false); connectSocket(v); }}}}
                  style={{flex:1,padding:'0.5rem',background:'#333',border:'1px solid #555',borderRadius:'4px',color:'#fff',outline:'none'}} />
                <button onClick={() => setShowName(false)}
                  style={{padding:'0.5rem 1rem',background:'#555',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer'}}>Go</button>
              </div>
            </div>
          )}
          <div ref={msgsRef} style={{flex:1,overflowY:'auto',padding:'1rem',fontSize:'0.9rem'}}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                marginBottom:'0.5rem',padding:'0.5rem 0.8rem',borderRadius:'8px',
                whiteSpace:'pre-wrap',wordBreak:'break-word',textAlign:'left',maxWidth:'85%',
                ...(m.who==='user'
                  ? {background:'#333',color:'#fff',alignSelf:'flex-end',marginLeft:'auto'}
                  : {background:'#222',color:'#aaa',alignSelf:'flex-start'})
              }}>{m.text}</div>
            ))}
          </div>
          <div style={{display:'flex',borderTop:'1px solid #333'}}>
            <input type="file" accept="image/*" style={{display:'none'}}
              onChange={async e => {
                const file = e.target.files?.[0]; if(!file) return;
                const fd = new FormData(); fd.append('file',file); fd.append('name',userName||'User'); fd.append('message','');
                try { await fetch('https://alphacoin.uk/api/chat/upload',{method:'POST',body:fd}); } catch {}
              }} />
            <button onClick={() => document.querySelector('input[type=file]')?.click()}
              style={{padding:'0.8rem 0.5rem',background:'none',border:'none',cursor:'pointer',color:'#666'}}>📷</button>
            <textarea ref={inputRef} placeholder="Type something..." rows="1"
              onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} }}
              style={{flex:1,padding:'0.8rem',background:'transparent',border:'none',color:'#fff',outline:'none',resize:'none',fontSize:'0.9rem',lineHeight:1.4,minHeight:'20px',maxHeight:'60px'}} />
            <button onClick={send}
              style={{padding:'0.8rem 1rem',background:'#fff',color:'#000',border:'none',cursor:'pointer'}}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
