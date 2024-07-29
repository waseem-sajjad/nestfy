import type { Conditions, ParsedQueryType } from "../types";

export interface Parsed {
  kind: ParsedQueryType;
}

export interface ParsedQuery extends Parsed {
  kind: "query";
  statements: Parsed[];
}

export interface ParsedSelect extends Parsed {
  kind: "select";
  resource: string;
  fields: string[];
}

export interface ParsedJoin extends Parsed {
  kind: "join";
  resource: string;
}

export type ExpressionField = {
  field: string;
  value:
    | string
    | number
    | boolean
    | null
    | Array<string | number | boolean | null>;
  condition: Conditions;
};

export type Expression = {
  kind: "expression";
  fields: { or: ExpressionField[] } | ExpressionField[];
};

export interface ParsedSearch extends Parsed {
  kind: "search";
  expression: Expression;
}

export interface ParsedOrder extends Parsed {
  kind: "order";
  api: string;
  field: string;
  direction: "asc" | "desc";
}

export interface ParsedPage extends Parsed {
  kind: "page";
  page: number;
}

export interface ParsedLimit extends Parsed {
  kind: "limit";
  limit: number;
}

export interface ParsedOffset extends Parsed {
  kind: "offset";
  offset: number;
}
