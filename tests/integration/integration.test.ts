import supertest from "supertest";
import app from "../../src/app.js";
import { db, mongoClient } from "../../src/database.js";
import * as signUpFactory from "../factories/signUpFactory.js";
import * as signInFactory from "../factories/signInFactory.js";
import * as categoryFactory from "../factories/categoryFactory.js";
import * as servicesFactory from "../factories/servicesFactory.js";
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
        expect(user).toHaveProperty("name", body.name);
        expect(user).toHaveProperty("email", body.email);
        expect(user).toHaveProperty("phone", body.phone);
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
        const token = await signInFactory.generateValidToken();

        const validation = await supertest(app)
            .post("/token/validation")
            .set("Authorization", `Bearer ${token}`);

        expect(validation.status).toBe(200);
    });

    it("should return 401 if not given a token", async () => {
        const validation = await supertest(app).post("/token/validation");

        expect(validation.status).toBe(401);
    });

    it("should return 401 given a invalid token", async () => {
        const token = "completelyinvalidtoken";

        const validation = await supertest(app)
            .post("/token/validation")
            .set("Authorization", `Bearer ${token}`);

        expect(validation.status).toBe(401);
    });

    it("should return 422 given a valid token that is not from any user", async () => {
        const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJKb2huIERvZSJ9fQ.xY01AjfmxskAvfrpMkXp8uw0XqlANlxC46bk22m_Hvk";

        const validation = await supertest(app)
            .post("/token/validation")
            .set("Authorization", `Bearer ${token}`);

        expect(validation.status).toBe(422);
    });
});

describe("POST /categories", () => {
    beforeAll(connect);
    beforeEach(truncate);
    afterAll(disconnect);

    it("should return 201 given a valid body and send to db", async () => {
        const body = categoryFactory.categoryBody();
        const token = await signInFactory.generateValidToken();

        const result = await supertest(app)
            .post("/categories")
            .send(body)
            .set("Authorization", `Bearer ${token}`);

        const category = await db
            .collection("categories")
            .findOne({ title: body.title });

        expect(result.status).toBe(201);
        expect(category).toHaveProperty("title", body.title);
        expect(category).toHaveProperty("services", []);
    });

    it("should return 422 given a invalid body", async () => {
        const body = categoryFactory.categoryBody("title");
        const token = await signInFactory.generateValidToken();

        const result = await supertest(app)
            .post("/categories")
            .send(body)
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(422);
    });

    it("should return 409 given a already existent title", async () => {
        const body = await categoryFactory.insertCategory();
        const token = await signInFactory.generateValidToken();

        const result = await supertest(app)
            .post("/categories")
            .send(body)
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(409);
    });
});

describe("GET /categories", () => {
    beforeAll(connect);
    beforeEach(truncate);
    afterAll(disconnect);

    it("should return 200 and a array with all categories", async () => {
        const categoryQuantity = 3;

        for (let i = 0; i < categoryQuantity; i++) {
            await categoryFactory.insertCategory();
        }

        const token = await signInFactory.generateValidToken();

        const result = await supertest(app)
            .get("/categories")
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(200);
        expect(result.body).toHaveLength(categoryQuantity);
    });
});

describe("DELETE /categories/categoryTitle", () => {
    beforeAll(connect);
    beforeEach(truncate);
    afterAll(disconnect);

    it("should return 200 and delete the category from db", async () => {
        const { title } = await categoryFactory.insertCategory();
        const token = await signInFactory.generateValidToken();

        const categoryBefore = await db
            .collection("categories")
            .findOne({ title });

        const result = await supertest(app)
            .delete(`/categories/${title}`)
            .set("Authorization", `Bearer ${token}`);

        const categoryAfter = await db
            .collection("categories")
            .findOne({ title });

        expect(result.status).toBe(200);
        expect(categoryBefore).toBeTruthy();
        expect(categoryAfter).toBeNull();
    });

    it("should return 404 if category does not exists", async () => {
        const title = "some category";
        const token = await signInFactory.generateValidToken();

        const result = await supertest(app)
            .delete(`/categories/${title}`)
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(404);
    });

    it("should return 422 if category exists but is not empty", async () => {
        const { title } = await categoryFactory.insertCategory();
        await servicesFactory.insertService(title);
        const token = await signInFactory.generateValidToken();

        const result = await supertest(app)
            .delete(`/categories/${title}`)
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(422);
    });
});

describe("PUT /categories/categoryTitle", () => {
    beforeAll(connect);
    beforeEach(truncate);
    afterAll(disconnect);

    it("should return 200 and edit the category inside the db", async () => {
        const { title } = await categoryFactory.insertCategory();
        const body = categoryFactory.categoryBody();
        const token = await signInFactory.generateValidToken();

        const categoryBefore = await db
            .collection("categories")
            .findOne({ title });

        const result = await supertest(app)
            .put(`/categories/${title}`)
            .send(body)
            .set("Authorization", `Bearer ${token}`);

        const categoryAfter = await db
            .collection("categories")
            .findOne({ title: body.title });

        expect(result.status).toBe(200);
        expect(categoryBefore._id).toStrictEqual(categoryAfter._id);
    });

    it("should return 422 given a invalid body", async () => {
        const { title } = await categoryFactory.insertCategory();
        const body = categoryFactory.categoryBody("title");
        const token = await signInFactory.generateValidToken();

        const result = await supertest(app)
            .put(`/categories/${title}`)
            .send(body)
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(422);
    });

    it("should return 404 given a category that does not exists", async () => {
        const title = "some category";
        const body = categoryFactory.categoryBody();
        const token = await signInFactory.generateValidToken();

        const result = await supertest(app)
            .put(`/categories/${title}`)
            .send(body)
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(404);
    });

    it("should return 409 given a body with existent title", async () => {
        const { title } = await categoryFactory.insertCategory();
        const token = await signInFactory.generateValidToken();

        const result = await supertest(app)
            .put(`/categories/${title}`)
            .send({ title })
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(409);
    });
});

