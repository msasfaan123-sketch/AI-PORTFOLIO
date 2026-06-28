import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, PhoneCall, Send, Volume2, VolumeX, X, Zap } from "lucide-react";
import { BatIcon } from "./bat-icon";

// ============================================================
// KNOWLEDGE BASE (ported from knowledge_base.json)
// ============================================================
const KB_PROJECTS: Record<string, {
  name: string; aliases: string[]; summary: string;
  tech_stack: string[]; role: string; impact: string;
  challenges: string[]; features: string[];
}> = {
  vconnect: {
    name: "VConnect",
    aliases: ["vconnect", "v connect", "v-connect", "village analytics", "rural analytics", "village project"],
    summary: "VConnect is a rural analytics dashboard that processed data for about 650,000 Indian villages and made rural information easier to search, analyze, and understand.",
    tech_stack: ["Python", "Pandas", "MongoDB", "Flask", "AI-driven search", "data preprocessing"],
    role: "Asfaan worked on data processing, dashboard logic, search improvements, and performance optimization.",
    impact: "Handled about 650,000 village records, improved retrieval speed by ~45%, and reduced preprocessing time by ~50%.",
    challenges: ["Handling large datasets", "making search intuitive", "improving retrieval speed", "cleaning and structuring village records"],
    features: ["Village data search", "analytics dashboard", "AI-driven search layer", "large CSV/data preprocessing"],
  },
  ai_nurse: {
    name: "AI Nurse Triage Voice Assistant",
    aliases: ["ai nurse", "nurse assistant", "triage assistant", "voice assistant", "vapi", "healthcare assistant", "nurse triage"],
    summary: "A healthcare automation project that handled initial patient intake through voice, using NLP and Vapi.ai.",
    tech_stack: ["Flask", "Vapi.ai", "NLP intent classification", "REST APIs", "MongoDB"],
    role: "Asfaan contributed to backend logic, symptom-intent handling, nurse escalation rules, and workflow automation.",
    impact: "Helped reduce manual intake effort and improved symptom collection time by around 35%.",
    challenges: ["Classifying symptoms safely", "knowing when to escalate", "keeping conversation simple for patients"],
    features: ["Voice-based intake", "symptom classification", "nurse escalation", "structured prompts"],
  },
  logisense: {
    name: "LogiSense 360",
    aliases: ["logisense", "logisense 360", "billing system", "subscription billing", "logistics project"],
    summary: "LogiSense 360 is a logistics and fleet management / subscription billing platform with real-time GPS tracking, warehouse operations, and analytics dashboards.",
    tech_stack: ["Python", "Flask", "SQLite", "JavaScript", "Chart.js", "REST APIs", "SSE", "Mappls API"],
    role: "Asfaan contributed to development tasks, backend workflow support, debugging, feature stability, and team collaboration.",
    impact: "Made subscription, invoice, and service workflows more organized and less dependent on manual processing.",
    challenges: ["Keeping billing workflows accurate", "debugging service logic", "integrating features cleanly"],
    features: ["GPS fleet tracking", "customer plan management", "invoice generation", "payment tracking", "analytics dashboards"],
  },
  appointment_bot: {
    name: "AI Medical Appointment Booking Assistant",
    aliases: ["appointment assistant", "medical appointment", "appointment bot", "booking assistant", "ollama", "appointment"],
    summary: "An AI Medical Appointment Booking Assistant that automates patient interactions, appointment scheduling, and symptom-based healthcare conversations using local AI models.",
    tech_stack: ["Ollama", "Flask", "Python", "NLP"],
    role: "Built conversational healthcare support with local AI models.",
    impact: "Automated patient appointment scheduling and reduced manual booking overhead.",
    challenges: ["Accurate intent detection", "managing appointment slots", "integrating local AI models"],
    features: ["Intelligent scheduling", "symptom-based responses", "AI-driven patient interactions"],
  },
};

// ============================================================
// Q&A DATASET (core rows from Asfaan_Interview_Questions_v3.xlsx)
// ============================================================
const QA_DATA: { q: string; kw: string[]; res: string[] }[] = [
  {
    q: "tell me about yourself",
    kw: ["walk me through your background", "give me your elevator pitch", "how do you describe yourself", "self introduction", "professional summary", "tell bout urself", "candidate profile overview", "abt urslf", "introduce yourself", "who are you", "about yourself", "background"],
    res: [
      "I'm Mohamed Sathak Asfaan — MCA student, Flask enthusiast, and the person who once reduced patient intake effort by 40%. I build AI systems that actually work, solve DSA problems for fun (yes, voluntarily), and I'm the kind of developer who reads error logs like bedtime stories.",
      "I am an MCA student at Measi IT and a developer focused on AI. During my internship at Smaart Healthcare, I built an AI nurse assistant that reduced intake effort by 40%. I also engineered VConnect for 650,000 villages and have solved 250+ LeetCode problems.",
      "I'm Asfaan, an MCA student at Measi IT who loves turning complex data into helpful tools. I built an AI voice assistant during my internship that helped nursing staff save real time.",
    ],
  },
  {
    q: "why should we hire you",
    kw: ["what makes you stand out", "why pick you", "your unique selling point", "why hire you", "why should we hire you", "why choose you", "why you", "hire me reason", "unique value", "why us"],
    res: [
      "Because I come with a 40% efficiency improvement pre-installed. I've built AI voice assistants, processed data for 650,000 villages, and won two hackathons — all as a student. Other candidates may have experience; I come with receipts.",
      "I bring measurable results. I've built and deployed production AI systems that improved routing efficiency by 35%. I combine academic rigor of my MCA with practical ability to solve complex data problems.",
    ],
  },
  {
    q: "where do you see yourself in five years",
    kw: ["long term career vision", "future goals", "five year plan", "career trajectory", "5 yr plan", "future plans", "career goals", "long term goals"],
    res: [
      "In five years, I see myself leading a team that builds systems impactful enough to make it into a case study. Right now I'm sharpening my backend and AI skills; by then, I'd like to be the person junior developers come to when Stack Overflow lets them down.",
      "In five years, I see myself as a Senior Software Architect leading teams to build high-impact AI products. Having worked on large-scale rural data and healthcare automation, I want to continue scaling systems that solve real-world problems.",
    ],
  },
  {
    q: "what are your greatest strengths",
    kw: ["best qualities", "your top skills", "what you are good at", "core competency", "strengths", "strong points", "good at", "greatest strengths", "best skill"],
    res: [
      "My greatest strengths? I learn fast, build faster, and debug even faster. I have a genuine obsession with solving problems — 250+ LeetCode problems isn't just a flex, it's Tuesday for me. Also, I document my code, which apparently makes me a rare species.",
      "Technical problem-solving speed and adaptability. My DSA practice (250+ problems) lets me write optimized code, and my hackathon wins show I can build quality prototypes under tight deadlines.",
    ],
  },
  {
    q: "what is your biggest weakness",
    kw: ["area you need to improve", "something you struggle with", "honest self critique", "weakness", "weaknesses", "bad at", "biggest weakness"],
    res: [
      "I sometimes over-engineer solutions — spending an extra hour making code elegant when 'working' would have been enough. I'm actively working on shipping first and refactoring second. The good news: my over-engineered solutions tend to scale really well.",
    ],
  },
  {
    q: "are you open to relocation",
    kw: ["relocation", "move city", "open to move", "open to relocation", "relocate", "willing to relocate", "move location"],
    res: [
      "Yes, absolutely. Great opportunities don't always happen in your hometown, and I'm ready to move wherever the work is interesting. I'm already used to adapting — building systems for healthcare and rural India required thinking well beyond my comfort zone.",
    ],
  },
  {
    q: "what is your expected salary",
    kw: ["salary", "expected salary", "salary expectation", "ctc", "package", "pay expectation", "compensation", "how much salary"],
    res: [
      "I'm looking for a package that reflects the value I bring — measurable impact, production AI experience, and two hackathon wins as a student. I'm flexible based on the role scope and growth potential, and I'm happy to discuss a fair number.",
    ],
  },
  {
    q: "what are your technical skills",
    kw: ["skills", "technical skills", "tech skills", "technology skills", "tech stack", "what technologies", "programming languages", "tools you use", "stack", "expertise", "technologies"],
    res: [
      "Core expertise: Python, Flask, SQL, MongoDB, Pandas, REST APIs, data processing, AI voice assistant workflows, NLP intent classification, Git/GitHub, Java, Spring Boot, JavaScript, and DSA (250+ LeetCode). Strongest in backend engineering and practical AI integration.",
    ],
  },
  {
    q: "tell me about your education",
    kw: ["education", "study", "degree", "college", "qualification", "field of study", "academic background", "university", "mca", "bca"],
    res: [
      "I completed BCA at The New College and I'm currently pursuing MCA at Measi Institute of Information Technology, Chennai. Academic focus: computer applications, software development, databases, and practical AI/data projects.",
    ],
  },
  {
    q: "tell me about your internship experience",
    kw: ["experience", "internship", "work experience", "work history", "previous job", "where did you work", "smaart", "smaart healthcare", "intern"],
    res: [
      "I worked as a Software and Data Intern at Smaart Healthcare, where I built an AI nurse assistant that reduced patient intake effort by ~40%, worked on backend/data workflows, and contributed to real healthcare automation use cases.",
    ],
  },
  {
    q: "what are your achievements",
    kw: ["achievements", "achievement", "awards", "hackathon", "accomplishments", "what have you won", "prizes", "won", "hackathons", "won prizes"],
    res: [
      "🏆 1st Prize at Measi Institute Hackathon | 🥈 2nd Prize at MGR University Hackathon | Built AI nurse assistant that cut intake effort by ~40% | VConnect for 650,000 village records with 45% faster retrieval | 250+ LeetCode problems solved.",
    ],
  },
  {
    q: "how do you handle failure",
    kw: ["failure", "handle failure", "bouncing back", "learning from mistakes", "setbacks", "mistakes", "failure recovery"],
    res: [
      "I treat failure like a compiler error — read it carefully, understand what went wrong, fix it, and don't repeat it. When my VConnect pipeline crashed on a 650k-row dataset, I profiled, optimized, and came back with a 50% faster solution. Failures are just unscheduled learning sessions.",
    ],
  },
  {
    q: "how do you handle pressure and tight deadlines",
    kw: ["pressure", "tight deadlines", "working under pressure", "deadline management", "stress", "deadline", "time pressure", "handle pressure"],
    res: [
      "Pressure is basically my default operating mode — I once built and deployed a working voice triage assistant during an internship sprint. My approach: break the panic into a checklist, prioritize ruthlessly, and remind myself that a deadline is just a problem with a timestamp.",
    ],
  },
  {
    q: "are you a team player",
    kw: ["team player", "work in team", "prefer working alone", "collaboration", "teamwork", "solo or team", "work with others"],
    res: [
      "I'm a team player who can also go deep solo when needed. I communicate clearly, give and take feedback well, and I believe the best code emerges from collaboration — not just from one genius in a corner.",
    ],
  },
  {
    q: "what motivates you professionally",
    kw: ["motivation", "what motivates you", "professionally motivated", "drive", "passion", "why do you code", "motivated by"],
    res: [
      "Solving problems that actually matter. When my AI nurse assistant helped reduce manual patient intake effort, that was tangible impact. I'm motivated by building systems where you can measure the difference before and after.",
    ],
  },
  {
    q: "how do you keep your technical skills updated",
    kw: ["keep skills updated", "learning new things", "stay current", "continuous learning", "upskilling", "how do you learn", "learn new tech"],
    res: [
      "I practice DSA regularly on LeetCode (250+ problems), build side projects that force me to learn new tools, read documentation obsessively, and follow AI/backend engineering developments. Learning isn't an event for me — it's a habit.",
    ],
  },
  {
    q: "what is your dsa experience",
    kw: ["dsa", "data structures", "algorithms", "leetcode", "competitive programming", "problem solving", "coding problems", "250"],
    res: [
      "I've solved 250+ DSA problems on LeetCode, covering arrays, trees, graphs, dynamic programming, and system design fundamentals. I practice consistently and find algorithmic thinking genuinely fun — not just interview prep.",
    ],
  },
  {
    q: "tell me about your python experience",
    kw: ["python", "python experience", "python skills", "python projects", "python developer"],
    res: [
      "Python is my primary language. I've used it for Flask backends, Pandas data pipelines, NLP workflows, AI assistant integrations, REST API development, and automation scripts across my internship and personal projects.",
    ],
  },
  {
    q: "tell me about your flask experience",
    kw: ["flask", "flask experience", "flask projects", "flask backend", "flask api", "flask developer"],
    res: [
      "Flask is my go-to web framework. I've used it to build REST APIs for healthcare systems, rural analytics dashboards, and logistics platforms. Comfortable with routing, middleware, request handling, and database integration.",
    ],
  },
  {
    q: "tell me about your mongodb experience",
    kw: ["mongodb", "nosql", "document database", "mongo", "mongodb experience"],
    res: [
      "I've used MongoDB in production for VConnect and the AI Nurse project. Chosen for its flexibility with document-like rural records and healthcare data. Comfortable with schema design, aggregation pipelines, and performance optimization.",
    ],
  },
  {
    q: "what are your hobbies",
    kw: ["hobbies", "interests", "free time", "outside work", "what do you do for fun", "personal interests", "hobby"],
    res: [
      "Beyond coding and AI systems, Asfaan enjoys football, cricket, chess, and reading books. Strategic thinking isn't limited to programming alone — chess has probably made him a better system designer.",
    ],
  },
  {
    q: "how do you approach learning something completely new",
    kw: ["learn something new", "new technology", "new skill", "how do you learn", "approach to learning", "picking up new tech", "learn new"],
    res: [
      "I start with the official documentation, build a small throwaway project to get hands-on fast, then work through edge cases. For AI tools I learned this way: Vapi.ai, Ollama, NLP pipelines — docs first, then build, then debug until I understand the internals.",
    ],
  },
  {
    q: "how do you handle conflict at work",
    kw: ["conflict", "conflict resolution", "team disagreement", "disagreement", "handle conflict", "conflict at work"],
    res: [
      "During my internship, there was a disagreement about architecture for the alert escalation system. I listened, made my case with actual data, and we went with a hybrid approach. It worked 30% better than either original idea. Conflict, when handled well, is just collaboration with extra drama.",
    ],
  },
  {
    q: "describe your ideal work environment",
    kw: ["ideal work environment", "preferred workplace", "work setting", "team dynamics", "work culture", "environment"],
    res: [
      "My ideal work environment has three things: interesting problems, people who care about quality, and decent Wi-Fi. I thrive in teams where feedback flows freely and no one's precious about their code. A good code review culture beats a ping-pong table any day.",
    ],
  },
];

// ============================================================
// MATCHING ENGINE
// ============================================================
const STOP_WORDS = new Set([
  "a","about","an","and","are","ask","be","been","by","can","did","do","for","from",
  "has","have","how","i","in","is","it","its","me","my","of","on","or","please","show",
  "tell","that","the","this","to","was","what","when","where","which","who","why","will",
  "with","you","your",
]);

const TYPO_MAP: Record<string, string> = {
  "2": "to", "4": "for", "r": "are", "u": "you", "ur": "your",
  "im": "i am", "iam": "i am", "wbu": "what about you", "wat": "what",
  "abt": "about", "proj": "project", "projs": "projects", "db": "database",
  "dev": "developer", "yr": "year", "yrs": "years", "plz": "please", "pls": "please",
};

function cleanText(text: string): string {
  let t = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  return t.split(" ").map(w => TYPO_MAP[w] ?? w).join(" ");
}

function getTokens(text: string): Set<string> {
  const tokens = new Set<string>();
  for (const word of text.split(" ")) {
    if (word.length > 2 && !STOP_WORDS.has(word)) {
      tokens.add(word);
      if (word.endsWith("s") && word.length > 4) tokens.add(word.slice(0, -1));
    }
  }
  return tokens;
}

function tokenOverlap(a: Set<string>, b: Set<string>): number {
  let count = 0;
  for (const t of a) if (b.has(t)) count++;
  return count;
}

function simpleRatio(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 100;
  if (a.includes(b) || b.includes(a)) return 88;
  const aT = new Set(a.split(" "));
  const bT = new Set(b.split(" "));
  let common = 0;
  for (const t of aT) if (bT.has(t)) common++;
  return (common / Math.max(aT.size, bT.size)) * 75;
}

function detectProject(input: string) {
  for (const proj of Object.values(KB_PROJECTS)) {
    for (const alias of proj.aliases) {
      if (input.includes(cleanText(alias))) return proj;
    }
  }
  return null;
}

function getReply(userText: string): string {
  const cleaned = cleanText(userText);
  const tokens = getTokens(cleaned);

  // Greetings
  if (["hi","hello","hey","good morning","good evening","good afternoon"].some(g => cleaned === g || cleaned.startsWith(g + " "))) {
    return "Batcomputer online. I use a three-layer fallback system: Groq AI first, Asfaan's Python portfolio knowledge base second, and built-in frontend answers third. Ask me about his projects, skills, experience, or achievements!";
  }
  // Thanks / bye
  if (["thank you","thanks","ty","thank u"].includes(cleaned))
    return "You're welcome. Batcomputer standing by for the next command.";
  if (["bye","goodbye","see you","cya"].includes(cleaned))
    return "Disconnecting secure session... See you again, Commander.";
  // Batman easter egg
  if (cleaned.includes("batman") || cleaned.includes("batcomputer"))
    return "Dark mode engineering with futuristic command-center aesthetics. The Batcomputer runs on Asfaan's portfolio — Wayne Enterprises approved.";

  // Direct project detection
  const proj = detectProject(cleaned);
  if (proj) {
    const techT = new Set(["stack", "tech", "technology", "tools", "used", "built", "framework", "language"]);
    const roleT = new Set(["role", "contribution", "did", "responsibility"]);
    const impactT = new Set(["impact", "result", "outcome", "achieve", "improv"]);
    const challengeT = new Set(["challenge", "difficult", "problem", "hard"]);
    const featureT = new Set(["feature", "features", "work", "function", "capability"]);

    if (tokenOverlap(tokens, techT) > 0)
      return `${proj.name} tech stack: ${proj.tech_stack.join(", ")}.`;
    if (tokenOverlap(tokens, roleT) > 0)
      return `${proj.name} — Asfaan's role: ${proj.role}`;
    if (tokenOverlap(tokens, impactT) > 0)
      return `${proj.name} impact: ${proj.impact}`;
    if (tokenOverlap(tokens, challengeT) > 0)
      return `${proj.name} key challenges: ${proj.challenges.join(", ")}.`;
    if (tokenOverlap(tokens, featureT) > 0)
      return `${proj.name} features: ${proj.features.join(", ")}.`;
    return `${proj.name}: ${proj.summary}\n\nStack: ${proj.tech_stack.join(", ")}.\nImpact: ${proj.impact}`;
  }

  // Direct KB answers
  const contactT = new Set(["contact","email","phone","linkedin","github","reach"]);
  if (tokenOverlap(tokens, contactT) > 0)
    return `📧 ms.asfaan123@gmail.com | 📞 +91 98847 83437 | LinkedIn: linkedin.com/in/mohamed-asfaan-5a3340284 | GitHub: github.com/msasfaan123-sketch`;

  if (["skills","skill","tech stack","stack"].includes(cleaned))
    return "Core skills: Python, Flask, SQL, MongoDB, Pandas, REST APIs, data processing, AI voice assistant workflows, NLP intent classification, Git/GitHub, and DSA practice (250+ LeetCode).";

  if (["education","degree","college"].includes(cleaned))
    return "MCA student at MEASI Institute of Information Technology. Previously completed BCA at The New College, Chennai.";

  if (["experience","internship","work experience"].includes(cleaned))
    return "Software and Data Intern at Smaart Healthcare, working on AI-assisted healthcare workflows, backend/data tasks, and automation.";

  if (["achievements","achievement","hackathon"].includes(cleaned))
    return "🏆 1st Prize at Measi Hackathon | 🥈 2nd Prize at MGR University Hackathon | AI nurse assistant cut intake effort by ~40% | VConnect for 650k village records | 250+ LeetCode problems solved.";

  if (["projects","project","portfolio"].includes(cleaned))
    return "Main projects: VConnect (rural analytics, 650k+ Indian villages), AI Nurse Triage Voice Assistant (healthcare automation), LogiSense 360 (logistics & billing), AI Medical Appointment Booking Assistant. Ask about any by name for details!";

  // Q&A fuzzy match
  let bestRow: (typeof QA_DATA)[0] | null = null;
  let bestScore = 0;

  for (const row of QA_DATA) {
    const allKw = [row.q, ...row.kw].map(cleanText);
    let rowScore = 0;
    for (const kw of allKw) {
      const s = simpleRatio(cleaned, kw);
      if (s > rowScore) rowScore = s;
    }
    const rowTokens = getTokens(allKw.join(" "));
    rowScore += tokenOverlap(tokens, rowTokens) * 7;
    if (rowScore > bestScore) { bestScore = rowScore; bestRow = row; }
  }

  if (bestRow && bestScore >= 28) {
    const res = bestRow.res;
    return res[Math.floor(Math.random() * res.length)];
  }

  return "I don't have a specific answer for that. Try asking about Asfaan's projects, skills, education, experience, achievements, or contact details!";
}

