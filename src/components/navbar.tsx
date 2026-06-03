import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { BatIcon } from "./bat-icon";

const links = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition ${
        scrolled ? "border-b border-bat/15 bg-background/70 backdrop-blur-xl" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <a href="/" className="flex items-center gap-2">
          <BatIcon className="h-7 w-7 text-bat" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-bat">
            M.S. Asfaan
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs uppercase tracking-widest text-foreground/70 hover:text-bat transition"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded bg-bat px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-black hover:opacity-90 glow-bat-sm"
          >
            Hire
          </a>
        </nav>
        <button onClick={() => setOpen((v) => !v)} className="md:hidden text-bat">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-bat/15 bg-background/95 backdrop-blur-xl">
          <div className="flex flex-col px-6 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 font-mono text-xs uppercase tracking-widest text-foreground/80"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
