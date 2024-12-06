import { describe, test, expect } from "vitest";
import { htmlToText } from "./utils";

describe("Utils", () => {
  test("Parse html to text:basic", () => {
    const input = `<div>
    <h1>Hello</h1>
    <a href="https://example.com">Home</a>
    </div>`;

    const output = htmlToText(input);

    expect(output).toBe("Hello Home (https://example.com)");
  });
});
