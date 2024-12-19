import nodemailer, { createTransport } from "nodemailer";
import {
  EmailTemplateCollection,
  IEmailTemplateRecord,
} from "./template-manager";

export type SetupOptions = {
  host: string;
  port: string | number;
  secure?: boolean;
  username: string;
  password: string;
  fromname?: string;
  frommail?: string;
};

export type MailerConfig<T> = {
  templates?: T;
  config?: SetupOptions;
};

export type EmailOptions = Omit<nodemailer.SendMailOptions, "to" | "subject"> &
  Required<Pick<nodemailer.SendMailOptions, "to" | "subject">>;

export class Mailer<
  K extends EmailTemplateCollection<Record<string, IEmailTemplateRecord>>
> {
  private transport: nodemailer.Transporter | null = null;
  public isInitialized: boolean = false;
  private config: SetupOptions | null = null;
  private defaultMailOptions: Partial<EmailOptions> = {};
  private templates: K;

  constructor(settings?: MailerConfig<K>) {
    if (settings?.templates) {
      this.templates = settings?.templates;
    }

    if (settings?.config) {
      this.config = settings.config;
      this.init();
    }
  }

  setup(config: SetupOptions) {
    this.config = config;
    this.init();
  }

  init() {
    if (!this.config) {
      console.warn("Mailer config not found");
      return null;
    }
    // Create transport
    const config = this.config;
    this.transport = createTransport({
      host: config.host,
      port: config?.port
        ? typeof config?.port === "string"
          ? parseInt(config.port)
          : config.port
        : 587,
      secure: config?.secure ?? false,
      auth: {
        type: "LOGIN",
        user: config.username,
        pass: config.password,
      },
      tls: { rejectUnauthorized: true },
    });

    if (config?.frommail) {
      const name = `"${config?.fromname || config.frommail}"`;
      this.defaultMailOptions = {
        from: `${name} <${config.frommail}>`,
      };
    }

    this.isInitialized = true;

    return this.transport;
  }

  // Test connection

  async testConnection() {
    if (!this.checkInitialized()) {
      return false;
    }
    try {
      const success = await this.transport?.verify();
      if (success) {
        console.info("Mailer connection success");
        return success;
      }
      console.warn("Mailer connection failed");
    } catch (e: any) {
      console.log(`Mailer test connection failed`, e.message);
      return false;
    }
  }

  async send(mailOptions: EmailOptions) {
    if (!this.checkInitialized()) {
      return null;
    }
    if (!this.transport) {
      console.log("Transport not found");
      this.init();
      return null;
    }
    try {
      const _options = this.getMailOptions(mailOptions);
      return await this.transport.sendMail(_options);
    } catch (e: any) {
      console.error(`Mailer send mail error`, e.message);
      return null;
    }
  }

  getMailOptions(mailOptions: Partial<EmailOptions>) {
    return { ...this.defaultMailOptions, ...mailOptions };
  }

  checkInitialized() {
    if (!this.isInitialized) {
      console.warn("Mailer not initialized");
      return false;
    }

    return true;
  }

  //
  useTemplate<N extends keyof K["templates"]>(
    name: N,
    ...args: K["templates"][N] extends IEmailTemplateRecord<infer P>
      ? P extends undefined
        ? []
        : [P]
      : never
  ) {
    if (!this.templates) {
      throw new Error("No templates attached to the mailer instance");
    }
    return {
      send: async (
        mailOptions: Omit<EmailOptions, "subject" | "text" | "html">
      ) => {
        const { subject, html, text } = this.templates.compile(
          name as string,
          ...args
        );
        return await this.send({
          ...(this.getMailOptions(mailOptions) as EmailOptions),
          subject,
          html,
          text,
        });
      },
      create: (
        mailOptions: Omit<EmailOptions, "subject" | "text" | "html">
      ) => {
        const { subject, html, text } = this.templates.compile(
          name as string,
          ...args
        );

        return {
          subject,
          text,
          html,
          ...this.getMailOptions(mailOptions),
        } as EmailOptions;
      },
    };
  }
}
