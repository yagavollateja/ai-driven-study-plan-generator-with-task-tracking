;(async () => {
  try {
    const studyPlan = getContext("studyPlan")
    if (!studyPlan) throw new Error("Missing study plan in context.")
    // If fallback, display message and skip detailed output
    if (studyPlan && (studyPlan.error || (Array.isArray(studyPlan.study_plan) && studyPlan.study_plan.length === 1 && studyPlan.study_plan[0].description))) {
      console.log("========== STUDY PLAN OUTPUT ==========")
      if (studyPlan.raw_output) console.log(studyPlan.raw_output)
      if (studyPlan.study_plan && studyPlan.study_plan[0].description) console.log(studyPlan.study_plan[0].description)
      if (studyPlan.reminders) studyPlan.reminders.forEach(rem => console.log("REMINDER:", rem))
      if (studyPlan.progress_insights) console.log("PROGRESS INSIGHTS:", studyPlan.progress_insights)
      console.log("========== END OF OUTPUT ==========")
      setContext("study_reminder_output", studyPlan)
      return
    }
    // Display output by structured sections in correct order
    function printSection(header, values) {
      console.log("\n--- " + header + " ---")
      if (!values || values.length === 0 || values === ":not found") {
        console.log("No data available.")
        return
      }
      if (Array.isArray(values)) {
        values.forEach(val => console.log(typeof val === "object" ? JSON.stringify(val, null, 2) : "- " + val))
      } else {
        console.log(values)
      }
    }
    console.log("========== PERSONALIZED STUDY PLAN ==========")
    printSection("SUBJECTS", studyPlan.subjects)
    printSection("ASSIGNMENTS", studyPlan.assignments)
    printSection("EXAMS", studyPlan.exams)
    printSection("DEADLINES", studyPlan.deadlines)
    printSection("STUDY GOALS", studyPlan.study_goals)
    printSection("DAILY STUDY TIME", studyPlan.daily_study_time)
    printSection("7-DAY STUDY PLAN", studyPlan.study_plan)
    printSection("SMART REMINDERS", studyPlan.reminders)
    printSection("PROGRESS INSIGHTS", studyPlan.progress_insights)
    console.log("========== END OF STUDY PLAN ==========")
    setContext("study_reminder_output", studyPlan)
  } catch (e) {
    console.error("Failed to display study reminder:", e.message)
    process.exit(1)
  }
})()
