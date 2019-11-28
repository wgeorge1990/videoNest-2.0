const request = require('supertest');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genres');

describe('auth middleware', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => {
        //cleanup function
        await Genre.deleteMany();
        server.close();
    });

    let token;

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genreOne' })
    };

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if invalid token is provided', async () => {
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if valid token is provided', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});
