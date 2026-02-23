// This step analyzes the AI summary to extract tasks, deadlines, and exams and generates daily plan
;(async () => {
  try {
    const summary = getContext("summary")
    if (!summary) throw new Error("Missing summary.")
    console.log("Analyzing summary to generate study plan and revision schedule...")
    const planResult = await TurboticOpenAI(
      [
        {
          role: "system",
          content: "You are an expert academic planner. From a summary of academic/class notes, assignments, and exam info, extract tasks with deadlines, identify any exam dates, and generate a day-wise study/revision plan in detailed, tabular JSON."
        },
        {
          role: "user",
          content: summary
        }
      ],
      {
        model: "gpt-4.1",
        temperature: 0
      }
    )
    let studyPlan
    try {
      studyPlan = JSON.parse(planResult.content)
    } catch {
      // If not valid JSON, set as raw text
      studyPlan = planResult.content
    }
    setContext("studyPlan", studyPlan)
    console.log("Study plan and schedule generated and set in context")
  } catch (e) {
    console.error("Study plan/schedule generation failed:", e.message)
    process.exit(1)
  }
})()
