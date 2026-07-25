import { z } from 'zod';

export const usernameSchema = z
	.string()
	.trim()
	.min(3, 'Username must be at least 3 characters')
	.max(31, 'Username must be at most 31 characters')
	.regex(/^[a-z0-9_-]+$/i, 'Username can only contain letters, numbers, underscores, and hyphens');

export const passwordSchema = z
	.string()
	.min(8, 'Password must be at least 8 characters')
	.max(255, 'Password is too long');

export const registerSchema = z.object({
	username: usernameSchema,
	password: passwordSchema
});

export const loginSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(1, 'Password is required')
});
