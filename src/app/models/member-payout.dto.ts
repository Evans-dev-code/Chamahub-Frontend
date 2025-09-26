// DTO for merry-go-round payout calculations
export interface MemberPayoutDTO {
  chamaId: number;
  cycle: string;
  nextPayoutMemberId: number;
  nextPayoutMemberName: string;
  payoutAmount: number;
  payoutDate: string; // ISO date string
  totalMembers: number;
  membersContributed: number;
  allMembersPaid: boolean;
}
