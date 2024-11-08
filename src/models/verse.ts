import mongoose from 'mongoose';

const verseSchema = new mongoose.Schema({
  book_id: Number,
  book_name: String,
  chapter_id: Number,
  verse_id: Number,
  verse_text: String,
  keywords: [String],
  request_count: { type: Number, default: 0 }
});

const Verse = mongoose.model('Verse', verseSchema);

export default Verse;