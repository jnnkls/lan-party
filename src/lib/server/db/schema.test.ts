import { describe, expect, it } from 'vitest';
import * as schema from './schema';

describe('schema', () => {
	it('exports the expected Postgres tables', () => {
		expect(schema.tenant).toBeDefined();
		expect(schema.user).toBeDefined();
		expect(schema.session).toBeDefined();
		expect(schema.lanParty).toBeDefined();
		expect(schema.playerProfile).toBeDefined();
	});
});
