import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from "@nestjs/common";
import { Injectable } from "@nestjs/common";

import { RequestQueryParser } from "../parsers";
import type { Request } from "../types";

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const queryParser = RequestQueryParser.create();
    queryParser.parse(req.query);
    req.parsedQuery = queryParser.toQuery();
    return next.handle();
  }
}
