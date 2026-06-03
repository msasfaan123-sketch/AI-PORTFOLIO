import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Download } from "lucide-react";
import { SectionTitle } from "./experience";

const contacts = [
  { icon: Mail, label: "EMAIL", value: "ms.asfaan123@gmail.com", href: "mailto:ms.asfaan123@gmail.com" },
  { icon: Linkedin, label: "LINKEDIN", value: "M.S.Asfaan", href: "https://www.linkedin.com/in/mohamed-asfaan-5a3340284" },
  { icon: Github, label: "GITHUB", value: "msasfaan123-sketch", href: "https://github.com/msasfaan123-sketch" },
  { icon: MapPin, label: "LOCATION", value: "Chennai, India", href: "#" },
];

export function Contact() {
  return (
    <section id="contact" className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionTitle eyebrow="Encrypted Channel" title="Contact Terminal" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass hud-corners mt-12 rounded-md overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-bat/20 bg-black/40 px-4 py-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-bat">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            secure-channel://wayne-enterprises
          </div>
          <span className="text-muted-foreground">256-bit AES</span>
        </div>
        <div className="p-8 font-mono text-sm">
          <div className="text-bat/80">$ ./connect --target=mohamed</div>
          <div className="mt-1 text-foreground/70">// channel established. choose protocol:</div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {contacts.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group flex items-center gap-3 rounded border border-bat/20 bg-black/30 p-4 hover:border-bat hover:bg-bat/5 transition"
              >
                <div className="grid h-10 w-10 place-items-center rounded bg-bat/10 text-bat group-hover:bg-bat group-hover:text-black transition">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {c.label}
                  </div>
                  <div className="truncate text-sm text-foreground">{c.value}</div>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <div className="text-bat/80">$ ./download --asset=resume.pdf</div>
            <a
              href="/MOHAMED SATHAK ASFAAN_ RESUME.pdf"
              download
              className="inline-flex items-center gap-2 rounded bg-bat px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 glow-bat-sm"
            >
              <Download className="h-4 w-4" /> Download Resume
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
