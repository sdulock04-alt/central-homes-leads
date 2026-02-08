import LeadForm from "@/components/LeadForm";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        padding: "40px 16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: 32,
        }}
      >
        {/* Left content */}
        <section style={{ color: "white" }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>
            Get Your Free Home Improvement Estimate
          </h1>

          <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 600 }}>
            Roofing, siding, and window replacements done right — clear pricing,
            quality installs, and real warranties.
          </p>
        </section>

        {/* Right form */}
        <aside>
          <LeadForm />
        </aside>
      </div>
    </main>
  );
}
