"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldCheck, Lock, CheckCircle2, Bot, Users, Trophy, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

type ButtonState = "default" | "hover" | "loading" | "success" | "error"

export default function AuthPage() {
  const [buttonState, setButtonState] = useState<ButtonState>("default")
  const [simulating, setSimulating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Simulate OAuth flow
  useEffect(() => {
    let t1: any
    let t2: any
    if (buttonState === "loading") {
      setSimulating(true)
      // simulate progress and success
      t1 = setTimeout(() => {
        setButtonState("success")
        toast({
          title: "Welcome back!",
          description: "Authentication succeeded.",
        })
      }, 1600)
      t2 = setTimeout(() => {
        router.push("/") // navigate to dashboard placeholder
      }, 2500)
    }
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      setSimulating(false)
    }
  }, [buttonState, router, toast])

  // Demo controls for states
  const setDemo = (s: ButtonState) => {
    setButtonState(s)
  }

  return (
    <main className="min-h-dvh grid lg:grid-cols-[0.4fr_0.6fr] grid-cols-1 relative overflow-hidden">
      {/* Theme toggle */}
      <div className="absolute right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left panel (hidden on mobile) */}
      <LeftPanel />

      {/* Right panel with glass card */}
      <section className={cn("relative flex items-center justify-center py-12 px-6 bg-background")}>
        <AuthCard
          state={buttonState}
          onHover={(h) => setButtonState(h ? "hover" : "default")}
          onClick={() => {
            if (buttonState === "loading") return
            // Randomize success / error for demo when not using controls
            const willFail = false
            if (willFail) {
              setButtonState("loading")
              setTimeout(() => {
                setButtonState("error")
              }, 1300)
            } else {
              setButtonState("loading")
            }
          }}
          onRetry={() => setButtonState("default")}
        />

        {/* Demo state toggles */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          <DemoChip label="Default" active={buttonState === "default"} onClick={() => setDemo("default")} />
          <DemoChip label="Hover" active={buttonState === "hover"} onClick={() => setDemo("hover")} />
          <DemoChip label="Loading" active={buttonState === "loading"} onClick={() => setDemo("loading")} />
          <DemoChip label="Success" active={buttonState === "success"} onClick={() => setDemo("success")} />
          <DemoChip label="Error" active={buttonState === "error"} onClick={() => setDemo("error")} />
        </div>
      </section>
    </main>
  )
}

function DemoChip({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-sm chip transition-all",
        active ? "text-foreground shadow-md" : "text-foreground/75 hover:text-foreground shadow-sm hover:shadow-md",
      )}
    >
      {label}
    </button>
  )
}

function LeftPanel() {
  // parallax
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [xy, setXy] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setXy({ x, y })
    }
    el.addEventListener("mousemove", onMove)
    return () => el.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <aside
      ref={containerRef}
      className={cn(
        "relative hidden lg:block overflow-hidden",
        "bg-[linear-gradient(135deg,var(--brand-primary-start),var(--brand-primary-end))]",
      )}
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] [background-size:8px_8px]" />
      {/* Floating shapes */}
      <div
        aria-hidden
        className="absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-30"
        style={{
          background: "radial-gradient(closest-side, rgba(255,255,255,0.6), rgba(255,255,255,0.1) 70%, transparent)",
          transform: `translate(${xy.x * 20}px, ${xy.y * 20}px)`,
        }}
      />
      <div
        aria-hidden
        className="absolute -left-24 bottom-16 h-72 w-72 rounded-full opacity-25"
        style={{
          background: "radial-gradient(closest-side, rgba(255,255,255,0.5), rgba(255,255,255,0.08) 70%, transparent)",
          transform: `translate(${xy.x * -15}px, ${xy.y * -15}px)`,
        }}
      />

      <div className="relative h-full w-full px-12 py-16 text-white">
        <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-2 animate-in fade-in slide-in-from-left-4">
          <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,white,rgba(255,255,255,0.8))]">
            Connect & Thrive
          </span>
        </h1>
        <p className="text-white/90 text-lg mb-8 animate-in fade-in slide-in-from-left-2 delay-100">
          Building Smarter, Safer Communities Together
        </p>

        <ul className="space-y-4 mt-8">
          <Feature icon={<AlertTriangle className="h-5 w-5" />} title="Instant Emergency Alerts" delay={150} />
          <Feature icon={<Users className="h-5 w-5" />} title="Smart Resource Sharing" delay={250} />
          <Feature icon={<Trophy className="h-5 w-5" />} title="Engage & Earn Rewards" delay={350} />
          <Feature icon={<Bot className="h-5 w-5" />} title="AI-Powered Community Assistant" delay={450} />
        </ul>
      </div>
    </aside>
  )
}

