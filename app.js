const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

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
    const { book_id, book_abbr, book_name, chapter_id, start_verse_id, end_verse_id, word_search } = req.query;
    let matchQuery = {};

    // Optional filtering by book name and chapter
    if (book_id) matchQuery.book_id = parseInt(book_id);
    if (book_abbr) matchQuery.book_abbr = book_abbr;
    if (book_name) matchQuery.book_name = book_name;
    if (chapter_id) matchQuery.chapter_id = parseInt(chapter_id);

    if (start_verse_id) matchQuery.verse_id = { $gte: parseInt(start_verse_id) };

    // If no end_verse_id is specified, query for the max verse_id in the chapter
    let finalEndVerseId = end_verse_id;
    if (!end_verse_id) {
        try {
            const maxVerse = await Verse.findOne(matchQuery).sort({ verse_id: -1 }).limit(1); // Get the last verse in the chapter
            finalEndVerseId = maxVerse ? maxVerse.verse_id : start_verse_id; // Use the max verse_id, or default to start_verse_id
        } catch (error) {
            return res.status(500).json({ error: 'Error retrieving maximum verse for the chapter.' });
        }
    }

    if (finalEndVerseId) {
        matchQuery.verse_id.$lte = parseInt(finalEndVerseId); // Adjust the query to search up to the end verse
    }
    // Optional filtering by keywords
    if (word_search) {
        matchQuery.keywords = {
            $elemMatch: {
                $regex: word_search,
                $options: "i" // Case-insensitive search
            }
        };
    }

    try {
        const verses = await Verse.aggregate([
            { $match: matchQuery }, // Filter the documents based on the query
            {
                $group: {
                    _id: { book_id: "$book_id", book_name: "$book_name" }, // Group by both book_id and book_name
                    verses: { $push: {
                        _id: "$_id", // Keep the _id field for the verse
                        chapter_id: "$chapter_id", // Keep chapter_id
                        verse_id: "$verse_id", // Keep verse_id
                        verse_text: "$verse_text", // Keep verse_text
                        keywords: "$keywords" // Keep keywords
                    }} // Push the filtered fields into the verses array
                }
            },
            { $sort: { "_id.book_id": 1 } } // Sort by book_id (ascending)
        ]);

        // Format the response to have book_id and book_name in the same layer
        const formattedResponse = verses.map(group => ({
            book_id: group._id.book_id,
            book_name: group._id.book_name,
            verses: group.verses
        }));

        res.json(formattedResponse);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;