type NotifyMethod = "email" | "sms";

export async function notifyUser(params: {
  userId: string;
  method: NotifyMethod;
  movie: { id: string; title: string; rating: number | null };
}) {
  const { method, movie, userId } = params;

  if (method === "email") {
    return sendEmailNotification({ userId, movie });
  } else if (method === "sms") {
    return sendSmsNotification({ userId, movie });
  }
}

async function sendEmailNotification({
  userId,
  movie,
}: {
  userId: string;
  movie: { id: string; title: string; rating: number | null };
}) {
  const key = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL;

  // In a real app, you'd look up the user's email by userId
  // For MVP, this is a placeholder
  const to = process.env.NOTIFY_TEST_EMAIL;

  if (!key || !from || !to) {
    console.log("[notify] Email placeholder:", { userId, to, movie });
    return { ok: true, placeholder: true };
  }

  // Lazy import to avoid dependency unless configured
  // const sgMail = await import("@sendgrid/mail");
  // sgMail.default.setApiKey(key);
  // const subject = `New movie alert: ${movie.title}`;
  // const text = `A new movie (${movie.title}) is now playing. IMDb rating: ${movie.rating ?? "N/A"}.`;
  // await sgMail.default.send({ to, from, subject, text });
  // return { ok: true };
}

async function sendSmsNotification({
  userId,
  movie,
}: {
  userId: string;
  movie: { id: string; title: string; rating: number | null };
}) {
  const smsKey = process.env.SMS_API_KEY;
  const smsFrom = process.env.SMS_FROM;
  const phone = process.env.NOTIFY_TEST_PHONE;
  if (!smsKey || !smsFrom || !phone) {
    console.log("[notify] SMS placeholder:", { userId, phone, movie });
    return { ok: true, placeholder: true };
  }

  // Example placeholder for a generic SMS API
  try {
    await fetch(process.env.SMS_API_URL || "https://example-sms-provider/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${smsKey}` },
      body: JSON.stringify({ from: smsFrom, to: phone, text: `New movie: ${movie.title} (${movie.rating ?? "N/A"})` }),
    });
  } catch (e) {
    console.error("SMS send failed", e);
  }
  return { ok: true };
}

