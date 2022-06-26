import supertest from "supertest";
import app from "../../src/app.js";
import { db, mongoClient } from "../../src/database.js";
import * as signUpFactory from "../factories/signUpFactory.js";
import * as signInFactory from "../factories/signInFactory.js";
import * as categoryFactory from "../factories/categoryFactory.js";
import * as serviceFactory from "../factories/serviceFactory.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

describe("POST /sign-up", () => {
  beforeEach(truncate);
  afterAll(disconnect);

  it("should return 201 given a valid body and send to db", async () => {
    const body = signUpFactory.signUpBody();

    const result = await supertest(app).post("/sign-up").send(body);

    const user = await db.collection("users").findOne({ email: body.email });

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

  it("should return 409 given body with email already existent", async () => {
    const body = signUpFactory.signUpBody();

    await db.collection("users").insertOne({ ...body });

    const result = await supertest(app).post("/sign-up").send(body);

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

  it("should return 400 given a valid token that is not from any user", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJKb2huIERvZSJ9fQ.xY01AjfmxskAvfrpMkXp8uw0XqlANlxC46bk22m_Hvk";

    const validation = await supertest(app)
      .post("/token/validation")
      .set("Authorization", `Bearer ${token}`);

    expect(validation.status).toBe(400);
  });
});

describe("POST /categories", () => {
  beforeAll(connect);
  beforeEach(truncate);
  afterAll(disconnect);

  it("should return 201 given a valid body and send to db", async () => {
    const body = categoryFactory.categoryBody();
    const token = await signInFactory.generateAdminToken();

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

  it("should return 401 given a valid body and a token that is not admin", async () => {
    const body = categoryFactory.categoryBody();
    const token = await signInFactory.generateValidToken();

    const result = await supertest(app)
      .post("/categories")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(401);
  });

  it("should return 422 given a invalid body", async () => {
    const body = categoryFactory.categoryBody("title");
    const token = await signInFactory.generateAdminToken();

    const result = await supertest(app)
      .post("/categories")
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(422);
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

describe("DELETE /categories/categoryId", () => {
  beforeAll(connect);
  beforeEach(truncate);
  afterAll(disconnect);

  it("should return 200 and delete the category from db", async () => {
    const { insertedId } = await categoryFactory.insertCategory();
    const token = await signInFactory.generateAdminToken();

    const categoryBefore = await db
      .collection("categories")
      .findOne({ _id: insertedId });

    const result = await supertest(app)
      .delete(`/categories/${insertedId}`)
      .set("Authorization", `Bearer ${token}`);

    const categoryAfter = await db
      .collection("categories")
      .findOne({ _id: insertedId });

    expect(result.status).toBe(200);
    expect(categoryBefore).toBeTruthy();
    expect(categoryAfter).toBeNull();
  });

  it("should return 401 given token that is not from admin", async () => {
    const { insertedId } = await categoryFactory.insertCategory();
    const token = await signInFactory.generateValidToken();

    const result = await supertest(app)
      .delete(`/categories/${insertedId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(401);
  });

  it("should return 404 if category does not exists", async () => {
    const id = new ObjectId();
    const token = await signInFactory.generateAdminToken();

    const result = await supertest(app)
      .delete(`/categories/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
  });

  it("should return 400 if category exists but is not empty", async () => {
    const { insertedId } = await categoryFactory.insertCategory();
    await serviceFactory.insertService(insertedId);
    const token = await signInFactory.generateAdminToken();

    const result = await supertest(app)
      .delete(`/categories/${insertedId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(400);
  });
});

describe("PUT /categories/categoryId", () => {
  beforeAll(connect);
  beforeEach(truncate);
  afterAll(disconnect);

  it("should return 200 and edit the category inside the db", async () => {
    const { insertedId } = await categoryFactory.insertCategory();
    const body = categoryFactory.categoryBody();
    const token = await signInFactory.generateAdminToken();

    const categoryBefore = await db
      .collection("categories")
      .findOne({ _id: insertedId });

    const result = await supertest(app)
      .put(`/categories/${insertedId}`)
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    const categoryAfter = await db
      .collection("categories")
      .findOne({ title: body.title });

    expect(result.status).toBe(200);
    expect(categoryBefore._id).toStrictEqual(categoryAfter._id);
  });

  it("should return 401 given a token that is not admin", async () => {
    const { insertedId } = await categoryFactory.insertCategory();
    const body = categoryFactory.categoryBody();
    const token = await signInFactory.generateValidToken();

    const result = await supertest(app)
      .put(`/categories/${insertedId}`)
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(401);
  });

  it("should return 422 given a invalid body", async () => {
    const { insertedId } = await categoryFactory.insertCategory();
    const body = categoryFactory.categoryBody("title");
    const token = await signInFactory.generateAdminToken();

    const result = await supertest(app)
      .put(`/categories/${insertedId}`)
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(422);
  });

  it("should return 404 given a category that does not exists", async () => {
    const id = new ObjectId();
    const body = categoryFactory.categoryBody();
    const token = await signInFactory.generateAdminToken();

    const result = await supertest(app)
      .put(`/categories/${id}`)
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
  });
});

describe("POST /services/categoryId", () => {
  beforeAll(connect);
  beforeEach(truncate);
  afterAll(disconnect);

  it("should return 201 given a valid body and send to db", async () => {
    const { insertedId } = await categoryFactory.insertCategory();
    const body = serviceFactory.serviceBody();
    const token = await signInFactory.generateAdminToken();

    const categoryBefore = await db
      .collection("categories")
      .findOne({ _id: insertedId });

    const result = await supertest(app)
      .post(`/services/${insertedId}`)
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    const categoryAfter = await db
      .collection("categories")
      .findOne({ _id: insertedId });

    expect(result.status).toBe(201);
    expect(categoryAfter.services).toHaveLength(
      categoryBefore.services.length + 1
    );
  });

  it("should return 401 given a token that is not admin", async () => {
    const { insertedId } = await categoryFactory.insertCategory();
    const body = serviceFactory.serviceBody();
    const token = await signInFactory.generateValidToken();

    const result = await supertest(app)
      .post(`/services/${insertedId}`)
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(401);
  });

  it("should return 422 given body without name", async () => {
    const { insertedId } = await categoryFactory.insertCategory();
    const body = serviceFactory.serviceBody("name");
    const token = await signInFactory.generateAdminToken();

    const result = await supertest(app)
      .post(`/services/${insertedId}`)
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(422);
  });

  it("should return 422 given body without price", async () => {
    const { insertedId } = await categoryFactory.insertCategory();
    const body = serviceFactory.serviceBody("price");
    const token = await signInFactory.generateAdminToken();

    const result = await supertest(app)
      .post(`/services/${insertedId}`)
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(422);
  });

  it("should return 422 given body without duration", async () => {
    const { insertedId } = await categoryFactory.insertCategory();
    const body = serviceFactory.serviceBody("duration");
    const token = await signInFactory.generateAdminToken();

    const result = await supertest(app)
      .post(`/services/${insertedId}`)
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(422);
  });

  it("should return 422 given body without description", async () => {
    const { insertedId } = await categoryFactory.insertCategory();
    const body = serviceFactory.serviceBody("description");
    const token = await signInFactory.generateAdminToken();

    const result = await supertest(app)
      .post(`/services/${insertedId}`)
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(422);
  });

  it("should return 404 given a non-existent category", async () => {
    const id = new ObjectId();
    const body = serviceFactory.serviceBody();
    const token = await signInFactory.generateAdminToken();

    const result = await supertest(app)
      .post(`/services/${id}`)
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
  });
});

describe("PUT /services/categoryId/serviceId", () => {
  beforeAll(connect);
  beforeEach(truncate);
  afterAll(disconnect);

  it("should return 200 and edit the selected service inside db", async () => {
    const { insertedId: categoryId } = await categoryFactory.insertCategory();
    const { serviceId } = await serviceFactory.insertService(categoryId);
    const token = await signInFactory.generateAdminToken();

    const categoryBefore = await db
      .collection("categories")
      .findOne({ _id: categoryId });

    const serviceBefore = categoryBefore.services[0];

    const newBody = serviceFactory.serviceBody();
    const result = await supertest(app)
      .put(`/services/${categoryId}/${serviceId}`)
      .send(newBody)
      .set("Authorization", `Bearer ${token}`);

    const categoryAfter = await db
      .collection("categories")
      .findOne({ _id: categoryId });

    const serviceAfter = categoryAfter.services[0];

    expect(result.status).toBe(200);
    expect(serviceBefore._id).toStrictEqual(serviceAfter._id);
    expect(serviceBefore.name).not.toStrictEqual(serviceAfter.name);
    expect(serviceBefore.price).not.toStrictEqual(serviceAfter.price);
    expect(serviceBefore.duration).not.toStrictEqual(serviceAfter.duration);
    expect(serviceBefore.description).not.toStrictEqual(
      serviceAfter.description
    );
  });

  it("should return 401 given a token that is not admin", async () => {
    const { insertedId: categoryId } = await categoryFactory.insertCategory();
    const { serviceId } = await serviceFactory.insertService(categoryId);
    const token = await signInFactory.generateValidToken();

    const newBody = serviceFactory.serviceBody();
    const result = await supertest(app)
      .put(`/services/${categoryId}/${serviceId}`)
      .send(newBody)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(401);
  });

  it("should return 404 given a category that does not exists", async () => {
    const { insertedId: categoryId } = await categoryFactory.insertCategory();
    const { body, serviceId } = await serviceFactory.insertService(categoryId);
    const token = await signInFactory.generateAdminToken();
    const fakeCategoryId = new ObjectId();

    const result = await supertest(app)
      .put(`/services/${fakeCategoryId}/${serviceId}`)
      .send(body)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
  });

  it("should return 404 given a service that does not exists", async () => {
    const { insertedId: categoryId } = await categoryFactory.insertCategory();
    const token = await signInFactory.generateAdminToken();
    const fakeServiceId = new ObjectId();

    const newBody = serviceFactory.serviceBody();
    const result = await supertest(app)
      .put(`/services/${categoryId}/${fakeServiceId}`)
      .send(newBody)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
  });
});

describe("DELETE /services/categoryTitle/serviceName", () => {
  beforeAll(connect);
  beforeEach(truncate);
  afterAll(disconnect);

  it("should return 200 and remove the service from the array", async () => {
    const { insertedId: categoryId } = await categoryFactory.insertCategory();
    const serviceQuantity = 3;

    for (let i = 0; i < serviceQuantity - 1; i++) {
      await serviceFactory.insertService(categoryId);
    }
    const { serviceId } = await serviceFactory.insertService(categoryId);
    const token = await signInFactory.generateAdminToken();

    const categoryBefore = await db
      .collection("categories")
      .findOne({ _id: categoryId });

    const result = await supertest(app)
      .delete(`/services/${categoryId}/${serviceId}`)
      .set("Authorization", `Bearer ${token}`);

    const categoryAfter = await db
      .collection("categories")
      .findOne({ _id: categoryId });

    expect(result.status).toBe(200);
    expect(categoryAfter.services).toHaveLength(
      categoryBefore.services.length - 1
    );
  });

  it("should return 401 given a token that is not admin", async () => {
    const { insertedId: categoryId } = await categoryFactory.insertCategory();
    const serviceQuantity = 3;

    for (let i = 0; i < serviceQuantity - 1; i++) {
      await serviceFactory.insertService(categoryId);
    }
    const { serviceId } = await serviceFactory.insertService(categoryId);

    const token = await signInFactory.generateValidToken();

    const result = await supertest(app)
      .delete(`/services/${categoryId}/${serviceId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(401);
  });

  it("should return 404 given a non-existent category", async () => {
    const { insertedId: categoryId } = await categoryFactory.insertCategory();
    const { serviceId } = await serviceFactory.insertService(categoryId);
    const token = await signInFactory.generateAdminToken();
    const fakeCategoryId = new ObjectId();

    const result = await supertest(app)
      .delete(`/services/${fakeCategoryId}/${serviceId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
  });

  it("should return 404 given a non-existent service", async () => {
    const { insertedId: categoryId } = await categoryFactory.insertCategory();
    await serviceFactory.insertService(categoryId);
    const token = await signInFactory.generateAdminToken();
    const fakeServiceId = new ObjectId();

    const result = await supertest(app)
      .delete(`/services/${categoryId}/${fakeServiceId}`)
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
