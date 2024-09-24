import { generateToken } from "@/utils/utils-server/utils-admin/auth.js"; // Import necessary functions for token generation and password verification
import RateLimiter from "@/utils/utils-server/rateLimiter.js";
import jwt from "jsonwebtoken";

const limiterPerHour = new RateLimiter({
  apiNumberArg: 7,
  tokenNumberArg: 8,
  expireDurationArg: 3600, //secs
});

export default async function logHandler(req, res) {
  
  try {

    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (!(await limiterPerHour.rateLimiterGate(clientIp)))
      return res.status(429).json({ error: "Too many requests." });

    // Retrieve user data from the database based on the username

    if (
      process.env.ADMIN_USERNAME !== req.body.username ||
      process.env.ADMIN_PASSWORD !== req.body.password
    ) {
      if (req.body.logout) {
        const token = jwt.sign({ userAdmin: false }, process.env.AUTH_SECRET, {
          expiresIn: "0s",
        }); // Generate an immediate-expiry token

        res.setHeader(
          "Set-Cookie",
          `token=${token}; HttpOnly; Secure; SameSite=None; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        );

        // Send a response indicating successful logout
        return res
          .status(200)
          .json({ success: true, message: "Logout successful" });
      }

      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a token
    const token = generateToken(true);

    // Set the token as an HttpOnly secure cookie
    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${604800}`,
    );

    // Send a success response
    return res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
}
