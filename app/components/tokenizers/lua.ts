// components/tokenizers/lua.ts
import * as monaco from 'monaco-editor';

export function registerLuaLanguage(monacoInstance: typeof monaco) {
  if (monacoInstance.languages.getLanguages().some(l => l.id === 'lua')) {
    return; // already registered
  }

  monacoInstance.languages.register({ id: 'lua' });

  monacoInstance.languages.setMonarchTokensProvider('lua', {
    tokenizer: {
      root: [
        [/[a-zA-Z_][a-zA-Z0-9_]*/, {
          cases: {
            'function|end|if|then|else|elseif|for|while|repeat|until|return|break|local|and|or|not|in|do': 'keyword',
            '@default': 'identifier',
          }
        }],
        { include: '@whitespace' },
        [/[{}()\[\]]/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],
        [/[0-9]*\.[0-9]+([eE][\-+]?[0-9]+)?/, 'number.float'],
        [/[0-9]+/, 'number'],
        [/".*?"/, 'string'],
        [/'.*?'/, 'string'],
        [/--.*/, 'comment'],
      ],

      whitespace: [
        [/[ \t\r\n]+/, 'white'],
      ],

      operators: [
        '=', '>', '<', '~', ':', '+', '-', '*', '/', '%', '^', '#',
        '==', '~=', '<=', '>=', 'and', 'or', 'not'
      ],

      symbols: /[=><!~?:&|+\-*\/\^%#]+/
    }
  });
}