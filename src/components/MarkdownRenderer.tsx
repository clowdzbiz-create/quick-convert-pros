import { Link } from "react-router-dom";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let i = 0;
  let key = 0;

  const parseInline = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    // Handle links, bold, code
    const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[1] && match[2]) {
        // Link
        const href = match[2];
        if (href.startsWith("/")) {
          parts.push(
            <Link key={`i-${key++}`} to={href} className="text-primary hover:underline font-medium">
              {match[1]}
            </Link>
          );
        } else {
          parts.push(
            <a key={`i-${key++}`} href={href} className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
              {match[1]}
            </a>
          );
        }
      } else if (match[3]) {
        parts.push(<strong key={`i-${key++}`}>{match[3]}</strong>);
      } else if (match[4]) {
        parts.push(
          <code key={`i-${key++}`} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            {match[4]}
          </code>
        );
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length > 0 ? parts : [text];
  };

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <pre key={key++} className="bg-foreground/5 border border-border rounded-lg p-4 overflow-x-auto my-4">
          <code className="text-sm font-mono text-foreground">{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // Tables
    if (line.includes("|") && line.trim().startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        const headers = tableLines[0].split("|").filter(Boolean).map((c) => c.trim());
        const rows = tableLines.slice(2).map((r) => r.split("|").filter(Boolean).map((c) => c.trim()));
        elements.push(
          <div key={key++} className="overflow-x-auto my-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {headers.map((h, j) => (
                    <th key={j} className="border border-border bg-muted/50 px-3 py-2 text-left font-semibold text-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, j) => (
                  <tr key={j}>
                    {row.map((cell, k) => (
                      <td key={k} className="border border-border px-3 py-2 text-muted-foreground">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      elements.push(<h3 key={key++} className="text-lg font-bold text-foreground mt-6 mb-2">{parseInline(line.slice(4))}</h3>);
      i++; continue;
    }
    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++} className="text-xl font-bold text-foreground mt-8 mb-3">{parseInline(line.slice(3))}</h2>);
      i++; continue;
    }

    // Unordered list
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className="list-disc pl-6 space-y-1 my-3 text-muted-foreground">
          {items.map((item, j) => (
            <li key={j}>{parseInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={key++} className="list-decimal pl-6 space-y-1 my-3 text-muted-foreground">
          {items.map((item, j) => (
            <li key={j}>{parseInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty lines
    if (line.trim() === "") {
      i++; continue;
    }

    // Paragraphs
    elements.push(<p key={key++} className="text-muted-foreground leading-relaxed my-3">{parseInline(line)}</p>);
    i++;
  }

  return <div>{elements}</div>;
};

export default MarkdownRenderer;
