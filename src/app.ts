import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/king_james_bible');

const verseSchema = new mongoose.Schema({
  book_id: Number,
  book_name: String,
  chapter_id: Number,
  verse_id: Number,
  verse_text: String,
  keywords: [String],
  request_count: { type: Number, default: 0 } // Add request_count with default value of 0
});

const Verse = mongoose.model('Verse', verseSchema);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/verses', async (req: Request, res: Response) => {
  const { book_name, chapter_id, start_verse_id, end_verse_id, keyword } = req.query;

  const query: any = {};
  if (book_name) query.book_name = book_name;
  if (chapter_id) query.chapter_id = Number(chapter_id);
  if (start_verse_id && end_verse_id) {
    query.verse_id = { $gte: Number(start_verse_id), $lte: Number(end_verse_id) };
  }
  else if (start_verse_id && !end_verse_id) {
    query.verse_id = { $gte: Number(start_verse_id) };
  }

  if (keyword) query.keywords = keyword;

  // Find the matching verses
  const verses = await Verse.find(query).sort({ verse_id: 1 });

  // Prepare bulkWrite operations to increment request_count
  const bulkOperations = verses.map(verse => ({
    updateOne: {
      filter: { _id: verse._id },
      update: { $inc: { request_count: 1 } } // Ensure the atomic operator $inc is used here
    }
  }));
  

  // Execute bulkWrite if there are any matching verses
  if (bulkOperations.length > 0) {
    await Verse.bulkWrite(bulkOperations);
  }

  res.json(verses);
});


export default app;