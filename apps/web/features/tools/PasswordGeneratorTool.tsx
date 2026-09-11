"use client";

import { useEffect, useState } from "react";
import { Check, Copy, KeyRound, RefreshCw, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PasswordGeneratorTool() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(20);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = "";
    if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!charset) {
      toast.error("Pilih minimal satu kategori karakter.");
      return;
    }

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length];
    }
    setPassword(result);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Password / Token disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate Shannon entropy: E = L * log2(pool)
  let poolSize = 0;
  if (includeUpper) poolSize += 26;
  if (includeLower) poolSize += 26;
  if (includeNumbers) poolSize += 10;
  if (includeSymbols) poolSize += 30;
  const entropy = poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0;

  let strengthLabel = "Sangat Lemah";
  let strengthColor = "bg-destructive text-destructive-foreground";
  if (entropy >= 100) {
    strengthLabel = "Sangat Kuat (Military-Grade)";
    strengthColor = "bg-emerald-500 text-white";
  } else if (entropy >= 75) {
    strengthLabel = "Kuat (Enterprise)";
    strengthColor = "bg-emerald-600 text-white";
  } else if (entropy >= 50) {
    strengthLabel = "Sedang";
    strengthColor = "bg-amber-500 text-white";
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <KeyRound className="size-5 text-primary" />
          Kriptografi Password & Secure Token Generator
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Hasilkan kunci API, secret key, atau password acak kriptografis (Web Crypto API) dengan analisis entropi bit.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        {/* Output & Copy */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              readOnly
              value={password}
              className="font-mono text-sm sm:text-base font-semibold tracking-wider h-12 pr-12 bg-muted/40"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={generatePassword}
              className="gap-2"
            >
              <RefreshCw className="size-4" />
              Acak Ulang
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={copyToClipboard}
              className="gap-2 shrink-0"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Tersalin" : "Salin"}
            </Button>
          </div>
        </div>

        {/* Strength & Entropy Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 p-4">
          <div className="flex items-center gap-3">
            {entropy >= 75 ? (
              <ShieldCheck className="size-5 text-emerald-500" />
            ) : (
              <ShieldAlert className="size-5 text-amber-500" />
            )}
            <div>
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Kekuatan Entropi
              </span>
              <p className="text-sm font-semibold text-foreground">
                {entropy} bit — {strengthLabel}
              </p>
            </div>
          </div>
          <div className="w-full sm:w-48 bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                entropy >= 75 ? "bg-emerald-500" : entropy >= 50 ? "bg-amber-500" : "bg-destructive"
              }`}
              style={{ width: `${Math.min(100, (entropy / 128) * 100)}%` }}
            />
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Label htmlFor="length-range">Panjang Karakter: {length}</Label>
              <span className="font-mono font-medium text-muted-foreground">{length} karakter</span>
            </div>
            <input
              id="length-range"
              type="range"
              min={8}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={(e) => setIncludeUpper(e.target.checked)}
                className="rounded accent-primary size-4"
              />
              Huruf Besar (A-Z)
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeLower}
                onChange={(e) => setIncludeLower(e.target.checked)}
                className="rounded accent-primary size-4"
              />
              Huruf Kecil (a-z)
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="rounded accent-primary size-4"
              />
              Angka (0-9)
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="rounded accent-primary size-4"
              />
              Simbol Khusus (!@#$)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
