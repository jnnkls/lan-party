import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from './validation';

describe('registerSchema', () => {
	it('accepts a valid username/password', () => {
		const result = registerSchema.safeParse({ username: 'FragMaster', password: 'correct-horse' });
		expect(result.success).toBe(true);
	});

	it('rejects a too-short username', () => {
		expect(registerSchema.safeParse({ username: 'ab', password: 'correct-horse' }).success).toBe(
			false
		);
	});

	it('rejects a username with disallowed characters', () => {
		expect(
			registerSchema.safeParse({ username: 'frag master!', password: 'correct-horse' }).success
		).toBe(false);
	});

	it('rejects a too-short password', () => {
		expect(registerSchema.safeParse({ username: 'FragMaster', password: 'short' }).success).toBe(
			false
		);
	});
});

describe('loginSchema', () => {
	it('only requires non-empty fields', () => {
		expect(loginSchema.safeParse({ username: 'x', password: 'y' }).success).toBe(true);
	});

	it('rejects an empty password', () => {
		expect(loginSchema.safeParse({ username: 'x', password: '' }).success).toBe(false);
	});
});