describe("POST /services/categoryTitle", () => {
    beforeAll(connect);
    beforeEach(truncate);
    afterAll(disconnect);

    it("should return 201 given a valid body and send to db", async () => {
        const { title } = await categoryFactory.insertCategory();
        const body = servicesFactory.serviceBody();
        const token = await signInFactory.generateValidToken();

        const categoryBefore = await db
            .collection("categories")
            .findOne({ title });

        const result = await supertest(app)
            .post(`/services/${title}`)
            .send(body)
            .set("Authorization", `Bearer ${token}`);

        const categoryAfter = await db
            .collection("categories")
            .findOne({ title });

        expect(result.status).toBe(201);
        expect(categoryAfter.services).toHaveLength(
            categoryBefore.services.length + 1
        );
    });

    it("should return 422 given body without name", async () => {
        const { title } = await categoryFactory.insertCategory();
        const body = servicesFactory.serviceBody("name");
        const token = await signInFactory.generateValidToken();

        const result = await supertest(app)
            .post(`/services/${title}`)
            .send(body)
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(422);
    });

    it("should return 422 given body without price", async () => {
        const { title } = await categoryFactory.insertCategory();
        const body = servicesFactory.serviceBody("price");
        const token = await signInFactory.generateValidToken();

        const result = await supertest(app)
            .post(`/services/${title}`)
            .send(body)
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(422);
    });

    it("should return 422 given body without duration", async () => {
        const { title } = await categoryFactory.insertCategory();
        const body = servicesFactory.serviceBody("duration");
        const token = await signInFactory.generateValidToken();

        const result = await supertest(app)
            .post(`/services/${title}`)
            .send(body)
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(422);
    });

    it("should return 422 given body without description", async () => {
        const { title } = await categoryFactory.insertCategory();
        const body = servicesFactory.serviceBody("description");
        const token = await signInFactory.generateValidToken();

        const result = await supertest(app)
            .post(`/services/${title}`)
            .send(body)
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(422);
    });

    it("should return 404 given a non-existent category", async () => {
        const title = "some title";
        const body = servicesFactory.serviceBody();
        const token = await signInFactory.generateValidToken();

        const result = await supertest(app)
            .post(`/services/${title}`)
            .send(body)
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(404);
    });

    it("should return 409 given a existent service with that name", async () => {
        const { title } = await categoryFactory.insertCategory();
        const body = await servicesFactory.insertService(title);
        const token = await signInFactory.generateValidToken();

        const result = await supertest(app)
            .post(`/services/${title}`)
            .send(body)
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(409);
    });
});

describe("DELETE /services/categoryTitle/serviceName", () => {
    beforeAll(connect);
    beforeEach(truncate);
    afterAll(disconnect);

    it("should return 200 and remove the service from the array", async () => {
        const { title } = await categoryFactory.insertCategory();
        const serviceQuantity = 3;

        for (let i = 0; i < serviceQuantity - 1; i++) {
            await servicesFactory.insertService(title);
        }
        const body = await servicesFactory.insertService(title);

        const token = await signInFactory.generateValidToken();

        const categoryBefore = await db
            .collection("categories")
            .findOne({ title });

        const result = await supertest(app)
            .delete(`/services/${title}/${body.name}`)
            .set("Authorization", `Bearer ${token}`);

        const categoryAfter = await db
            .collection("categories")
            .findOne({ title });

        expect(result.status).toBe(200);
        expect(categoryAfter.services).toHaveLength(
            categoryBefore.services.length - 1
        );
    });

    it("should return 404 given a non-existent category", async () => {
        const { title } = await categoryFactory.insertCategory();
        const body = await servicesFactory.insertService(title);
        const token = await signInFactory.generateValidToken();
        const fakeTitle = "some title";

        const result = await supertest(app)
            .delete(`/services/${fakeTitle}/${body.name}`)
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(404);
    });

    it("should return 404 given a non-existent service", async () => {
        const { title } = await categoryFactory.insertCategory();
        await servicesFactory.insertService(title);
        const token = await signInFactory.generateValidToken();
        const fakeService = "some service";

        const result = await supertest(app)
            .delete(`/services/${title}/${fakeService}`)
            .set("Authorization", `Bearer ${token}`);

        expect(result.status).toBe(404);
    });
});

async function truncate() {
    await db.collection("users").deleteMany({});
    await db.collection("categories").deleteMany({});
}

async function connect() {
    await mongoClient.connect();
}

async function disconnect() {
    await mongoClient.close();
}
