import { describe, test, expect } from "vitest";
import {
  IEmailTemplateRecord,
  EmailTemplateCollection,
} from "./template-manager";

describe("Template manager", () => {
  test("compile: just string ", () => {
    const intro: IEmailTemplateRecord = {
      subject: `Hello`,
      body: `<h1>World<h1>`,
    };

    const templates = new EmailTemplateCollection({ intro });

    const { subject, html, text } = templates.compile("intro");

    expect(subject).toBe(intro.subject);
    expect(html).toBe(intro.body);
    expect(text).toBe("World");
  });

  test("compile: with variable ", () => {
    const intro: IEmailTemplateRecord<{ name: string }> = {
      subject: (data) => `Hello ${data.name}`,
      body: (data) => `<h1>Thanks ${data.name}<h1>`,
    };

    const templates = new EmailTemplateCollection({ intro });

    const { subject, html, text } = templates.compile("intro", {
      name: "Luke",
    });

    expect(subject).toBe("Hello Luke");
    expect(html).toBe("<h1>Thanks Luke<h1>");
    expect(text).toBe("Thanks Luke");
  });
});
