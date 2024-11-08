// Map common abbreviations to full book names
const bookMapping = {
    'ge': 'Genesis', 'gen': 'Genesis',
    'exod': 'Exodus', 'exo': 'Exodus',
    'lev': 'Leviticus', 'levi': 'Leviticus',
    'num': 'Numbers', 'numb': 'Numbers', 'nu': 'Numbers',
    'deut': 'Deuteronomy', 'deu': 'Deuteronomy', 'dt': 'Deuteronomy',
    'josh': 'Joshua', 'jos': 'Joshua',
    'judg': 'Judges', 'jdg': 'Judges', 'jud': 'Judges',
    'ruth': 'Ruth', 'ru': 'Ruth',
    '1sam': '1 Samuel', '1samuel': '1 Samuel', '1 sam': '1 Samuel', '1sa': '1 Samuel',
    '2sam': '2 Samuel', '2samuel': '2 Samuel', '2 sam': '2 Samuel', '2sa': '2 Samuel',
    '1kgs': '1 Kings', '1kings': '1 Kings', '1 kgs': '1 Kings', '1ki': '1 Kings',
    '2kgs': '2 Kings', '2kings': '2 Kings', '2 kgs': '2 Kings', '2ki': '2 Kings',
    '1chr': '1 Chronicles', '1chronicles': '1 Chronicles', '1 ch': '1 Chronicles', '1chrn': '1 Chronicles',
    '2chr': '2 Chronicles', '2chronicles': '2 Chronicles', '2 ch': '2 Chronicles', '2chrn': '2 Chronicles',
    'ezra': 'Ezra', 'ez': 'Ezra',
    'neh': 'Nehemiah', 'ne': 'Nehemiah',
    'esth': 'Esther', 'est': 'Esther',
    'job': 'Job', 'jb': 'Job',
    'ps': 'Psalms', 'psalm': 'Psalms', 'psa': 'Psalms', 'pss': 'Psalms',
    'prov': 'Proverbs', 'pr': 'Proverbs', 'pro': 'Proverbs', 'prv': 'Proverbs',
    'eccl': 'Ecclesiastes', 'ecc': 'Ecclesiastes', 'ec': 'Ecclesiastes', 'qoh': 'Ecclesiastes',
    'song': 'Song of Solomon', 'songs': 'Song of Solomon', 'ss': 'Song of Solomon', 'song of sol': 'Song of Solomon',
    'isa': 'Isaiah', 'is': 'Isaiah',
    'jer': 'Jeremiah', 'je': 'Jeremiah',
    'lam': 'Lamentations', 'la': 'Lamentations',
    'ezek': 'Ezekiel', 'eze': 'Ezekiel', 'ezk': 'Ezekiel',
    'dan': 'Daniel', 'dn': 'Daniel',
    'hos': 'Hosea', 'ho': 'Hosea',
    'joel': 'Joel', 'jl': 'Joel',
    'amos': 'Amos', 'am': 'Amos',
    'obad': 'Obadiah', 'ob': 'Obadiah', 'obd': 'Obadiah',
    'jonah': 'Jonah', 'jon': 'Jonah', 'jo': 'Jonah',
    'micah': 'Micah', 'mic': 'Micah', 'mi': 'Micah',
    'nahum': 'Nahum', 'nah': 'Nahum',
    'hab': 'Habakkuk', 'hb': 'Habakkuk',
    'zeph': 'Zephaniah', 'zep': 'Zephaniah', 'ze': 'Zephaniah',
    'hag': 'Haggai', 'hg': 'Haggai',
    'zech': 'Zechariah', 'zec': 'Zechariah', 'zr': 'Zechariah',
    'mal': 'Malachi', 'ml': 'Malachi',
    'matt': 'Matthew', 'mat': 'Matthew', 'mt': 'Matthew',
    'mark': 'Mark', 'mk': 'Mark',
    'luke': 'Luke', 'lk': 'Luke',
    'john': 'John', 'jn': 'John', 'jhn': 'John', 'jh': 'John',
    'acts': 'Acts', 'ac': 'Acts',
    'rom': 'Romans', 'rm': 'Romans',
    '1cor': '1 Corinthians', '1corinthians': '1 Corinthians', '1 cor': '1 Corinthians', '1co': '1 Corinthians',
    '2cor': '2 Corinthians', '2corinthians': '2 Corinthians', '2 cor': '2 Corinthians', '2co': '2 Corinthians',
    'gal': 'Galatians', 'ga': 'Galatians',
    'eph': 'Ephesians', 'ephs': 'Ephesians', 'ep': 'Ephesians',
    'phil': 'Philippians', 'php': 'Philippians', 'phl': 'Philippians',
    'col': 'Colossians', 'cl': 'Colossians',
    '1thess': '1 Thessalonians', '1thessalonians': '1 Thessalonians', '1 th': '1 Thessalonians', '1th': '1 Thessalonians',
    '2thess': '2 Thessalonians', '2thessalonians': '2 Thessalonians', '2 th': '2 Thessalonians', '2th': '2 Thessalonians',
    '1tim': '1 Timothy', '1timothy': '1 Timothy', '1 ti': '1 Timothy', '1tm': '1 Timothy',
    '2tim': '2 Timothy', '2timothy': '2 Timothy', '2 ti': '2 Timothy', '2tm': '2 Timothy',
    'titus': 'Titus', 'ti': 'Titus',
    'philem': 'Philemon', 'phm': 'Philemon',
    'heb': 'Hebrews', 'he': 'Hebrews',
    'james': 'James', 'jm': 'James', 'ja': 'James',
    '1pet': '1 Peter', '1peter': '1 Peter', '1 pe': '1 Peter', '1p': '1 Peter',
    '2pet': '2 Peter', '2peter': '2 Peter', '2 pe': '2 Peter', '2p': '2 Peter',
    '1john': '1 John', '1jh': '1 John', '1 jn': '1 John', '1 jo': '1 John',
    '2john': '2 John', '2jh': '2 John', '2 jn': '2 John', '2 jo': '2 John',
    '3john': '3 John', '3jh': '3 John', '3 jn': '3 John', '3 jo': '3 John',
    'jude': 'Jude', 'jud': 'Jude',
    'rev': 'Revelation', 're': 'Revelation', 'revel': 'Revelation',
    'genesis': 'Genesis',
    'exodus': 'Exodus',
    'leviticus': 'Leviticus',
    'numbers': 'Numbers',
    'deuteronomy': 'Deuteronomy',
    'joshua': 'Joshua',
    'judges': 'Judges',
    'ruth': 'Ruth',
    '1 samuel': '1 Samuel',
    '2 samuel': '2 Samuel',
    '1 kings': '1 Kings',
    '2 kings': '2 Kings',
    '1 chronicles': '1 Chronicles',
    '2 chronicles': '2 Chronicles',
    'ezra': 'Ezra',
    'nehemiah': 'Nehemiah',
    'esther': 'Esther',
    'job': 'Job',
    'psalms': 'Psalms',
    'proverbs': 'Proverbs',
    'ecclesiastes': 'Ecclesiastes',
    'song of solomon': 'Song of Solomon',
    'isaiah': 'Isaiah',
    'jeremiah': 'Jeremiah',
    'lamentations': 'Lamentations',
    'ezekiel': 'Ezekiel',
    'daniel': 'Daniel',
    'hosea': 'Hosea',
    'joel': 'Joel',
    'amos': 'Amos',
    'obadiah': 'Obadiah',
    'jonah': 'Jonah',
    'micah': 'Micah',
    'nahum': 'Nahum',
    'habakkuk': 'Habakkuk',
    'zephaniah': 'Zephaniah',
    'haggai': 'Haggai',
    'zechariah': 'Zechariah',
    'malachi': 'Malachi',
    'matthew': 'Matthew',
    'mark': 'Mark',
    'luke': 'Luke',
    'john': 'John',
    'acts': 'Acts',
    'romans': 'Romans',
    '1 corinthians': '1 Corinthians',
    '2 corinthians': '2 Corinthians',
    'galatians': 'Galatians',
    'ephesians': 'Ephesians',
    'philippians': 'Philippians',
    'colossians': 'Colossians',
    '1 thessalonians': '1 Thessalonians',
    '2 thessalonians': '2 Thessalonians',
    '1 timothy': '1 Timothy',
    '2 timothy': '2 Timothy',
    'titus': 'Titus',
    'philemon': 'Philemon',
    'hebrews': 'Hebrews',
    'james': 'James',
    '1 peter': '1 Peter',
    '2 peter': '2 Peter',
    '1 john': '1 John',
    '2 john': '2 John',
    '3 john': '3 John',
    'jude': 'Jude',
    'revelation': 'Revelation'
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
        searchButton.style.backgroundColor = 'red';
        searchButton.textContent = 'Invalid input format.';
        searchInput.value = '';
        searchInput.focus();

        setTimeout(() => {
            searchButton.style.backgroundColor = '';
            searchButton.textContent = 'Search';
        }, 1000);
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
        "text/plain": fetch(`/api/verses${query}`)
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
                        const headingText = `${group.book_name} ${group.chapter_id}:${verseRange}`;
                        clipboardText += `${headingText}\n`;
                        group.verses.forEach(verse => {
                            clipboardText += `${verse.verse_id} ${verse.verse_text}\n`;
                        });

                        resultsContainer.insertAdjacentHTML('beforeend', `
                            <article class="card">
                                <header>
                                    <h3 class="lead">${headingText}</h3>
                                </header>
                                <div>
                                    ${group.verses.map(verse => `
                                        <p><span class="text-muted">${verse.verse_id}</span> ${verse.verse_text}</p>
                                    `).join('')}
                                </div>
                            </article>
                        `);

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