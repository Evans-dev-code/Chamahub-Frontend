// src/app/models/chama-rules.dto.ts
export interface ChamaRulesDTO {
  id?: number;
  chamaId: number;

  monthlyContributionAmount: number;   // backend used BigDecimal → number in TS
  penaltyForLate: number;

  cycleType: 'WEEKLY' | 'MONTHLY';     // backend used enum → union type in TS

  dayOfCycle: number;                  // 1–31 depending on cycleType
  gracePeriodDays: number;             // 0–30

  payoutOrder?: string;                // optional string
  currentPayoutMemberId?: number;      // optional id

  // Extra info for responses
  chamaName?: string;
}
