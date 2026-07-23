import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, unauthorized } from "@/lib/auth-guard";

const CANDIDATE_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-2.5-flash",
];

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const { title, fullName, summary, experiences, skills } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Gemini API key is not configured. Please set GEMINI_API_KEY in your environment (.env file).",
        },
        { status: 500 }
      );
    }

    const expSummary = Array.isArray(experiences) && experiences.length > 0
      ? experiences.map((e: any) => `${e.role || "Role"} at ${e.company || "Company"}: ${e.description || ""}`).join("; ")
      : "";

    const skillSummary = Array.isArray(skills) && skills.length > 0
      ? skills.map((s: any) => s.name || s).join(", ")
      : "";

    const prompt = `You are an expert resume writer and executive career coach.
Write a comprehensive, compelling, and fully articulated professional resume summary paragraph (around 3 to 5 sentences, 70 to 120 words) using the following input details:

- Candidate Name: ${fullName || "Professional"}
- Professional Role / Title: ${title || "Professional"}
- Key Technical & Soft Skills: ${skillSummary || "Industry standard practices & tools"}
${summary ? `- User Notes / Draft Context: "${summary}"` : ""}
${expSummary ? `- Work Experience Context: ${expSummary}` : ""}

Writing Guidelines:
- Write a full, well-rounded paragraph that seamlessly incorporates the candidate's professional title, core skills, and background.
- Highlight technical proficiency, problem-solving ability, and business impact.
- Use strong action-oriented, professional language suitable for top-tier company applications and ATS resume screeners.
- Write in first-person implicit style (do NOT use "I" or "My", e.g., "Results-driven ${title || "Software Engineer"} with extensive expertise in ${skillSummary || "modern software development"}...").
- Make sure the paragraph is completely finished with a proper closing sentence.
- Output ONLY the finished summary paragraph text. Do NOT include quotes, headers, introductory explanations, or bullet points.`;

    let lastErrorMsg = "";

    for (const model of CANDIDATE_MODELS) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const generatedText =
          data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

        if (generatedText) {
          return NextResponse.json({ summary: generatedText });
        }
      } else {
        const errText = await response.text();
        console.error(`Gemini API Error with model ${model}:`, errText);
        try {
          const parsed = JSON.parse(errText);
          lastErrorMsg = parsed?.error?.message || errText;
        } catch {
          lastErrorMsg = errText;
        }
      }
    }

    return NextResponse.json(
      { error: lastErrorMsg || "Failed to generate summary from Gemini API." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred while generating summary." },
      { status: 500 }
    );
  }
}
