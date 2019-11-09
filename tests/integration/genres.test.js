const request = require('supertest');
const { Genre } = require('../../models/genres');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); })
    afterEach(async () => {
        //cleanup function wipes test database
        await Genre.deleteMany({})
        server.close();
    });
   
    describe('GET /', () => {
        it('should return all genres', async () => {
           await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' },
                { name: 'genre3' }
            ])

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3)
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre3')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return the genre with the given id', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();
            const res = await request(server).get(`/api/genres/${genre._id}`)
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', genre.name)
        });

        it('should return status 404 if no genre with the given id exists', async () => {

            const res = await request(server).get('/api/genres/1')
            expect(res.status).toBe(404)
        });
        it('should return status 404 if invalid id is passed', async () => {
            const objectId = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + objectId)
            expect(res.status).toBe(404)
        });
    })

    describe('POST /', () => {
    // Define the happy path, and then in each test,
    // we change one parameter tht clearly aligns with
    // with the name of the test.
        let token;
        let name;
        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name }); //es6 key and value same, write once
        }

        beforeEach(() => {
            //simulates an authenticated user
            token = new User().generateAuthToken();
            name = 'genreOne'
        })

        it('return status 401 if user is not logged in', async () => {
            //simulates a an unauthenticated user
            token = ''
            const res = await exec()
            expect(res.status).toBe(401);
        });

        it('return status 400 if genre is less than 5 characters', async () => {
            name = '1234'
            const res = await exec()
            expect(res.status).toBe(400);
        });

        it('return status 400 if genre is more than 30 characters', async () => {
            name = new Array(32).join('a')
            const res = await exec()
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
           //TODO: add request from refactor
            const res = await exec()
            const genre = await Genre.find({ name })
            expect(genre).not.toBeNull();
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name')

        });
    }); //end POST /

    describe('PUT /:id', () => {
        let token;
        let newName;
        let genre;
        let id;

        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ name: newName })
        };

        beforeEach(async () => {
            // Becasue we are trying to test editing an existing object we need to create one in the test database prior to running tests.
            genre = new Genre({ name: 'genreOne' });
            await genre.save();

            token = new User().generateAuthToken()
            id = genre._id;
            newName = 'updatedGenreOne'
        })

        it('should return 401 if the client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401)
        })

        it('should return 400 if genre is less than 5 characters', async () => {
            newName = '1234'
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should return 400 if genre is more than 30 characters', async () => {
            newName = new Array(32).join('a')
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should return 404 if id is invalid', async () => {
            id = 1
            const res = await exec();
            expect(res.status).toBe(404)
        })

        it('should should return a 404 if genre with the given id was not found', async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404)
        })

        it('should update the genre if it is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id', genre._id.toHexString())
            expect(res.body).toHaveProperty('name', newName)
        });
    }) //end PUT

    describe('DELETE /:id', () => {
        let token
        let id
        let genre

        const exec = async () => {
            return await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token)
                .send();
        }

        beforeEach( async () => {
            genre = new Genre({ name: "newG4Delete" });
            await genre.save();
            id = genre._id;
            token = new User({ isAdmin: true }).generateAuthToken();
        })

        it('should return a 401 if user is not logged in', async () => {
            token = '';
            const res = await exec()
            expect(res.status).toBe(401)
        })

        it('should return a 403 if the user is not admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403)
        })

        it('should return a 404 if id is invalid', async () => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404)
        })

        it('should return 404 if no genre with the given id was found', async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should delete the genre if input is valid', async () => {
            await exec();
            const genreInDb = await Genre.findById(id)
            expect(genreInDb).toBeNull();
        });

        it('should return the removed genre', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id', genre._id.toHexString())
            expect(res.body).toHaveProperty('name', genre.name)
        })
    }) // end of DELETE Suite

}); //end GENRES SUITE