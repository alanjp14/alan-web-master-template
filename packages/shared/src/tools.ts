/**
 * Type definitions for IT Web Tools shared between the frontend (@app/web)
 * and the Bun backend (@app/api).
 */

// 1. DNS Lookup
export interface DnsRecord {
  type: string;
  value: string;
  priority?: number;
  ttl?: number;
}

export interface DnsLookupRequest {
  domain: string;
  recordType?: "A" | "AAAA" | "MX" | "TXT" | "NS" | "CNAME" | "SOA" | "ANY";
}

export interface DnsLookupResponse {
  domain: string;
  recordType: string;
  records: DnsRecord[];
  responseTimeMs: number;
}

// 2. SSL / TLS Certificate Checker
export interface SslCheckRequest {
  domain: string;
  port?: number;
}

export interface SslCheckResponse {
  domain: string;
  port: number;
  valid: boolean;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  protocol: string;
  cipher?: string;
  authorized: boolean;
  error?: string;
}

// 3. HTTP Status & Security Header Inspector
export interface HttpStatusRequest {
  url: string;
}

export interface SecurityHeaderAudit {
  hsts: boolean;
  csp: boolean;
  xFrameOptions: boolean;
  xContentTypeOptions: boolean;
  referrerPolicy: boolean;
}

export interface HttpStatusResponse {
  url: string;
  status: number;
  statusText: string;
  responseTimeMs: number;
  headers: Record<string, string>;
  securityAudit: SecurityHeaderAudit;
}

// 4. Subnet / CIDR IP Calculator
export interface SubnetCalcRequest {
  ip: string;
  prefix: number; // 0 - 32
}

export interface SubnetCalcResponse {
  ip: string;
  prefix: number;
  netmask: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableIp: string;
  lastUsableIp: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
}
