import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "localhost",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (process.env.DISABLE_EMAIL === "true") {
    console.log("[EMAIL DISABLED]", options.to, options.subject);
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "PULSE <noreply@pulse.local>",
    ...options,
  });
}
