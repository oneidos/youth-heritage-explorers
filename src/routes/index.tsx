import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuthUser } from "@/lib/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cicero — scopri l'Italia con chi la vive" },
      {
        name: "description",
        content:
          "Entra in Cicero: studenti che fanno scoprire il patrimonio della propria città ad altri studenti. Accedi con email o Google.",
      },
      { property: "og:title", content: "Cicero — scopri l'Italia con chi la vive" },
      {
        property: "og:description",
        content:
          "Visitatore o cicerone: scopri una città con chi ci vive, oppure racconta la tua ai coetanei.",
      },
    ],
  }),
  component: LoginPage,
});

const credentials = z.object({
  email: z.string().trim().email("Inserisci un'email valida").max(255),
  password: z.string().min(6, "La password deve avere almeno 6 caratteri").max(72),
});

function LoginPage() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useAuthUser();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/onboarding", replace: true });
  }, [user, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = credentials.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Dati non validi");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account creato! Se richiesto, conferma la mail e poi accedi.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
        navigate({ to: "/onboarding", replace: true });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Qualcosa è andato storto");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Accesso con Google non riuscito");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/onboarding", replace: true });
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-between px-6 pb-10 pt-16">
      <div>
        <Logo size={52} />
        <h1 className="mt-14 font-display text-4xl font-bold leading-[1.05]">
          Scopri l'Italia
          <br />
          <span className="text-primary">con chi la vive.</span>
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Studenti che raccontano il patrimonio della propria città ad altri studenti. Niente audio
          guide: solo coetanei, vicoli veri e storie di quartiere.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="nome@scuola.it"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-2xl bg-card"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder="almeno 6 caratteri"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-2xl bg-card"
          />
        </div>
        <Button
          type="submit"
          disabled={busy || isLoading}
          className="tap-scale h-12 w-full rounded-full text-base font-semibold"
        >
          {mode === "signup" ? "Crea account" : "Entra"}
        </Button>
        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">oppure</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={handleGoogle}
          className="tap-scale h-12 w-full rounded-full border-border bg-card text-base font-semibold hover:bg-accent"
        >
          <GoogleMark />
          Continua con Google
        </Button>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="w-full pt-2 text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          {mode === "login" ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
        </button>
      </form>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18Z"
      />
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.01-2.34Z" />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
