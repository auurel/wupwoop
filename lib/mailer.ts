import nodemailer from 'nodemailer';

type SendAdminForgotPasswordEmailParams = {
  to: string;
  adminName?: string | null;
  resetUrl: string;
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration is incomplete');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendAdminForgotPasswordEmail({ to, resetUrl, adminName }: SendAdminForgotPasswordEmailParams) {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  if (!from) {
    throw new Error('EMAIL_FROM is not configured');
  }

  const transporter = getTransporter();
  const displayName = adminName?.trim() || 'Admin Muzayyan';

  await transporter.sendMail({
    from,
    to,
    subject: 'Reset Password Admin Muzayyan',
    text: [
      `Halo ${displayName},`,
      '',
      'Kami menerima permintaan reset password untuk akun admin Anda.',
      'Gunakan tautan berikut untuk mengatur ulang password:',
      resetUrl,
      '',
      'Tautan ini berlaku selama 30 menit.',
      '',
      'Jika Anda tidak meminta reset password, abaikan email ini.',
      '',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <p>Halo ${displayName},</p>
        <p>Kami menerima permintaan reset password untuk akun admin Anda.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;">
            Reset Password Sekarang
          </a>
        </p>
        <p style="word-break:break-all;">Atau buka tautan ini: <a href="${resetUrl}">${resetUrl}</a></p>
        <p>Tautan ini berlaku selama 30 menit.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
      </div>
    `,
  });
}