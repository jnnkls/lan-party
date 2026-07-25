// Shared XP/level math used by the UI. XP itself is computed from real DB
// aggregates (attendance xpAwarded + earned achievement xp) in
// src/lib/server/db/queries.ts — this module only turns a total xp number
// into a level and progress-within-level percentage.

export const XP_PER_LEVEL = 250;

export function levelForXp(xp: number): number {
	return Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);
}

export function progressForXp(xp: number): number {
	const normalized = Math.max(0, xp);
	return Math.min(100, Math.round(((normalized % XP_PER_LEVEL) / XP_PER_LEVEL) * 100));
}
