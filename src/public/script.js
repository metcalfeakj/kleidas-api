// Map common abbreviations to full book names
const bookMapping = {
    'gen': 'Genesis',
    'exod': 'Exodus',
    'lev': 'Leviticus',
    'num': 'Numbers',
    'deut': 'Deuteronomy',
    'josh': 'Joshua',
    'judg': 'Judges',
    'ruth': 'Ruth',
    '1sam': '1 Samuel', '1samuel': '1 Samuel',
    '2sam': '2 Samuel', '2samuel': '2 Samuel',
    '1kgs': '1 Kings', '1kings': '1 Kings',
    '2kgs': '2 Kings', '2kings': '2 Kings',
    '1chr': '1 Chronicles', '1chronicles': '1 Chronicles',
    '2chr': '2 Chronicles', '2chronicles': '2 Chronicles',
    'ezra': 'Ezra',
    'neh': 'Nehemiah',
    'esth': 'Esther',
    'job': 'Job',
    'ps': 'Psalms', 'psalm': 'Psalms',
    'prov': 'Proverbs',
    'eccl': 'Ecclesiastes', 'ecc': 'Ecclesiastes',
    'song': 'Song of Solomon', 'songs': 'Song of Solomon',
    'isa': 'Isaiah',
    'jer': 'Jeremiah',
    'lam': 'Lamentations',
    'ezek': 'Ezekiel',
    'dan': 'Daniel',
    'hos': 'Hosea',
    'joel': 'Joel',
    'amos': 'Amos',
    'obad': 'Obadiah',
    'jonah': 'Jonah',
    'micah': 'Micah',
    'nahum': 'Nahum',
    'hab': 'Habakkuk',
    'zeph': 'Zephaniah',
    'hag': 'Haggai',
    'zech': 'Zechariah',
    'mal': 'Malachi',
    'matt': 'Matthew',
    'mark': 'Mark',
    'luke': 'Luke',
    'john': 'John',
    'acts': 'Acts',
    'rom': 'Romans',
    '1cor': '1 Corinthians', '1corinthians': '1 Corinthians',
    '2cor': '2 Corinthians', '2corinthians': '2 Corinthians',
    'gal': 'Galatians',
    'eph': 'Ephesians',
    'phil': 'Philippians',
    'col': 'Colossians',
    '1thess': '1 Thessalonians', '1thessalonians': '1 Thessalonians',
    '2thess': '2 Thessalonians', '2thessalonians': '2 Thessalonians',
    '1tim': '1 Timothy', '1timothy': '1 Timothy',
    '2tim': '2 Timothy', '2timothy': '2 Timothy',
    'titus': 'Titus',
    'philem': 'Philemon',
    'heb': 'Hebrews',
    'james': 'James',
    '1pet': '1 Peter', '1peter': '1 Peter',
    '2pet': '2 Peter', '2peter': '2 Peter',
    '1john': '1 John', '1jh': '1 John', '1 jn': '1 John',
    '2john': '2 John', '2jh': '2 John',
    '3john': '3 John', '3jh': '3 John',
    'jude': 'Jude',
    'rev': 'Revelation'
};

function parseInput(input) {
    const regex = /(\d?\s?\w+)\s*(\d+)?(?::(\d+)(?:-(\d+))?)?/i;
    const match = input.match(regex);

    if (match) {
        const bookAbbr = match[1].toLowerCase().replace(/\s+/g, '');
        const bookName = bookMapping[bookAbbr] || bookAbbr;
        const chapterId = match[2] ? parseInt(match[2]) : null;
        const startVerseId = match[3] ? parseInt(match[3]) : null;

        const endVerseId = match[4] ? parseInt(match[4]) : (input.includes('-') ? null : startVerseId);

        return { bookName, chapterId, startVerseId, endVerseId };
    } else {
        return null;
    }
}

document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchInput = document.getElementById('search');
    const input = searchInput.value;
    const searchButton = document.getElementById('search-button');
    const parsed = parseInput(input);

    if (!parsed || !parsed.bookName || !parsed.chapterId) {
        alert('Invalid input format. Please enter at least the book and chapter.');
        return;
    }

    const { bookName, chapterId, startVerseId, endVerseId } = parsed;

    let query = `?book_name=${encodeURIComponent(bookName)}&chapter_id=${chapterId}`;

    if (startVerseId !== null) {
        query += `&start_verse_id=${startVerseId}`;
        if (endVerseId !== null) {
            query += `&end_verse_id=${endVerseId}`;
        }
    }

    const clipboardItem = new ClipboardItem({
        "text/plain": fetch(`/verses${query}`)
            .then(response => response.json())
            .then(data => {
                const resultsContainer = document.getElementById('results-container');
                resultsContainer.innerHTML = '';

                if (data.length === 0) {
                    resultsContainer.innerHTML = '<p>No results found.</p>';
                    return '';
                } else {
                    const groupedData = data.reduce((acc, verse) => {
                        const { book_name, chapter_id } = verse;
                        const verseKey = `${book_name} ${chapter_id}`;
                        if (!acc[verseKey]) {
                            acc[verseKey] = { book_name, chapter_id, verses: [] };
                        }
                        acc[verseKey].verses.push(verse);
                        return acc;
                    }, {});

                    let clipboardText = '';

                    Object.values(groupedData).forEach(group => {
                        const firstVerseId = group.verses[0].verse_id;
                        const lastVerseId = group.verses[group.verses.length - 1].verse_id;
                        const verseRange = firstVerseId === lastVerseId ? `${firstVerseId}` : `${firstVerseId}-${lastVerseId}`;

                        const headingText = `${group.book_name} ${group.chapter_id}:${verseRange}\n`;
                        resultsContainer.insertAdjacentHTML('beforeend', `<div class="verse-heading">${headingText.trim()}</div>`);
                        clipboardText += headingText;

                        group.verses.forEach(verse => {
                            const verseText = `<div class="verse-text">${verse.verse_id} ${verse.verse_text}</div>`;
                            resultsContainer.insertAdjacentHTML('beforeend', verseText);
                            clipboardText += `${verse.verse_id} ${verse.verse_text}\n`;
                        });

                        clipboardText += '\n';
                    });

                    return new Blob([clipboardText], { type: "text/plain" });
                }
            })
    });

    navigator.clipboard.write([clipboardItem]).then(() => {
        searchButton.style.backgroundColor = 'green';
        searchButton.textContent = 'Copied!';

        setTimeout(() => {
            searchButton.style.backgroundColor = '';
            searchButton.textContent = 'Search';
        }, 2000);
    }).catch(error => {
        console.error('Error copying to clipboard:', error);
        alert('Error copying to clipboard. Please try again later.');
    });

    searchInput.value = '';
    searchInput.focus();
});