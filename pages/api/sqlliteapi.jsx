import betterSqlite3 from "better-sqlite3";
import RateLimiter from "@/utils/rateLimiter.js";

const limiterPerMinute = new RateLimiter({
  apiNumberArg: 8,
  tokenNumberArg: 6,
  expireDurationArg: 86400, //secs
});

const dailyMessageLimit = new RateLimiter({
  apiNumberArg: 0,
  tokenNumberArg: 4,
  expireDurationArg: 60, //secs
});

const limiterPerWeek = new RateLimiter({
  apiNumberArg: 1,
  tokenNumberArg: 40,
  expireDurationArg: 604800, //secs
});

export default async function handler(req, res) {
  try {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Perform rate limiting checks

    if (!(await limiterPerMinute.rateLimiterGate(clientIp)))
      return res.status(429).json({ error: "Too many requests." });
    if (!(await limiterPerWeek.rateLimiterGate(clientIp)))
      return res.status(429).json({ error: "Too many requests." });

    // Rate limiting checks passed, proceed with API logic

    if (req.method === "GET") {
      try {
        // Create a new SQLite database connection
        const db = betterSqlite3(process.env.DB_PATH);

        // Define a database query for fetching data (example: all orders)
        const rows = db.prepare("SELECT * FROM orders").all();

        res.status(200).json({ data: rows });

        // Close the database connection when done
        db.close();
      } catch (error) {
        console.error("Error handling GET request:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (req.method === "POST") {
      // Handle POST requests here
      try {
        if (!req.body.type) return;

        if (req.body.type === "subscribers") {
          // Create a new SQLite database connection
          const db = betterSqlite3(process.env.DB_PATH);

          // Ensure the subscribers table exists
          db.prepare(
            `
            CREATE TABLE IF NOT EXISTS subscribers (
              email TEXT
            )
          `,
          ).run();

          // Insert subscriber email into the subscribers table
          db.prepare("INSERT INTO subscribers (email) VALUES (?)").run(
            req.body.email,
          );

          console.log("Successfully subscribed.");
          res.status(201).json({ message: "Successfully subscribed." });

          // Close the database connection when done
          db.close();
        } else if (req.body.type === "messages") {
          // Create a new SQLite database connection


          if (!(await dailyMessageLimit.rateLimiterGate(clientIp)))
          return res.status(429).json({ error: "Too many messages sent." });

          const db = betterSqlite3(process.env.DB_PATH);

          // Ensure the messages table exists
          db.prepare(
            `
            CREATE TABLE IF NOT EXISTS messages (
              id INTEGER PRIMARY KEY,
              email TEXT,
              name TEXT,
              message TEXT,
              msgStatus TEXT
            )
          `,
          ).run();

          // Assuming you have the message data in the request body
          const { email, name, message } = req.body.message;

          // Insert message data into the messages table
          db.prepare(
            `INSERT INTO messages (email, name, message, msgStatus) VALUES (?, ?, ?, '0')`,
          ).run(email, name, message);

          console.log("Message sent successfully.");
          res.status(201).json({ message: "Message sent successfully." });

          // Close the database connection when done
          db.close();
        }
      } catch (error) {
        console.error("Error handling POST request:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
