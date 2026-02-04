import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import {
  getEstimateEmailSubject,
  getEstimateEmailHtml,
  getEstimateEmailText,
  type EstimateEmailData,
} from './templates/estimate';

// Create reusable transporter
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
      throw new Error('이메일 설정이 올바르지 않습니다. 환경 변수를 확인해주세요.');
    }

    transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: parseInt(port) === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });
  }

  return transporter;
}

export interface SendEstimateEmailParams {
  to: string;
  estimateData: EstimateEmailData;
  pdfBuffer: Buffer;
  pdfFilename?: string;
}

export async function sendEstimateEmail({
  to,
  estimateData,
  pdfBuffer,
  pdfFilename = '견적서.pdf',
}: SendEstimateEmailParams): Promise<void> {
  try {
    const transporter = getTransporter();
    const from = process.env.SMTP_FROM || 'noreply@busungtk.com';

    const subject = getEstimateEmailSubject(estimateData);
    const html = getEstimateEmailHtml(estimateData);
    const text = getEstimateEmailText(estimateData);

    await transporter.sendMail({
      from: `부성TK <${from}>`,
      to,
      subject,
      text,
      html,
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });
  } catch (error) {
    console.error('이메일 전송 실패:', error);
    throw new Error('이메일 전송에 실패했습니다. 나중에 다시 시도해주세요.');
  }
}

// Test email configuration
export async function testEmailConfiguration(): Promise<boolean> {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('이메일 설정 검증 실패:', error);
    return false;
  }
}
