import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { db } from './db';
import * as table from './db/schema';
import * as auth from './auth';

// Integration tests against a real PostgreSQL instance — see docs/testing.md.

const TEST_USER_ID = 'test-auth-user';

beforeAll(async () => {
	await db.insert(table.user).values({
		id: TEST_USER_ID,
		username: 'test-auth-user',
		passwordHash: 'not-a-real-hash'
	});
});

afterAll(async () => {
	await db.delete(table.session).where(eq(table.session.userId, TEST_USER_ID));
	await db.delete(table.user).where(eq(table.user.id, TEST_USER_ID));
});

describe('session lifecycle', () => {
	it('creates a session and validates it back to the same user', async () => {
		const token = auth.generateSessionToken();
		const created = await auth.createSession(token, TEST_USER_ID);

		const { session, user } = await auth.validateSessionToken(token);
		expect(session?.id).toBe(created.id);
		expect(user?.id).toBe(TEST_USER_ID);

		await auth.invalidateSession(created.id);
	});

	it('rejects an unknown token', async () => {
		const { session, user } = await auth.validateSessionToken('does-not-exist');
		expect(session).toBeNull();
		expect(user).toBeNull();
	});

	it('deletes and rejects an expired session', async () => {
		const token = auth.generateSessionToken();
		const created = await auth.createSession(token, TEST_USER_ID);
		await db
			.update(table.session)
			.set({ expiresAt: new Date(Date.now() - 1000) })
			.where(eq(table.session.id, created.id));

		const { session, user } = await auth.validateSessionToken(token);
		expect(session).toBeNull();
		expect(user).toBeNull();

		const [remaining] = await db
			.select()
			.from(table.session)
			.where(eq(table.session.id, created.id));
		expect(remaining).toBeUndefined();
	});

	it('invalidateSession removes the session', async () => {
		const token = auth.generateSessionToken();
		const created = await auth.createSession(token, TEST_USER_ID);
		await auth.invalidateSession(created.id);

		const { session } = await auth.validateSessionToken(token);
		expect(session).toBeNull();
	});
});

describe('generateUserId', () => {
	it('produces distinct ids', () => {
		const ids = new Set(Array.from({ length: 20 }, () => auth.generateUserId()));
		expect(ids.size).toBe(20);
	});
});
