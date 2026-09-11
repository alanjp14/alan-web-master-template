"use client";

import { useState } from "react";
import { CheckCircle2, Mail, MessageSquare, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ConsultationForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    service: "Cloud Architecture & DevOps",
    budget: "50 - 150 Juta IDR",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Permintaan konsultasi Anda berhasil dikirim!", {
        description: "Tim Solution Architect kami akan menghubungi Anda dalam kurun waktu 1x24 jam kerja.",
      });
    }, 1000);
  };

  return (
    <section id="consultation" className="border-b border-border bg-muted/20 py-20">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 shadow-sm">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              Jadwalkan Konsultasi Teknis
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
              Mulai Transformasi IT & Diskusikan Kebutuhan Sistem Anda
            </h2>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Konsultasikan arsitektur, pemilihan teknologi, dan estimasi timeline dengan tim teknis
              kami secara gratis tanpa komitmen awal.
            </p>
          </div>

          {submitted ? (
            <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-8 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/20 text-primary">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">
                Terima Kasih, Permintaan Anda Telah Diterima!
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Tim Solution Architect kami sedang meninjau detail proyek Anda dan akan mengirimkan tanggapan via email{" "}
                <strong className="text-foreground">{form.email}</strong> dalam 1x24 jam.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-6"
                onClick={() => setSubmitted(false)}
              >
                Kirim Permintaan Konsultasi Lain
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                  id="name"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="company">Nama Perusahaan / Organisasi *</Label>
                <Input
                  id="company"
                  required
                  placeholder="Contoh: PT Teknologi Maju Bersama"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Bisnis *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="budi@perusahaan.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="service">Jenis Layanan IT</Label>
                <select
                  id="service"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                >
                  <option value="Cloud Architecture & DevOps">Cloud Architecture & DevOps</option>
                  <option value="Enterprise Software & Web Apps">Enterprise Software & Web Apps</option>
                  <option value="Cyber Security & Hardening">Cyber Security & Hardening</option>
                  <option value="AI Automation & Data Pipeline">AI Automation & Data Pipeline</option>
                  <option value="IT Managed Services & 24/7 Support">IT Managed Services & 24/7 Support</option>
                  <option value="Mobile & Cross-Platform Apps">Mobile & Cross-Platform Apps</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="budget">Perkiraan Alokasi Anggaran Proyek</Label>
                <select
                  id="budget"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                >
                  <option value="< 50 Juta IDR">&lt; 50 Juta IDR</option>
                  <option value="50 - 150 Juta IDR">50 - 150 Juta IDR</option>
                  <option value="150 - 500 Juta IDR">150 - 500 Juta IDR</option>
                  <option value="> 500 Juta IDR">&gt; 500 Juta IDR (Enterprise)</option>
                  <option value="Belum Ditentukan">Belum Ditentukan / Konsultasi Dulu</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="message">Rincian Kebutuhan atau Tantangan Sistem *</Label>
                <Textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Ceritakan tujuan sistem yang ingin dibangun, jumlah pengguna yang diantisipasi, atau masalah teknis yang sedang dihadapi..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto gap-2">
                  {loading ? (
                    "Mengirimkan Permintaan..."
                  ) : (
                    <>
                      <Send className="size-4" />
                      Kirim Permintaan Konsultasi IT
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
