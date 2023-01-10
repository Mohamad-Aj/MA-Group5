const request = require("supertest");
const app = require("../app").app;
const doctorRouter = require('../routes/doctor')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise



const dbURI = 'mongodb+srv://mohamad_aj3:alonssael12A@cluster0.jtnxgjr.mongodb.net/Hospital?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async (result) =>{ await console.log('connected to db')})
    .catch((err) => console.log(err));
var db = mongoose.connection;

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

// describe("POST /register", () => {
//     it("Should succeed and return status code 302", async () => {
//         const newUser = await request(app).post("/register").send({
//             fullname: "Ankajhjhswgd",
//             birthdate: Date(),//json.toString(req.body.birthdate),
//             email: "Aasnbasddvh@gmail.com",
//             password: "12345e6",
//             id1: "213121369915",
//             phonenumber: "052328462f345",
//             gender: "Male",
//         });
//         console.log(newUser.statusCode)
//         expect(newUser.statusCode).toBe(302);
//     })
// })


describe("POST /doctor/login", () => {
    it("Should respond succeed the user exists in the database", async () => {
        const newUser = await request(app).post("/doctor/login").send({
            email: 'noah@gmail.com',
            password: 'alonssael12A'

        });

        expect(newUser.statusCode).toBe(302);
    })
})

describe("POST /patient/login", () => {
    it("Should respond succeed the user exists in the database", async () => {
        const newUser = await request(app).post("/patient/login").send({
            email: 'mohamadaj310@gmail.com',
            password: 'alonssael12A'

        });

        expect(newUser.statusCode).toBe(302);
    })
})


describe("POST /nurse/login", () => {
    it("Should respond succeed the user exists in the database", async () => {
        const newUser = await request(app).post("/nurse/login").send({
            email: 'mia@gmail.com',
            password: 'alonssael12A'

        });

        expect(newUser.statusCode).toBe(302);
    })
})

describe("POST /doctor/LogOut", () => {
    it("Should respond succeed the user exists in the database", async () => {
        const newUser = await request(app).post("/doctor/LogOut")
        expect(newUser.statusCode).toBe(302);
    })
})

describe("POST /patient/LogOut", () => {
    it("Should respond succeed the user exists in the database", async () => {
        const newUser = await request(app).post("/patient/LogOut")
        expect(newUser.statusCode).toBe(302);
    })
})

describe("POST /nurse/LogOut", () => {
    it("Should respond succeed the user exists in the database", async () => {
        const newUser = await request(app).post("/nurse/LogOut")
        expect(newUser.statusCode).toBe(302);
    })
})

describe("POST /doctor/Profile", () => {
    it("Should respond error the user does not exist in the database", async () => {
        const newUser = await request(app).post("/doctor/Profile/:id").send({
            email:null,

        });
        expect(newUser.statusCode).toBe(404);
    })
})




describe("POST /patient/Profile", () => {
    it("Should respond with error code the user exists in the database but as doctor", async () => {
        const newUser = await request(app).post("/patient/Profile/:id").send({
            email:"noah@gmail.com",
            
        });
        expect(newUser.statusCode).toBe(404);
    })
})

describe("POST /nurse/Profile", () => {
    it("Should respond with error code the user exists in the database but as patient", async () => {
        const newUser = await request(app).post("/nurse/Profile/:id").send({
            email:"mohamadaj310@gmail.com",  
        });
        expect(newUser.statusCode).toBe(404);
    })
})




describe("POST /forgetpassword", () => {
    it("Should succeed and return status code 200", async () => {
        const newUser = await request(app).post("/forgetpassword1").send({
            email: "mohamadaj310@gmail.com",
        });
        console.log(newUser.statusCode)
        expect(newUser.statusCode).toBe(302);
    })
})





