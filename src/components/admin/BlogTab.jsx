import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, X, Check, AlertTriangle, FileText,
  Bold, Italic, Heading1, Heading2, List, ListOrdered, Link, Minus,
} from 'lucide-react';
import { getAllBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '@/data/blogStore';
import { toast } from '@/components/ui/use-toast';

const CATEGORIES = ['Immobilien', 'Architektur', 'Unternehmen', 'Allgemein'];

const EMPTY = {
  title: '',
  slug: '',
  category: 'Allgemein',
  excerpt: '',
  content: '',
  title_it: '',
  excerpt_it: '',
  content_it: '',
  cover_image: '',
  published: false,
  author: 'Hans Amonn AG',
  published_at: new Date().toISOString().slice(0, 10),
};

// ── Markdown → HTML converter ───────────────────────────────────────────────
function markdownToHtml(text) {
  if (!text) return '';

  const lines = text.split('\n');
  const output = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      output.push('<hr style="border:none;border-top:1px solid #e5e7eb;margin:1.25rem 0;" />');
      i++;
      continue;
    }

    // Headings
    if (/^### /.test(line)) {
      output.push(`<h3 style="font-size:1rem;font-weight:700;margin:1.1rem 0 0.3rem;">${inlineMarkdown(line.slice(4))}</h3>`);
      i++;
      continue;
    }
    if (/^## /.test(line)) {
      output.push(`<h2 style="font-size:1.125rem;font-weight:700;margin:1.25rem 0 0.4rem;">${inlineMarkdown(line.slice(3))}</h2>`);
      i++;
      continue;
    }
    if (/^# /.test(line)) {
      output.push(`<h1 style="font-size:1.375rem;font-weight:800;margin:1.4rem 0 0.5rem;">${inlineMarkdown(line.slice(2))}</h1>`);
      i++;
      continue;
    }

    // Unordered list — collect consecutive list items
    if (/^[-*] /.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(`<li style="margin:0.2rem 0;">${inlineMarkdown(lines[i].slice(2))}</li>`);
        i++;
      }
      output.push(`<ul style="margin:0.75rem 0;padding-left:1.5rem;list-style:disc;">${items.join('')}</ul>`);
      continue;
    }

    // Ordered list — collect consecutive numbered items
    if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        const content = lines[i].replace(/^\d+\. /, '');
        items.push(`<li style="margin:0.2rem 0;">${inlineMarkdown(content)}</li>`);
        i++;
      }
      output.push(`<ol style="margin:0.75rem 0;padding-left:1.5rem;list-style:decimal;">${items.join('')}</ol>`);
      continue;
    }

    // Paragraph — collect until blank line or block element
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,3} /.test(lines[i]) &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      const paraHtml = paraLines.map(inlineMarkdown).join('<br />');
      output.push(`<p style="margin:0.6rem 0;line-height:1.7;">${paraHtml}</p>`);
    }
  }

  return output.join('\n');
}

function inlineMarkdown(text) {
  return text
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic (avoid matching leftover single * from lists)
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#1d4ed8;text-decoration:underline;">$1</a>');
}

// ── ToolbarButton ────────────────────────────────────────────────────────────
function ToolbarButton({ onClick, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        border: '1px solid #e5e7eb',
        borderRadius: 4,
        background: '#fff',
        color: '#374151',
        cursor: 'pointer',
        padding: 0,
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
    >
      {children}
    </button>
  );
}

