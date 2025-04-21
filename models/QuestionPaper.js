import mongoose from "mongoose";

const QuestionPaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  timeLimit: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  classStream: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true },
      answer: { type: String, required: true },
      marks: { type: Number, required: true },
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

// Check if model exists before defining it again (prevents OverwriteModelError)
const QuestionPaper = mongoose.models.QuestionPaper || mongoose.model("QuestionPaper", QuestionPaperSchema);

export default QuestionPaper;