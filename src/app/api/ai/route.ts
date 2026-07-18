import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = process.env.OPENROUTER_MODEL ?? "openai/gpt-oss-120b";

const MAX_INPUT = 4000;

const SYSTEM_PROMPT = `You are an expert resume editor. Improve the user's resume text for clarity, impact, and ATS-friendliness.

Rules:
- Rewrite or polish ONLY the text the user provides.
- Use strong action verbs and concise phrasing.
- Do NOT invent, add, or assume any facts, metrics, companies, dates, skills, or achievements that are not present in the input.
- If the input is empty or nonsense, return it unchanged.
- Return ONLY the improved text, with no preamble, no quotes, and no commentary.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI is not configured on the server. Set OPENROUTER_API_KEY." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = (body as { text?: unknown })?.text;
  if (typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "Provide non-empty 'text'." }, { status: 400 });
  }
  if (text.length > MAX_INPUT) {
    return NextResponse.json(
      { error: `Text too long (max ${MAX_INPUT} characters).` },
      { status: 413 },
    );
  }

  try {
    const upstream = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://resume-studio-ai.app",
        "X-Title": "Resume Studio AI",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      return NextResponse.json(
        { error: "AI provider request failed.", detail: detail.slice(0, 500) },
        { status: 502 },
      );
    }

    const data = (await upstream.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const improved = data.choices?.[0]?.message?.content?.trim() ?? "";
    return NextResponse.json({ text: improved });
  } catch {
    return NextResponse.json({ error: "Failed to reach AI provider." }, { status: 502 });
  }
}
