import Redis from 'ioredis';

const REDIS_URL = process.env.NODE_ENV === "dev" ? "redis://localhost:6379" : process.env.REDIS_URL;

console.log(REDIS_URL)
const redisClient = new Redis(REDIS_URL)
redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("error", (err) => console.log("Redis error :", err.message));

export default redisClient;