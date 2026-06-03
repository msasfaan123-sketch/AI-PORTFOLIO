import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

const items = [
  {
    role: "Software And Data Intern",
    org: "Smaart Healthcare",
    period: "Aug 2025 — Nov2025",
    desc: "Developed AI Appointment Booking System and AI Nurse Triage Assistant. Gained hands-on experience with REST APIs, database design, and AI/NLP integration.",
  },
  {
    role: "MCA Student",
    org: "University Of Madras",
    period: "2024 — Present",
    desc: "Pursuing Master of Computer Applications with focus on full-stack development and AI integration. Building practical projects with Python, Flask, and modern web technologies.",
  },
  
   {
  role: "Software Development Intern",
  org: "AL-HASEENA EXPORTS",
  period: "Jan 2026 — Apr 2026",
  desc: "Developed LOGISENSE 360, a real-time shipment tracking and fleet management platform with live GPS tracking, analytics dashboards, operational alerts, warehouse management, and role-based logistics modules using Flask, JavaScript, SQLite, SSE, and Mappls API.",
}, 
  {
    role: "Hackathon Participant",
    org: "College Events",
    period: "2024 — 2025",
    desc: "Competed in multiple hackathons, winning 1st Prize Intra-College and 2nd Prize at MGR University. Solved 250+ LeetCode problems to strengthen problem-solving skills.",
  },
];

export function Experience() {
  return (
    <section id="experience" className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionTitle eyebrow="Mission Log" title="Experience Timeline" />
      <div className="relative mt-14">
        <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-bat/0 via-bat/60 to-bat/0 md:left-1/2" />
        <div className="space-y-10">
          {items.map((it, i) => (
            <motion.div
              key={it.role}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1 }}
              className={`relative md:grid md:grid-cols-2 md:gap-12 ${
                i % 2 ? "md:[&>div:first-child]:col-start-2" : ""
              }`}
            >
              <div className="relative pl-10 md:pl-0 md:pr-10">
                <div className="absolute left-0 top-2 h-6 w-6 -translate-x-1/2 rounded-full border-2 border-bat bg-background glow-bat-sm md:left-1/2" />
                <div className={`glass hud-corners rounded p-5 ${i % 2 ? "" : "md:text-right"}`}>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-bat">
                    <Briefcase className="h-3 w-3" /> {it.period}
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">{it.role}</h3>
                  <div className="text-sm text-muted-foreground">{it.org}</div>
                  <p className="mt-3 text-sm text-foreground/80">{it.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-bat/30 bg-bat/5 px-4 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-bat">
        <span className="h-1.5 w-1.5 rounded-full bg-bat animate-pulse" />
        {eyebrow}
      </div>
      <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
        <span className="text-bat text-glow">{title.split(" ")[0]}</span>{" "}
        <span className="text-foreground">{title.split(" ").slice(1).join(" ")}</span>
      </h2>
      <div className="neon-divider mx-auto mt-6 w-32" />
    </motion.div>
  );
}
