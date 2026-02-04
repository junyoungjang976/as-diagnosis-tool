import { renderToBuffer } from '@react-pdf/renderer';
import { EstimatePDFTemplate, type EstimatePDFData } from './estimateTemplate';
import { generateEstimateNumber, calculateValidUntil } from './index';

interface EstimateWithRelations {
  id: string;
  parts: string;
  laborCost: number;
  travelCost: number;
  totalAmount: number;
  validUntil: Date | null;
  notes: string | null;
  createdAt: Date;
  diagnosis: {
    customerName: string | null;
    customerContact: string | null;
    customerEmail: string | null;
    location: string | null;
    notes: string | null;
    equipment: {
      name: string;
      model: string | null;
      category: {
        name: string;
      };
    };
  };
}

export async function generateEstimatePDF(
  estimate: EstimateWithRelations
): Promise<Buffer> {
  // Parse parts JSON
  const parts = JSON.parse(estimate.parts);

  // Calculate subtotal (parts + labor + travel)
  const partsTotal = parts.reduce((sum: number, part: any) => sum + part.total, 0);
  const subtotal = partsTotal + estimate.laborCost + estimate.travelCost;
  const vat = Math.round(subtotal * 0.1); // 10% VAT
  const total = subtotal + vat;

  // Get diagnosis summary from notes
  const diagnosisSummary = estimate.diagnosis.notes
    ? estimate.diagnosis.notes.split('\n').filter((line: string) => line.trim())
    : [];

  // Prepare PDF data
  const pdfData: EstimatePDFData = {
    estimateNumber: generateEstimateNumber(),
    issueDate: estimate.createdAt,
    validUntil: estimate.validUntil || calculateValidUntil(estimate.createdAt),
    customerName: estimate.diagnosis.customerName || '고객',
    customerContact: estimate.diagnosis.customerContact || '-',
    location: estimate.diagnosis.location || '-',
    equipmentName: estimate.diagnosis.equipment.name,
    equipmentType: estimate.diagnosis.equipment.category.name,
    diagnosisDate: estimate.createdAt,
    diagnosisSummary,
    parts: parts.map((part: any) => ({
      name: part.name,
      spec: part.partNumber || undefined,
      quantity: part.quantity,
      unitPrice: part.unitPrice,
      total: part.total,
    })),
    laborCost: estimate.laborCost,
    travelCost: estimate.travelCost,
    subtotal,
    vat,
    total,
    notes: estimate.notes || undefined,
  };

  // Generate PDF
  const pdfBuffer = await renderToBuffer(
    <EstimatePDFTemplate data={pdfData} />
  );

  return pdfBuffer;
}
