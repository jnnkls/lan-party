import { describe, expect, it } from 'vitest';
import { levelForXp, progressForXp, XP_PER_LEVEL } from './gamification';

describe('levelForXp', () => {
	it('is level 1 at zero xp', () => {
		expect(levelForXp(0)).toBe(1);
	});

	it('is level 1 for any xp under one level', () => {
		expect(levelForXp(XP_PER_LEVEL - 1)).toBe(1);
	});

	it('advances a level exactly at each threshold', () => {
		expect(levelForXp(XP_PER_LEVEL)).toBe(2);
		expect(levelForXp(XP_PER_LEVEL * 2)).toBe(3);
	});

	it('never goes below level 1 for negative xp', () => {
		expect(levelForXp(-500)).toBe(1);
	});
});

describe('progressForXp', () => {
	it('is 0% at the start of a level', () => {
		expect(progressForXp(0)).toBe(0);
		expect(progressForXp(XP_PER_LEVEL)).toBe(0);
	});

	it('is 50% halfway through a level', () => {
		expect(progressForXp(XP_PER_LEVEL / 2)).toBe(50);
	});

	it('never exceeds 100', () => {
		expect(progressForXp(XP_PER_LEVEL - 1)).toBeLessThanOrEqual(100);
	});

	it('clamps negative xp to 0%', () => {
		expect(progressForXp(-50)).toBe(0);
	});
});
