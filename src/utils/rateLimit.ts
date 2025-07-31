// lib/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

// Create a new ratelimiter instance.
// Adjust the `points` and `duration` as needed for your use case.
// Example: 10 requests per 10 seconds per IP
export const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(200, '60s'),
  // Set to true to enable the Ratelimit headers on all responses
  analytics: true,
})
