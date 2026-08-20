import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

export default function Mermaid({ chart }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.render(`mermaid-${Math.random().toString(36).substring(2, 9)}`, chart)
        .then(({ svg }) => {
          ref.current.innerHTML = svg;
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [chart]);

  return <div ref={ref} className="mermaid-container flex justify-center overflow-auto p-4" />;
}
