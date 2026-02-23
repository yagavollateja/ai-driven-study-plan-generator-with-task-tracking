// Generate a fully structured academic study plan with day-wise schedule, reminders and fallback
;(async () => {
  try {
    const summary = getContext("summary")
    if (!summary || summary.startsWith("Could not extract academic content")) {
      // Fallback: Structure default plan asking the user to provide readable content
      const fallbackPlan = {
        subjects: [],
        assignments: [],
        deadlines: [],
        exams: [],
        study_goals: [],
        study_plan: [
          {
            day: "Day 1",
            description: "No academic data detected. Please upload readable course/assignment material to receive a full plan."
          }
        ],
        reminders: ["Reminder: Please upload readable files containing subject names, assignments, deadlines, and exam dates for a personalized plan."],
        progress_insights: "Plan cannot be generated until valid data is provided."
      }
      setContext("studyPlan", fallbackPlan)
      console.log("Default fallback study plan set in context.")
      return
    }
    console.log("Generating structured 7-day plan, reminders, and progress from summary...")
    const plannerPrompt = `You are an academic study-planning assistant. Given the following academic content summary in JSON or text, produce a structured JSON object containing:\n- subjects: All subjects detected (list of strings)\n- assignments: List of assignments and their deadlines (array of {assignment, deadline})\n- deadlines: Upcoming assignment deadlines (array of {assignment, deadline})\n- exams: All upcoming exams with subjects and dates (array of {subject, exam_date})\n- study_goals: Academic or personal study goals (array of strings)\n- study_plan: Day-wise 7-day plan (array of {day, tasks, focus, hours}) — Prioritize urgent tasks first! Assume student studies 2 hours/day unless otherwise stated.\n- reminders: Friendly actionable messages for each day (7 messages)\n- progress_insights: Brief analytics/smart commentary (text)\nIf any section is missing or unclear, fill it with \":not found\" or leave blank.\nAcademic summary:\n${summary}`
    const planResult = await TurboticOpenAI(
      [
        {
          role: "user",
          content: plannerPrompt
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
      // Use AI response as fallback plan
      studyPlan = {
        raw_output: planResult.content,
        error: "Could not parse full output as JSON; see raw_output for details."
      }
    }
    setContext("studyPlan", studyPlan)
    console.log("Structured 7-day study plan and reminders generated and set in context")
  } catch (e) {
    console.error("Study plan/schedule generation failed:", e.message)
    process.exit(1)
  }
})()
