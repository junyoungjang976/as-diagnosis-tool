/**
 * 견적서 PDF 템플릿
 * @react-pdf/renderer를 사용한 한국어 견적서
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { formatCurrency, formatDate } from './index';

// 한글 폰트 등록 (Noto Sans KR 웹폰트 사용)
Font.register({
  family: 'NotoSansKR',
  src: 'https://fonts.gstatic.com/s/notosanskr/v36/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuoyeLTq8H4hfeE.ttf',
});

// 스타일 정의
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'NotoSansKR',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    width: 140,
    fontSize: 9,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  headerLabel: {
    width: 60,
    color: '#666',
  },
  headerValue: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    padding: 12,
    border: '1px solid #ddd',
    borderRadius: 4,
    backgroundColor: '#f9fafb',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    width: 80,
    color: '#4b5563',
    fontSize: 9,
  },
  infoValue: {
    flex: 1,
    fontSize: 9,
  },
  diagnosisSection: {
    marginBottom: 20,
  },
  diagnosisList: {
    marginTop: 8,
    paddingLeft: 12,
  },
  diagnosisItem: {
    flexDirection: 'row',
    marginBottom: 4,
    fontSize: 9,
  },
  bullet: {
    width: 20,
    color: '#ef4444',
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    color: 'white',
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
    padding: 8,
    fontSize: 9,
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  colItem: {
    flex: 2,
  },
  colSpec: {
    flex: 2,
  },
  colQty: {
    width: 50,
    textAlign: 'center',
  },
  colPrice: {
    width: 80,
    textAlign: 'right',
  },
  colTotal: {
    width: 90,
    textAlign: 'right',
  },
  summarySection: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  summaryRow: {
    flexDirection: 'row',
    width: 250,
    justifyContent: 'space-between',
    padding: 6,
    fontSize: 10,
  },
  summaryTotal: {
    backgroundColor: '#1f2937',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: '2px solid #e5e7eb',
  },
  footerSection: {
    marginBottom: 12,
  },
  footerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#374151',
  },
  footerText: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 3,
  },
  notice: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fef3c7',
    borderRadius: 4,
    fontSize: 9,
    textAlign: 'center',
    color: '#92400e',
  },
});

export interface EstimatePartItem {
  name: string;
  spec?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface EstimatePDFData {
  estimateNumber: string;
  issueDate: Date;
  validUntil: Date;
  customerName: string;
  customerContact: string;
  location: string;
  equipmentName: string;
  equipmentType: string;
  diagnosisDate: Date;
  diagnosisSummary: string[];
  parts: EstimatePartItem[];
  laborCost: number;
  travelCost: number;
  subtotal: number;
  vat: number;
  total: number;
  notes?: string;
}

export const EstimatePDFTemplate: React.FC<{ data: EstimatePDFData }> = ({
  data,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 100 }} />
          <Text style={styles.title}>견적서</Text>
          <View style={styles.headerRight}>
            <View style={styles.headerRow}>
              <Text style={styles.headerLabel}>견적번호:</Text>
              <Text style={styles.headerValue}>{data.estimateNumber}</Text>
            </View>
            <View style={styles.headerRow}>
              <Text style={styles.headerLabel}>견적일자:</Text>
              <Text style={styles.headerValue}>
                {formatDate(data.issueDate)}
              </Text>
            </View>
            <View style={styles.headerRow}>
              <Text style={styles.headerLabel}>유효기간:</Text>
              <Text style={styles.headerValue}>
                {formatDate(data.validUntil)}
              </Text>
            </View>
          </View>
        </View>

        {/* Customer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>고객 정보</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>고객명:</Text>
            <Text style={styles.infoValue}>{data.customerName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>연락처:</Text>
            <Text style={styles.infoValue}>{data.customerContact}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>현장위치:</Text>
            <Text style={styles.infoValue}>{data.location}</Text>
          </View>
        </View>

        {/* Equipment & Diagnosis Section */}
        <View style={styles.diagnosisSection}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>설비 및 진단 정보</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>설비명:</Text>
              <Text style={styles.infoValue}>{data.equipmentName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>설비유형:</Text>
              <Text style={styles.infoValue}>{data.equipmentType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>진단일시:</Text>
              <Text style={styles.infoValue}>
                {formatDate(data.diagnosisDate)}
              </Text>
            </View>
          </View>

          {data.diagnosisSummary.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>진단 요약</Text>
              <View style={styles.diagnosisList}>
                {data.diagnosisSummary.map((item, index) => (
                  <View key={index} style={styles.diagnosisItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Estimate Details Table */}
        <View style={styles.table}>
          <Text style={styles.sectionTitle}>견적 내역</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.colItem}>품목</Text>
            <Text style={styles.colSpec}>규격/모델</Text>
            <Text style={styles.colQty}>수량</Text>
            <Text style={styles.colPrice}>단가</Text>
            <Text style={styles.colTotal}>금액</Text>
          </View>

          {/* Parts */}
          {data.parts.map((part, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                ...(index % 2 === 1 ? [styles.tableRowAlt] : []),
              ]}
            >
              <Text style={styles.colItem}>{part.name}</Text>
              <Text style={styles.colSpec}>{part.spec || '-'}</Text>
              <Text style={styles.colQty}>{part.quantity}</Text>
              <Text style={styles.colPrice}>
                {formatCurrency(part.unitPrice)}
              </Text>
              <Text style={styles.colTotal}>{formatCurrency(part.total)}</Text>
            </View>
          ))}

          {/* Labor */}
          {data.laborCost > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.colItem}>공임</Text>
              <Text style={styles.colSpec}>-</Text>
              <Text style={styles.colQty}>1</Text>
              <Text style={styles.colPrice}>
                {formatCurrency(data.laborCost)}
              </Text>
              <Text style={styles.colTotal}>
                {formatCurrency(data.laborCost)}
              </Text>
            </View>
          )}

          {/* Travel */}
          {data.travelCost > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.colItem}>출장비</Text>
              <Text style={styles.colSpec}>-</Text>
              <Text style={styles.colQty}>1</Text>
              <Text style={styles.colPrice}>
                {formatCurrency(data.travelCost)}
              </Text>
              <Text style={styles.colTotal}>
                {formatCurrency(data.travelCost)}
              </Text>
            </View>
          )}
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text>소계</Text>
            <Text>{formatCurrency(data.subtotal)}</Text>
          </View>
          {data.vat > 0 && (
            <View style={styles.summaryRow}>
              <Text>부가세 (10%)</Text>
              <Text>{formatCurrency(data.vat)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text>합계</Text>
            <Text>{formatCurrency(data.total)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {data.notes && (
            <View style={styles.footerSection}>
              <Text style={styles.footerTitle}>비고 / 특이사항</Text>
              <Text style={styles.footerText}>{data.notes}</Text>
            </View>
          )}

          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>회사 정보</Text>
            <Text style={styles.footerText}>부성티케이</Text>
            <Text style={styles.footerText}>
              전화: 02-1234-5678 | 이메일: info@busungtk.com
            </Text>
            <Text style={styles.footerText}>
              주소: 서울특별시 강남구 테헤란로 123
            </Text>
          </View>

          <View style={styles.notice}>
            <Text>본 견적서는 발행일로부터 30일간 유효합니다.</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
