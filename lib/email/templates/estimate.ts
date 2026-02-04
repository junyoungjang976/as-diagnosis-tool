export interface EstimateEmailData {
  customerName: string;
  equipmentName: string;
  totalAmount: number;
  validUntil?: Date;
}

export function getEstimateEmailSubject(data: EstimateEmailData): string {
  return `[부성TK] 견적서 - ${data.customerName}님 (${data.equipmentName})`;
}

export function getEstimateEmailHtml(data: EstimateEmailData): string {
  const validUntilText = data.validUntil
    ? `<p style="color: #666; font-size: 14px; margin: 10px 0;">견적 유효기간: ${data.validUntil.toLocaleDateString('ko-KR')}</p>`
    : '';

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>견적서</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #2563eb; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">부성TK</h1>
              <p style="margin: 5px 0 0 0; color: #e0e7ff; font-size: 14px;">주방설비 A/S 전문</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 20px;">안녕하세요, ${data.customerName}님.</h2>

              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                요청하신 A/S 진단 견적서를 보내드립니다.
              </p>

              <!-- Estimate Summary -->
              <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px;">견적 요약</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">설비명</td>
                    <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right; font-weight: bold;">${data.equipmentName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0;">총 견적금액</td>
                    <td style="padding: 8px 0; color: #2563eb; font-size: 18px; text-align: right; font-weight: bold; border-top: 1px solid #e2e8f0;">${data.totalAmount.toLocaleString('ko-KR')}원</td>
                  </tr>
                </table>
                ${validUntilText}
              </div>

              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                견적서 상세 내용은 첨부된 PDF 파일을 확인해 주시기 바랍니다.
              </p>

              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                궁금하신 사항이 있으시면 언제든지 연락 주시기 바랍니다.
              </p>

              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                감사합니다.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color: #64748b; font-size: 13px; line-height: 1.6;">
                    <strong style="color: #1e293b; display: block; margin-bottom: 10px;">부성티케이 (BUSUNG TK)</strong>
                    전화: 02-1234-5678<br>
                    이메일: contact@busungtk.com<br>
                    홈페이지: www.busungtk.com
                  </td>
                </tr>
              </table>
              <p style="color: #94a3b8; font-size: 12px; margin: 15px 0 0 0; text-align: center;">
                본 메일은 발신 전용입니다. 문의사항은 위 연락처로 연락 주시기 바랍니다.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getEstimateEmailText(data: EstimateEmailData): string {
  const validUntilText = data.validUntil
    ? `\n견적 유효기간: ${data.validUntil.toLocaleDateString('ko-KR')}`
    : '';

  return `
안녕하세요, ${data.customerName}님.

요청하신 A/S 진단 견적서를 보내드립니다.

[견적 요약]
설비명: ${data.equipmentName}
총 견적금액: ${data.totalAmount.toLocaleString('ko-KR')}원${validUntilText}

견적서 상세 내용은 첨부된 PDF 파일을 확인해 주시기 바랍니다.

궁금하신 사항이 있으시면 언제든지 연락 주시기 바랍니다.

감사합니다.

---
부성티케이 (BUSUNG TK)
전화: 02-1234-5678
이메일: contact@busungtk.com
홈페이지: www.busungtk.com
  `.trim();
}
