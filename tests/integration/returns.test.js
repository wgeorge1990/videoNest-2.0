const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
const request = require('supertest');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let requestBody

    const exec = async () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send(requestBody)
    }

    beforeEach(async () => {
        requestBody = {
            customerId,
            movieId
        }
        token = new User().generateAuthToken();
        server = require('../../index');

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '123456',
                dailyRentalRate: 3
            }
        })
        await rental.save()
    });

    afterEach(async () => {
        await server.close();
        await Rental.deleteMany({});
    });

    it('should work', async () => {
        const result = await Rental.findById(rental._id)
        expect(result).not.toBeNull();
    });

    it('should return 401 if client is not logged in', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401)
    });

    it('should return 400 if customerId is not provided', async () => {
        requestBody = { movieId }
        const res = await exec();
        expect(res.status).toBe(400)

    });

    it('should return 400 if movieId is not provided', async () => {
        requestBody = { customerId }
        const res = await exec();
        expect(res.status).toBe(400)
    });

    it('should return 404 if no rental is found for customer/movie combination', async () => {
        await Rental.remove({})

        const res = await exec();

        expect(res.status).toBe(404)
    })

}); // end of api/rentals suite