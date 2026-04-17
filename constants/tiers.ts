export type TierKey = "bronze" | "silver" | "gold" | "diamond";

export interface Tier {
  key: TierKey;
  icon: string;
  min: number;
  max: number;
  color: string;
  gradient: readonly [string, string];
  multiplier: number;
  discount: number;
  mysteryMin: number;
  mysteryMax: number;
}

export const TIERS: Tier[] = [
  { key: "bronze",  icon: "🥉", min: 0,     max: 999,    color: "#CD7F32", gradient: ["#8B4513", "#CD7F32"] as const, multiplier: 1,   discount: 0,  mysteryMin: 5,  mysteryMax: 25  },
  { key: "silver",  icon: "🥈", min: 1000,  max: 4999,   color: "#C0C0C0", gradient: ["#7B7B7B", "#C0C0C0"] as const, multiplier: 1.5, discount: 5,  mysteryMin: 10, mysteryMax: 50  },
  { key: "gold",    icon: "🥇", min: 5000,  max: 14999,  color: "#FFD700", gradient: ["#B8860B", "#FFD700"] as const, multiplier: 2,   discount: 10, mysteryMin: 25, mysteryMax: 100 },
  { key: "diamond", icon: "💎", min: 15000, max: Infinity, color: "#B9F2FF", gradient: ["#1E90FF", "#B9F2FF"] as const, multiplier: 3, discount: 15, mysteryMin: 50, mysteryMax: 200 },
];

export function getTierForPoints(points: number): Tier {
  return TIERS.find(t => points >= t.min && points <= t.max) ?? TIERS[0];
}

export function getNextTier(currentKey: TierKey): Tier | null {
  const idx = TIERS.findIndex(t => t.key === currentKey);
  return idx >= 0 && idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
}
