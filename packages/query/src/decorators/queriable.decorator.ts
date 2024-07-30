import { applyDecorators, UseInterceptors } from "@nestjs/common";

import { RequestInterceptor } from "../interceptors";

export const Queriable = () =>
  applyDecorators(UseInterceptors(RequestInterceptor));
