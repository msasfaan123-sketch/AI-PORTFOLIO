import { motion } from "framer-motion";
import { SectionTitle } from "./experience";

const groups = [
  {
    title: "Backend",
    skills: [
      { n: "Python", v: 85 },
      { n: "Java", v: 80 },
      { n: "Flask", v: 82 },
      { n: "Spring Boot", v: 78 },
      { n: "SQL", v: 78 },
    ],
  },
  {
    title: "Frontend & Data",
    skills: [
      { n: "JavaScript", v: 80 },
      { n: "MongoDB", v: 75 },
      { n: "Git / GitHub", v: 52 },
      { n: "Problem Solving", v: 85 },
    ],
  },
  {
    title: "AI & Tools",
    skills: [
      { n: "AI / NLP", v: 75 },
      { n: "API Integration", v: 80 },
      { n: "Debugging", v: 78 },
      { n: "Documentation", v: 75 },
    ],
  },
];

export function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionTitle eyebrow="Arsenal" title="Skills Arsenal" />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {groups.map((g, gi) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: gi * 0.1 }}
            className="glass hud-corners rounded-md p-6 hover:glow-bat-sm transition"
          >
            <div className="flex items-center justify-between border-b border-bat/20 pb-3">
              <h3 className="font-mono text-sm uppercase tracking-widest text-bat">{g.title}</h3>
              <span className="font-mono text-[10px] text-muted-foreground">MODULE.{gi + 1}</span>
            </div>
            <ul className="mt-5 space-y-4">
              {g.skills.map((s, i) => (
                <li key={s.n}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-foreground/90">{s.n}</span>
                    <span className="font-mono text-bat">{s.v}%</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded bg-bat/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.v}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: i * 0.08, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-bat/70 to-bat glow-bat-sm"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