// ── MarkdownEditor ────────────────────────────────────────────────────────────
function MarkdownEditor({ value, onChange, rows = 10, placeholder = '' }) {
  const [tab, setTab] = useState('edit'); // 'edit' | 'preview'
  const textareaRef = useRef(null);

  // Insert markdown syntax around/at cursor
  function insert(before, after = '') {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const newValue =
      value.slice(0, start) +
      before +
      selected +
      after +
      value.slice(end);
    onChange(newValue);
    // Restore cursor after React re-render
    requestAnimationFrame(() => {
      ta.focus();
      if (selected.length > 0) {
        ta.setSelectionRange(start + before.length, start + before.length + selected.length);
      } else {
        ta.setSelectionRange(start + before.length, start + before.length);
      }
    });
  }

  // Insert at the beginning of the current line
  function insertLinePrefix(prefix) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newValue = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(newValue);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  }

  function insertBlock(text) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    // Add newlines around block elements if needed
    const before = start > 0 && value[start - 1] !== '\n' ? '\n' : '';
    const newValue = value.slice(0, start) + before + text + '\n' + value.slice(start);
    onChange(newValue);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + before.length + text.length + 1;
      ta.setSelectionRange(pos, pos);
    });
  }

  const tabBtnStyle = (active) => ({
    padding: '4px 14px',
    fontSize: '0.75rem',
    fontWeight: 600,
    border: '1px solid #e5e7eb',
    borderBottom: active ? '1px solid #fff' : '1px solid #e5e7eb',
    borderRadius: '4px 4px 0 0',
    background: active ? '#fff' : '#f9fafb',
    color: active ? '#111827' : '#6b7280',
    cursor: 'pointer',
    marginBottom: -1,
    position: 'relative',
    zIndex: active ? 2 : 1,
  });

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, overflow: 'hidden' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', alignItems: 'flex-end', padding: '6px 8px 0', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', gap: 4 }}>
        <button type="button" style={tabBtnStyle(tab === 'edit')} onClick={() => setTab('edit')}>
          Bearbeiten
        </button>
        <button type="button" style={tabBtnStyle(tab === 'preview')} onClick={() => setTab('preview')}>
          Vorschau
        </button>
      </div>

      {/* Toolbar — only shown in edit mode */}
      {tab === 'edit' && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          padding: '6px 8px',
          background: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <ToolbarButton title="Fett (Bold)" onClick={() => insert('**', '**')}>
            <Bold size={13} />
          </ToolbarButton>
          <ToolbarButton title="Kursiv (Italic)" onClick={() => insert('*', '*')}>
            <Italic size={13} />
          </ToolbarButton>

          {/* Divider */}
          <div style={{ width: 1, background: '#e5e7eb', margin: '2px 2px' }} />

          <ToolbarButton title="Überschrift 1" onClick={() => insertLinePrefix('# ')}>
            <span style={{ fontSize: 11, fontWeight: 800, lineHeight: 1 }}>H1</span>
          </ToolbarButton>
          <ToolbarButton title="Überschrift 2" onClick={() => insertLinePrefix('## ')}>
            <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1 }}>H2</span>
          </ToolbarButton>
          <ToolbarButton title="Überschrift 3" onClick={() => insertLinePrefix('### ')}>
            <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1 }}>H3</span>
          </ToolbarButton>

          <div style={{ width: 1, background: '#e5e7eb', margin: '2px 2px' }} />

          <ToolbarButton title="Aufzählungsliste" onClick={() => insertLinePrefix('- ')}>
            <List size={13} />
          </ToolbarButton>
          <ToolbarButton title="Nummerierte Liste" onClick={() => insertLinePrefix('1. ')}>
            <ListOrdered size={13} />
          </ToolbarButton>

          <div style={{ width: 1, background: '#e5e7eb', margin: '2px 2px' }} />

          <ToolbarButton
            title="Link einfügen"
            onClick={() => {
              const ta = textareaRef.current;
              const selected = ta ? value.slice(ta.selectionStart, ta.selectionEnd) : '';
              insert(`[${selected || 'Linktext'}](`, ')');
            }}
          >
            <Link size={13} />
          </ToolbarButton>
          <ToolbarButton title="Horizontale Linie" onClick={() => insertBlock('---')}>
            <Minus size={13} />
          </ToolbarButton>
        </div>
      )}

      {/* Edit pane */}
      {tab === 'edit' && (
        <textarea
          ref={textareaRef}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px 12px',
            fontSize: '0.8125rem',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            lineHeight: 1.6,
            border: 'none',
            outline: 'none',
            resize: 'vertical',
            background: '#fff',
            color: '#111827',
            boxSizing: 'border-box',
            minHeight: rows * 22,
          }}
        />
      )}

      {/* Preview pane */}
      {tab === 'preview' && (
        <div
          style={{
            minHeight: rows * 22,
            padding: '12px 16px',
            background: '#fff',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            color: '#1f2937',
            overflowY: 'auto',
          }}
          dangerouslySetInnerHTML={{ __html: value.trim() ? markdownToHtml(value) : '<span style="color:#9ca3af;font-style:italic;">Noch kein Inhalt zum Vorschauen…</span>' }}
        />
      )}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// ── BlogTab ───────────────────────────────────────────────────────────────────
