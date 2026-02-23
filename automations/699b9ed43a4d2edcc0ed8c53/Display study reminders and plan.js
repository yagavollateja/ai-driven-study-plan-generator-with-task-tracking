;(async () => {
  try {
    const studyPlan = getContext("studyPlan")
    if (!studyPlan) throw new Error("Missing study plan in context.")
    let planText
    if (typeof studyPlan === "string") {
      planText = studyPlan
    } else if (Array.isArray(studyPlan)) {
      planText = studyPlan.map(item => `- ${item.task} (Due: ${item.deadline || item.date || "N/A"})`).join("\n")
    } else if (typeof studyPlan === "object") {
      planText = JSON.stringify(studyPlan, null, 2)
    } else {
      planText = String(studyPlan)
    }
    const message = `Your personalized study plan and upcoming reminders:\n\n${planText}`
    setContext("study_reminder_output", message)
    console.log("\n========== STUDY REMINDER OUTPUT ==========")
    console.log(message)
    console.log("========== END OF REMINDER ==========\n")
  } catch (e) {
    console.error("Failed to display study reminder:", e.message)
    process.exit(1)
  }
})()
