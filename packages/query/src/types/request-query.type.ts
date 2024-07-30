import type { Request as ExpressRequest } from "express";
import type { ParsedQuery } from "../interfaces";

export type FieldS = string | string[];

export type Conditions =
  | "eq"
  | "ne"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "cont"
  | "icont"
  | "in"
  | "nin"
  | "isnull"
  | "notnull"
  | "between"
  | "notbetween";

export type Value =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | Array<string | number | boolean | Date | null>;

export type LogicalOperator = "or";

export type ConditionValue = {
  [key in Conditions]?: Value;
};

export type SearchFields = {
  [key: string]: Conditions;
};

export type SearchOr = {
  or: SearchFields;
};

export type Search = SearchFields | SearchOr;

export type RequestQuery = {
  select?: FieldS;
  join?: FieldS;
  search?: Search;
  order?: FieldS;
  page?: number;
  limit?: number;
  offset?: number;
};

export interface Request extends Omit<ExpressRequest, "query"> {
  query: RequestQuery;
  parsedQuery?: ParsedQuery;
}

export interface ParsedRequest {
  parsedQuery: ParsedQuery;
}
