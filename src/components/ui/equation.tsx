import type { CSSProperties } from 'react';

/**
 * Typographic equation with a gold signal passing through the terms (§23.6.1 coda). Uses the shared
 * `.equation` styles; the homepage chapter keeps its own approved markup unchanged.
 */
export function Equation({ terms }: { terms: string[] }) {
  return (
    <div className="equation" data-reveal="">
      <p className="sr-only">{terms.join(' + ')}</p>
      <p className="equation__terms" aria-hidden="true">
        {terms.map((term, i) => (
          <span key={term} className="equation__term" style={{ '--i': i } as CSSProperties}>
            {i > 0 && <span className="equation__plus">+</span>}
            <span>{term}</span>
          </span>
        ))}
      </p>
      <span className="equation__track" aria-hidden="true">
        <span className="equation__signal" />
      </span>
    </div>
  );
}
