import {
  createParamDecorator,
  InternalServerErrorException,
  type ExecutionContext,
} from "@nestjs/common";

import type { Request } from "../types";

export const ParsedRequest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const parsedRequest = req.parsedQuery;
    if (!parsedRequest)
      throw new InternalServerErrorException("Parsed request not found");
    return parsedRequest;
  }
);
