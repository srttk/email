import path from "path";
import { IEmailTemplateRecord, EmailTemplateCollection } from "../../lib";

type Vars = {
  name: string;
};

const intro: IEmailTemplateRecord<Vars> = {
  subject: (data) => `Hello ${data.name}`,
  body: "Welcome",
};

const news: IEmailTemplateRecord<Vars> = {
  subject: (data) => `Latest news ${data.name} - <%= it.name %>`,
  body: { path: "news" },
};

export default new EmailTemplateCollection(
  { intro, news },
  {
    templatePath: path.join(__dirname, "tmpl"),
  }
);
