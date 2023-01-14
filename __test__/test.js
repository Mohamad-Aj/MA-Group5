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
        const newUser = await request(app).post("/patient/Profile/63afeb3114d74e4a6fccb9aa").send({
            email:"noah@gmail.com",
            
        });
        expect(newUser.statusCode).toBe(404);
    })
})

describe("POST /nurse/Profile", () => {
    it("Should respond with error code the user exists in the database but as patient", async () => {
        const newUser = await request(app).post("/nurse/Profile/63aff4bc99c006ebf459a118").send({
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
        const newUser = await request(app).get("/doctor/Appointments/63afeb3114d74e4a6fccb9aa")

        expect(newUser.statusCode).toBe(302);
    })
})


describe("POST /doctor/Patients", () => {
    it("Should respond successfully with patients page", async () => {
        const newUser = await request(app).get("/doctor/Patients/63afeb3114d74e4a6fccb9aa")

        expect(newUser.statusCode).toBe(302);
    })
})


describe("POST /doctor/saveNote", () => {
    it("Should save the note", async () => {
        const newUser = await request(app).post("/doctor/saveNote/63afebf514d74e4a6fccb9b6").send({
            text:"wasjdkkasdjk"
        });
        expect(newUser.statusCode).toBe(302);
    })
})


describe("POST /nurse/Lab", () => {
    it("Should post the lab result", async () => {
        const newUser = await request(app).post("/nurse/Lab/63afef3cd4bc02c5be5ef736").send({
            Res: "as[p[dopijhagds]] Anderson",
            pats: "Mohamad Abu Jafar",
        });

        expect(newUser.statusCode).toBe(302);
    })
})



describe("POST /patient/Rate", () => {
    it("Should write the review with success", async () => {
        const newUser = await request(app).post("/patient/Rate/63aff4bc99c006ebf459a118").send({
            docss:"Noah Anderson",
            rating:"Test Review"
        });

        expect(newUser.statusCode).toBe(302);
    })
})



describe("POST /patient/OrderCard", () => {
    it("Should send email to the person who order a card", async () => {
        const newUser = await request(app).post("/patient/OrderCard/63aff4bc99c006ebf459a118").send({
            name:"Mohamad Aj",
            email:"mohamadaj310@gmail.com"
        });
        expect(newUser.statusCode).toBe(302);
    })
})


describe("POST /patient/Medicine", () => {
    it("Should send email with medicine name", async () => {
        const newUser = await request(app).post("/patient/Medicine/63aff4bc99c006ebf459a118/Acetaminophen").send({
        });
        expect(newUser.statusCode).toBe(302);
    })
})



describe("POST /nurse/Appointments", () => {
    it("Should respond with success and open the appointments", async () => {
        const newUser = await request(app).get("/nurse/Appointments/63afed0514d74e4a6fccb9c8").send({
        });
        expect(newUser.statusCode).toBe(302);
    })
})
