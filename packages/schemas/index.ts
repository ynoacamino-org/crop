// Media schemas

// Article schemas
export type {
  ArticleStatusType,
  ArticlesQueryInput,
  CreateArticleInput,
  UpdateArticleInput,
} from "./article/interfaces";
export {
  ArticleStatus,
  articlesQuerySchema,
  createArticleSchema,
  updateArticleSchema,
} from "./article/schemas";

// Case Type schemas
export type {
  CaseTypesQueryInput,
  CreateCaseTypeInput,
  UpdateCaseTypeInput,
} from "./case-type/interfaces";
export {
  caseTypesQuerySchema,
  createCaseTypeSchema,
  updateCaseTypeSchema,
} from "./case-type/schemas";

// Legal Case schemas
export type {
  CreateLegalCaseInput,
  JurisdictionType,
  LegalCasesQueryInput,
  UpdateLegalCaseInput,
} from "./legal-case/interfaces";
export {
  CaseStatusEnum,
  CourtLevelEnum,
  createLegalCaseSchema,
  JurisdictionEnum,
  LegalAreaEnum,
  legalCasesQuerySchema,
  updateLegalCaseSchema,
} from "./legal-case/schemas";
export type {
  CreateMediaPayload,
  DeleteMediaPayload,
  MediaPayload,
  MediasPayload,
  UpdateMediaPayload,
  UploadMediaPayload,
  UploadMediaPayloadInput,
} from "./media/interfaces";
export {
  CreateMediaPayloadSchema,
  DeleteMediaPayloadSchema,
  MediaPayloadSchema,
  MediasPayloadSchema,
  MediaTypeEnum,
  UpdateMediaPayloadSchema,
  UploadMediaPayloadSchema,
} from "./media/schemas";
// User schemas
export type {
  DeleteUserPayload,
  SignInPayload,
  SignUpPayload,
  UpdateMePayload,
  UpdateUserPayload,
  UserPayload,
  UsersPayload,
} from "./user/interface";
export {
  DeleteUserPayloadSchema,
  SignInPayloadSchema,
  SignUpPayloadSchema,
  UpdateMePayloadSchema,
  UpdateUserPayloadSchema,
  UserPayloadSchema,
  UsersPayloadSchema,
} from "./user/schemas";
