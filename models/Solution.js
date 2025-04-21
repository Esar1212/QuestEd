import mongoose from "mongoose";

const SolutionPaperSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  paperId: { type: String, required: true }, // Reference to original exam paper
  title: { type: String, required: true },
  subject: { type: String, required: true },
  timeLimit: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  classStream: { type: String, required: true },
  questions: [
    {
      questionId: { type: String, required: true }, // Reference to original question
      question: { type: String, required: true },
      selectedOption: { type: String },
      correctOption: { type: String, required: true },
      marks: { type: Number, required: true }, // Marks for this question
      isCorrect: { type: Boolean, required: true }, // Whether answer is correct
    },
  ],
  submittedAt: { type: Date, default: Date.now },
  startedAt: { type: Date, required: true },
  completedAt: { type: Date, required: true },
  totalScore: { type: Number, required: true }, // Total marks obtained
  status: { type: String, enum: ['completed', 'timeout', 'submitted'], required: true },
});

// Add index for faster querying
SolutionPaperSchema.index({ studentId: 1, paperId: 1 });

const Solution = mongoose.models.Solution || mongoose.model("Solution", SolutionPaperSchema);

export default Solution;