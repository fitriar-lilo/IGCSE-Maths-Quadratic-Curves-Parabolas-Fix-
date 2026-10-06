import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    katex?: {
      render: (tex: string, element: HTMLElement, options?: Record<string, unknown>) => void;
      renderToString: (tex: string, options?: Record<string, unknown>) => string;
    };
    renderMathInElement?: (element: HTMLElement, options?: Record<string, unknown>) => void;
  }
}

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '' }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean any leading/trailing $ or $$ if passed directly
    let cleanMath = math.trim();
    if (cleanMath.startsWith('$$') && cleanMath.endsWith('$$')) {
      cleanMath = cleanMath.slice(2, -2).trim();
    } else if (cleanMath.startsWith('$') && cleanMath.endsWith('$')) {
      cleanMath = cleanMath.slice(1, -1).trim();
    }

    if (window.katex) {
      try {
        window.katex.render(cleanMath, containerRef.current, {
          displayMode: block,
          throwOnError: false,
        });
      } catch {
        containerRef.current.textContent = cleanMath;
      }
    } else {
      // Fallback if KaTeX CDN is still resolving
      containerRef.current.textContent = cleanMath;
      const interval = setInterval(() => {
        if (window.katex && containerRef.current) {
          try {
            window.katex.render(cleanMath, containerRef.current, {
              displayMode: block,
              throwOnError: false,
            });
            clearInterval(interval);
          } catch {
            clearInterval(interval);
          }
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [math, block]);

  return <span ref={containerRef} className={`inline-block ${className}`} />;
};

/**
 * TextWithMath: Parses a mixed string with inline $...$ or $$...$$ formulas and renders both text and KaTeX
 */
export const TextWithMath: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = text;
    if (window.renderMathInElement) {
      window.renderMathInElement(containerRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
      });
    }
  }, [text]);

  return <div ref={containerRef} className={className} />;
};
