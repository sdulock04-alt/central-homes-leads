export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "system-ui", maxWidth: 600 }}>
      <h1>FREE Home Improvement Estimate</h1>

      <p>
        <strong>Steve Central Homes</strong>
      </p>
      <p>Roofing • Windows • Siding</p>
      <p>Florida • Local • Trusted</p>

      <hr style={{ margin: "30px 0" }} />

      <h2>What can we help you with?</h2>

      <div style={{ display: "grid", gap: 12 }}>
        <a href="#form">
          <button type="button">🏠 Free Roof Estimate</button>
        </a>
        <a href="#form">
          <button type="button">🪟 Windows Quote</button>
        </a>
        <a href="#form">
          <button type="button">🧱 Siding Quote</button>
        </a>
        <a href="#form">
          <button type="button">💬 Not Sure? Talk to a Pro</button>
        </a>
      </div>

      <hr style={{ margin: "40px 0" }} />

      <h2 id="form">Book Your Free Estimate</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const form = e.currentTarget as typeof e.currentTarget & {
            full_name: { value: string };
            phone: { value: string };
            email: { value: string };
            service: { value: string };
            notes: { value: string };
            company: { value: string }; // honeypot
          };

          const payload = {
            full_name: form.full_name.value.trim(),
            phone: form.phone.value.trim(),
            email: form.email.value.trim(),
            service: form.service.value,
            notes: form.notes.value.trim(),
            company: form.company.value, // honeypot
          };

          const res = await fetch("/api/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            alert("Something went wrong. Please try again.");
            return;
          }

          alert("Thanks! We’ll contact you shortly.");
          (e.target as HTMLFormElement).reset();
        }}
        style={{ display: "grid", gap: 12 }}
      >
        <input name="full_name" placeholder="Full Name" required />
        <input name="phone" placeholder="Phone Number" required />
        <input name="email" placeholder="Email (optional)" />

        <select name="service" required defaultValue="">
          <option value="" disabled>
            Select Service
          </option>
          <option value="roofing">Roofing</option>
          <option value="windows">Windows</option>
          <option value="siding">Siding</option>
        </select>

        <textarea
          name="notes"
          placeholder="Tell us a little about your project"
          rows={4}
        />

        {/* Honeypot (spam trap) - humans won't fill this */}
        <input
          name="company"
          placeholder="Company"
          tabIndex={-1}
          autoComplete="off"
          style={{
            position: "absolute",
            left: "-9999px",
            height: 0,
            width: 0,
            opacity: 0,
          }}
        />

        <button type="submit">📅 Book Free Estimate</button>
      </form>
    </main>
  );
}