import {
  isApiAndField,
  isBoolean,
  isCondition,
  isDigit,
  isIdentifier,
  isJSON,
  isNull,
  isNumber,
  isObject,
  isOrder,
  isSelect,
  isString,
  stringOrArrayMap,
} from "@nestpack/utils";
import type {
  ParsedJoin,
  ParsedLimit,
  ParsedOffset,
  ParsedOrder,
  ParsedPage,
  ParsedQuery,
  ParsedSearch,
  ParsedSelect,
} from "../interfaces";
import type { RequestQuery, FieldS, Search } from "../types";
import { ValidationException } from "@nestpack/core";

export class RequestQueryParser {
  private constructor() {}

  private query: RequestQuery = {};
  private parsedQuery: ParsedQuery = {
    kind: "query",
    statements: [],
  };

  public static create(): RequestQueryParser {
    return new RequestQueryParser();
  }

  public parse(query: RequestQuery) {
    this.query = query;
    this.processing();
  }

  private parseSelect(select: FieldS) {
    const values = stringOrArrayMap(select);
    if (values.some((value) => !isSelect(value))) {
      throw new ValidationException("Invalid select query");
    }
    for (const api of values) {
      const [resource, fields] = api.split(".");
      const statement: ParsedSelect = {
        kind: "select",
        resource,
        fields: fields?.split(",") ?? [],
      };
      this.parsedQuery.statements.push(statement);
    }
  }

  private parseJoin(join: FieldS) {
    const values = stringOrArrayMap(join);
    for (const resource of values) {
      if (!isIdentifier(resource))
        throw new ValidationException("Invalid join query");
      const statement: ParsedJoin = {
        kind: "join",
        resource,
      };
      this.parsedQuery.statements.push(statement);
    }
  }

  private parseSearchObj(query: any) {
    const parseCondition = (value: any) => {
      return Object.entries(value).map(([key, value]) => {
        if (!isCondition(key))
          throw new ValidationException("Invalid where query condition");

        if (
          !isString(value) &&
          !isNumber(value) &&
          !isBoolean(value) &&
          !isNull(value) &&
          !Array.isArray(value)
        )
          throw new ValidationException("Invalid where query value");

        if (Array.isArray(value)) {
          if (
            value.some(
              (v) => !isString(v) && !isNumber(v) && !isBoolean(v) && !isNull(v)
            )
          )
            throw new ValidationException("Invalid where query value");

          return { condition: key, value };
        }

        return { condition: key, value };
      });
    };

    const parseobj = (obj: any) => {
      if (!isObject(obj)) throw new ValidationException("Invalid where query");

      return Object.entries(obj).map(([key, value]) => {
        if (!isApiAndField(key))
          throw new ValidationException("Invalid where query api and field");

        const [api, field] = key.split(".");

        if (typeof value === "object") {
          return { api, field, ...parseCondition(value)[0] };
        }

        if (
          isString(value) ||
          isNumber(value) ||
          isBoolean(value) ||
          isNull(value) ||
          Array.isArray(value)
        ) {
          if (Array.isArray(value)) {
            if (
              value.some(
                (v) =>
                  !isString(v) && !isNumber(v) && !isBoolean(v) && !isNull(v)
              )
            )
              throw new ValidationException("Invalid where query value");

            return { api, field, value, condition: "in" };
          }

          return { api, field, value, condition: "eq" };
        }
      });
    };

    if (Object.hasOwn(query, "or")) {
      return parseobj(query.or);
    }

    return parseobj(query);
  }

  private parseSearch(search: Search) {
    if (!isString(search)) throw new ValidationException("Invalid where query");
    const obj = isJSON(search);
    if (obj === false || !isObject(obj))
      throw new ValidationException("Invalid where query");

    const data = this.parseSearchObj(obj);

    const result: any = Object.hasOwn(obj as object, "or")
      ? { or: data }
      : data;

    const statement: ParsedSearch = {
      kind: "search",
      expression: result,
    };

    this.parsedQuery.statements.push(statement);
  }

  private parseOrder(order: FieldS) {
    const values = stringOrArrayMap(order);
    if (values.some((value) => !isOrder(value))) {
      throw new ValidationException(
        'Invalid order query. Must be in the format of "api.field,asc" or "api.field,desc"'
      );
    }

    for (const api of values) {
      const [resource, raw] = api.split(".");
      if (!isIdentifier(resource))
        throw new ValidationException("Invalid order query");
      const [field, direction] = raw.split(",") as [string, "asc" | "desc"];
      const statement: ParsedOrder = {
        kind: "order",
        api: resource,
        field,
        direction,
      };
      this.parsedQuery.statements.push(statement);
    }
  }

  private parsePage(page: any) {
    if (!isDigit(page)) throw new ValidationException("Invalid page query");
    const statement: ParsedPage = {
      kind: "page",
      page: Number(page),
    };
    this.parsedQuery.statements.push(statement);
  }

  private parseLimit(limit: any) {
    if (!isDigit(limit)) throw new ValidationException("Invalid limit query");
    const statement: ParsedLimit = {
      kind: "limit",
      limit: Number(limit),
    };
    this.parsedQuery.statements.push(statement);
  }

  private parseOffset(offset: any) {
    if (!isDigit(offset)) throw new ValidationException("Invalid offset query");
    const statement: ParsedOffset = {
      kind: "offset",
      offset: Number(offset),
    };
    this.parsedQuery.statements.push(statement);
  }

  private processing() {
    if (this.query?.select) this.parseSelect(this.query.select);
    if (this.query?.join) this.parseJoin(this.query.join);
    if (this.query?.search) this.parseSearch(this.query.search);
    if (this.query?.order) this.parseOrder(this.query.order);
    if (this.query?.page) this.parsePage(this.query.page);
    if (this.query?.limit) this.parseLimit(this.query.limit);
    if (this.query?.offset) this.parseOffset(this.query.offset);
  }

  public toQuery() {
    return this.parsedQuery;
  }
}
