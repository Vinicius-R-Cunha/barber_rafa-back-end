import supertest from "supertest";
import app from "../../src/app.js";
import { db, mongoClient } from "../../src/database.js";
import * as signUpFactory from "../factories/signUpFactory.js";
import * as signInFactory from "../factories/signInFactory.js";
import jwt from "jsonwebtoken";

describe("POST /sign-up", () => {
    beforeEach(truncate);
    afterAll(disconnect);

    it("should return 201 given a valid body and send to db", async () => {
        const body = signUpFactory.signUpBody();

        const result = await supertest(app).post("/sign-up").send(body);

        const user = await db
            .collection("users")
            .findOne({ email: body.email });

        expect(result.status).toBe(201);
        expect(user).toBeTruthy();
    });

    it("should return 422 given body missing name", async () => {
        const body = signUpFactory.signUpBody("name");

        const result = await supertest(app).post("/sign-up").send(body);

        expect(result.status).toBe(422);
    });

    it("should return 422 given body missing email", async () => {
        const body = signUpFactory.signUpBody("email");

        const result = await supertest(app).post("/sign-up").send(body);

        expect(result.status).toBe(422);
    });

    it("should return 422 given body missing phone", async () => {
        const body = signUpFactory.signUpBody("phone");

        const result = await supertest(app).post("/sign-up").send(body);

        expect(result.status).toBe(422);
    });

    it("should return 422 given body missing password", async () => {
        const body = signUpFactory.signUpBody("password");

        const result = await supertest(app).post("/sign-up").send(body);

        expect(result.status).toBe(422);
    });

    it("should return 422 given body missing passwordConfirmation", async () => {
        const body = signUpFactory.signUpBody("passwordConfirmation");

        const result = await supertest(app).post("/sign-up").send(body);

        expect(result.status).toBe(422);
    });

    it("should return 409 given body with email already existent", async () => {
        const body = signUpFactory.signUpBody();

        await db.collection("users").insertOne({ ...body });

        const result = await supertest(app).post("/sign-up").send(body);

        expect(result.status).toBe(409);
    });

    it("should return 409 given body with passwords mismatching", async () => {
        const body = signUpFactory.signUpBody();

        const result = await supertest(app)
            .post("/sign-up")
            .send({ ...body, passwordConfirmation: "senhaimpossivel" });

        expect(result.status).toBe(409);
    });
});

describe("POST /sign-in", () => {
    beforeAll(connect);
    beforeEach(truncate);
    afterAll(disconnect);

    it("should return 200 with valid token given a valid body", async () => {
        const userData = await signInFactory.signIn();

        const result = await supertest(app)
            .post("/sign-in")
            .send({ email: userData.email, password: userData.password });

        let tokenData: jwt.JwtPayload;
        jwt.verify(
            result.text,
            process.env.JWT_SECRET,
            (error: any, decoded: any) => {
                if (error) {
                    throw { type: "unauthorized", message: "invalid token" };
                }
                tokenData = decoded as jwt.JwtPayload;
            }
        );

        expect(result.status).toBe(200);
        expect(tokenData).toBeTruthy();
    });

    it("should return 422 given body without email", async () => {
        const body = signInFactory.signInBody("email");

        const result = await supertest(app).post("/sign-in").send(body);

        expect(result.status).toBe(422);
    });

    it("should return 422 given body without password", async () => {
        const body = signInFactory.signInBody("password");

        const result = await supertest(app).post("/sign-in").send(body);

        expect(result.status).toBe(422);
    });

    it("should return 409 given body with passwords mismatching", async () => {
        const body = signInFactory.signInBody();

        const result = await supertest(app).post("/sign-in").send(body);

        expect(result.status).toBe(409);
    });

    it("should return 409 given a invalid email", async () => {
        const body = signInFactory.signInBody();

        const result = await supertest(app).post("/sign-in").send(body);

        expect(result.status).toBe(409);
    });

    it("should return 409 given a invalid password", async () => {
        const userData = await signInFactory.signIn();

        const result = await supertest(app)
            .post("/sign-in")
            .send({ email: userData.email, password: "senhaimpossivel" });

        expect(result.status).toBe(409);
    });
});

describe("GET /token/validation", () => {
    beforeAll(connect);
    beforeEach(truncate);
    afterAll(disconnect);

    it("should return 200 given a valid token", async () => {
        const userData = await signInFactory.signIn();

        const result = await supertest(app)
            .post("/sign-in")
            .send({ email: userData.email, password: userData.password });

        const validation = await supertest(app)
            .post("/token/validation")
            .set("Authorization", `Bearer ${result.text}`);

        expect(validation.status).toBe(200);
    });
});

async function truncate() {
    await db.collection("users").deleteMany({});
}

async function connect() {
    await mongoClient.connect();
}

async function disconnect() {
    await mongoClient.close();
}
