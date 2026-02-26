// Media schemas

// Legal Case schemas
export type {
  CreateLegalCasePayload,
  DeleteLegalCasePayload,
  LegalCasePayload,
  LegalCasesPayload,
  UpdateLegalCasePayload,
} from "./legal-case/interfaces";
export {
  CaseStatusEnum,
  CourtLevelEnum,
  CreateLegalCasePayloadSchema,
  DeleteLegalCasePayloadSchema,
  LegalAreaEnum,
  LegalCasePayloadSchema,
  LegalCasesPayloadSchema,
  UpdateLegalCasePayloadSchema,
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
  UpdateMePayload,
  UpdateUserPayload,
  UserPayload,
  UsersPayload,
} from "./user/interface";
export {
  DeleteUserPayloadSchema,
  UpdateMePayloadSchema,
  UpdateUserPayloadSchema,
  UserPayloadSchema,
  UsersPayloadSchema,
} from "./user/schemas";
