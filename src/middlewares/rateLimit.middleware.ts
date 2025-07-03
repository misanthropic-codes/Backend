import rateLimit from 'express-rate-limit';

export const postRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { status: 429, error: 'Too Many Requests', message: 'Rate limit exceeded' },
});

export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { status: 429, error: 'Too Many Requests', message: 'Rate limit exceeded' },
});
