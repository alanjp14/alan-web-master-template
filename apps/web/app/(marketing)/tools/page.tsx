"use client";

import { useState } from "react";
import {
  Globe,
  KeyRound,
  Lock,
  Network,
  Terminal,
  Zap,
} from "lucide-react";
import {
  DnsLookupTool,
  HttpStatusTool,
  PasswordGeneratorTool,
  SslCheckerTool,
  SubnetCalculatorTool,
} from "@/features/tools";

type ToolTab = "dns" | "ssl" | "http" | "subnet" | "password";

const toolTabs: Array<{ id: ToolTab; label: string; icon: typeof Globe; desc: string }> = [
  { id: "dns", label: "DNS Lookup", icon: Globe, desc: "Kueri record A, AAAA, MX, TXT, NS" },
  { id: "ssl", label: "SSL / TLS Checker", icon: Lock, desc: "Validasi masa berlaku & CA" },
  { id: "http", label: "HTTP Inspector", icon: Zap, desc: "Cek latensi & security headers" },
  { id: "subnet", label: "Subnet Calculator", icon: Network, desc: "Kalkulator IPv4 CIDR & host" },
  { id: "password", label: "Password & Token", icon: KeyRound, desc: "Generator acak kriptografis" },
];

export default function WebToolsPage() {
  const [activeTab, setActiveTab] = useState<ToolTab>("dns");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <Terminal className="size-3.5" />
          <span>High-Performance Bun.js Backend API</span>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
          Suite Web Tools Diagnostik & Utilitas IT
        </h1>
        <p className="mt-3 text-base text-muted-foreground text-pretty">
          Koleksi alat bantu teknis untuk pengembang software, DevOps, dan administrator jaringan.
          Cepat, akurat, dan diproses langsung oleh runtime Bun.js.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
        {toolTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <tab.icon className="size-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Active Tool Content */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        {activeTab === "dns" && <DnsLookupTool />}
        {activeTab === "ssl" && <SslCheckerTool />}
        {activeTab === "http" && <HttpStatusTool />}
        {activeTab === "subnet" && <SubnetCalculatorTool />}
        {activeTab === "password" && <PasswordGeneratorTool />}
      </div>
    </div>
  );
}
