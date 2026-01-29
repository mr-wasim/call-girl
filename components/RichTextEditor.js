// components/RichTextEditor.js
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import "react-quill/dist/quill.snow.css"

// Dynamic import to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

export default function RichTextEditor({
  value = "",
  onChange = () => {},
  placeholder = "Write rich description...",
  minHeight = 220,
}) {
  const reactQuillRef = useRef(null)    // ReactQuill component ref
  const quillRef = useRef(null)         // actual Quill instance when ready
  const lastSelectionRef = useRef(null) // last valid selection {index, length}
  const [mounted, setMounted] = useState(false)
  const [html, setHtml] = useState(value || "")

  useEffect(() => setMounted(true), [])

  // helper: get Quill instance safely (works across versions)
  function getQuill() {
    const rq = reactQuillRef.current
    if (!rq) return null
    if (typeof rq.getEditor === "function") return rq.getEditor()
    if (rq.editor) return rq.editor
    return null
  }

  // Attach selection-change listener and store quill instance
  useEffect(() => {
    if (!mounted) return
    let cancelled = false

    const attach = () => {
      const q = getQuill()
      if (!q) {
        if (!cancelled) setTimeout(attach, 150)
        return
      }
      quillRef.current = q
      const selHandler = (range) => {
        if (range && typeof range.index === "number") {
          lastSelectionRef.current = { index: range.index, length: range.length || 0 }
        }
      }
      // attach listener (safe guard if .on exists)
      q.on && q.on("selection-change", selHandler)
      return () => {
        try { q.off && q.off("selection-change", selHandler) } catch (e) {}
      }
    }

    const cleanup = attach()
    return () => { cancelled = true; if (typeof cleanup === "function") cleanup() }
  }, [mounted, reactQuillRef.current])

  // Keep local html state in sync with external value
  useEffect(() => {
    if (value !== undefined && value !== html) {
      setHtml(value || "")
      const q = quillRef.current || getQuill()
      try {
        if (q && q.root && q.root.innerHTML !== (value || "")) {
          q.root.innerHTML = value || "<p></p>"
        }
      } catch (e) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // palette
  const COLORS = [
    "#000000","#444444","#666666","#999999","#ffffff",
    "#f44336","#ff9800","#ffc107","#ffeb3b",
    "#4caf50","#009688","#00bcd4",
    "#2196f3","#3f51b5","#9c27b0","#e91e63",
  ]

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: COLORS }, { background: COLORS }],
      ["link", "clean"],
    ],
  }

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "color", "background",
    "link",
  ]

  // Ensure selection exists — restore last if needed
  function ensureSelection() {
    const q = quillRef.current || getQuill()
    if (!q) return null
    try {
      const sel = q.getSelection()
      if (sel && typeof sel.index === "number") return sel
    } catch (e) {}
    const last = lastSelectionRef.current
    if (last && typeof last.index === "number") {
      try {
        q.setSelection(last.index, last.length || 0, "silent")
        return { index: last.index, length: last.length || 0 }
      } catch (e) {
        return null
      }
    }
    return null
  }

  // Apply inline !important style to DOM nodes that correspond to the selection range
  // This runs after quill.formatText so Quill's attributes exist — we then ensure inline style with priority
  function applyImportantStyleToRange(q, sel, cssProp, hex) {
    if (!q || !sel || sel.length === 0) return
    const nodes = new Set()
    const start = sel.index
    const end = sel.index + sel.length - 1
    for (let i = start; i <= end; i++) {
      try {
        const leafInfo = q.getLeaf(i)
        if (!leafInfo) continue
        const leaf = leafInfo[0]
        const dom = leaf && leaf.domNode ? leaf.domNode : null
        if (!dom) continue
        // If text node, pick parent element
        const node = dom.nodeType === 3 ? dom.parentElement : dom
        if (node) nodes.add(node)
      } catch (e) {
        // skip index errors
      }
    }

    // For each node, set style property with priority
    nodes.forEach(node => {
      try {
        node.style.setProperty(cssProp, hex, "important")
      } catch (e) {}
    })
  }

  // apply color reliably
  function applyColor(hex) {
    const q = quillRef.current || getQuill()
    if (!q) return
    const sel = ensureSelection()
    if (!sel) {
      try { q.format("color", hex) } catch (e) {}
      return
    }
    if (sel.length === 0) {
      try { q.format("color", hex) } catch (e) {}
    } else {
      try {
        q.formatText(sel.index, sel.length, "color", hex, "user")
      } catch (e) {
        try { q.format("color", hex) } catch (ee) {}
      }
      // enforce inline !important after a small tick to allow quill to render formatting
      setTimeout(() => applyImportantStyleToRange(q, sel, "color", hex), 10)
    }
    q.focus()
    const updated = q.root?.innerHTML ?? ""
    setHtml(updated); onChange(updated)
  }

  // apply background reliably
  function applyBackground(hex) {
    const q = quillRef.current || getQuill()
    if (!q) return
    const sel = ensureSelection()
    if (!sel) {
      try { q.format("background", hex) } catch (e) {}
      return
    }
    if (sel.length === 0) {
      try { q.format("background", hex) } catch (e) {}
    } else {
      try {
        q.formatText(sel.index, sel.length, "background", hex, "user")
      } catch (e) {
        try { q.format("background", hex) } catch (ee) {}
      }
      setTimeout(() => applyImportantStyleToRange(q, sel, "background", hex), 10)
    }
    q.focus()
    const updated = q.root?.innerHTML ?? ""
    setHtml(updated); onChange(updated)
  }

  return (
    <div className="rich-editor w-full">
      {/* Toolbar: color swatches + pickers */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
       

      
      </div>

      {/* Editor */}
      <div className="border rounded bg-white" style={{ minHeight }}>
        {mounted ? (
          <ReactQuill
            ref={reactQuillRef}
            value={html}
            onChange={(content) => { setHtml(content); onChange(content) }}
            placeholder={placeholder}
            modules={modules}
            formats={formats}
            theme="snow"
            className="bg-white text-gray-900"
            style={{ minHeight }}
          />
        ) : (
          <div className="p-4 text-sm text-gray-500">Editor loading…</div>
        )}
      </div>

      {/* editor visibility CSS - forces readable text/background inside editor */}
      <style jsx global>{`
        .ql-editor {
          color: #111827 !important;
          background-color: #ffffff !important;
          min-height: ${minHeight}px !important;
        }
        .ql-editor p,
        .ql-editor span,
        .ql-editor li,
        .ql-editor h1,
        .ql-editor h2,
        .ql-editor h3 {
          color: inherit !important;
        }
        .ql-container { background: #ffffff !important; }
        .ql-toolbar { background: #f9fafb !important; }
        .ql-editor.ql-blank::before { color: #9ca3af !important; left: 0.5rem; }
      `}</style>
    </div>
  )
}
