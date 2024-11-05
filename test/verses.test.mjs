import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js'; // Adjust the path to your app file

describe('GET /verses', () => {
    it('should return John 1:1 when querying "John 1:1"', async () => {
        const res = await request(app)
            .get('/verses')
            .query({ book_name: 'John', chapter_id: 1, start_verse_id: 1, end_verse_id: 1 });

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.property('book_name', 'John');
        expect(res.body[0].verses).to.be.an('array');
        expect(res.body[0].verses[0]).to.have.property('chapter_id', 1);
        expect(res.body[0].verses[0]).to.have.property('verse_id', 1);
        expect(res.body[0].verses[0]).to.have.property('verse_text').that.is.a('string');
    });

    it('should return all verses of John chapter 1 when querying "John 1:1-"', async () => {
        const res = await request(app)
            .get('/verses')
            .query({ book_name: 'John', chapter_id: 1, start_verse_id: 1 });

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.property('book_name', 'John');
        expect(res.body[0].verses).to.be.an('array');
        expect(res.body[0].verses[0]).to.have.property('chapter_id', 1);

        const lastVerse = res.body[0].verses[res.body[0].verses.length - 1];
        expect(lastVerse).to.have.property('chapter_id', 1);
        expect(lastVerse).to.have.property('verse_id').that.is.a('number');
    });
});
