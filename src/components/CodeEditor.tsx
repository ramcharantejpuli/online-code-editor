"use client"

import React, { useState, useCallback } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { php } from '@codemirror/lang-php'
import { rust } from '@codemirror/lang-rust'
import { cpp } from '@codemirror/lang-cpp'
import { go } from '@codemirror/lang-go'
import { useTheme } from 'next-themes'
import { 
  FaPython, 
  FaJsSquare, 
  FaPhp, 
  FaRust,
} from 'react-icons/fa'
import { 
  SiTypescript,
  SiCplusplus,
  SiGo,
} from 'react-icons/si'

type Language = {
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  lang: any;
  ext: string;
  defaultCode: string;
}

const LANGUAGES: Language[] = [
  { 
    name: 'Python', 
    icon: FaPython, 
    lang: python(), 
    ext: '.py',
    defaultCode: '# Python Code Editor\n# Write your Python code here\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))'
  },
  { 
    name: 'JavaScript', 
    icon: FaJsSquare, 
    lang: javascript(), 
    ext: '.js',
    defaultCode: '// JavaScript Code Editor\n// Write your JavaScript code here\n\nfunction greet(name) {\n    return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));'
  },
  { 
    name: 'TypeScript', 
    icon: SiTypescript, 
    lang: javascript({ typescript: true }), 
    ext: '.ts',
    defaultCode: '// TypeScript Code Editor\n// Write your TypeScript code here\n\nfunction greet(name: string): string {\n    return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));'
  },
  { 
    name: 'Go', 
    icon: SiGo, 
    lang: go(), 
    ext: '.go',
    defaultCode: '// Go Code Editor\n// Write your Go code here\n\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}'
  },
  { 
    name: 'PHP', 
    icon: FaPhp, 
    lang: php(), 
    ext: '.php',
    defaultCode: '<?php\n// PHP Code Editor\n// Write your PHP code here\n\nfunction greet($name) {\n    return "Hello, " . $name . "!";\n}\n\necho greet("World");\n?>'
  },
  { 
    name: 'Rust', 
    icon: FaRust, 
    lang: rust(), 
    ext: '.rs',
    defaultCode: '// Rust Code Editor\n// Write your Rust code here\n\nfn main() {\n    println!("Hello, World!");\n}'
  },
  { 
    name: 'C++', 
    icon: SiCplusplus, 
    lang: cpp(), 
    ext: '.cpp',
    defaultCode: '// C++ Code Editor\n// Write your C++ code here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}'
  },
]

const simulateCodeExecution = (code: string, language: string) => {
  try {
    let output = '';
    switch (language) {
      case 'Python':
        const printMatches = code.match(/print\((.*?)\)/g);
        if (printMatches) {
          output = printMatches
            .map(match => {
              const content = match.match(/print\((.*?)\)/)?.[1] || '';
              return eval(content);
            })
            .join('\n');
        }
        break;

      case 'JavaScript':
      case 'TypeScript':
        const consoleMatches = code.match(/console\.log\((.*?)\)/g);
        if (consoleMatches) {
          output = consoleMatches
            .map(match => {
              const content = match.match(/console\.log\((.*?)\)/)?.[1] || '';
              return eval(content);
            })
            .join('\n');
        }
        break;

      case 'PHP':
        const echoMatches = code.match(/echo\s+(.*?);/g);
        if (echoMatches) {
          output = echoMatches
            .map(match => {
              const content = match.match(/echo\s+(.*?);/)?.[1] || '';
              return content.replace(/["']/g, '');
            })
            .join('\n');
        }
        break;

      case 'Go':
        const fmtMatches = code.match(/fmt\.Println\((.*?)\)/g);
        if (fmtMatches) {
          output = fmtMatches
            .map(match => {
              const content = match.match(/fmt\.Println\((.*?)\)/)?.[1] || '';
              return content.replace(/["']/g, '');
            })
            .join('\n');
        }
        break;

      case 'Rust':
        const printlnMatches = code.match(/println!\s*\((.*?)\)/g);
        if (printlnMatches) {
          output = printlnMatches
            .map(match => {
              const content = match.match(/println!\s*\((.*?)\)/)?.[1] || '';
              return content.replace(/["']/g, '');
            })
            .join('\n');
        }
        break;

      case 'C++':
        const coutMatches = code.match(/cout\s*<<\s*(.*?)\s*<</g);
        if (coutMatches) {
          output = coutMatches
            .map(match => {
              const content = match.match(/cout\s*<<\s*(.*?)\s*<</)?.[1] || '';
              return content.replace(/["']/g, '');
            })
            .join('\n');
        }
        break;
    }
    return output + '\n=== Code Execution Successful ===';
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
};

const CodeEditor: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(LANGUAGES[0])
  const [code, setCode] = useState(currentLanguage.defaultCode)
  const [output, setOutput] = useState('')
  const { setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    setTheme('dark')
  }, [setTheme])

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang)
    setCode(lang.defaultCode)
  }

  const handleCodeChange = useCallback((value: string) => {
    setCode(value)
  }, [])

  const handleRunCode = () => {
    const result = simulateCodeExecution(code, currentLanguage.name);
    setOutput(result || 'No output');
  }

  const handleClear = () => {
    setOutput('');
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-white">
      {/* Left Sidebar */}
      <div className="w-16 bg-[#2d2d2d] flex flex-col items-center py-4 space-y-4">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.name}
            onClick={() => handleLanguageChange(lang)}
            className={`p-3 rounded-lg transition-colors ${
              currentLanguage.name === lang.name
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#3d3d3d]'
            }`}
            title={lang.name}
          >
            <lang.icon size={24} />
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 bg-[#2d2d2d]">
          <span className="text-gray-300">{currentLanguage.name} - main{currentLanguage.ext}</span>
          <div className="space-x-2">
            <button
              onClick={handleRunCode}
              className="px-6 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Run
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Editor and Output */}
        <div className="flex-1 grid grid-cols-2 gap-1">
          <div className="overflow-auto">
            <CodeMirror
              value={code}
              height="100%"
              theme="dark"
              extensions={[currentLanguage.lang]}
              onChange={handleCodeChange}
              className="text-sm"
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightSpecialChars: true,
                history: true,
                foldGutter: true,
                drawSelection: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
                syntaxHighlighting: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                rectangularSelection: true,
                crosshairCursor: true,
                highlightActiveLine: true,
                highlightSelectionMatches: true,
                closeBracketsKeymap: true,
                defaultKeymap: true,
                searchKeymap: true,
                historyKeymap: true,
                foldKeymap: true,
                completionKeymap: true,
                lintKeymap: true,
              }}
            />
          </div>
          <div className="bg-[#1e1e1e] p-4">
            <h2 className="text-lg font-semibold mb-2">Output</h2>
            <pre className="font-mono text-sm whitespace-pre-wrap">
              {output || 'Run the code to see output'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeEditor
