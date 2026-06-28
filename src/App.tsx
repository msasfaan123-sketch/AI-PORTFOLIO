import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BootSequence } from "@/components/boot-sequence";
import { CursorSpotlight, GridBackdrop } from "@/components/atmosphere";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/sections/hero";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Achievements } from "@/components/sections/achievements";
import { AssistantPanel } from "@/components/sections/assistant-panel";
import { Contact } from "@/components/sections/contact";
import { Chatbot } from "@/components/chatbot";
import { VapiCall } from "@/components/vapi-call";
import { BatIcon } from "@/components/bat-icon";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

function App() {
  const [booted, setBooted] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen">
        <BootSequence onDone={() => setBooted(true)} />
        <GridBackdrop />
        <CursorSpotlight />
        {booted && (
          <>
            <Navbar />
            <main>
              <Hero />
              <Experience />
              <Projects />
              <Skills />
              <Achievements />
              <AssistantPanel />
              <Contact />
            </main>
            <footer className="border-t border-bat/15 px-6 py-8 text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <BatIcon className="mx-auto mb-2 h-5 w-5 text-bat/60" />
              © 2026 Mohamed Sathak Asfaan · Encrypted by Wayne Enterprises
            </footer>
            <Chatbot />
            <VapiCall />
          </>
        )}
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
