import { NextResponse } from "next/server";

// Constants for Judge0 API
const JUDGE0_API_URL = process.env.JUDGE0_API_URL;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

// Language IDs for Judge0
const LANGUAGE_IDS = {
  python: 71,
  javascript: 63,
  typescript: 74,
  java: 62,
  cpp: 54,
  c: 50,
};

interface SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

interface JudgeResponse {
  status?: {
    id: number;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  time?: string;
  memory?: string;
}

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to fetch submission status
async function getSubmissionStatus(token: string): Promise<JudgeResponse> {
  const response = await fetch(
    `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false&fields=status,stdout,stderr,compile_output,message,time,memory`,
    {
      headers: {
        "X-RapidAPI-Key": JUDGE0_API_KEY!,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get submission status: ${response.statusText}`);
  }

  return response.json();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, language, input } = body;

    if (!JUDGE0_API_KEY) {
      return NextResponse.json(
        { error: "Judge0 API key is not configured" },
        { status: 500 }
      );
    }

    const languageId = LANGUAGE_IDS[language as keyof typeof LANGUAGE_IDS];
    if (!languageId) {
      return NextResponse.json(
        { error: "Unsupported programming language" },
        { status: 400 }
      );
    }

    // Create submission
    const submissionResponse = await fetch(`${JUDGE0_API_URL}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": JUDGE0_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: input || "",
      } as SubmissionRequest),
    });

    if (!submissionResponse.ok) {
      throw new Error("Failed to create submission");
    }

    const { token } = await submissionResponse.json();

    // Initial delay to allow for compilation
    await delay(2000);

    // Poll for results with exponential backoff
    let result: JudgeResponse | null = null;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      result = await getSubmissionStatus(token);

      // If we have a result and it'\''s not in queue/processing, we'\''re done
      if (result.status && result.status.id > 2) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s, 8s
      await delay(Math.pow(2, attempts) * 1000);
      attempts++;
    }

    if (!result) {
      throw new Error(
        "Failed to get submission result after multiple attempts"
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in code execution:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to execute code", details: errorMessage },
      { status: 500 }
    );
  }
}
