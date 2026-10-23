export type Language = 'ts' | 'html' | 'css' | 'json' | 'md' | 'text';

// Each rule is [regex source, Tailwind classes]. Inner groups must be non-capturing.
// Tailwind scans this .ts file too, so these class names end up in the generated CSS.
const STRING = String.raw`\x60(?:\\[\s\S]|[^\\\x60])*\x60|'(?:\\.|[^\\'\n])*'|"(?:\\.|[^\\"\n])*"`;
const COMMENT = String.raw`\/\/[^\n]*|\/\*[\s\S]*?\*\/`;
const NUMBER = String.raw`\b\d+(?:\.\d+)?\b`;

const RULES: Record<Language, [string, string][]> = {
  ts: [
    [COMMENT, 'text-slate-500 italic'],
    [STRING, 'text-emerald-300'],
    [String.raw`@\w+`, 'text-amber-300'],
    [
      String.raw`\b(?:import|from|export|const|let|var|class|interface|type|extends|implements|return|if|else|for|of|in|new|this|private|public|protected|readonly|async|await|function|true|false|null|undefined|void|as|typeof|keyof|debugger|throw|try|catch|default|switch|case|break)\b`,
      'text-fuchsia-300',
    ],
    [String.raw`\b[A-Z][A-Za-z0-9_]*\b`, 'text-sky-300'],
    [NUMBER, 'text-orange-300'],
    [String.raw`\b[a-zA-Z_$][\w$]*(?=\s*[(<])`, 'text-blue-300'],
  ],
  html: [
    [String.raw`<!--[\s\S]*?-->`, 'text-slate-500 italic'],
    [String.raw`\{\{[\s\S]*?\}\}`, 'text-amber-200'],
    [String.raw`@(?:if|else if|else|for|empty|switch|case|default)\b`, 'text-fuchsia-300 font-semibold'],
    [String.raw`<\/?[a-zA-Z][\w-]*|\/?>`, 'text-pink-400'],
    [String.raw`[\[(]*[a-zA-Z_*#][\w.\-:]*[\])]*(?==)`, 'text-sky-300'],
    [String.raw`"[^"]*"|'[^']*'`, 'text-emerald-300'],
  ],
  css: [
    [String.raw`\/\*[\s\S]*?\*\/`, 'text-slate-500 italic'],
    [String.raw`"[^"]*"|'[^']*'`, 'text-emerald-300'],
    [String.raw`@[\w-]+`, 'text-fuchsia-300'],
    [String.raw`#[0-9a-fA-F]{3,8}\b`, 'text-orange-300'],
    [String.raw`[\w-]+(?=\s*:\s)`, 'text-sky-300'],
    [String.raw`\.[a-zA-Z][\w-]*`, 'text-amber-300'],
    [String.raw`-?\b\d+(?:\.\d+)?(?:rem|px|em|%|s|ms)?`, 'text-orange-300'],
  ],
  json: [
    [String.raw`"(?:\\.|[^\\"])*"(?=\s*:)`, 'text-sky-300'],
    [String.raw`"(?:\\.|[^\\"])*"`, 'text-emerald-300'],
    [String.raw`\b(?:true|false|null)\b`, 'text-fuchsia-300'],
    [String.raw`-?\b\d+(?:\.\d+)?\b`, 'text-orange-300'],
  ],
  md: [
    [String.raw`^#{1,6} .*$`, 'text-pink-400 font-semibold'],
    [String.raw`\x60\x60\x60[\s\S]*?\x60\x60\x60|\x60[^\x60\n]*\x60`, 'text-emerald-300'],
    [String.raw`\[[^\]\n]+\]\([^)\n]+\)`, 'text-sky-300'],
    [String.raw`^\s*[-*] |\|`, 'text-slate-500'],
  ],
  text: [],
};

export function languageOf(path: string): Language {
  const ext = path.slice(path.lastIndexOf('.') + 1);
  if (ext === 'ts' || ext === 'js') return 'ts';
  if (ext === 'html' || ext === 'css' || ext === 'json' || ext === 'md') return ext;
  return 'text';
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Turns source code into one HTML string per line, with colored <span>s for tokens. */
export function highlight(code: string, lang: Language): string[] {
  const lines = [''];
  const emit = (text: string, cls?: string) => {
    text.split('\n').forEach((part, i) => {
      if (i > 0) lines.push('');
      if (part) lines[lines.length - 1] += cls ? `<span class="${cls}">${escapeHtml(part)}</span>` : escapeHtml(part);
    });
  };

  const rules = RULES[lang];
  if (rules.length === 0) {
    emit(code);
    return lines;
  }

  const pattern = new RegExp(rules.map(([source]) => `(${source})`).join('|'), 'gm');
  let last = 0;
  for (const match of code.matchAll(pattern)) {
    emit(code.slice(last, match.index));
    const rule = match.slice(1).findIndex((group) => group !== undefined);
    emit(match[0], rules[rule][1]);
    last = match.index + match[0].length;
  }
  emit(code.slice(last));
  return lines;
}
