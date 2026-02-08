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
    const body = await req.json().catch(() => ({} as any));

    // Honeypot (optional): if filled, treat as bot and "succeed"
    const website = asString((body as any).website);
    if (website) {
      return NextResponse.json({ success: true });
    }

    // Accept either { name } OR { firstName, lastName } OR { full_name }
    const name =
      asString((body as any).name) ||
      asString((body as any).full_name) ||
      `${asString((body as any).firstName)} ${asString((body as any).lastName)}`.trim();

    const phone = asString((body as any).phone);

    // Accept either { service } OR { services: [...] }
    const service =
      asString((body as any).service) ||
      (Array.isArray((body as any).services) ? asString((body as any).services[0]) : "");

    const email = asString((body as any).email) || null;
    const address = asString((body as any).address) || null;
    const city = asString((body as any).city) || null;
    const state = asString((body as any).state) || null;
    const zip = asString((body as any).zip) || null;
    const notes = asString((body as any).notes) || null;
    const timeline = asString((body as any).timeline) || null;
    const county = asString((body as any).county) || null;

    // Required fields
    if (!name || !phone || !service) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["name", "phone", "service"],
          received: { name: !!name, phone: !!phone, service: !!service },
        },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("leads").insert([
      {
        full_name: name,
        phone,
        email,
        service,
        address,
        city,
        state,
        zip,
        county,
        timeline,
        notes,
        source: "central-homes-website",
        homeowner: true,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: "Supabase insert failed", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
