import { Mailer } from "../../lib";
import templates from "./templates";

const mailer = new Mailer({
  templates: templates,
  config: {
    frommail: "sarath@sw.com",
    host: "",
    port: "",
    password: "",
    username: "",
    fromname: "Sarath",
  },
});

const result = mailer
  .useTemplate("news", {
    name: "Sarath",
  })
  .create({ to: "luke@sw.com" });

console.log("result ", result);
