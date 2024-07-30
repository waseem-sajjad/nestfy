import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { Catch } from "@nestjs/common";

import { ValidationException } from "../exceptions/validation.exception";

@Catch(ValidationException)
export class RequestFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    return res.status(exception.getStatus()).json(exception.getResponse());
  }
}
