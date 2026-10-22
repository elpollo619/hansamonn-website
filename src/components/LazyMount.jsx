import React, { useEffect, useRef, useState } from 'react';

/**
 * Renders its children only once the placeholder comes near the viewport, so heavy widgets
 * (3D viewers with their own WebGL context) do not load for visitors who never scroll there.
 */
export default function LazyMount({ children, placeholder = null, rootMargin = '300px', className = '' }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show || !ref.current) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setShow(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(true); }, { rootMargin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {show ? children : placeholder}
    </div>
  );
}
