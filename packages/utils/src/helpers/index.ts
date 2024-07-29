export const isSelect = (select: string): boolean => {
  const regex = /^[a-zA-Z_]+(\.[a-zA-Z_]+(,[a-zA-Z_]+)*)?$/;
  return regex.test(select);
};

export const isApiAndField = (api: string): boolean => {
  const regex = /^[a-zA-Z_]\w+\.[a-zA-Z_]+$/;
  return regex.test(api);
};

export const stringOrArrayMap = (value: string | string[]): string[] => {
  if (typeof value === "string") {
    return [value];
  }
  return value;
};

export const isIdentifier = (value: string): boolean => {
  const regex = /^[a-zA-Z_]\w*$/;
  return regex.test(value);
};

export const isString = (value: any): boolean => {
  if (typeof value === "string") {
    return true;
  }
  return false;
};

export const isJSON = (value: any): object | boolean => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return false;
  }
};

export const isObject = (value: any): boolean => {
  if (Array.isArray(value)) {
    return false;
  }
  return true;
};

export const isNumber = (value: any): boolean => {
  if (typeof value === "number") {
    return true;
  }
  return false;
};

export const isBoolean = (value: any): boolean => {
  if (typeof value === "boolean") {
    return true;
  }
  return false;
};

export const isNull = (value: any): boolean => {
  if (value === null) {
    return true;
  }
  return false;
};

export const isCondition = (condition: any): boolean => {
  const regex =
    /^(eq|ne|gt|lt|gte|lte|cont|icont|in|nin|isnull|notnull|between|notbetween)$/;
  return regex.test(condition);
};

export const isOrder = (order: any): boolean => {
  const regex = /^[a-zA-Z_]\w+\.[a-zA-Z_]+,(asc|desc)$/;
  return regex.test(order);
};

export const isDigit = (value: any): boolean => {
  const regex = /^\d+$/;
  return regex.test(value);
};
