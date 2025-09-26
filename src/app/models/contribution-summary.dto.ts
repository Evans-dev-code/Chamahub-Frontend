// DTO for contribution summary/statistics
export interface ContributionSummaryDTO {
  chamaId: number;
  cycle: string;
  totalMembers: number;
  membersContributed: number;
  pendingContributions: number;
  lateContributions: number;
  totalCollected: number;
  expectedTotal: number;
  collectionRate: number; // percentage value from backend
  chamaName: string;
}
