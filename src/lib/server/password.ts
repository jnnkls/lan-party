import { hash, verify } from '@node-rs/argon2';

// OWASP-recommended minimum parameters for Argon2id.
const ARGON2_OPTIONS = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

export function hashPassword(password: string) {
	return hash(password, ARGON2_OPTIONS);
}

export function verifyPassword(hash: string, password: string) {
	return verify(hash, password, ARGON2_OPTIONS);
}
