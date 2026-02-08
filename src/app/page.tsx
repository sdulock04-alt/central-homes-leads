export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "system-ui", maxWidth: 600 }}>
      <h1>FREE Home Improvement Estimate</h1>

      <p><strong>Steve Central Homes</strong></p>
      <p>Roofing • Windows • Siding</p>
      <p>Florida • Local • Trusted</p>

      <hr style={{ margin: "30px 0" }} />

      <h2>What can we help you with?</h2>

      <div style={{ display: "grid", gap: 12 }}>
        <a href="#form"><button>🏠 Free Roof Estimate</button></a>
        <a href="#form"><button>🪟 Windows Quote</button></a>
        <a href="#form"><button>🧱 Siding Quote</button></a>
        <a href="#form"><button>💬 Not Sure? Talk to a Pro</button></a>
      </div>

      <hr style={{ margin: "40px 0" }} />

      <h2 id="form">Book Your Free Estimate</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const data = {
            full_name: form.full_name.value,
            phone: form.phone.value,
            email: form.email.value,
            service: form.service.value,
            notes: form.notes.value,
          };

          await fetch("/api/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          alert("Thanks! We’ll contact you shortly.");
          form.reset();
        }}
        style={{ display: "grid", gap: 12 }}
      >
        <input name="full_name" placeholder="Full Name" required />
        <input name="phone" placeholder="Phone Number" required />
        <input name="email" placeholder="Email (optional)" />
        
        <select name="service" required>
          <option value="">Select Service</option>
          <option value="roofing">Roofing</option>
          <option value="windows">Windows</option>
          <option value="siding">Siding</option>
        </select>

        <textarea name="notes" placeholder="Tell us a little about your project"></textarea>

        <button type="submit">📅 Book Free Estimate</button>
      </form>
    </main>
  );
}