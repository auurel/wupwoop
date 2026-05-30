import nodemailer from 'nodemailer';

type SmtpSettings = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

function getSmtpSettings(): SmtpSettings | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  const parsedPort = Number(port);
  if (Number.isNaN(parsedPort)) {
    return null;
  }

  const secure = parsedPort === 465;
  const from = process.env.EMAIL_FROM || `Muzayyan Admin <${user}>`;

  return {
    host,
    port: parsedPort,
    secure,
    user,
    pass,
    from,
  };
}

export function isEmailConfigured() {
  return Boolean(getSmtpSettings());
}

export async function sendResetPasswordEmail(to: string, resetUrl: string) {
  const settings = getSmtpSettings();

  if (!settings) {
    throw new Error('Konfigurasi email SMTP belum lengkap');
  }

  const transporter = nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: {
      user: settings.user,
      pass: settings.pass,
    },
  });

  await transporter.sendMail({
    from: settings.from,
    to,
    subject: 'Reset Password Admin Muzayyan',
    text: `Kami menerima permintaan reset password untuk akun admin Anda.\n\nBuka tautan berikut untuk mengatur ulang password:\n${resetUrl}\n\nTautan ini berlaku 30 menit. Jika Anda tidak meminta reset password, abaikan email ini.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 8px;">Reset Password Admin Muzayyan</h2>
        <p>Kami menerima permintaan reset password untuk akun admin Anda.</p>
        <p>
          Klik tautan berikut untuk mengatur ulang password:<br/>
          <a href="${resetUrl}" target="_blank" rel="noopener noreferrer">${resetUrl}</a>
        </p>
        <p>Tautan ini berlaku selama <strong>30 menit</strong>.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
      </div>
    `,
  });
}
