import crypto from "crypto";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";

/* ------------------ Mongo Model ------------------ */

const WebhookEventSchema = new mongoose.Schema(
  {
    event: { type: String, required: true },
    form_id: { type: String, required: true },
    submission_id: { type: String, required: true },
    payload: { type: Object, required: true },
    received_at: { type: Date, required: true },
  },
  { timestamps: true }
);

const WebhookEvent =
  mongoose.models.WebhookEvent ||
  mongoose.model("WebhookEvent", WebhookEventSchema);

/* ------------------ Signature Verification ------------------ */

function verifySignature(rawBody, secret, timestamp, signature) {
  if (!signature || !timestamp) return false;

  // Replay protection (5 min window)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > 300) return false;

  const signedPayload = `${timestamp}.${rawBody}`;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(signature, "hex")
    );
  } catch {
    return false;
  }
}

/* ------------------ POST Handler ------------------ */

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);

    const signature = req.headers.get("x-forge-signature");
    const timestamp = req.headers.get("x-forge-timestamp");

    const secret = process.env.FORGE_WEBHOOK_SECRET;
    if (!secret) {
      console.error("❌ FORGE_WEBHOOK_SECRET missing");
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }

    const isValid = verifySignature(rawBody, secret, timestamp, signature);

    if (!isValid) {
      console.warn("⚠️ Invalid Forge webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    await connectToDatabase();

    await WebhookEvent.create({
      event: payload.event || "form.submitted",
      form_id: payload.form_id,
      submission_id: payload.submission_id || payload.id,
      payload,
      received_at: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Webhook processing failed:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
