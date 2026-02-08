"use client";

import * as React from "react";

export default function LeadForm() {
  const formStartMs = React.useRef<number>(Date.now());
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const fd = new FormData(e.currentTarget);

    const firstName = String(fd.get("firstName") || "").trim();
    const lastName = String(fd.get("lastName") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const propertyType = String(fd.get("propertyType") || "").trim();
    const address = String(fd.get("address") || "").trim();
    const service = String(fd.get("service") || "").trim();

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          phone,
          email,
          address,
          services: service ? [service] : [],
          notes: propertyType ? `Property Type: ${propertyType}` : undefined,
          website: "", // honeypot
          formStartMs: formStartMs.current,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Submission failed.");
      } else {
        setSuccess(true);
        (e.currentTarget as HTMLFormElement).reset();
        formStartMs.current = Date.now();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, background: "white" }}>
      <h3 style={{ margin: 0, fontWeight: 700 }}>Contact Us Today to Schedule Your Free Estimate</h3>

      <form onSubmit={onSubmit} style={{ marginTop: 12, display: "grid", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input name="firstName" placeholder="First Name" required />
          <input name="lastName" placeholder="Last Name" required />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input name="email" placeholder="Your Email" type="email" />
          <input name="phone" placeholder="Phone" required />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <select name="propertyType" defaultValue="">
            <option value="">Select Property Type</option>
            <option>Single Family</option>
            <option>Townhome</option>
            <option>Condo</option>
            <option>Mobile Home</option>
            <option>Commercial</option>
          </select>
          <input name="address" placeholder="Address" />
        </div>

        <select name="service" required defaultValue="">
          <option value="">Please choose service</option>
          <option value="Roofing">Roofing</option>
          <option value="Siding">Siding</option>
          <option value="Windows">Windows</option>
        </select>

        {error && <div style={{ color: "#b91c1c", fontSize: 14 }}>{error}</div>}
        {success && <div style={{ color: "#15803d", fontSize: 14 }}>✅ Got it — we’ll reach out shortly.</div>}

        <button type="submit" disabled={loading} style={{ padding: "10px 12px", fontWeight: 700 }}>
          {loading ? "Sending..." : "Get an Estimate"}
        </button>
      </form>
    </div>
  );
}
