import {
  createParamDecorator,
  InternalServerErrorException,
  type ExecutionContext,
} from "@nestjs/common";

import type { Request } from "../types";

export const ParsedReq = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const parsedQuery = req.parsedQuery;
    if (!parsedQuery)
      throw new InternalServerErrorException("Parsed request not found");

    return {
      parsedQuery,
    };
  }
);
