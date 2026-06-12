import { useRef, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';

const TOOLS = [
  { cmd: 'bold',          icon: '<strong>B</strong>', title: 'Bold (Ctrl+B)' },
  { cmd: 'italic',        icon: '<em>I</em>',          title: 'Italic (Ctrl+I)' },
  { cmd: 'underline',     icon: '<u>U</u>',            title: 'Underline (Ctrl+U)' },
  { sep: true },
  { cmd: 'formatBlock',   val: 'h2',  icon: 'H2',      title: 'Heading 2' },
  { cmd: 'formatBlock',   val: 'h3',  icon: 'H3',      title: 'Heading 3' },
  { cmd: 'formatBlock',   val: 'p',   icon: '¶',       title: 'Paragraph' },
  { sep: true },
  { cmd: 'insertUnorderedList', icon: '≡',             title: 'Bullet list' },
  { cmd: 'insertOrderedList',   icon: '1.',             title: 'Numbered list' },
  { sep: true },
  { cmd: 'justifyLeft',   icon: '⇤',  title: 'Align left' },
  { cmd: 'justifyCenter', icon: '↔',  title: 'Align center' },
  { cmd: 'justifyRight',  icon: '⇥',  title: 'Align right' },
  { sep: true },
  { cmd: 'removeFormat',  icon: '✕',  title: 'Clear formatting' },
];

/**
 * Lightweight rich-text editor using contentEditable + execCommand.
 * No external dependencies.
 *
 * Props:
 *   value      string (HTML)
 *   onChange   (html: string) => void
 *   placeholder string
 *   minHeight  string (CSS)
 */
export default function RichTextEditor({
  value       = '',
  onChange,
  placeholder = 'Write product description…',
  minHeight   = '180px',
  label,
  error,
}) {
  const editorRef = useRef(null);
  const isComposing = useRef(false);

  // Sync value → editor (only on external changes)
  useEffect(() => {
    const el = editorRef.current;
    if (el && el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value]);

  const exec = useCallback((cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    handleInput();
  }, []);

  const handleInput = useCallback(() => {
    if (!isComposing.current) {
      onChange?.(editorRef.current?.innerHTML ?? '');
    }
  }, [onChange]);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '  ');
    }
  };

  const isActive = (cmd, val) => {
    try { return document.queryCommandState(cmd); } catch { return false; }
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="input-label">{label}</label>}

      <div className={clsx(
        'border rounded-2xl overflow-hidden transition-all',
        error ? 'border-red-300' : 'border-slate-200 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100'
      )}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 p-2 bg-slate-50 border-b border-slate-200">
          {TOOLS.map((tool, i) =>
            tool.sep ? (
              <span key={i} className="w-px h-5 bg-slate-200 mx-1" />
            ) : (
              <button
                key={tool.cmd + (tool.val ?? '')}
                type="button"
                title={tool.title}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent blur
                  exec(tool.cmd, tool.val ?? null);
                }}
                className={clsx(
                  'min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-medium transition-colors',
                  'hover:bg-blue-100 hover:text-blue-700',
                  isActive(tool.cmd, tool.val)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600'
                )}
                dangerouslySetInnerHTML={{ __html: tool.icon }}
              />
            )
          )}
        </div>

        {/* Editable area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onCompositionStart={() => { isComposing.current = true; }}
          onCompositionEnd={() => { isComposing.current = false; handleInput(); }}
          onKeyDown={handleKeyDown}
          data-placeholder={placeholder}
          className={clsx(
            'outline-none px-4 py-3 text-sm text-slate-700 leading-relaxed',
            'prose prose-sm max-w-none',
            '[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-slate-400'
          )}
          style={{ minHeight }}
        />
      </div>

      {error && <p className="input-error">{error}</p>}
    </div>
  );
}
