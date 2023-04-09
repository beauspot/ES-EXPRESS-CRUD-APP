import dotenv from "dotenv";
import Redis from "ioredis";
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_URL_HOST,
  port: process.env.REDIS_URL_PORT,
});

export const cache = (req, res, next) => {
  const { id } = req.params;
  redis.get(id, (error, result) => {
    if (error) throw error;
    if (result !== null) {
      return res.json(JSON.parse(result));
    } else {
      return next();
    }
  });
};
