// This step summarizes the uploaded file content and extracts key academic fields using OpenAI via TurboticOpenAI
const run = async () => {
  try {
    const fileContent = getContext("fileContent")
    if (!fileContent || typeof fileContent !== "string" || fileContent.trim().length < 15) {
      // Gracefully handle missing/unclear input, set a warning summary, continue workflow
      setContext("summary", "Could not extract academic content. Please provide readable text.")
      console.warn("No valid academic content provided. Prompting for better input.")
      return
    }
    console.log("Extracting ALL academic fields from text: subjects, assignments, deadlines, exams, study goals, daily study time...")
    const aiPrompt = `You are an academic data extractor.
Read ALL plain sentences from the student document below. Detect and extract these fields, even if listed only in simple sentences or in partial/weak format:
- Subjects
- Assignments
- Exams
- Deadlines
- Study Goals
- Daily Study Time
Return output in strict JSON with the following top-level objects (sections):
{
  "subjects": ["..."],
  "assignments": ["..."],
  "exams": ["..."],
  "deadlines": ["..."],
  "study_goals": ["..."],
  "daily_study_time": "..."
}
Instructions:
- If ANY academic keyword (Subject, Assignment, Exam, Deadline, Goal, Study) is present, NEVER show ":not found" or empty lists; always detect and output whatever is present as best effort, even if only partial or weak (e.g., use detected plain sentence fragments).
- Output empty lists ONLY if there is absolutely no mention of that field. If ALL academic context is absent, return: {"message": "No academic content detected, please provide a more relevant file."}
- Prefer actionable and readable output (e.g., group partial info under closest-fit field).

Student Document:
"""${fileContent}"""`
    const summaryResult = await TurboticOpenAI([{ role: "user", content: aiPrompt }], {
      model: "gpt-4.1",
      temperature: 0
    })
    const summary = summaryResult.content
    setContext("summary", summary)
    console.log("Summary (with extracted fields) generated and set in context")
  } catch (e) {
    console.error("AI summarization failed:", e.message)
    process.exit(1)
  }
}

run()
