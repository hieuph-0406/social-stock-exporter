export type AppConfig = {
  readonly port: string;
  readonly appUrl: string;
  readonly timeout: number;
  readonly debug: boolean;
  readonly corsOrigin: boolean | string | RegExp | (string | RegExp)[];
  readonly logLevel: string;
  readonly logPretty: boolean;
  readonly mailer: MailerConfig;
};

export type MailerConfig = {
  readonly sendGridApiKey: string;
  readonly mailFrom: string;
};
