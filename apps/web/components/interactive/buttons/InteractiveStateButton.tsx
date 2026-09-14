"use client";

import { motion, AnimatePresence } from "motion/react";
import { Loader2Icon, CheckCircle2Icon, AlertCircleIcon, ArrowRightIcon } from "lucide-react";
import { cn } from "cn";

export type ButtonActionState = "idle" | "loading" | "success" | "error";

export interface InteractiveStateButtonProps
  extends Omit<React.ComponentProps<typeof motion.button>, "children"> {
  state?: ButtonActionState;
  idleText?: string;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  idleIcon?: React.ReactNode;
  className?: string;
}

/**
 * Interactive State Button that morphs smoothly between idle, loading, success, and error states
 * with animated icons and status color morphing.
 */
export function InteractiveStateButton({
  state = "idle",
  idleText = "Kirim Permintaan",
  loadingText = "Memproses...",
  successText = "Berhasil Terkirim!",
  errorText = "Gagal, Coba Lagi",
  idleIcon = <ArrowRightIcon className="size-4" />,
  className,
  disabled,
  ...props
}: InteractiveStateButtonProps) {
  const stateStyles = {
    idle: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20",
    loading: "bg-primary/80 text-primary-foreground cursor-wait shadow-sm",
    success:
      "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400/40",
    error:
      "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30 border border-destructive/40",
  };

  return (
    <motion.button
      layout
      whileTap={state === "idle" ? { scale: 0.96 } : undefined}
      disabled={disabled || state === "loading"}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer select-none disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        stateStyles[state],
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <span>{idleText}</span>
            {idleIcon && <span className="transition-transform group-hover:translate-x-1">{idleIcon}</span>}
          </motion.span>
        )}

        {state === "loading" && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Loader2Icon className="size-4 animate-spin" />
            <span>{loadingText}</span>
          </motion.span>
        )}

        {state === "success" && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="flex items-center gap-2"
          >
            <CheckCircle2Icon className="size-4 text-emerald-200" />
            <span>{successText}</span>
          </motion.span>
        )}

        {state === "error" && (
          <motion.span
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="flex items-center gap-2"
          >
            <AlertCircleIcon className="size-4 text-destructive-foreground" />
            <span>{errorText}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
