import { z } from 'zod';

export const customerInfoSchema = z.object({
  name: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().email('유효한 이메일을 입력해주세요').optional().or(z.literal('')),
  location: z.string().optional(),
});

export const checkResultSchema = z.object({
  itemId: z.string(),
  checked: z.boolean(),
  hasProblem: z.boolean(),
  note: z.string().optional(),
});

export const selectedPartSchema = z.object({
  partId: z.string(),
  name: z.string(),
  partNumber: z.string().optional(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().int().nonnegative(),
  checklistItemId: z.string(),
});

export const diagnosisSchema = z.object({
  equipmentId: z.string(),
  customerInfo: customerInfoSchema,
  checkResults: z.array(checkResultSchema),
  selectedParts: z.array(selectedPartSchema),
  notes: z.string().optional(),
}).refine(
  (data) => data.checkResults.some(r => r.checked),
  {
    message: '최소 1개 이상의 체크리스트 항목을 확인해주세요',
    path: ['checkResults'],
  }
);

export type CustomerInfo = z.infer<typeof customerInfoSchema>;
export type CheckResult = z.infer<typeof checkResultSchema>;
export type SelectedPart = z.infer<typeof selectedPartSchema>;
export type DiagnosisFormData = z.infer<typeof diagnosisSchema>;
