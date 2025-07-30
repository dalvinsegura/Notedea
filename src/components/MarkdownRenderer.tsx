"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ 
  content, 
  className = "" 
}: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Personalizar elementos HTML
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-5 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4 first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 text-gray-700 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 text-gray-700 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-300 pl-4 py-2 my-3 bg-blue-50 text-gray-700 italic">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-3">
              {children}
            </pre>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border border-gray-300">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-3 py-2 text-gray-700">
              {children}
            </td>
          ),
          hr: () => (
            <hr className="border-gray-300 my-6" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
