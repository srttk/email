import { describe, test, expect } from "vitest";
import { Mailer } from "./mailer";

describe("Mailer", () => {
  test("basic", () => {
    const mailer = new Mailer({
      config: {
        host: "",
        port: "200",
        password: "",
        username: "",
        frommail: "luke@ss.com",
        fromname: "Like",
        secure: false,
      },
    });

    expect(mailer.isInitialized).toBe(false);
    mailer.init();
    expect(mailer.isInitialized).toBe(true);
  });
});
