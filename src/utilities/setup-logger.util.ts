import { AppConfigService } from '@/shared/services/app-config.service';
import { type IncomingMessage, type ServerResponse } from 'http';
import { type Params } from 'nestjs-pino';
import { GenReqId, Options, type ReqId } from 'pino-http';
import { v4 as uuidv4 } from 'uuid';

const redactPaths = [
  'req.headers.authorization',
  'req.body.token',
  'req.body.email',
  'req.body.phoneNumber',
  'req.body.password',
  'req.body.oldPassword',
  'req.body.newPassword',
];

const genReqId: GenReqId = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  const id: ReqId = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-Id', id.toString());
  return id;
};

const customSuccessMessage = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  responseTime: number,
) => {
  return `[${req.id || '*'}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - ${responseTime} ms`;
};

const customReceivedMessage = (req: IncomingMessage) => {
  return `[${req.id || '*'}] "${req.method} ${req.url}"`;
};

const customErrorMessage = (req, res, err) => {
  return `[${req.id || '*'}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - message: ${err.message}`;
};

function localLoggingConfig(): Options {
  return {
    messageKey: 'msg',
    transport: {
      target: 'pino-pretty',
      options: {
        singleLine: true,
        ignore:
          'req.id,req.method,req.url,req.headers,req.remoteAddress,req.remotePort,res.headers',
      },
    },
  };
}

export const loggerFactory = async (
  config: AppConfigService,
): Promise<Params> => {
  return {
    pinoHttp: {
      level: config.appConfig.logLevel,
      genReqId: config.appConfig.debug ? genReqId : undefined,
      serializers: config.appConfig.debug
        ? {
            req: (req) => {
              req.body = req.raw.body;
              return req;
            },
          }
        : undefined,
      customSuccessMessage,
      customReceivedMessage,
      customErrorMessage,
      redact: {
        paths: redactPaths,
        censor: '**GDPR COMPLIANT**',
      }, // Redact sensitive information
      ...localLoggingConfig(),
    },
  };
};
