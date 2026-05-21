import { BRAND, PRODUCT_NAME, SUPPORT_EMAIL } from '@/lib/i18n/brand';

interface IWelcomeEmail {
  subject: string;
  html: string;
  text: string;
}

interface IBuildWelcomeEmailInput {
  unsubscribeUrl: string;
  recipeManualUrl: string;
}

export function buildWelcomeEmail({
  unsubscribeUrl,
  recipeManualUrl,
}: IBuildWelcomeEmailInput): IWelcomeEmail {
  const subject = `You're on the list, commander. — ${BRAND}`;

  const text = [
    `Welcome aboard, commander.`,
    ``,
    `You're officially on the ${BRAND} pre-launch roster. We'll ping you the moment ${PRODUCT_NAME} ships.`,
    ``,
    `What you've locked in:`,
    `  - Early-bird discount: 10% off your first order`,
    `  - Recipe Manual PDF — tactical drink recipes for your squad`,
    `  - First-wave access before the public launch`,
    ``,
    `Download the Recipe Manual: ${recipeManualUrl}`,
    ``,
    `Stay tactical. Stand by for orders.`,
    ``,
    `— ${BRAND} HQ`,
    ``,
    `18+ only. Always drink responsibly and line up a designated driver.`,
    `Questions? Reply to this email or write us at ${SUPPORT_EMAIL}.`,
    ``,
    `Don't want these emails? Stand down here: ${unsubscribeUrl}`,
  ].join('\n');

  // Email-safe HTML: table layout, inline styles, web-safe fonts, no external CSS.
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#1f2516;font-family:Arial,Helvetica,sans-serif;color:#131210;">
  <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">
    Early-bird 10% off + Recipe Manual PDF inside — locked in.
  </span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1f2516;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ede4cf;border:3px solid #131210;box-shadow:8px 8px 0 #c9472f;">
          <tr>
            <td style="padding:24px 28px 8px 28px;border-bottom:2px solid #131210;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.2em;color:#c9472f;text-transform:uppercase;">
                    // pre-launch roster
                  </td>
                  <td align="right" style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.2em;color:#131210;text-transform:uppercase;">
                    Confidential · 18+
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px 28px;">
              <p style="margin:0;font-family:'Courier New',monospace;font-size:12px;letter-spacing:0.18em;color:#131210;text-transform:uppercase;">
                Drunken Arsenal HQ
              </p>
              <h1 style="margin:8px 0 0 0;font-family:Impact,'Arial Black',sans-serif;font-size:34px;line-height:1.05;letter-spacing:0.02em;color:#131210;text-transform:uppercase;">
                Welcome aboard,<br>commander.
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 8px 28px;">
              <p style="margin:0 0 14px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#131210;">
                You're officially on the <strong>${escapeHtml(BRAND)}</strong> pre-launch roster. We'll ping you the moment <strong>${escapeHtml(PRODUCT_NAME)}</strong> ships.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#353c28;border:3px solid #131210;">
                <tr>
                  <td style="padding:18px 22px;">
                    <p style="margin:0 0 12px 0;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.2em;color:#e8a93a;text-transform:uppercase;">
                      // mission perks locked in
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#ede4cf;">
                          <span style="color:#e8a93a;font-weight:bold;">·</span>&nbsp;&nbsp;<strong>Early-bird discount</strong> — 10% off your first order
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#ede4cf;">
                          <span style="color:#e8a93a;font-weight:bold;">·</span>&nbsp;&nbsp;<strong>Recipe Manual PDF</strong> — tactical drink recipes for your squad
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#ede4cf;">
                          <span style="color:#e8a93a;font-weight:bold;">·</span>&nbsp;&nbsp;<strong>First-wave access</strong> before the public launch
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px 28px 8px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#c9472f;border:3px solid #131210;box-shadow:4px 4px 0 #131210;">
                    <a href="${escapeHtml(recipeManualUrl)}" style="display:inline-block;padding:14px 28px;font-family:Impact,'Arial Black',sans-serif;font-size:16px;letter-spacing:0.08em;color:#ede4cf;text-decoration:none;text-transform:uppercase;">
                      Download Recipe Manual →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:10px 0 0 0;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.1em;color:#131210;opacity:0.7;text-transform:uppercase;">
                PDF · ~1.4&nbsp;MB
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 8px 28px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#131210;">
                Stay tactical. Stand by for orders — we'll send the green light when the launch operation goes live.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 24px 28px;">
              <p style="margin:0;font-family:'Courier New',monospace;font-size:13px;letter-spacing:0.12em;color:#131210;text-transform:uppercase;">
                — ${escapeHtml(BRAND)} HQ
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 28px;background-color:#d8cca8;border-top:2px solid #131210;">
              <p style="margin:0;font-family:'Courier New',monospace;font-size:11px;line-height:1.6;letter-spacing:0.05em;color:#353c28;text-transform:uppercase;">
                18+ only · Drink responsibly · Line up a designated driver
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 28px 18px 28px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#131210;">
                Questions? Reply to this email or write us at <a href="mailto:${escapeHtml(SUPPORT_EMAIL)}" style="color:#8a3a2a;text-decoration:underline;">${escapeHtml(SUPPORT_EMAIL)}</a>.
              </p>
              <p style="margin:8px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:#131210;opacity:0.65;">
                You're receiving this because you signed up at drunkenarsenal.com. Don't want these? <a href="${escapeHtml(unsubscribeUrl)}" style="color:#8a3a2a;text-decoration:underline;">Stand down here</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
