import { htmlToText } from "./utils";
import { Eta } from "eta";
type TemplateReturnFun<T = any> = (data: T) => string;
type TemplateFile = { path: string };

export interface IEmailTemplateRecord<T = any> {
  subject: TemplateReturnFun<T> | string;
  body: TemplateReturnFun<T> | string | TemplateFile;
}

type TemplateCollectionOptions = {
  htmlToText?: HtmlToTextParserFn;
  templatePath?: string;
  defaultExtension?: string;
};

export class EmailTemplateCollection<
  T extends Record<string, IEmailTemplateRecord>
> {
  public templates: T;
  private defaultExtension: string = ".html";
  private tEngine: Eta = new Eta({
    views: process.cwd(),
    defaultExtension: this.defaultExtension,
  });

  constructor(_templates: T, options?: TemplateCollectionOptions) {
    this.templates = _templates;

    if (options?.htmlToText) {
      this.htmlToTextParser = options.htmlToText;
    }

    if (options?.templatePath) {
      this.tEngine = new Eta({
        views: options.templatePath,
        defaultExtension: options?.defaultExtension || this.defaultExtension,
      });
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

      //
      let html = "";
      switch (typeof template.body) {
        case "string":
          html = this.tEngine.renderString(template.body, data as object);
          break;
        case "function":
          html = this.tEngine.renderString(template.body(data), data as object);
          break;
        case "object":
          //WIP
          html = this.tEngine.render(template.body.path, data as object);
          break;
      }

      const subject =
        typeof template.subject === "string"
          ? this.tEngine.renderString(template.subject, data as object)
          : this.tEngine.renderString(template.subject(data), data as object);

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
