import { builder } from "@/shared/graphql/builder";

export const StringFilter = builder.inputType("StringFilter", {
  description: "Filter for string fields with common operators",
  fields: (t) => ({
    eq: t.string({
      description: "Exact match",
    }),
    contains: t.string({
      description: "Contains substring (case-insensitive)",
    }),
    startsWith: t.string({
      description: "Starts with substring (case-insensitive)",
    }),
    endsWith: t.string({
      description: "Ends with substring (case-insensitive)",
    }),
    in: t.stringList({
      description: "Matches any value in the list",
    }),
    not: t.string({
      description: "Does not equal",
    }),
  }),
});

export const IntFilter = builder.inputType("IntFilter", {
  description: "Filter for integer fields with comparison operators",
  fields: (t) => ({
    eq: t.int({
      description: "Exact match",
    }),
    gt: t.int({
      description: "Greater than",
    }),
    gte: t.int({
      description: "Greater than or equal",
    }),
    lt: t.int({
      description: "Less than",
    }),
    lte: t.int({
      description: "Less than or equal",
    }),
    in: t.intList({
      description: "Matches any value in the list",
    }),
    not: t.int({
      description: "Does not equal",
    }),
  }),
});

export const FloatFilter = builder.inputType("FloatFilter", {
  description: "Filter for float fields with comparison operators",
  fields: (t) => ({
    eq: t.float({
      description: "Exact match",
    }),
    gt: t.float({
      description: "Greater than",
    }),
    gte: t.float({
      description: "Greater than or equal",
    }),
    lt: t.float({
      description: "Less than",
    }),
    lte: t.float({
      description: "Less than or equal",
    }),
    in: t.floatList({
      description: "Matches any value in the list",
    }),
    not: t.float({
      description: "Does not equal",
    }),
  }),
});

export const BooleanFilter = builder.inputType("BooleanFilter", {
  description: "Filter for boolean fields",
  fields: (t) => ({
    eq: t.boolean({
      description: "Exact match",
    }),
  }),
});

export const DateTimeFilter = builder.inputType("DateTimeFilter", {
  description: "Filter for datetime fields (ISO 8601 strings)",
  fields: (t) => ({
    eq: t.string({
      description: "Exact match (ISO 8601)",
    }),
    gt: t.string({
      description: "Greater than (ISO 8601)",
    }),
    gte: t.string({
      description: "Greater than or equal (ISO 8601)",
    }),
    lt: t.string({
      description: "Less than (ISO 8601)",
    }),
    lte: t.string({
      description: "Less than or equal (ISO 8601)",
    }),
  }),
});
