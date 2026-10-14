import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUp, Check, ChevronDown, Clock3, Command,
  Copy, FileText, Heart, History, LayoutDashboard, Menu, MessageSquareText,
  MoreHorizontal, Plus, Search, Send, Sparkles, Stars, Trash2, WandSparkles,
  X, Zap,
} from "lucide-react";
import { categories, createDemoResponse, templates } from "./data";

const starterPrompt = "Help me brainstorm a creative idea for my next project...";
const readStore = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [activeNav, setActiveNav] = useState("Workspace");
  const [category, setCategory] = useState("All prompts");
  const [prompt, setPrompt] = useState("");
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState(() => readStore("pp-history", []));
  const [favorites, setFavorites] = useState(() => readStore("pp-favorites", []));
  const [current, setCurrent] = useState(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => localStorage.setItem("pp-history", JSON.stringify(history)), [history]);
  useEffect(() => localStorage.setItem("pp-favorites", JSON.stringify(favorites)), [favorites]);

  const visibleTemplates = useMemo(() => templates.filter((item) => {
    const matchesCategory = category === "All prompts" || item.category === category;
    const term = search.toLowerCase().trim();
    const matchesSearch = !term || `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  }), [category, search]);

  const runPrompt = (value = prompt) => {
    const clean = value.trim();
    if (!clean || busy) return;
    setBusy(true);
    setPrompt(clean);
    window.setTimeout(() => {
      const entry = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        prompt: clean,
        response: createDemoResponse(clean),
        createdAt: new Date().toISOString(),
      };
      setCurrent(entry);
      setHistory((old) => [entry, ...old].slice(0, 40));
      setBusy(false);
      setActiveNav("Workspace");
    }, 650);
  };

  const loadTemplate = (item) => {
    setPrompt(item.prompt);
    setActiveNav("Workspace");
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const toggleFavorite = (entry) => {
    setFavorites((old) => old.some((item) => item.id === entry.id)
      ? old.filter((item) => item.id !== entry.id)
      : [entry, ...old]);
  };

  const copyText = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
      window.prompt("Copy your text:", value);
    }
  };

  const openHistory = (entry) => {
    setCurrent(entry);
    setPrompt(entry.prompt);
    setActiveNav("Workspace");
  };

  const navItems = [
    { label: "Workspace", icon: LayoutDashboard },
    { label: "Prompt library", icon: WandSparkles },
    { label: "History", icon: History, count: history.length },
    { label: "Favorites", icon: Heart, count: favorites.length },
  ];

  const shownEntries = activeNav === "Favorites" ? favorites : history;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark"><Sparkles size={21} /></div>
          <div className="brand-name">promptpilot<span>.ai</span></div>
          <button className="icon-btn sidebar-close" aria-label="Close menu" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>

        <button className="workspace-switch">
          <div className="workspace-avatar">P</div>
          <div className="workspace-label"><strong>Personal workspace</strong><span>Free plan</span></div>
          <ChevronDown size={15} className="muted-icon" />
        </button>

        <div className="side-label">WORKSPACE</div>
        <nav className="side-nav">
          {navItems.map(({ label, icon: Icon, count }) => (
            <button key={label} onClick={() => { setActiveNav(label); setMobileOpen(false); }} className={`nav-item ${activeNav === label ? "active" : ""}`}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
              {typeof count === "number" && count > 0 && <span className="nav-count">{count}</span>}
            </button>
          ))}
        </nav>

        <div className="side-label library-label">YOUR LIBRARY <button aria-label="Add prompt" onClick={() => { setActiveNav("Prompt library"); setCategory("All prompts"); }}><Plus size={15} /></button></div>
        <div className="mini-library">
          {templates.slice(0, 3).map(({ id, title, icon: Icon, color }) => (
            <button key={id} onClick={() => loadTemplate(templates.find((item) => item.id === id))} className="mini-item">
              <span className={`mini-icon ${color}`}><Icon size={14} /></span><span>{title}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-spark"><Stars size={16} /></div>
            <strong>A little more magic?</strong>
            <p>Your next great idea is one prompt away.</p>
            <button onClick={() => { setActiveNav("Prompt library"); setMobileOpen(false); }}>Explore prompts <ArrowRight size={14} /></button>
          </div>
          <div className="profile-row">
            <div className="profile-avatar">Y</div>
            <div className="profile-copy"><strong>Your workspace</strong><span>Local demo mode</span></div>
            <MoreHorizontal size={18} className="muted-icon" />
          </div>
        </div>
      </aside>

      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <button className="icon-btn mobile-menu" aria-label="Open menu" onClick={() => setMobileOpen(true)}><Menu size={19} /></button>
            <span className="breadcrumb-muted">Workspace</span><span className="crumb-slash">/</span><strong>{activeNav}</strong>
          </div>
          <div className="topbar-actions">
            <div className="demo-pill"><span className="status-dot" /> Demo mode</div>
            <button className="topbar-avatar" title="Personal workspace">Y</button>
          </div>
        </header>

        {activeNav === "Workspace" && (
          <div className="page-content">
            {!current ? (
              <>
                <section className="welcome-block">
                  <div className="eyebrow"><span className="eyebrow-line" /> YOUR CREATIVE CO-PILOT</div>
                  <h1>Big ideas start with<br /><span>a little prompt magic.</span></h1>
                  <p className="welcome-subtitle">Your space to think clearer, create faster, and turn<br className="desktop-break" /> “what if?” into “what's next?”</p>
                </section>

                <section className="composer-card">
                  <div className="composer-topline"><span><Sparkles size={15} /> New prompt</span><span className="model-label"><span className="model-dot" /> Demo assistant <ChevronDown size={13} /></span></div>
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onKeyDown={(event) => { if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) runPrompt(); }}
                    placeholder={starterPrompt}
                    rows={4}
                    aria-label="Enter your prompt"
                  />
                  <div className="composer-footer">
                    <div className="composer-hints"><span><Command size={12} /> + Enter to run</span><span className="hint-divider" /><span>{prompt.length} characters</span></div>
                    <button className="generate-btn" onClick={() => runPrompt()} disabled={!prompt.trim() || busy}>
                      {busy ? <><span className="spinner" /> Thinking...</> : <><Sparkles size={15} /> Generate <ArrowUp size={15} /></>}
                    </button>
                  </div>
                </section>

                <section className="suggestions-section">
                  <div className="section-heading"><div><h2>Jump-start your creativity</h2><p>Not sure where to begin? Try a prompt made for you.</p></div><button className="text-link" onClick={() => setActiveNav("Prompt library")}>View all <ArrowRight size={14} /></button></div>
                  <div className="template-grid">
                    {templates.slice(0, 4).map((item) => <TemplateCard key={item.id} item={item} onClick={() => loadTemplate(item)} />)}
                  </div>
                </section>

                <section className="bottom-tip"><div className="tip-icon"><Zap size={17} /></div><div><strong>Pro tip: give your prompt a little context.</strong><p>Include your goal, audience, and desired format for more useful results.</p></div><button aria-label="Use pro tip" onClick={() => { setPrompt("Act as an expert in [field]. My goal is [goal], my audience is [audience], and I want the result formatted as [format]. Please give me a clear, actionable answer."); textareaRef.current?.focus(); }}><ArrowRight size={17} /></button></section>
              </>
            ) : (
              <section className="result-view">
                <button className="back-link" onClick={() => setCurrent(null)}><ArrowDown className="back-arrow" size={15} /> Back to workspace</button>
                <div className="result-title-row"><div><div className="eyebrow"><span className="eyebrow-line" /> YOUR RESULT</div><h1>Your idea, <span>in motion.</span></h1></div><button className={`favorite-btn ${favorites.some((item) => item.id === current.id) ? "is-favorite" : ""}`} onClick={() => toggleFavorite(current)}><Heart size={16} fill={favorites.some((item) => item.id === current.id) ? "currentColor" : "none"} /> {favorites.some((item) => item.id === current.id) ? "Saved" : "Save result"}</button></div>
                <div className="result-prompt"><span className="result-label"><MessageSquareText size={14} /> YOUR PROMPT</span><p>{current.prompt}</p></div>
                <div className="answer-card"><div className="answer-header"><span className="answer-brand"><span className="answer-brand-icon"><Sparkles size={15} /></span> PromptPilot response <span className="local-tag">LOCAL DEMO</span></span><button className="copy-btn" onClick={() => copyText(current.response)}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied!" : "Copy"}</button></div><div className="answer-body"><MarkdownLite text={current.response} /></div><div className="answer-footer"><span><Clock3 size={13} /> Just now</span><span>Generated in demo mode</span></div></div>
                <div className="followup-box"><Sparkles size={17} /><input value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => event.key === "Enter" && runPrompt()} placeholder="Ask a follow-up or refine your prompt..." /><button onClick={() => runPrompt()} disabled={!prompt.trim() || busy} aria-label="Send follow-up"><Send size={16} /></button></div>
                <p className="demo-disclaimer">This is a sample response generated locally in your browser. No AI API is connected.</p>
              </section>
            )}
          </div>
        )}

        {activeNav === "Prompt library" && (
          <div className="page-content library-page">
            <div className="library-heading"><div className="eyebrow"><span className="eyebrow-line" /> THE PROMPT LIBRARY</div><h1>Find your next <span>great idea.</span></h1><p>Thoughtful starting points for whatever you're working on.</p></div>
            <div className="library-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search prompts, topics, or categories..." /><span>{visibleTemplates.length} prompts</span></div>
            <div className="category-tabs">{categories.map(({ name, icon: Icon }) => <button key={name} className={category === name ? "selected" : ""} onClick={() => setCategory(name)}><Icon size={15} />{name}</button>)}</div>
            <div className="template-grid library-grid">{visibleTemplates.map((item) => <TemplateCard key={item.id} item={item} onClick={() => loadTemplate(item)} />)}</div>
            {visibleTemplates.length === 0 && <div className="empty-state"><Search size={26} /><h3>No prompts found</h3><p>Try another search or category.</p><button className="secondary-btn" onClick={() => { setSearch(""); setCategory("All prompts"); }}>Clear filters</button></div>}
          </div>
        )}

        {(activeNav === "History" || activeNav === "Favorites") && (
          <div className="page-content list-page">
            <div className="library-heading"><div className="eyebrow"><span className="eyebrow-line" /> YOUR WORKSPACE</div><h1>{activeNav === "History" ? <>Your ideas, <span>so far.</span></> : <>The ones you <span>love.</span></>}</h1><p>{activeNav === "History" ? "Pick up where you left off. Your recent prompts live here." : "Your saved responses, all in one easy place."}</p></div>
            {shownEntries.length ? <div className="history-list">{shownEntries.map((entry) => <div className="history-card" key={entry.id}><div className="history-card-icon"><FileText size={17} /></div><button className="history-main" onClick={() => openHistory(entry)}><strong>{entry.prompt}</strong><span>{new Date(entry.createdAt).toLocaleString()} · {entry.response.slice(0, 100).replaceAll("#", "")}...</span></button><button className="icon-btn" aria-label="Open response" onClick={() => openHistory(entry)}><ArrowRight size={17} /></button><button className="icon-btn delete-btn" aria-label="Remove item" onClick={() => activeNav === "Favorites" ? setFavorites((old) => old.filter((item) => item.id !== entry.id)) : setHistory((old) => old.filter((item) => item.id !== entry.id))}><Trash2 size={16} /></button></div>)}</div> : <div className="empty-state"><div className="empty-icon">{activeNav === "History" ? <History size={25} /> : <Heart size={25} />}</div><h3>{activeNav === "History" ? "Your story starts here" : "Save something inspiring"}</h3><p>{activeNav === "History" ? "Generate your first response and it will appear here." : "Tap “Save result” on any response to keep it close."}</p><button className="secondary-btn" onClick={() => setActiveNav("Workspace")}>Go to workspace <ArrowRight size={14} /></button></div>}
            {activeNav === "History" && history.length > 0 && <button className="clear-history" onClick={() => { if (window.confirm("Clear all response history?")) setHistory([]); }}><Trash2 size={14} /> Clear history</button>}
          </div>
        )}

        <footer className="app-footer"><span>Made for curious minds <span className="footer-heart">♥</span></span><span><span className="footer-status" /> All work saved locally</span></footer>
      </main>
    </div>
  );
}

function TemplateCard({ item, onClick }) {
  const Icon = item.icon;
  return <button className="template-card" onClick={onClick}><div className="template-card-top"><span className={`template-icon ${item.color}`}><Icon size={18} strokeWidth={1.8} /></span><span className="template-category">{item.category}</span><ArrowUp className="template-arrow" size={16} /></div><h3>{item.title}</h3><p>{item.description}</p><div className="template-card-bottom"><span><Sparkles size={12} /> Use template</span><ArrowRight size={15} /></div></button>;
}

function MarkdownLite({ text }) {
  return <div className="markdown-lite">{text.split("\n").map((line, index) => {
    if (line.startsWith("## ")) return <h2 key={index}>{line.slice(3)}</h2>;
    if (line.startsWith("### ")) return <h3 key={index}>{line.slice(4)}</h3>;
    if (line.startsWith("> ")) return <blockquote key={index}>{line.slice(2)}</blockquote>;
    if (/^\d+\.\s/.test(line)) return <p className="numbered-line" key={index}>{line}</p>;
    if (line.startsWith("- ")) return <p className="bullet-line" key={index}>• {line.slice(2)}</p>;
    if (line.trim() === "") return <div className="markdown-spacer" key={index} />;
    return <p key={index}>{line.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part)}</p>;
  })}</div>;
}

export default App;
