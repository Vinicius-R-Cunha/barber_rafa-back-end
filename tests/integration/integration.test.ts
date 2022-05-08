import supertest from "supertest";
import app from "../../src/app.js";
import db from "../../src/database.js";
import * as signUpFactory from "../factories/signUpFactory.js";

describe("POST /sign-up", () => {
    // afterAll(disconnect);

    it("should return 422 given body missing name", async () => {
        const body = signUpFactory.signUpBody("name");
        console.log(body);

        await supertest(app).post("/sign-up").send(body);
    });
});
