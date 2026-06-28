import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, PhoneOff, X } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { BatIcon } from "./bat-icon";

type CallState = "idle" | "connecting" | "active" | "ending" | "error";

type VapiMessage = {
  type?: string;
  role?: string;
  status?: string;
  transcript?: string;
  transcriptType?: string;
};

const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY?.trim();
const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID?.trim();

export function VapiCall() {
  const [open, setOpen] = useState(false);
  const [callState, setCallState] = useState<CallState>("idle");
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState("");
  const [caption, setCaption] = useState("");
  const stateRef = useRef<CallState>("idle");
  const vapi = useMemo(() => (publicKey ? new Vapi(publicKey) : null), []);

  const updateCallState = (state: CallState) => {
    stateRef.current = state;
    setCallState(state);
  };

  useEffect(() => {
    if (!vapi) return;

    const onCallStart = () => {
      updateCallState("active");
      setError("");
    };
    const onCallEnd = () => {
      updateCallState("idle");
      setAssistantSpeaking(false);
      setMuted(false);
      setVolume(0);
    };
    const onSpeechStart = () => setAssistantSpeaking(true);
    const onSpeechEnd = () => {
      setAssistantSpeaking(false);
      setVolume(0);
    };
    const onVolume = (level: number) => setVolume(Math.max(0, Math.min(1, level)));
    const onMessage = (message: VapiMessage) => {
      if (message.type === "speech-update" && message.role === "assistant") {
        setAssistantSpeaking(message.status === "started");
      }

      if (
        message.type === "transcript" &&
        message.role === "assistant" &&
        message.transcriptType === "final" &&
        message.transcript
      ) {
        setCaption(message.transcript);
      }
    };
    const onError = (event: unknown) => {
      const message = event instanceof Error ? event.message : "The voice link could not be established.";
      setError(message);
      updateCallState("error");
      setAssistantSpeaking(false);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("volume-level", onVolume);
    vapi.on("message", onMessage);
    vapi.on("error", onError);

    return () => {
      vapi.removeListener("call-start", onCallStart);
      vapi.removeListener("call-end", onCallEnd);
      vapi.removeListener("speech-start", onSpeechStart);
      vapi.removeListener("speech-end", onSpeechEnd);
      vapi.removeListener("volume-level", onVolume);
      vapi.removeListener("message", onMessage);
      vapi.removeListener("error", onError);
      void vapi.stop();
    };
  }, [vapi]);

  const startCall = useCallback(async () => {
    setOpen(true);

    if (stateRef.current === "active" || stateRef.current === "connecting") return;

    if (!vapi || !assistantId) {
      setError("Vapi public key or assistant ID is missing.");
      updateCallState("error");
      return;
    }

    setError("");
    setCaption("");
    updateCallState("connecting");

    try {
      await vapi.start(assistantId);
    } catch (event) {
      const message = event instanceof Error ? event.message : "Unable to start the Batcomputer voice link.";
      setError(message);
      updateCallState("error");
    }
  }, [vapi]);

  useEffect(() => {
    const handleStart = () => void startCall();
    window.addEventListener("start-vapi-call", handleStart);
    return () => window.removeEventListener("start-vapi-call", handleStart);
  }, [startCall]);

  const endCall = async () => {
    if (!vapi) {
      setOpen(false);
      return;
    }

    updateCallState("ending");

    try {
      await vapi.stop();
    } finally {
      updateCallState("idle");
      setAssistantSpeaking(false);
      setMuted(false);
      setVolume(0);
      setOpen(false);
    }
  };

  const toggleMute = () => {
    if (!vapi || callState !== "active") return;
    const nextMuted = !muted;
    vapi.setMuted(nextMuted);
    setMuted(nextMuted);
  };

  const closePanel = () => {
    if (callState === "active" || callState === "connecting" || callState === "ending") {
      void endCall();
      return;
    }

    setOpen(false);
  };

  const status =
    callState === "connecting"
      ? "Establishing secure voice link..."
      : callState === "ending"
        ? "Disconnecting..."
        : callState === "active"
          ? assistantSpeaking
            ? "Batcomputer is speaking"
            : muted
              ? "Microphone muted"
              : "Listening"
          : callState === "error"
            ? "Voice link unavailable"
            : "Voice link ready";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="vapi-call-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[260] grid place-items-center bg-black/80 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            className="glass hud-corners relative flex min-h-[440px] w-full max-w-[440px] flex-col items-center overflow-hidden rounded-md border border-bat/35 px-6 py-7 text-center shadow-2xl"
          >
            <button
              type="button"
              onClick={closePanel}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center text-muted-foreground transition hover:text-bat"
              aria-label="Close voice call"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live neural link
            </div>
            <h2 id="vapi-call-title" className="mt-3 text-lg font-bold uppercase text-bat">
              Talk to Batcomputer
            </h2>

            <div className="relative mt-12 grid h-40 w-40 place-items-center">
              {[1, 0.72, 0.46].map((scale, index) => (
                <motion.span
                  key={scale}
                  className="absolute inset-0 rounded-full border border-bat/30"
                  animate={{
                    scale: assistantSpeaking ? [scale, scale + 0.12 + volume * 0.12, scale] : scale,
                    opacity: assistantSpeaking ? [0.2, 0.75, 0.2] : 0.16,
                  }}
                  transition={{ duration: 1.15 + index * 0.18, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
              <motion.div
                animate={{
                  scale: assistantSpeaking ? 1 + volume * 0.14 : callState === "connecting" ? [1, 1.06, 1] : 1,
                }}
                transition={{ duration: 0.45, repeat: callState === "connecting" ? Infinity : 0 }}
                className="relative z-10 grid h-24 w-24 place-items-center rounded-full border border-bat/50 bg-black/80 shadow-[0_0_35px_rgba(250,204,21,0.24)]"
              >
                <BatIcon className="h-14 w-14 text-bat" />
              </motion.div>
            </div>

            <div className="mt-6 flex h-8 items-end justify-center gap-1" aria-hidden>
              {[0.35, 0.7, 1, 0.58, 0.82, 0.42, 0.66].map((height, index) => (
                <motion.span
                  key={`${height}-${index}`}
                  className="w-1 rounded-sm bg-bat"
                  animate={{
                    height: assistantSpeaking
                      ? [`${8 + height * 12}px`, `${12 + height * 20 + volume * 10}px`, `${8 + height * 12}px`]
                      : "4px",
                    opacity: assistantSpeaking ? [0.45, 1, 0.45] : 0.25,
                  }}
                  transition={{ duration: 0.5 + index * 0.05, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>

            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-bat/80">{status}</p>
            {caption && callState === "active" && (
              <p className="mt-3 line-clamp-2 min-h-10 max-w-sm text-sm leading-relaxed text-foreground/65">
                {caption}
              </p>
            )}
            {error && <p className="mt-3 max-w-sm text-sm text-red-300">{error}</p>}

            <div className="mt-auto flex items-center justify-center gap-4 pt-8">
              <button
                type="button"
                onClick={toggleMute}
                disabled={callState !== "active"}
                className={`grid h-12 w-12 place-items-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-35 ${
                  muted ? "border-red-400/60 bg-red-400/15 text-red-300" : "border-bat/40 text-bat hover:bg-bat/10"
                }`}
                aria-label={muted ? "Unmute microphone" : "Mute microphone"}
                aria-pressed={muted}
                title={muted ? "Unmute" : "Mute"}
              >
                {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={() => void endCall()}
                className="grid h-14 w-14 place-items-center rounded-full bg-red-500 text-white shadow-[0_0_24px_rgba(239,68,68,0.35)] transition hover:bg-red-400"
                aria-label="End voice call"
                title="End call"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
