import { htmlToText } from "./utils";

type TemplateReturnFun<T = any> = (data: T) => string;

export interface IEmailTemplateRecord<T = any> {
  subject: TemplateReturnFun<T> | string;
  body: TemplateReturnFun<T> | string;
}

type TemplateCollectionOptions = {
  htmlToText?: HtmlToTextParserFn;
};

export class EmailTemplateCollection<
  T extends Record<string, IEmailTemplateRecord>
> {
  public templates: T;
  constructor(_templates: T, options?: TemplateCollectionOptions) {
    this.templates = _templates;

    if (options?.htmlToText) {
      this.htmlToTextParser = options.htmlToText;
    }
  }

  private htmlToTextParser: HtmlToTextParserFn = htmlToText;

  setHtmlToText(parser: HtmlToTextParserFn) {
    this.htmlToTextParser = parser;
  }

  compile<K extends keyof T>(
    name: K,
    ...args: T[K] extends IEmailTemplateRecord<infer P>
      ? P extends undefined
        ? [] | [P]
        : [P]
      : never
  ) {
    const data = args[0];

    if (this.templates[name]) {
      const template = this.templates[name];
      const html =
        typeof template.body === "string" ? template.body : template.body(data);

      const subject =
        typeof template.subject === "string"
          ? template.subject
          : template.subject(data);

      return {
        subject,
        text: this.toText(html),
        html: html,
      };
    }
    return {
      subject: "",
      text: "",
      html: "",
    };
  }

  // HTML to TEXT
  toText(html: string) {
    return this.htmlToTextParser(html);
  }
}

type HtmlToTextParserFn = (string) => string;
