import { motion } from "framer-motion";
import { Trophy, Award, Star, Rocket } from "lucide-react";
import { SectionTitle } from "./experience";

const items = [
  { icon: Trophy, label: "Intra-College Hackathon", value: "1st Prize" },
  { icon: Award, label: "MGR University Hackathon", value: "2nd Prize" },
  { icon: Star, label: "LeetCode Problems Solved", value: "250+" },
  { icon: Rocket, label: "Projects Completed", value: "5" },
];

export function Achievements() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionTitle eyebrow="Records" title="Achievements" />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass hud-corners group flex flex-col items-center rounded-md p-6 text-center hover:glow-bat-sm transition"
          >
            <it.icon className="h-7 w-7 text-bat group-hover:scale-110 transition" />
            <div className="mt-3 text-3xl font-bold text-foreground text-glow">{it.value}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {it.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
