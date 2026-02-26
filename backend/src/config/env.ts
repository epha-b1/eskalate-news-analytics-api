const requireEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const isTest = process.env.NODE_ENV === "test";

export const env = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: requireEnv(
    "DATABASE_URL",
    isTest ? "postgresql://test:test@localhost:5432/test" : undefined
  ),
  jwtSecret: requireEnv("JWT_SECRET", isTest ? "test-secret" : undefined),
  redisUrl: requireEnv("REDIS_URL", isTest ? "redis://localhost:6379" : undefined)
};
