export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Clean email service abstraction.
 * Supports Resend API key when provided, otherwise logs to console gracefully.
 */
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: "Cash for Houses Summit <notifications@cashforhousessummit.com>",
          to,
          subject,
          html,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, id: data.id };
      }
    } catch (err) {
      console.error("[Email Dispatch Error]", err);
    }
  }

  // Development / Demo Fallback Logging
  console.log("=========================================");
  console.log(`[EMAIL DISPATCH - DEV SIMULATION]`);
  console.log(`TO: ${to}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`BODY SUMMARY: ${html.substring(0, 150)}...`);
  console.log("=========================================");

  return { success: true, id: `dev_sim_${Date.now()}` };
}

export function getEmailHeader(title: string): string {
  return `
    <div style="background-color: #1E2022; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="color: #FFFFFF; font-family: sans-serif; font-size: 22px; margin: 0;">CASH FOR HOUSES SUMMIT</h1>
      <p style="color: #E88D23; font-family: sans-serif; font-size: 13px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">${title}</p>
    </div>
  `;
}

export function getEmailFooter(): string {
  return `
    <div style="background-color: #F8FAFC; padding: 16px; border-top: 1px solid #E2E8F0; text-align: center; font-family: sans-serif; font-size: 12px; color: #64748B; border-radius: 0 0 8px 8px;">
      <p style="margin: 0;">© ${new Date().getFullYear()} Cash for Houses Summit. Direct Home Buying Platform Since 2011.</p>
      <p style="margin: 4px 0 0 0;">This is an automated notification from your Cash for Houses Summit Account.</p>
    </div>
  `;
}

export function buildNotificationEmail({ title, body, ctaText, ctaUrl }: { title: string; body: string; ctaText?: string; ctaUrl?: string }): string {
  return `
    <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
      ${getEmailHeader(title)}
      <div style="padding: 32px 24px; color: #1E2022; line-height: 1.6;">
        <div style="font-size: 15px; margin-bottom: 24px;">${body}</div>
        ${
          ctaText && ctaUrl
            ? `<div style="text-align: center; margin: 32px 0;">
                <a href="${ctaUrl}" style="background-color: #E88D23; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block;">${ctaText}</a>
              </div>`
            : ""
        }
      </div>
      ${getEmailFooter()}
    </div>
  `;
}
