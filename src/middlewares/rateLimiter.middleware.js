import rateLimit from "express-rate-limit";

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // each IP-100 requests
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

export{apiRateLimiter}