async function getPythonReply(userText: string): Promise<string> {
  const apiBaseUrl = import.meta.env.VITE_CHATBOT_API_URL?.replace(/\/$/, "") ?? "";
  const response = await fetch(`${apiBaseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userText }),
  });

  if (!response.ok) {
    throw new Error(`Chatbot API returned ${response.status}`);
  }

  const data = (await response.json()) as { reply?: string };
  return data.reply?.trim() || getReply(userText);
}

// ============================================================
// TYPEWRITER
// ============================================================
function TypedBotText({ messageId, text }: { messageId: number; text: string }) {
  const [shown, setShown] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    setShown("");
    setComplete(false);
    const chars = [...text];
    if (!chars.length) { setComplete(true); return; }
    let cancelled = false, i = 0, timeoutId = 0;
    const step = () => {
      if (cancelled) return;
      i++;
      setShown(chars.slice(0, i).join(""));
      if (i >= chars.length) { setComplete(true); return; }
      const ch = chars[i - 1];
      const base = ch === " " || ch === "\n" ? 10 : /[.,;:!?]/.test(ch) ? 45 : 8 + (i % 4) * 2;
      timeoutId = window.setTimeout(step, base);
    };
    timeoutId = window.setTimeout(step, 120);
    return () => { cancelled = true; window.clearTimeout(timeoutId); };
  }, [messageId, text]);

  return <span className={complete ? "" : "blink"}>{complete ? text : shown}</span>;
}

// ============================================================
// CHATBOT COMPONENT
// ============================================================
type Msg = { id: number; from: "bot" | "user"; text: string };

type SpeechResultEvent = Event & {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      0: { transcript: string };
      isFinal: boolean;
    };
  };
};

type SpeechErrorEvent = Event & { error: string };

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [speakerEnabled, setSpeakerEnabled] = useState(
    () => window.localStorage.getItem("batcomputer-speaker") === "on",
  );
  const [listening, setListening] = useState(false);
  const msgIdRef = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const recognitionBaseInputRef = useRef("");
  const ignoreRecognitionResultsRef = useRef(false);
  const speakerEnabledRef = useRef(speakerEnabled);
  const speechWindow = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  const recognitionSupported = Boolean(speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition);
  const synthesisSupported = "speechSynthesis" in window;

  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 0,
      from: "bot",
      text: "Batcomputer online. I use a three-layer fallback system: Groq AI first, Asfaan's Python knowledge base (resume, Excel, and JSON) second, and built-in frontend answers third. Ask me about his projects, skills, experience, or achievements!",
    },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  useEffect(() => {
    const openChatbot = () => setOpen(true);
    window.addEventListener("open-batcomputer", openChatbot);
    return () => window.removeEventListener("open-batcomputer", openChatbot);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    speakerEnabledRef.current = speakerEnabled;
    window.localStorage.setItem("batcomputer-speaker", speakerEnabled ? "on" : "off");

    if (!speakerEnabled && synthesisSupported) {
      window.speechSynthesis.cancel();
    }
  }, [speakerEnabled, synthesisSupported]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const quick = ["Projects", "Skills", "Contact", "Education", "Achievements", "Internship", "Tell me about yourself", "Hobbies"];

  const speakReply = (text: string) => {
    if (!speakerEnabledRef.current || !synthesisSupported) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[#*_`]/g, ""));
    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionSupported) return;

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    ignoreRecognitionResultsRef.current = false;
    recognitionBaseInputRef.current = input.trim();

    recognition.onresult = (event) => {
      if (ignoreRecognitionResultsRef.current) return;

      let transcript = "";

      for (let index = event.resultIndex; index < event.results.length; index++) {
        transcript += event.results[index][0].transcript;
      }

      const prefix = recognitionBaseInputRef.current;
      setInput(`${prefix}${prefix && transcript ? " " : ""}${transcript}`.trim());
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };
    recognitionRef.current = recognition;

    try {
      recognition.start();
      setListening(true);
    } catch {
      recognitionRef.current = null;
      setListening(false);
    }
  };

  const send = async (t?: string) => {
    const text = (t ?? input).trim();
    if (!text) return;
    ignoreRecognitionResultsRef.current = true;
    recognitionRef.current?.stop();
    recognitionBaseInputRef.current = "";
    setInput("");
    const userId = msgIdRef.current++;
    setMsgs((m) => [...m, { id: userId, from: "user", text }]);
    const botId = msgIdRef.current++;
    setMsgs((m) => [...m, { id: botId, from: "bot", text: "Querying Python knowledge core..." }]);

    try {
      const reply = await getPythonReply(text);
      setMsgs((m) => m.map((msg) => (msg.id === botId ? { ...msg, text: reply } : msg)));
      speakReply(reply);
    } catch {
      const fallbackReply = getReply(text);
      setMsgs((m) => m.map((msg) => (msg.id === botId ? { ...msg, text: fallbackReply } : msg)));
      speakReply(fallbackReply);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[210] grid h-14 w-14 place-items-center rounded-full bg-bat text-black glow-bat"
        aria-label={open ? "Close Batcomputer chat" : "Open Batcomputer chat"}
      >
        {open ? <X className="h-6 w-6" /> : <BatIcon className="h-7 w-7" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="batcomputer-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="batcomputer-chat-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", damping: 24, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="glass hud-corners relative flex h-[min(85dvh,560px)] min-h-0 w-full max-w-[520px] flex-col overflow-hidden rounded-md shadow-2xl"
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-bat/20 bg-black/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <BatIcon className="h-7 w-7 text-bat" />
                  <div>
                    <div id="batcomputer-chat-title" className="text-xs font-bold uppercase tracking-widest text-bat">
                      Batcomputer AI
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      KNOWLEDGE BASE · 113 Q&A LOADED
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      window.dispatchEvent(new CustomEvent("start-vapi-call"));
                    }}
                    className="grid h-8 w-8 place-items-center rounded text-muted-foreground transition hover:bg-bat/10 hover:text-bat"
                    aria-label="Start live Batcomputer voice call"
                    title="Talk to Batcomputer"
                  >
                    <PhoneCall className="h-4 w-4" />
                  </button>
                  {synthesisSupported && (
                    <button
                      type="button"
                      onClick={() => setSpeakerEnabled((enabled) => !enabled)}
                      className={`grid h-8 w-8 place-items-center rounded transition ${
                        speakerEnabled ? "bg-bat/15 text-bat" : "text-muted-foreground hover:text-bat"
                      }`}
                      aria-label={speakerEnabled ? "Turn voice replies off" : "Turn voice replies on"}
                      aria-pressed={speakerEnabled}
                      title={speakerEnabled ? "Voice replies on" : "Voice replies off"}
                    >
                      {speakerEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </button>
                  )}
                  <button type="button" onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-bat" aria-label="Close chat">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 font-mono text-sm space-y-3 [scrollbar-width:thin]"
                aria-live="polite"
                aria-relevant="additions text"
              >
                {msgs.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] rounded px-3 py-2 leading-relaxed whitespace-pre-line ${
                        m.from === "user" ? "bg-bat text-black" : "border border-bat/30 bg-black/40 text-bat/90"
                      }`}
                    >
                      {m.from === "bot" && <span className="mr-1 text-bat/60">[AI]</span>}
                      {m.from === "bot" ? <TypedBotText messageId={m.id} text={m.text} /> : m.text}
                    </div>
                  </motion.div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Quick prompts + input */}
              <div className="shrink-0 border-t border-bat/20 bg-black/40 p-3">
                <div className="mb-2 flex flex-wrap gap-1">
                  {quick.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="flex items-center gap-1 rounded border border-bat/30 px-2 py-1 text-[10px] uppercase tracking-wider text-bat/80 hover:bg-bat/10"
                    >
                      <Zap className="h-3 w-3" /> {q}
                    </button>
                  ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="> Ask anything about Asfaan..."
                    className="flex-1 rounded border border-bat/30 bg-black/60 px-3 py-2 font-mono text-sm text-bat placeholder:text-bat/40 focus:outline-none focus:ring-1 focus:ring-bat"
                  />
                  {recognitionSupported && (
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded border transition ${
                        listening
                          ? "animate-pulse border-red-400/70 bg-red-400/15 text-red-300"
                          : "border-bat/30 text-bat hover:bg-bat/10"
                      }`}
                      aria-label={listening ? "Stop voice input" : "Start voice input"}
                      aria-pressed={listening}
                      title={listening ? "Listening" : "Voice input"}
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  )}
                  <button type="submit" className="grid h-9 w-9 place-items-center rounded bg-bat text-black hover:opacity-90">
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
