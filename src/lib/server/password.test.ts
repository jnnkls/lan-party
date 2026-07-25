import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('password hashing', () => {
	it('verifies a matching password', async () => {
		const hash = await hashPassword('correct-horse-battery-staple');
		expect(await verifyPassword(hash, 'correct-horse-battery-staple')).toBe(true);
	});

	it('rejects a non-matching password', async () => {
		const hash = await hashPassword('correct-horse-battery-staple');
		expect(await verifyPassword(hash, 'wrong-password')).toBe(false);
	});

	it('produces a different hash each time (random salt)', async () => {
		const a = await hashPassword('same-password');
		const b = await hashPassword('same-password');
		expect(a).not.toBe(b);
	});
});
