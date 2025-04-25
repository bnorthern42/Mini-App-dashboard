// components/CodeEditor.tsx
'use client';

import { useEffect } from 'react';
import { useMonaco } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import { registerLuaLanguage } from './tokenizers/lua';

interface Props {
  code: string;
  language: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ code, language, onChange }: Props) {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      if (language === 'lua') {
        registerLuaLanguage(monaco);
      }
    }
  }, [monaco, language]);

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 4, marginBottom: '1rem' }}>
      <Editor
        height="200px"
        language={language === 'lua' ? 'lua' : language}
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
    </div>
  );
}