// This step summarizes the uploaded file content using OpenAI API via TurboticOpenAI
const run = async () => {
  try {
    const fileContent = getContext("fileContent")
    if (!fileContent) throw new Error("No file content found in context.")
    console.log("Summarizing uploaded content using AI...")
    const summaryResult = await TurboticOpenAI([{ role: "user", content: `Summarize the following academic/class notes, assignments, or exam details for a student:\n\n"""${fileContent}"""` }], {
      model: "gpt-4.1",
      temperature: 0
    })
    const summary = summaryResult.content
    setContext("summary", summary)
    console.log("Summary generated and set in context")
  } catch (e) {
    console.error("AI summarization failed:", e.message)
    process.exit(1)
  }
}

run()
