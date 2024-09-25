const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB (make sure to replace the URI with your actual MongoDB connection string)
mongoose.connect('mongodb://localhost:27017/king_james_bible', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to the database');
});

// Define the Verse schema
const verseSchema = new mongoose.Schema({
    book_abbr: String,
    book_id: Number,
    book_name: String,
    chapter_id: Number,
    keywords: [String],
    verse_id: Number,
    verse_text: String,
});

// Create a model for the verses collection
const Verse = mongoose.model('Verse', verseSchema);

// Initialize the app
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

/**
 * Route: GET /verses
 * Description: Fetch all verses, with optional filters for book, chapter, verse, and keywords
 */
app.get('/verses', async (req, res) => {
    const { book_name, chapter_id, start_verse_id, end_verse_id, word_search } = req.query;
    let query = {};

    // Optional filtering by book name and chapter
    if (book_name) query.book_name = book_name;
    if (chapter_id) query.chapter_id = parseInt(chapter_id);

    // Optional filtering by verse range (start_verse_id to end_verse_id)
    if (start_verse_id && end_verse_id) {
        query.verse_id = { $gte: parseInt(start_verse_id), $lte: parseInt(end_verse_id) };
    }

    // Optional filtering by keywords
    if (word_search) {
        query.keywords = {
            $elemMatch: {
                $regex: word_search,
                $options: "i" // Case-insensitive search
            }
        };
    }

    try {
        const verses = await Verse.find(query);
        res.json(verses);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


/**
 * Route: GET /verses/:id
 * Description: Fetch a single verse by its unique ID
 */
app.get('/verses/:id', async (req, res) => {
    try {
        const verse = await Verse.findById(req.params.id);
        if (!verse) return res.status(404).json({ error: 'Verse not found' });
        res.json(verse);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Route: POST /verses
 * Description: Create a new verse entry
 */
app.post('/verses', async (req, res) => {
    const { book_abbr, book_id, book_name, chapter_id, keywords, verse_id, verse_text } = req.body;
    const newVerse = new Verse({ book_abbr, book_id, book_name, chapter_id, keywords, verse_id, verse_text });

    try {
        await newVerse.save();
        res.status(201).json(newVerse);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Route: PUT /verses/:id
 * Description: Update an existing verse by its ID
 */
app.put('/verses/:id', async (req, res) => {
    try {
        const updatedVerse = await Verse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVerse) return res.status(404).json({ error: 'Verse not found' });
        res.json(updatedVerse);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Route: DELETE /verses/:id
 * Description: Delete a verse by its ID
 */
app.delete('/verses/:id', async (req, res) => {
    try {
        const deletedVerse = await Verse.findByIdAndDelete(req.params.id);
        if (!deletedVerse) return res.status(404).json({ error: 'Verse not found' });
        res.json({ message: 'Verse deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
