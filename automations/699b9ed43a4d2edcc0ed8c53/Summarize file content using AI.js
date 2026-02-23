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
    console.log("Extracting academic info: subjects, assignments, deadlines, exams, study goals...")
    const aiPrompt = `Read the following text from a student. Extract and list the following as structured JSON:\n- Subjects detected\n- Detailed assignments and their deadlines\n- Exam dates (with subjects if possible)\n- Study goals or learning targets\nIf any element is missing or unclear, write \":not found\" or empty list for that field.\nText:\n"""${fileContent}"""`
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
