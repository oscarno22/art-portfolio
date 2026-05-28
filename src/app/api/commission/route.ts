import { NextResponse } from "next/server";
import { Resend } from "resend";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    email?: string;
    description?: string;
    budget?: string;
  };

  const { name, email, description, budget } = body;

  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    typeof email !== "string" ||
    !email.includes("@") ||
    typeof description !== "string" ||
    description.trim().length === 0
  ) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  const artistEmail = process.env.ARTIST_EMAIL;
  if (!artistEmail || !process.env.RESEND_API_KEY) {
    logger.warn("commission.email_skipped_missing_config");
    return NextResponse.json({ ok: true });
  }

  const budgetLine = budget
    ? `<p><strong>Budget:</strong> ${esc(budget)}</p>`
    : "";

  try {
    await getResend().emails.send({
      from: "Dink's Gallery <onboarding@resend.dev>",
      to: artistEmail,
      replyTo: email.trim(),
      subject: `Commission inquiry from ${esc(name.trim())}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1c1917;">
          <h1 style="font-size: 22px; margin: 0 0 24px;">New commission inquiry</h1>
          <p><strong>Name:</strong> ${esc(name.trim())}</p>
          <p><strong>Email:</strong> ${esc(email.trim())}</p>
          ${budgetLine}
          <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 20px 0;" />
          <p style="white-space: pre-wrap;">${esc(description.trim())}</p>
          <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 20px 0;" />
          <p style="font-size: 13px; color: #78716c;">Reply directly to this email to respond to ${esc(name.trim())}.</p>
        </div>
      `,
    });

    logger.info("commission.inquiry_sent");
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error("commission.send_failed", { error: message });
    return NextResponse.json(
      { error: "Could not send your message. Please try again." },
      { status: 500 }
    );
  }
}
