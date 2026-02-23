// This step tracks progress and generates analytics for completed tasks in the working directory
const fs = require("fs")
try {
  const studyPlan = getContext("studyPlan")
  // Removed dependency on notificationSent context key
  const analytics = {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    progressPercent: 0,
    details: []
  }
  if (Array.isArray(studyPlan)) {
    analytics.totalTasks = studyPlan.length
    // For demo, randomly mark some as complete (in real use, should update based on external events)
    analytics.completedTasks = Math.floor(studyPlan.length * 0.3)
    analytics.pendingTasks = studyPlan.length - analytics.completedTasks
    analytics.progressPercent = analytics.totalTasks > 0 ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100) : 0
    analytics.details = studyPlan.map((task, idx) => ({
      ...task,
      status: idx < analytics.completedTasks ? "complete" : "pending"
    }))
  }
  // Save analytics as CSV and JSON in the working directory
  const analyticsJson = JSON.stringify(analytics, null, 2)
  fs.writeFileSync("progress_analytics.json", analyticsJson)
  const csvRows = ["Task,Deadline,Status", ...analytics.details.map(d => `${d.task || ""},${d.deadline || d.date || ""},${d.status || "pending"}`)]
  fs.writeFileSync("progress_analytics.csv", csvRows.join("\n"))
  setContext("progressAnalytics", analytics)
  console.log("Progress analytics saved as progress_analytics.json and progress_analytics.csv")
} catch (e) {
  console.error("Analytics generation failed:", e.message)
  process.exit(1)
}
