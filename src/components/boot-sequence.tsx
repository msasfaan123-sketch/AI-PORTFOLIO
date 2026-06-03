import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BatIcon } from "./bat-icon";

const SEQUENCE = [
  "> Initializing Batcomputer...",
  "> Bypassing Wayne Enterprises firewall...",
  "> Loading neural net modules...",
  "> Identity Verified.",
  "> Welcome Back, Detective.",
];

export function BootSequence({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setLines((p) => [...p, SEQUENCE[i]]);
      i++;
      if (i >= SEQUENCE.length) {
        clearInterval(t);
        setTimeout(() => {
          setDone(true);
          setTimeout(onDone, 400);
        }, 600);
      }
    }, 380);
    return () => clearInterval(t);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="relative w-[min(92vw,640px)]">
            <div className="mb-8 flex items-center justify-center">
              <BatIcon className="h-24 w-24 text-bat text-glow animate-flicker" />
            </div>
            <div className="glass hud-corners rounded-md p-5 font-mono text-sm">
              <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-bat/80">
                <span className="h-2 w-2 rounded-full bg-bat animate-pulse" />
                BATCOMPUTER OS v7.13 — SECURE BOOT
              </div>
              {lines.map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-bat/90"
                >
                  {l}
                </motion.div>
              ))}
              <div className="mt-3 h-1 w-full overflow-hidden bg-bat/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  className="h-full bg-bat glow-bat-sm"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
