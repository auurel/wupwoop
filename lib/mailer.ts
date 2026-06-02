import nodemailer from 'nodemailer';

type SendAdminForgotPasswordEmailParams = {
  to: string;
  adminName?: string | null;
  otp: string;
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

export async function sendAdminForgotPasswordEmail({ to, otp, adminName }: SendAdminForgotPasswordEmailParams) {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  if (!from) {
    throw new Error('EMAIL_FROM is not configured');
  }

  const transporter = getTransporter();
  const displayName = adminName?.trim() || 'Admin Muzayyan';

  await transporter.sendMail({
    from,
    to,
    subject: 'Kode OTP Reset Password Admin Muzayyan',
    text: [
      `Halo ${displayName},`,
      '',
      'Kami menerima permintaan reset password untuk akun admin Anda.',
      `Kode OTP Anda: ${otp}`,
      '',
      'Kode ini berlaku selama 10 menit.',
      '',
      'Masukkan kode ini di halaman reset password untuk mengatur ulang password.',
      '',
      'Jika Anda tidak meminta reset password, abaikan email ini.',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <p>Halo ${displayName},</p>
        <p>Kami menerima permintaan reset password untuk akun admin Anda.</p>
        <p>
          Kode OTP Anda:
        </p>
        <p style="font-size:24px;font-weight:700;letter-spacing:4px;background:#fff7ed;display:inline-block;padding:12px 18px;border-radius:10px;border:1px dashed #fb923c;">${otp}</p>
        <p>Kode ini berlaku selama 10 menit.</p>
        <p>Masukkan kode ini di halaman reset password untuk mengatur ulang password.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
      </div>
    `,
  });
}