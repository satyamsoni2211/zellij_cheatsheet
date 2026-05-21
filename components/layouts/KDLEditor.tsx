'use client'

import { useEffect, useRef, useState } from 'react'
import { EditorState, Extension } from '@codemirror/state'
import {
  EditorView,
  lineNumbers,
  highlightActiveLine,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLineGutter,
  keymap,
} from '@codemirror/view'
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from '@codemirror/language'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { javascript } from '@codemirror/lang-javascript'

interface KDLEditorProps {
  initialValue?: string
  onChange?: (value: string) => void
  readOnly?: boolean
}

// KDL syntax highlighting - simple tokenizer for config format
const kdlHighlighting = syntaxHighlighting(defaultHighlightStyle)

const kdlLanguage = javascript({ jsx: false, typescript: false })

function createEditorExtensions(readOnly: boolean): Extension {
  return [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    kdlLanguage,
    kdlHighlighting,
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      indentWithTab,
    ]),
    EditorView.editable.of(!readOnly),
    EditorView.theme({
      '&': {
        height: '100%',
        fontSize: '14px',
      },
      '.cm-scroller': {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        lineHeight: '1.6',
      },
      '.cm-content': {
        padding: '12px 0',
      },
      '.cm-gutters': {
        backgroundColor: 'var(--surface-secondary)',
        color: 'var(--text-muted)',
        border: 'none',
        paddingRight: '8px',
      },
      '.cm-activeLineGutter': {
        backgroundColor: 'var(--surface)',
      },
      '.cm-activeLine': {
        backgroundColor: 'var(--surface)',
      },
      '.cm-selectionMatch': {
        backgroundColor: 'var(--primary-alpha-20)',
      },
      '&.cm-focused .cm-cursor': {
        borderLeftColor: 'var(--text-primary)',
      },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
        backgroundColor: 'var(--primary-alpha-20)',
      },
    }),
  ]
}

export function KDLEditor({ initialValue = '', onChange, readOnly = false }: KDLEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!editorRef.current) return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && onChange) {
        const newValue = update.state.doc.toString()
        onChange(newValue)
      }
    })

    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        createEditorExtensions(readOnly),
        updateListener,
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view
    setIsInitialized(true)

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update content when initialValue changes externally
  useEffect(() => {
    if (viewRef.current && isInitialized) {
      const currentValue = viewRef.current.state.doc.toString()
      if (currentValue !== initialValue) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: initialValue,
          },
        })
      }
    }
  }, [initialValue, isInitialized])

  return (
    <div className="relative flex h-full min-h-[300px] rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <div ref={editorRef} className="w-full h-full" />
    </div>
  )
}

// Lazy-loaded version using next/dynamic
export const LazyKDLEditor = () => {
  const [showEditor, setShowEditor] = useState(false)

  return (
    <div
      className="h-64"
      onMouseEnter={() => setShowEditor(true)}
      onFocus={() => setShowEditor(true)}
    >
      {showEditor ? (
        <KDLEditor />
      ) : (
        <div className="flex items-center justify-center h-full rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <p className="text-[var(--text-muted)] text-sm">Hover to load editor...</p>
        </div>
      )}
    </div>
  )
}