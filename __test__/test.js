const request = require("supertest");
const app = require("../app").app;
const doctorRouter = require('../routes/doctor')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

describe("Test the root path", () => {
    test("It should response the GET method", done => {
        request(app)
            .get("/")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});

describe("POST /register", () => {
    it("Should succeed and return status code 302", async () => {
        const newUser = await request(app).post("/register").send({
            fullname: "Ankajhswgd",
            birthdate: Date(),//json.toString(req.body.birthdate),
            email: "Aasnbdvh@gmail.com",
            password: "12345e6",
            ID: "213169915",
            phonenumber: "0528462f345",
            gender: "Male",
        });
        console.log(newUser.statusCode)
        expect(newUser.statusCode).toBe(302);
    })
})


describe("POST /doctor/login", () => {
    it("Should respond succeed the user exists in the database", async () => {
        const newUser = await request(app).get("/doctor/login").send({
            email: 'mohamadaj310@gmail.com',
            password: 'alonnsael12A'

        });
        expect(newUser.statusCode).toBe(200);
    })
})

describe("POST /forgetpassword", () => {
    it("Should succeed and return status code 200", async () => {
        const newUser = await request(app).get("/forgetpassword").send({
            email: "mohamadaj310@gmail.com.com",
            ID: "213169915",
            password:"alonss",
            confirm:"alonss"
        });
        console.log(newUser.statusCode)
        expect(newUser.statusCode).toBe(200);
    })
})




