import { expect } from 'chai';
import request from 'supertest';
import server from '../src/server';

describe('GET /api/verses', () => {
  after((done) => {
    server.close(done); // Close the server after tests
  });

  it('should return John 1:1 when querying "John 1:1"', async () => {
    const res = await request(server).get('/api/verses')
      .query({ book_name: 'John', chapter_id: 1, start_verse_id: 1, end_verse_id: 1 });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('book_name', 'John');
    expect(res.body[0]).to.have.property('chapter_id', 1);
    expect(res.body[0]).to.have.property('verse_id', 1);
    expect(res.body[0]).to.have.property('verse_text').that.is.a('string');
  });

  it('should return all verses of John chapter 1 when querying "John 1:1-"', (done) => {
    request(server)
      .get('/api/verses')
      .query({ book_name: 'John', chapter_id: 1, start_verse_id: 1 })
      .end((err, res) => {
        if (err) return done(err);
        try {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          res.body.forEach((verse) => {
            expect(verse).to.have.property('book_name', 'John');
            expect(verse).to.have.property('chapter_id', 1);
            expect(verse).to.have.property('verse_id').that.is.a('number');
            expect(verse).to.have.property('verse_text').that.is.a('string');
          });
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it('should return 1 John 5:7 with the correct KJV text', async () => {
    const res = await request(server).get('/api/verses')
      .query({ book_name: '1 John', chapter_id: 5, start_verse_id: 7, end_verse_id: 7 });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('book_name', '1 John');
    expect(res.body[0]).to.have.property('chapter_id', 5);
    expect(res.body[0]).to.have.property('verse_id', 7);
    expect(res.body[0]).to.have.property('verse_text').that.is.a('string');

    // KJV text for 1 John 5:7
    const expectedText = "For there are three that bear record in heaven, the Father, the Word, and the Holy Ghost: and these three are one.";

    // Verify the exact KJV text for 1 John 5:7
    expect(res.body[0].verse_text).to.equal(expectedText);
  });

  it('should return the cambridge spelling from Nahum 3:16.', async () => {
    const res = await request(server).get('/api/verses')
      .query({ book_name: 'Nahum', chapter_id: 3, start_verse_id: 16, end_verse_id: 16 });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('book_name', 'Nahum');
    expect(res.body[0]).to.have.property('chapter_id', 3);
    expect(res.body[0]).to.have.property('verse_id', 16);
    expect(res.body[0]).to.have.property('verse_text').that.is.a('string');

    // KJV text for 1 John 5:7
    const expectedText = "Thou hast multiplied thy merchants above the stars of heaven: the cankerworm spoileth, and flieth away.";

    // Verify the exact KJV text for 1 John 5:7
    expect(res.body[0].verse_text).to.equal(expectedText);
  });
});
