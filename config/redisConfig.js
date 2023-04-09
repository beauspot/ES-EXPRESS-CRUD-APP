import redis from "redis";

export const redisClient = redis.createClient({
  host: process.env.REDIS_URL_HOST,
  port: process.env.REDIS_URL_PORT,
});

redisClient.on("connnect", () => console.log("Connected to Redis Server"));
redisClient.on("error", (error) =>
  console.error(`Error connecting to the Redis Server: ${error.message}`)
);

export default redisClient;
