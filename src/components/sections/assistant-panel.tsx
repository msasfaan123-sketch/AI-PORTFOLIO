import { motion } from "framer-motion";
import { Bot, Sparkles, Activity } from "lucide-react";
import { SectionTitle } from "./experience";
import { BatIcon } from "../bat-icon";

export function AssistantPanel() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionTitle eyebrow="Neural Core" title="AI Assistant Panel" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 grid gap-6 lg:grid-cols-3"
      >
        <div className="glass hud-corners rounded-md p-6 lg:col-span-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-batcomputer"))}
            className="flex w-full cursor-pointer items-center justify-between border-b border-bat/20 pb-3 text-left outline-none transition hover:bg-bat/5 focus-visible:ring-2 focus-visible:ring-bat"
            aria-label="Open Batcomputer chat"
          >
            <div className="flex items-center gap-2">
              <BatIcon className="h-7 w-7 text-bat" />
              <span className="font-mono text-sm uppercase tracking-widest text-bat">
                Batcomputer · Neural Console
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400">● ONLINE</span>
          </button>
          <div className="mt-4 space-y-2 font-mono text-sm">
            <Line>{"> ai.session --user='detective' --secure"}</Line>
            <Line delay={0.4}>{"// Routing query through Wayne Tower mainframe..."}</Line>
            <Line delay={0.8}>{"// 42 vector embeddings indexed across 3 corpora"}</Line>
            <Line delay={1.2} highlight>
              {"> Ready. Ask me about Mohamed's projects, skills, or experience."}
            </Line>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Show stack", "Explain VConnect", "Best contact method"].map((q) => (
              <button
                key={q}
                className="rounded border border-bat/30 px-3 py-1.5 font-mono text-[11px] text-bat/90 hover:bg-bat hover:text-black transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {[
            { icon: Bot, label: "Model", value: "Wayne-LLM v3" },
            { icon: Activity, label: "Latency", value: "84ms" },
            { icon: Sparkles, label: "Tokens / s", value: "248" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-md p-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded bg-bat/10 text-bat">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </div>
                <div className="text-lg font-bold text-foreground">{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Line({
  children,
  delay = 0,
  highlight,
}: {
  children: React.ReactNode;
  delay?: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={highlight ? "text-bat text-glow" : "text-foreground/80"}
    >
      {children}
    </motion.div>
  );
}
