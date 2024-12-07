import { EmailTemplateCollection, IEmailTemplateRecord } from "../../lib";

// Define templates
const welcome: IEmailTemplateRecord<{ name: string }> = {
  subject: `Welcome to ACME`,
  body: (data) => `<div>
  <h1>Hi ${data.name}</h1>
  <img src="logo.jpg" alt="ACME Logo" />
  <a href="https://github.com/srttk">Click the link<a/>
  </div>
  `,
};

// create a collection
const templates = new EmailTemplateCollection({ welcome });

// Compile
const result = templates.compile("welcome", { name: "Luke" });

console.log("result ", result);
