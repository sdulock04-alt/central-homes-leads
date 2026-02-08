import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function asString(v: unknown) {
  if (typeof v === "string") return v.trim();
  return "";
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // Accept either { name } OR { firstName, lastName }
    const name =
      asString(body.name) ||
      `${asString(body.firstName)} ${asString(body.lastName)}`.trim();

    const phone = asString(body.phone);

    // Accept either { service: "Roofing" } OR { services: ["Roofing"] }
    const service =
      asString(body.service) ||
      (Array.isArray(body.services) ? asString(body.services[0]) : "");

    const email = asString(body.email) || null;
    const address = asString(body.address) || null;
    const city = asString(body.city) || null;
    const state = asString(body.state) || null;
    const zip = asString(body.zip) || null;
    const notes = asString(body.notes) || null;

    // Spam honeypot support (optional)
    const website = asString(body.website);
    if (website) {
      return NextResponse.json({ success: true }); // silently ignore bots
    }

    // Required fields
    if (!name || !phone || !service) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["name", "phone", "service"],
          received: { name: !!name, phone: !!phone, service: !!service },
        },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("leads").insert([
      {
        full_name: name, // ✅ matches your Supabase column
        phone,
        email,
        service,
        address,
        city,
        state,
        zip,
        notes,
        source: "central-homes-website",
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Supabase insert failed", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
