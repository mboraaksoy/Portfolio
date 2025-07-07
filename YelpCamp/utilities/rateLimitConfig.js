module.exports.rateLimitConfig = {
    windowMs: 10 * 60 * 1000, // 10 minutes
	limit: 500, // Limit each IP to 100 requests per `window`.
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false,
}