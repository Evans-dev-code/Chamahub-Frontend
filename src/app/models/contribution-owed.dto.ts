// DTO for contribution owed calculations
export interface ContributionOwedDTO {
  memberId: number;
  chamaId: number;
  currentCycle: string;
  expectedAmount: number;
  amountOwed: number;
  penaltyAmount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE'; // matching backend
  dueDate: string; // ISO date string
  lastPaymentDate: string; // ISO date string
  memberName: string;
  chamaName: string;
}