export default function BlogTab() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [contentLang, setContentLang] = useState('de');

  const cls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900';

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllBlogPosts();
      setPosts(data);
    } catch {
      toast({ title: 'Fehler beim Laden', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function openCreate() {
    setForm(EMPTY);
    setEditingId(null);
    setContentLang('de');
    setDrawerOpen(true);
  }

  function openEdit(p) {
    setForm({
      title: p.title ?? '',
      slug: p.slug ?? '',
      category: p.category ?? 'Allgemein',
      excerpt: p.excerpt ?? '',
      content: p.content ?? '',
      title_it: p.title_it ?? '',
      excerpt_it: p.excerpt_it ?? '',
      content_it: p.content_it ?? '',
      cover_image: p.cover_image ?? '',
      published: p.published ?? false,
      author: p.author ?? 'Hans Amonn AG',
      published_at: p.published_at ? p.published_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
    });
    setEditingId(p.id);
    setDrawerOpen(true);
  }

  function handleTitleChange(e) {
    const title = e.target.value;
    setForm((f) => ({
      ...f,
      title,
      ...(editingId ? {} : { slug: slugify(title) }),
    }));
  }

  async function save() {
    if (!form.title.trim()) {
      toast({ title: 'Titel ist erforderlich', variant: 'destructive' });
      return;
    }
    if (!form.slug.trim()) {
      toast({ title: 'Slug ist erforderlich', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        published_at: form.published_at ? new Date(form.published_at).toISOString() : new Date().toISOString(),
      };
      if (editingId) {
        await updateBlogPost(editingId, payload);
        toast({ title: '✓ Gespeichert', description: `${form.title} aktualisiert.` });
      } else {
        await createBlogPost(payload);
        toast({ title: '✓ Erstellt', description: `${form.title} hinzugefügt.` });
      }
      setDrawerOpen(false);
      await reload();
    } catch (err) {
      toast({ title: 'Fehler beim Speichern', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    const p = posts.find((x) => x.id === deleteConfirm);
    try {
      await deleteBlogPost(deleteConfirm);
      toast({ title: '✓ Gelöscht', description: `${p?.title ?? ''} entfernt.` });
      setDeleteConfirm(null);
      await reload();
    } catch (err) {
      toast({ title: 'Fehler beim Löschen', description: err.message, variant: 'destructive' });
    }
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Neuigkeiten</h2>
          <p className="text-sm text-gray-500">
            {posts.filter((p) => p.published).length} veröffentlicht · {posts.filter((p) => !p.published).length} Entwürfe
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          <Plus size={16} /> Neuer Beitrag
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Titel</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Kategorie</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Datum</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400 text-sm">
                  Laden…
                </td>
              </tr>
            )}
            {!loading && posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  Noch keine Beiträge vorhanden
                </td>
              </tr>
            )}
            {!loading && posts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {p.cover_image
                        ? <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" loading="lazy" decoding="async" onError={(e) => { e.target.style.display = 'none'; }} />
                        : <FileText size={16} className="text-gray-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{p.title}</p>
                      <p className="text-xs text-gray-400 font-mono">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.category}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    p.published ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {p.published ? <><Eye size={11} /> Aktiv</> : <><EyeOff size={11} /> Entwurf</>}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{formatDate(p.published_at)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Bearbeiten"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(p.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Löschen"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Slide-over Drawer ──────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="w-full max-w-lg bg-white flex flex-col" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="font-bold text-gray-900">
                {editingId ? 'Beitrag bearbeiten' : 'Neuer Beitrag'}
              </h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {/* Titel */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Titel *</label>
                <input
                  value={form.title}
                  onChange={handleTitleChange}
                  className={cls}
                  placeholder="Titel des Beitrags"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Slug *</label>
                <input
                  value={form.slug}
                  onChange={(e) => set('slug', e.target.value)}
                  className={cls + ' font-mono'}
                  placeholder="url-freundlicher-slug"
                />
                <p className="text-xs text-gray-400 mt-1">Wird in der URL verwendet: /neuigkeiten/<span className="font-mono">{form.slug || '…'}</span></p>
              </div>

              {/* Kategorie + Datum */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kategorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
                    className={cls}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Datum</label>
                  <input
                    type="date"
                    value={form.published_at}
                    onChange={(e) => set('published_at', e.target.value)}
                    className={cls}
                  />
                </div>
              </div>

              {/* Autor */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Autor</label>
                <input
                  value={form.author}
                  onChange={(e) => set('author', e.target.value)}
                  className={cls}
                />
              </div>

              {/* Language toggle */}
              <div>
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">Sprache</span>
                  {['de', 'it'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setContentLang(lang)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                        contentLang === lang
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                {contentLang === 'de' ? (
                  <>
                    {/* Kurzbeschreibung DE */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Kurzbeschreibung (DE)
                      </label>
                      <textarea
                        rows={3}
                        value={form.excerpt}
                        onChange={(e) => set('excerpt', e.target.value)}
                        className={cls + ' resize-none'}
                        placeholder="Kurze Zusammenfassung…"
                      />
                    </div>
                    {/* Inhalt DE — Markdown Editor */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Inhalt (DE)
                      </label>
                      <MarkdownEditor
                        value={form.content}
                        onChange={(val) => set('content', val)}
                        rows={10}
                        placeholder="# Überschrift&#10;&#10;Inhalt des Beitrags…"
                      />
                      <p className="text-xs text-gray-400 mt-1">Markdown wird unterstützt: **fett**, *kursiv*, # Überschrift, - Liste</p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Titel IT */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Titolo (IT)
                      </label>
                      <input
                        value={form.title_it}
                        onChange={(e) => set('title_it', e.target.value)}
                        className={cls}
                        placeholder="Titolo italiano…"
                      />
                    </div>
                    {/* Kurzbeschreibung IT */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Estratto (IT)
                      </label>
                      <textarea
                        rows={3}
                        value={form.excerpt_it}
                        onChange={(e) => set('excerpt_it', e.target.value)}
                        className={cls + ' resize-none'}
                        placeholder="Breve descrizione…"
                      />
                    </div>
                    {/* Inhalt IT — Markdown Editor */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Contenuto (IT)
                      </label>
                      <MarkdownEditor
                        value={form.content_it}
                        onChange={(val) => set('content_it', val)}
                        rows={10}
                        placeholder="# Titolo&#10;&#10;Contenuto…"
                      />
                      <p className="text-xs text-gray-400 mt-1">Markdown supportato: **grassetto**, *corsivo*, # Titolo, - Lista</p>
                    </div>
                  </>
                )}
              </div>

              {/* Cover-Bild URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cover-Bild URL</label>
                <input
                  type="url"
                  value={form.cover_image}
                  onChange={(e) => set('cover_image', e.target.value)}
                  className={cls}
                  placeholder="https://..."
                />
                {form.cover_image && (
                  <div className="mt-2 w-full h-28 rounded-lg overflow-hidden bg-gray-100">
                    <img src={form.cover_image} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                )}
              </div>

              {/* Veröffentlicht toggle */}
              <label className="flex items-center gap-3 cursor-pointer py-1">
                <div
                  onClick={() => set('published', !form.published)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.published ? 'bg-gray-900' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {form.published ? 'Veröffentlicht' : 'Entwurf'}
                </span>
              </label>
            </div>

            {/* Drawer footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3 flex-shrink-0">
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-60"
              >
                <Check size={16} /> {saving ? 'Speichern…' : 'Speichern'}
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation ────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
            <div className="flex items-start gap-3 mb-5">
              <AlertTriangle size={22} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Beitrag löschen?</h3>
                <p className="text-sm text-gray-500">Diese Aktion kann nicht rückgängig gemacht werden.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={doDelete}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Ja, löschen
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
