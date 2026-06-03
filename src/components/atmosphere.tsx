import { useEffect, useRef } from "react";

export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      el.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(245,197,24,0.10), transparent 60%)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return <div ref={ref} className="pointer-events-none fixed inset-0 z-30" />;
}

export function GridBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 scanlines opacity-40" />
      <div className="absolute inset-x-0 top-0 h-px animate-scan bg-gradient-to-r from-transparent via-[var(--bat)] to-transparent opacity-60" />
      {/* Particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-[var(--bat)]"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.15,
            animation: `float-slow ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 5}s infinite`,
            boxShadow: "0 0 8px rgba(245,197,24,0.7)",
          }}
        />
      ))}
      {/* Fog */}
      <div className="absolute -bottom-32 left-0 right-0 h-96 bg-gradient-to-t from-[var(--bat)]/5 to-transparent blur-3xl" />
    </div>
  );
}
