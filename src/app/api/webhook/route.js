export const runtime = "nodejs";

import crypto from "crypto";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";

/* ------------------ Mongo Models ------------------ */

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

/* New: Submission data store (stores submission payload for easy inspection) */
const SubmissionSchema = new mongoose.Schema(
  {
    submission_id: { type: String, required: true },
    form_id: { type: String, required: true },
    workspace_id: { type: String, required: false },
    data: { type: Object, required: true },
    received_at: { type: Date, required: true },
  },
  { timestamps: true }
);

const Submission =
  mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);

/* ------------------ Signature Verification ------------------ */

function verifySignature(rawBody, secret, timestamp, signature) {
  // Replay protection (5 minutes)
  const now = Math.floor(Date.now() / 1000);
  if (!timestamp || Math.abs(now - Number(timestamp)) > 300) return false;

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
  // TEMPORARY DEBUG LOG (remove after verification)
  console.log("WEBHOOK HIT", {
    method: req.method,
    url: req.url,
    hasSignature: !!req.headers.get("x-forge-signature"),
    hasTimestamp: !!req.headers.get("x-forge-timestamp"),
  });

  try {
    // ---- Read raw body FIRST ----
    const rawBody = await req.text();

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (parseErr) {
      console.warn("Webhook: invalid JSON payload");
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const signature = req.headers.get("x-forge-signature");
    const timestamp = req.headers.get("x-forge-timestamp");

    if (!signature || !timestamp) {
      console.warn("Webhook: missing signature or timestamp headers");
      return NextResponse.json(
        { error: "Missing signature headers" },
        { status: 400 }
      );
    }

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

    // ---- DB write ----
    await connectToDatabase();

    // Save the generic webhook event
    const createdEvent = await WebhookEvent.create({
      event: payload.event || "form.submitted",
      form_id: payload.form_id,
      submission_id:
        payload.submission_id ||
        payload.id ||
        (payload.data && payload.data.id) ||
        "unknown",
      payload,
      received_at: new Date(),
    });

    // If payload contains submission data, also store it in Submission collection
    // Common envelope shape: { data: { ... } } where data is the submission object
    const submissionData = payload.data ?? null;
    if (submissionData) {
      try {
        await Submission.create({
          submission_id:
            payload.submission_id ||
            payload.id ||
            submissionData.id ||
            `s-${Date.now()}`,
          form_id: payload.form_id,
          workspace_id: payload.workspace_id ?? null,
          data: submissionData,
          received_at: new Date(),
        });
      } catch (subErr) {
        console.error("Failed to create Submission record:", subErr);
        // do not fail the webhook — we've already created WebhookEvent
      }
    }

    // Helpful temporary log to confirm DB writes (remove after testing)
    console.log("WEBHOOK STORED", {
      webhookEventId: createdEvent?._id?.toString?.(),
      storedSubmission: !!submissionData,
    });

    // ---- Explicit success ----
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook processing failed:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
