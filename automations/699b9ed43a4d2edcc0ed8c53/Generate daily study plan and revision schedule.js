// Generate a fully structured academic study plan with day-wise schedule, reminders, and fallback
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
        daily_study_time: "",
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
    console.log("Generating structured 7-day plan, reminders, and progress from summary including daily study time, if available...")
    // Pass daily_study_time into prompt if present
    let structuredSummary
    try {
      structuredSummary = typeof summary === "string" ? JSON.parse(summary) : summary
    } catch {
      structuredSummary = summary
    }
    const dailyStudyTime = structuredSummary && structuredSummary.daily_study_time ? structuredSummary.daily_study_time : undefined
    const plannerPrompt = `You are an academic study-planning assistant. Given the following academic content summary in JSON, produce a structured JSON object containing:\n- subjects: All subjects detected (list of strings)\n- assignments: List of assignments and their deadlines (array of {assignment, deadline})\n- deadlines: Upcoming assignment deadlines (array of {assignment, deadline})\n- exams: All upcoming exams with subjects and dates (array of {subject, exam_date})\n- study_goals: Academic or personal study goals (array of strings)\n- daily_study_time: How many hours per day student should study (string, e.g. '2 hours', '90 minutes', etc.)\n- study_plan: Day-wise 7-day plan (array of {day, tasks, focus, hours}), customized so that daily total hours matches 'daily_study_time' if available, else assume 2 hours.\n- reminders: Actionable messages for each day (7 messages)\n- progress_insights: Brief analytics/smart commentary (text)\nIf any section is missing, fill it as best as possible from the input. Never output :not found if any relevant field exists.\nAcademic summary with fields:\n${JSON.stringify(structuredSummary, null, 2)}\n${dailyStudyTime ? `\nDAILY STUDY TIME TO RESPECT IN PLAN: ${dailyStudyTime}` : ""}`
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