function Feature({
  icon,
  title,
  delay = 0,
}: {
  icon: React.ReactNode
  title: string
  delay?: number
}) {
  return (
    <li
      className="flex items-center gap-3 text-white/90 animate-in fade-in slide-in-from-left-2"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-9 w-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-white/10 shadow">
        {icon}
      </div>
      <span className="text-base font-medium">{title}</span>
    </li>
  )
}

function AuthCard({
  state,
  onHover,
  onClick,
  onRetry,
}: {
  state: ButtonState
  onHover: (hover: boolean) => void
  onClick: () => void
  onRetry: () => void
}) {
  const isLoading = state === "loading"
  const isSuccess = state === "success"
  const isError = state === "error"
  const isHover = state === "hover"

  return (
    <div
      className={cn(
        "relative w-full max-w-[480px] p-12 rounded-3xl glass-strong shadow-[0_10px_40px_rgba(0,0,0,0.08)]",
        "will-change-transform data-[float=true]:animate-float",
      )}
      data-float="true"
      aria-live="polite"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 opacity-0 animate-in fade-in duration-300">
        <div className="h-10 w-10 rounded-2xl bg-[linear-gradient(135deg,var(--brand-primary-start),var(--brand-primary-end))] shadow-lg shadow-[rgba(0,102,255,0.35)]" />
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--brand-primary-start),var(--brand-primary-end))]">
            Welcome Back
          </h2>
          <p className="text-foreground/70 text-sm">Sign in to continue to your community</p>
        </div>
      </div>

      {/* Google Sign-In Button */}
      <GoogleButton state={state} onClick={onClick} isHover={isHover} />

      {/* Divider */}
      <div className="relative my-6">
        <div className="h-px w-full border-t border-[color:color-mix(in oklab,var(--color-foreground) 14%, transparent)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="px-3 py-0.5 text-xs chip">OR</span>
        </div>
      </div>

      {/* Footer legal */}
      <p className="text-xs text-center text-foreground/60">
        By continuing, you agree to our{" "}
        <Link
          href="#"
          className="underline decoration-transparent hover:decoration-inherit text-[color:var(--brand-primary-start)]"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="#"
          className="underline decoration-transparent hover:decoration-inherit text-[color:var(--brand-primary-start)]"
        >
          Privacy Policy
        </Link>
        .
      </p>

      {/* Trust indicators */}
      <div className="mt-6 flex items-center justify-center gap-6 text-foreground/70">
        <span className="inline-flex items-center gap-2 text-sm">
          <ShieldCheck className="h-4 w-4" /> Secure
        </span>
        <span className="inline-flex items-center gap-2 text-sm">
          <Lock className="h-4 w-4" /> Encrypted
        </span>
        <span className="inline-flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4" /> Verified
        </span>
      </div>

      {/* Powered by Google microcopy */}
      <p className="mt-3 text-center text-xs text-foreground/50">Powered by Google</p>

      {/* Error state */}
      {isError ? (
        <div
          role="alert"
          className={cn(
            "mt-4 flex items-center justify-between gap-3 rounded-xl border px-4 py-3",
            "bg-[color:oklch(0.96_0_0)/0.6] dark:bg-white/5",
            "border-[color:var(--error)] text-[color:var(--error)]",
            "animate-shake",
          )}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm">Authentication failed. Please try again.</span>
          </div>
          <button className="text-sm font-medium underline underline-offset-2 hover:opacity-80" onClick={onRetry}>
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  )
}

