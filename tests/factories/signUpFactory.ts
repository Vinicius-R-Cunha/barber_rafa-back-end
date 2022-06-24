import { faker } from "@faker-js/faker";

type MissingData = "name" | "email" | "phone" | "password";

export function signUpBody(missing?: MissingData) {
  const name = faker.name.firstName();
  const email = faker.internet.email();
  const phone = faker.phone.phoneNumber("11 9####-####");
  const password = faker.internet.password();

  if (missing === "name") {
    return {
      email,
      phone,
      password,
    };
  } else if (missing === "email") {
    return {
      name,
      phone,
      password,
    };
  } else if (missing === "phone") {
    return {
      name,
      email,
      password,
    };
  } else if (missing === "password") {
    return {
      name,
      email,
      phone,
    };
  } else {
    return {
      name,
      email,
      phone,
      password,
    };
  }
}
