if (!process.env.JUDGE0_API_KEY) {
  throw new Error("JUDGE0_API_KEY is not set in environment variables");
}

if (!process.env.JUDGE0_API_URL) {
  throw new Error("JUDGE0_API_URL is not set in environment variables");
}

export const config = {
  judge0: {
    apiKey: process.env.JUDGE0_API_KEY,
    apiUrl: process.env.JUDGE0_API_URL,
  },
} as const;
