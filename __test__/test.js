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
    it("Should succeed and return status code 302", async () => {
        const newUser = await request(app).post("/forgetpassword1").send({
            email: "mohamadaj310@gmail.com",
        });
        console.log(newUser.statusCode)
        expect(newUser.statusCode).toBe(302);
    })
})

describe("POST /forgetpassword", () => {
    it("Should succeed and return status code 302", async () => {
        const newUser = await request(app).post("/forgetpassword1").send({
            email: "noah@gmail.com",
        });
        console.log(newUser.statusCode)
        expect(newUser.statusCode).toBe(302);
    })
})

describe("POST /forgetpassword", () => {
    it("Should succeed and return status code 302", async () => {
        const newUser = await request(app).post("/forgetpassword1").send({
            email: "noah@gmail.com",
        });
        console.log(newUser.statusCode)
        expect(newUser.statusCode).toBe(302);
    })
})


describe("POST /patient/Appointments", () => {
    it("Should respond error the appointment is taken", async () => {
        const newUser = await request(app).post("/patient/Appointments/:id").send({
            docs: "Noah Anderson",
            time: "22:30",
            date: "2023-10-10"
        });

        expect(newUser.statusCode).toBe(404);
    })
})

describe("POST /doctor/Appointments", () => {
    it("Should respond no appointment", async () => {
        const newUser = await request(app).post("/doctor/Appointments/:id")

        expect(newUser.statusCode).toBe(404);
    })
})


describe("POST /doctor/Patients", () => {
    it("Should respond no appointment", async () => {
        const newUser = await request(app).post("/doctor/Appointments/:id/:i1/:i2/:i3/:i4")

        expect(newUser.statusCode).toBe(404);
    })
})


describe("POST /doctor/saveNote", () => {
    it("Should respond no appointment", async () => {
        const newUser = await request(app).post("/doctor/saveNote/63afebf514d74e4a6fccb9b6").send({
            text:"wasjdkkasdjk"
        });
        expect(newUser.statusCode).toBe(302);
    })
})


describe("POST /nurse/Lab", () => {
    it("Should respond error the appointment is taken", async () => {
        const newUser = await request(app).post("/nurse/Lab/63afef3cd4bc02c5be5ef736").send({
            Res: "as[p[dopijhagds]] Anderson",
            pats: "Mohamad Abu Jafar",
        });

        expect(newUser.statusCode).toBe(302);
    })
})