function GoogleButton({
  state,
  onClick,
  isHover,
}: {
  state: ButtonState
  onClick: () => void
  isHover?: boolean
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const isDisabled = state === "loading" || state === "success"
  const isLoading = state === "loading"
  const isSuccess = state === "success"

  const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current || isDisabled) return
    const rect = btnRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples((r) => [...r, { id, x, y }])
    setTimeout(() => {
      setRipples((r) => r.filter((it) => it.id !== id))
    }, 650)
    onClick()
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        aria-live="polite"
        aria-busy={isLoading}
        disabled={isDisabled}
        onClick={onButtonClick}
        className={cn(
          "relative w-full h-14 rounded-2xl overflow-hidden isolate",
          "backdrop-blur-xl border",
          "bg-white text-foreground dark:bg-white/10 dark:text-white",
          "border-white/40 dark:border-white/15",
          "shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
          "transition-all duration-200 will-change-transform select-none",
          isLoading ? "cursor-progress" : "cursor-pointer",
          isSuccess
            ? "scale-[0.995]"
            : isHover
              ? "translate-y-[-2px] scale-[1.01] shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
              : "hover:-translate-y-0.5 hover:scale-[1.01]",
          isDisabled && "opacity-90",
        )}
      >
        {/* Gradient border on hover */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl border-2",
            "border-transparent [background:linear-gradient(white,white)_padding-box,linear-gradient(135deg,var(--brand-primary-start),var(--brand-primary-end))_border-box]",
            "opacity-40 group-hover:opacity-70 transition-opacity",
          )}
        />

        {/* Ripples */}
        <div className="absolute inset-0 overflow-hidden">
          {ripples.map((r) => (
            <span
              key={r.id}
              className="absolute rounded-full animate-ripple"
              style={{
                left: r.x,
                top: r.y,
                width: 10,
                height: 10,
                background: "radial-gradient(circle, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center gap-3 h-full px-6">
          {!isSuccess ? (
            <>
              <GoogleG />
              <span className="font-semibold">{isLoading ? "Connecting securely..." : "Continue with Google"}</span>
            </>
          ) : (
            <div className="flex items-center gap-2 text-[color:var(--brand-primary-start)]">
              <CheckCircle2 className="h-6 w-6 animate-in zoom-in-95 fade-in" />
              <span className="font-semibold">Success</span>
            </div>
          )}
        </div>

        {/* Spinner / Progress */}
        {isLoading && (
          <>
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full animate-spin"
              style={{
                background: "conic-gradient(from 0deg, var(--brand-primary-start), var(--brand-primary-end))",
                WebkitMask: "radial-gradient(farthest-side, transparent 60%, black 61%)",
                mask: "radial-gradient(farthest-side, transparent 60%, black 61%)",
              }}
            />
            <div className="absolute -bottom-2 left-3 right-3 h-1 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
              <div className="h-full w-1/3 rounded-full bg-[linear-gradient(90deg,var(--brand-primary-start),var(--brand-primary-end))] animate-progress" />
            </div>
          </>
        )}
      </button>

      {/* Success confetti */}
      {isSuccess && <ConfettiBurst />}
    </div>
  )
}

function GoogleG() {
  // Official-like Google "G" built with simple layers to avoid external assets
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.7h5.2c-.2 1.2-1.6 3.6-5.2 3.6-3.1 0-5.6-2.6-5.6-5.7s2.5-5.7 5.6-5.7c1.8 0 3 .7 3.7 1.3l2.6-2.5C16.8 3.8 14.6 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c5 0 8.3-3.5 8.3-8.5 0-.6-.1-1-.2-1.5H12z"
      />
      <path
        fill="#34A853"
        d="M3.7 7.6l3 2.2C7.4 8 8.6 6.9 10.2 6.9c1.2 0 2 .5 2.4.9l2.7-2.6C14.1 3.8 13.1 3.4 12 3.4 9 3.4 6.5 5.2 5.5 7.6z"
      />
      <path
        fill="#FBBC05"
        d="M12 20.4c2.5 0 4.6-.8 6.1-2.2l-2.9-2.2c-.8.6-1.9 1-3.2 1-2.6 0-4.8-1.7-5.6-4l-3 2.3c1.1 3.3 4.2 5.1 8.6 5.1z"
      />
      <path
        fill="#4285F4"
        d="M20.3 11.9c0-.6-.1-1-.2-1.5H12v3.7h4.7c-.2 1.2-1.6 3.6-4.7 3.6-2.7 0-4.9-2.2-5.5-4.7l-3 2.3c1.1 3.3 4.2 5.1 8.5 5.1z"
      />
    </svg>
  )
}

function ConfettiBurst() {
  // Simple confetti using brand colors
  const pieces = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 200,
        rotate: Math.random() * 360,
      })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute h-2 w-1.5 rounded-[2px] animate-confetti"
          style={{
            left: `${p.left}%`,
            top: "45%",
            background: "linear-gradient(180deg, var(--brand-primary-start), var(--brand-primary-end))",
            transform: `rotate(${p.rotate}deg)`,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  )
}
