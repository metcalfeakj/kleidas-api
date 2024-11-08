import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Verse from './models/verse'; // Adjust the import path as necessary

const router = Router();

router.get('/verses', asyncHandler(async (req: Request, res: Response) => {
  const { book_name, chapter_id, start_verse_id, end_verse_id, keyword } = req.query;

  const query: any = {};
  if (book_name) query.book_name = book_name;
  if (chapter_id) query.chapter_id = Number(chapter_id);
  if (start_verse_id && end_verse_id) {
    query.verse_id = { $gte: Number(start_verse_id), $lte: Number(end_verse_id) };
  } else if (start_verse_id && !end_verse_id) {
    query.verse_id = { $gte: Number(start_verse_id) };
  }

  if (keyword) query.keywords = keyword;

  const verses = await Verse.find(query);
  res.json(verses);
}));

export default router;