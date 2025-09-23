// src/app/models/contribution.dto.ts

export interface ContributionDTO {
  id: number;
  amount: number; // BigDecimal → number
  datePaid: string; // LocalDate → string (ISO format: yyyy-MM-dd)
  cycle: string;
  status: 'PAID' | 'PENDING' | 'LATE' | 'OVERDUE'; // match backend enum ContributionStatus
  memberId: number;
  chamaId: number;
  penaltyAmount?: number;
  notes?: string;

  // extra fields from backend
  memberName?: string;
  chamaName?: string;
  expectedAmount?: number;
  isLate?: boolean;
}
