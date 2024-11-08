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

  const verses = await Verse.find(query).sort({ verse_id: 1 });
  res.json(verses);
});

export default app;