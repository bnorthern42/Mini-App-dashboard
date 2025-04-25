// components/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(() => import('./components/CodeEditor'), { ssr: false });

export default function Home() {
  const [apps, setApps] = useState([]);
  const [newApp, setNewApp] = useState({ title: '', code: '', isPublic: false, tags: '', language: 'html' });
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [filter, setFilter] = useState<'all' | 'mine' | 'public'>('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<'title' | 'user'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activePreview, setActivePreview] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('username');
    if (t && u) {
      setToken(t);
      setUsername(u);
      fetchApps(t);
    }
  }, []);

  const fetchApps = async (t: string) => {
    const res = await axios.get('/api/apps', {
      headers: { Authorization: `Bearer ${t}` },
    });
    setApps(res.data);
  };

  const login = async () => {
    const res = await axios.post('/api/auth/login', credentials);
    const t = res.data.token;
    const u = res.data.username;
    localStorage.setItem('token', t);
    localStorage.setItem('username', u);
    setToken(t);
    setUsername(u);
    fetchApps(t);
  };

  const createApp = async () => {
    const payload = { ...newApp, tags: newApp.tags.split(',').map(t => t.trim()) };
    await axios.post('/api/apps', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNewApp({ title: '', code: '', isPublic: false, tags: '', language: 'html' });
    fetchApps(token);
  };

  const updateApp = async (id: string, updatedCode: string, isPublic: boolean, tags: string, language: string) => {
    await axios.put(`/api/apps?id=${id}`, { code: updatedCode, isPublic, tags: tags.split(',').map(t => t.trim()), language }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchApps(token);
  };

  const getPreviewHtml = (code: string, lang: string) => {
    if (lang === 'html') return code;
    if (lang === 'python') {
      return `
        <script src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"></script>
        <pre id="output" style="background:#f9f9f9;padding:1em;border-radius:8px;border:1px solid #ccc;white-space:pre-wrap;"></pre>
        <script>
          (function() {
            async function main() {
              const pyodide = await loadPyodide();
              let output = '';
              const originalConsole = console.log;
              console.log = function(...args) {
                output += args.join(' ') + '\n';
                document.getElementById('output').textContent = output;
              };
              try {
                await pyodide.runPythonAsync(${JSON.stringify(code)});
              } catch (e) {
                document.getElementById('output').textContent = 'Python Error: ' + e.message;
              }
              console.log = originalConsole;
            }
            main();
          })();
        </script>
      `;}
      if (lang === 'lua') {
        const encodedLua = btoa(unescape(encodeURIComponent(code)));
        return `
          <script src="https://unpkg.com/fengari-web/dist/fengari-web.js"></script>
          <pre id="output" style="background:#f9f9f9;padding:1em;border-radius:8px;border:1px solid #ccc;white-space:pre-wrap;"></pre>
          <script>
            (function() {
              try {
                const luaPrelude = \`
                  local js = require "js"
                  local document = js.global.document
                  function print(...)
                    local args = {...}
                    local out = ''
                    for i=1, #args do
                      out = out .. tostring(args[i]) .. ' '
                    end
                    local outputElem = document:getElementById('output')
                    outputElem.textContent = (outputElem.textContent or '') .. out .. '\\\\n'
                  end
                \`;
                const base64Code = "${encodedLua}";
                const decodedLua = decodeURIComponent(escape(window.atob(base64Code)));
                const fullLuaCode = luaPrelude + '\\n' + decodedLua;
                fengari.load(fullLuaCode)(); 
              } catch (e) {
                const output = document.getElementById('output');
                if (output) output.textContent = 'Lua Error: ' + e.message;
              }
            })();
          </script>
        `;
      }
      return '<pre style="background:#ffe;padding:1em">Unsupported language</pre>';
    };
  

  if (!token) {
    return (
      <div className="layout">
        <aside className="sidebar">
          <nav>
            <a href="#">Login</a>
          </nav>
        </aside>
        <main className="mainContent">
          <div className={styles.loginBox}>
            <h1 className={styles.heading}>Login</h1>
            <input className={styles.input} placeholder="Username" onChange={e => setCredentials({ ...credentials, username: e.target.value })} />
            <input className={styles.input} type="password" placeholder="Password" onChange={e => setCredentials({ ...credentials, password: e.target.value })} />
            <button onClick={login} className={styles.button}>Login</button>
          </div>
        </main>
      </div>
    );
  }

  const filteredApps = apps
    .filter((app: any) => {
      if (filter === 'mine') return app.user === username;
      if (filter === 'public') return app.isPublic;
      return true;
    })
    .filter(app => app.title.toLowerCase().includes(search.toLowerCase()) || app.tags?.join(',').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortKey]?.toLowerCase?.() || '';
      const bVal = b[sortKey]?.toLowerCase?.() || '';
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="layout">
      <aside className="sidebar">
        <nav>
          <a href="#">Dashboard</a>
          <a href="#">My Apps</a>
          <a href="#">Create App</a>
          <a href="#">Logout</a>
        </nav>
      </aside>
      <main className="mainContent">
        <h1 className={styles.heading}>Welcome, {username}</h1>

        <div className={styles.card}>
          <h2>Create New App</h2>
          <input className={styles.input} placeholder="Title" value={newApp.title} onChange={e => setNewApp({ ...newApp, title: e.target.value })} />
          <select className={styles.input} value={newApp.language} onChange={e => setNewApp({ ...newApp, language: e.target.value })}>
            <option value="html">HTML</option>
            <option value="python">Python</option>
            <option value="lua">Lua</option>
          </select>
          <CodeEditor code={newApp.code} language={newApp.language} onChange={code => setNewApp({ ...newApp, code })} />
          <input className={styles.input} placeholder="Tags (comma separated)" value={newApp.tags} onChange={e => setNewApp({ ...newApp, tags: e.target.value })} />
          <label>
            <input type="checkbox" checked={newApp.isPublic} onChange={e => setNewApp({ ...newApp, isPublic: e.target.checked })} /> Public
          </label>
          <button className={styles.button} onClick={createApp}>Create App</button>
        </div>

        {filteredApps.map((app: any) => (
          <div key={app.id} className={styles.card}>
            <h3>{app.title}</h3>
            <CodeEditor code={app.code} language={app.language} onChange={(code) => updateApp(app.id, code, app.isPublic, app.tags.join(','), app.language)} />
            <button className={styles.button} onClick={() => setActivePreview(activePreview === app.id ? null : app.id)}>
              {activePreview === app.id ? 'Hide Preview' : 'Show Preview'}
            </button>
            {activePreview === app.id && (
             <iframe
             srcDoc={getPreviewHtml(app.code, app.language)}
             style={{ width: '100%', height: '400px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#1a1a1a' }}
             sandbox="allow-scripts"
             title="Mini App Preview"
           />
           
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
