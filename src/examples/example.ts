import { EmailTemplateCollection, IEmailTemplateRecord, Mailer } from "../lib";

const userIntro: IEmailTemplateRecord = {
  subject: "Hello",
  body: "Hey hello",
};

type UserData = {
  name: string;
  email: string;
};
const userRegister: IEmailTemplateRecord<UserData> = {
  subject: (data) => ` Welcome ${data.name}`,
  body: (data) => `Hey ${data.name}`,
};

const templates = new EmailTemplateCollection({
  "user:intro": userIntro,
  "user:register": userRegister,
});

templates.compile("user:intro");

const { text, subject, html } = templates.compile("user:register", {
  name: "Luke Skywalker",
  email: "luke@sw.com",
});

const mailer = new Mailer({ templates });

mailer.useTemplate("user:intro").send({
  to: "test@test.com",
});
mailer
  .useTemplate("user:register", {
    email: "Obiwan Kenobi",
    name: "obiwan@sw.com",
  })
  .create({
    to: "hello",
  });
