import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type LeadBody = {
  name?: string;
  phone?: string;
  email?: string;
  services?: string[];
  address?: string;
  city?: string;
  zip?: string;
  timeframe?: string;
  notes?: string;

  // anti-spam (optional)
  website?: string;     // honeypot (should be empty)
  formStartMs?: number; // Date.now() when form opened
};

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Lead API live" });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadBody;

    // Honeypot
    if (body.website && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Timing check
    if (typeof body.formStartMs === "number") {
      const elapsed = Date.now() - body.formStartMs;
      if (elapsed < 1200) return NextResponse.json({ ok: true }, { status: 200 });
    }

    const name = (body.name ?? "").trim();
    const phone = (body.phone ?? "").trim();
    const email = (body.email ?? "").trim();

    if (name.length < 2) {
      return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json({ ok: false, error: "Valid phone is required." }, { status: 400 });
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Valid email required." }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { ok: false, error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from("leads").insert({
      name,
      phone,
      email: email || null,
      services: Array.isArray(body.services) ? body.services : [],
      address: body.address?.trim() || null,
      city: body.city?.trim() || null,
      zip: body.zip?.trim() || null,
      timeframe: body.timeframe?.trim() || null,
      notes: body.notes?.trim() || null,
      source: "central-homes-website",
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: `Supabase insert failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
}
