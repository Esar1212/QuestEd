import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    teacherId: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Video || mongoose.model('Video', videoSchema);