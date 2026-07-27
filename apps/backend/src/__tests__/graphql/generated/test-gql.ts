/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };

import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
/** Filter articles by various fields */
export type ArticleFilter = {
  /** Filter by author ID */
  authorId?: StringFilter | null | undefined;
  /** Filter by content */
  content?: StringFilter | null | undefined;
  /** Filter by excerpt */
  excerpt?: StringFilter | null | undefined;
  /** Filter by publication date */
  publishedAt?: DateTimeFilter | null | undefined;
  /** Filter by reading time */
  readingTimeMin?: IntFilter | null | undefined;
  /** Filter by slug */
  slug?: StringFilter | null | undefined;
  /** Filter by status (DRAFT, PUBLISHED, ARCHIVED) */
  status?: StringFilter | null | undefined;
  /** Filter by title */
  title?: StringFilter | null | undefined;
};

/** Sort configuration for articles */
export type ArticleSort = {
  /** Sort direction */
  direction: SortDirection;
  /** Field to sort by */
  field: ArticleSortField;
};

/** Fields to sort articles by */
export enum ArticleSortField {
  CreatedAt = "CREATED_AT",
  PublishedAt = "PUBLISHED_AT",
  ReadingTimeMin = "READING_TIME_MIN",
  Slug = "SLUG",
  Status = "STATUS",
  Title = "TITLE",
}

export enum ArticleStatus {
  Archived = "ARCHIVED",
  Draft = "DRAFT",
  Published = "PUBLISHED",
}

/** Filter for boolean fields */
export type BooleanFilter = {
  /** Exact match */
  eq?: boolean | null | undefined;
};

/** Filter case types by various fields */
export type CaseTypeFilter = {
  /** Filter by active status */
  active?: BooleanFilter | null | undefined;
  /** Filter by color */
  color?: StringFilter | null | undefined;
  /** Filter by description */
  description?: StringFilter | null | undefined;
  /** Filter by icon */
  icon?: StringFilter | null | undefined;
  /** Filter by name */
  name?: StringFilter | null | undefined;
  /** Filter by order */
  order?: IntFilter | null | undefined;
  /** Filter by slug */
  slug?: StringFilter | null | undefined;
};

/** Sort configuration for case types */
export type CaseTypeSort = {
  /** Sort direction */
  direction: SortDirection;
  /** Field to sort by */
  field: CaseTypeSortField;
};

/** Fields to sort case types by */
export enum CaseTypeSortField {
  CreatedAt = "CREATED_AT",
  Name = "NAME",
  Order = "ORDER",
  Slug = "SLUG",
}

/** Filter courts by various fields */
export type CourtFilter = {
  /** Filter by description */
  description?: StringFilter | null | undefined;
  /** Filter by jurisdiction (NACIONAL, REGIONAL, LOCAL, INTERNACIONAL) */
  jurisdiction?: StringFilter | null | undefined;
  /** Filter by name */
  name?: StringFilter | null | undefined;
  /** Filter by type (SUPREMA, SUPERIOR, PRIMERA_INSTANCIA, ESPECIALIZADA, CONSTITUCIONAL) */
  type?: StringFilter | null | undefined;
};

/** Sort configuration for courts */
export type CourtSort = {
  /** Sort direction */
  direction: SortDirection;
  /** Field to sort by */
  field: CourtSortField;
};

/** Fields to sort courts by */
export enum CourtSortField {
  CreatedAt = "CREATED_AT",
  Jurisdiction = "JURISDICTION",
  Name = "NAME",
  Type = "TYPE",
}

export enum CourtType {
  Constitucional = "CONSTITUCIONAL",
  Especializada = "ESPECIALIZADA",
  PrimeraInstancia = "PRIMERA_INSTANCIA",
  Superior = "SUPERIOR",
  Suprema = "SUPREMA",
}

export type CreateArticleInput = {
  /** Array of category IDs */
  categoryIds?: Array<string> | null | undefined;
  /** Full content of the article (Markdown/HTML) */
  content: string;
  /** Short summary of the article */
  excerpt?: string | null | undefined;
  /** ID of the featured image media */
  featuredImageId?: string | null | undefined;
  /** Array of related legal case IDs */
  legalCaseIds?: Array<string> | null | undefined;
  /** Publication date (ISO 8601 datetime string) */
  publishedAt?: string | null | undefined;
  /** Estimated reading time in minutes */
  readingTimeMin?: number | null | undefined;
  /** URL-friendly slug */
  slug: string;
  /** Article status: DRAFT, PUBLISHED, or ARCHIVED */
  status?: string | null | undefined;
  /** Array of tag IDs */
  tagIds?: Array<string> | null | undefined;
  /** Title of the article */
  title: string;
};

export type CreateCaseTypeInput = {
  /** Whether this case type is active */
  active?: boolean | null | undefined;
  /** Hex color code for UI display (e.g., '#3B82F6') */
  color?: string | null | undefined;
  /** Optional description of the case type */
  description?: string | null | undefined;
  /** Icon name for UI display (e.g., 'FileText') */
  icon?: string | null | undefined;
  /** Case type name (e.g., 'Civil', 'Penal') */
  name: string;
  /** Display order (lower numbers appear first) */
  order?: number | null | undefined;
  /** URL-friendly slug (e.g., 'civil', 'penal') */
  slug: string;
};

export type CreateLegalCaseInput = {
  /** Date the case was filed */
  caseDate?: Date | null | undefined;
  /** Name or title of the legal case */
  caseName: string;
  /** Unique case number identifier */
  caseNumber: string;
  /** ID of the related case type */
  caseTypeId?: string | null | undefined;
  /** ID of the related court */
  courtId?: string | null | undefined;
  /** The defendant party */
  defendant?: string | null | undefined;
  /** Assigned judges */
  judges?: string | null | undefined;
  /** Jurisdiction: NACIONAL, REGIONAL, LOCAL, or INTERNACIONAL */
  jurisdiction?: string | null | undefined;
  /** Legal basis or grounds for the case */
  legalBasis?: string | null | undefined;
  /** Involved parties in the case */
  parties?: string | null | undefined;
  /** The plaintiff party */
  plaintiff?: string | null | undefined;
  /** Date the case was resolved */
  resolutionDate?: Date | null | undefined;
  /** Brief summary of the case */
  summary?: string | null | undefined;
  /** Case verdict or resolution */
  verdict?: string | null | undefined;
};

export type CreateMediaInput = {
  /** Alternative text for the media */
  alt?: string | null | undefined;
  /** Original filename */
  filename: string;
  /** MIME type of the file */
  mimeType: string;
  /** Unique ID in the storage bucket */
  objectKey: string;
  /** Size of the file in bytes */
  size: number;
  /** Type of media: IMAGE, VIDEO, or AUDIO */
  type: string;
  /** CDN URL of the media */
  url: string;
};

/** Filter for datetime fields (ISO 8601 strings) */
export type DateTimeFilter = {
  /** Exact match (ISO 8601) */
  eq?: string | null | undefined;
  /** Greater than (ISO 8601) */
  gt?: string | null | undefined;
  /** Greater than or equal (ISO 8601) */
  gte?: string | null | undefined;
  /** Less than (ISO 8601) */
  lt?: string | null | undefined;
  /** Less than or equal (ISO 8601) */
  lte?: string | null | undefined;
};

/** Filter for integer fields with comparison operators */
export type IntFilter = {
  /** Exact match */
  eq?: number | null | undefined;
  /** Greater than */
  gt?: number | null | undefined;
  /** Greater than or equal */
  gte?: number | null | undefined;
  /** Matches any value in the list */
  in?: Array<number> | null | undefined;
  /** Less than */
  lt?: number | null | undefined;
  /** Less than or equal */
  lte?: number | null | undefined;
  /** Does not equal */
  not?: number | null | undefined;
};

export enum Jurisdiction {
  Internacional = "INTERNACIONAL",
  Local = "LOCAL",
  Nacional = "NACIONAL",
  Regional = "REGIONAL",
}

/** Filter legal cases by various fields */
export type LegalCaseFilter = {
  /** Filter by case date */
  caseDate?: DateTimeFilter | null | undefined;
  /** Filter by case name */
  caseName?: StringFilter | null | undefined;
  /** Filter by case number */
  caseNumber?: StringFilter | null | undefined;
  /** Filter by case type ID */
  caseTypeId?: StringFilter | null | undefined;
  /** Filter by court ID */
  courtId?: StringFilter | null | undefined;
  /** Filter by defendant */
  defendant?: StringFilter | null | undefined;
  /** Filter by jurisdiction (NACIONAL, REGIONAL, LOCAL, INTERNACIONAL) */
  jurisdiction?: StringFilter | null | undefined;
  /** Filter by parties */
  parties?: StringFilter | null | undefined;
  /** Filter by plaintiff */
  plaintiff?: StringFilter | null | undefined;
  /** Filter by resolution date */
  resolutionDate?: DateTimeFilter | null | undefined;
  /** Filter by summary */
  summary?: StringFilter | null | undefined;
};

/** Sort configuration for legal cases */
export type LegalCaseSort = {
  /** Sort direction */
  direction: SortDirection;
  /** Field to sort by */
  field: LegalCaseSortField;
};

/** Fields to sort legal cases by */
export enum LegalCaseSortField {
  CaseDate = "CASE_DATE",
  CaseName = "CASE_NAME",
  CaseNumber = "CASE_NUMBER",
  CreatedAt = "CREATED_AT",
  Jurisdiction = "JURISDICTION",
  ResolutionDate = "RESOLUTION_DATE",
}

/** Filter media items by various fields */
export type MediaFilter = {
  /** Filter by alt text */
  alt?: StringFilter | null | undefined;
  /** Filter by filename */
  filename?: StringFilter | null | undefined;
  /** Filter by MIME type */
  mimeType?: StringFilter | null | undefined;
  /** Filter by object key */
  objectKey?: StringFilter | null | undefined;
  /** Filter by size */
  size?: IntFilter | null | undefined;
  /** Filter by type (IMAGE, VIDEO, AUDIO, FILE) */
  type?: StringFilter | null | undefined;
  /** Filter by URL */
  url?: StringFilter | null | undefined;
};

/** Sort configuration for media */
export type MediaSort = {
  /** Sort direction */
  direction: SortDirection;
  /** Field to sort by */
  field: MediaSortField;
};

/** Fields to sort media by */
export enum MediaSortField {
  CreatedAt = "CREATED_AT",
  Filename = "FILENAME",
  Size = "SIZE",
  Type = "TYPE",
}

export enum MediaType {
  Audio = "AUDIO",
  File = "FILE",
  Image = "IMAGE",
  Video = "VIDEO",
}

export enum Role {
  Admin = "ADMIN",
  Collaborator = "COLLABORATOR",
  Public = "PUBLIC",
}

/** Sort direction for ordering results */
export enum SortDirection {
  Asc = "ASC",
  Desc = "DESC",
}

/** Filter for string fields with common operators */
export type StringFilter = {
  /** Contains substring (case-insensitive) */
  contains?: string | null | undefined;
  /** Ends with substring (case-insensitive) */
  endsWith?: string | null | undefined;
  /** Exact match */
  eq?: string | null | undefined;
  /** Matches any value in the list */
  in?: Array<string> | null | undefined;
  /** Does not equal */
  not?: string | null | undefined;
  /** Starts with substring (case-insensitive) */
  startsWith?: string | null | undefined;
};

export type UpdateArticleInput = {
  /** Array of category IDs */
  categoryIds?: Array<string> | null | undefined;
  /** Full content of the article */
  content?: string | null | undefined;
  /** Short summary of the article */
  excerpt?: string | null | undefined;
  /** ID of the featured image media */
  featuredImageId?: string | null | undefined;
  /** Array of related legal case IDs */
  legalCaseIds?: Array<string> | null | undefined;
  /** Publication date (ISO 8601 datetime string) */
  publishedAt?: string | null | undefined;
  /** Estimated reading time in minutes */
  readingTimeMin?: number | null | undefined;
  /** URL-friendly slug */
  slug?: string | null | undefined;
  /** Article status: DRAFT, PUBLISHED, or ARCHIVED */
  status?: string | null | undefined;
  /** Array of tag IDs */
  tagIds?: Array<string> | null | undefined;
  /** Title of the article */
  title?: string | null | undefined;
};

export type UpdateCaseTypeInput = {
  /** Whether this case type is active */
  active?: boolean | null | undefined;
  /** Hex color code for UI display */
  color?: string | null | undefined;
  /** Description of the case type */
  description?: string | null | undefined;
  /** Icon name for UI display */
  icon?: string | null | undefined;
  /** Case type name */
  name?: string | null | undefined;
  /** Display order */
  order?: number | null | undefined;
  /** URL-friendly slug */
  slug?: string | null | undefined;
};

export type UpdateLegalCaseInput = {
  /** Date the case was filed */
  caseDate?: Date | null | undefined;
  /** Name or title of the legal case */
  caseName?: string | null | undefined;
  /** Unique case number identifier */
  caseNumber?: string | null | undefined;
  /** ID of the related case type */
  caseTypeId?: string | null | undefined;
  /** ID of the related court */
  courtId?: string | null | undefined;
  /** The defendant party */
  defendant?: string | null | undefined;
  /** Assigned judges */
  judges?: string | null | undefined;
  /** Jurisdiction: NACIONAL, REGIONAL, LOCAL, or INTERNACIONAL */
  jurisdiction?: string | null | undefined;
  /** Legal basis or grounds for the case */
  legalBasis?: string | null | undefined;
  /** Involved parties in the case */
  parties?: string | null | undefined;
  /** The plaintiff party */
  plaintiff?: string | null | undefined;
  /** Date the case was resolved */
  resolutionDate?: Date | null | undefined;
  /** Brief summary of the case */
  summary?: string | null | undefined;
  /** Case verdict or resolution */
  verdict?: string | null | undefined;
};

export type UpdateMediaInput = {
  /** Alternative text for the media */
  alt?: string | null | undefined;
  /** CDN URL of the media */
  url?: string | null | undefined;
};

export type UpdateUserInput = {
  /** URL of the user's profile image */
  image?: string | null | undefined;
  /** Display name of the user */
  name?: string | null | undefined;
};

/** Filter users by various fields */
export type UserFilter = {
  /** Filter by bio */
  bio?: StringFilter | null | undefined;
  /** Filter by email */
  email?: StringFilter | null | undefined;
  /** Filter by name */
  name?: StringFilter | null | undefined;
  /** Filter by role (PUBLIC, COLLABORATOR, ADMIN) */
  role?: StringFilter | null | undefined;
};

/** Sort configuration for users */
export type UserSort = {
  /** Sort direction */
  direction: SortDirection;
  /** Field to sort by */
  field: UserSortField;
};

/** Fields to sort users by */
export enum UserSortField {
  CreatedAt = "CREATED_AT",
  Email = "EMAIL",
  Name = "NAME",
  Role = "ROLE",
}

export type GetArticleByIdQueryVariables = Exact<{
  id: string;
}>;

export type GetArticleByIdQuery = {
  article: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    status: ArticleStatus;
    publishedAt: Date | null;
    views: number;
    readingTimeMin: number | null;
    createdAt: Date;
    updatedAt: Date;
    author: { id: string; name: string | null; email: string; role: Role };
    categories: Array<{ id: string; name: string; slug: string }>;
    tags: Array<{ id: string; name: string; slug: string }>;
    legalCases: Array<{ id: string; caseName: string; caseNumber: string }>;
  } | null;
};

export type GetArticleBySlugQueryVariables = Exact<{
  slug: string;
}>;

export type GetArticleBySlugQuery = {
  article: {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: ArticleStatus;
  } | null;
};

export type GetArticlesQueryVariables = Exact<{
  take?: number | null | undefined;
  skip?: number | null | undefined;
  filter?: ArticleFilter | null | undefined;
  sort?: Array<ArticleSort> | ArticleSort | null | undefined;
}>;

export type GetArticlesQuery = {
  articles: {
    items: Array<{
      id: string;
      title: string;
      slug: string;
      status: ArticleStatus;
      publishedAt: Date | null;
      views: number;
      author: { id: string; name: string | null };
    }>;
    pageInfo: {
      totalCount: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

export type CreateArticleMutationVariables = Exact<{
  input: CreateArticleInput;
}>;

export type CreateArticleMutation = {
  createArticle: {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: ArticleStatus;
    author: { id: string; name: string | null };
  };
};

export type UpdateArticleMutationVariables = Exact<{
  id: string;
  input: UpdateArticleInput;
}>;

export type UpdateArticleMutation = {
  updateArticle: {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: ArticleStatus;
    updatedAt: Date;
  };
};

export type DeleteArticleMutationVariables = Exact<{
  id: string;
}>;

export type DeleteArticleMutation = {
  deleteArticle: { id: string; title: string };
};

export type GetCaseTypeQueryVariables = Exact<{
  id: string;
}>;

export type GetCaseTypeQuery = {
  caseType: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    order: number | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

export type GetCaseTypesQueryVariables = Exact<{
  take?: number | null | undefined;
  skip?: number | null | undefined;
  filter?: CaseTypeFilter | null | undefined;
  sort?: Array<CaseTypeSort> | CaseTypeSort | null | undefined;
}>;

export type GetCaseTypesQuery = {
  caseTypes: {
    items: Array<{
      id: string;
      name: string;
      slug: string;
      description: string | null;
      color: string | null;
      icon: string | null;
      order: number | null;
      active: boolean;
    }>;
    pageInfo: {
      totalCount: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

export type CreateCaseTypeMutationVariables = Exact<{
  input: CreateCaseTypeInput;
}>;

export type CreateCaseTypeMutation = {
  createCaseType: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    order: number | null;
    active: boolean;
  };
};

export type UpdateCaseTypeMutationVariables = Exact<{
  id: string;
  input: UpdateCaseTypeInput;
}>;

export type UpdateCaseTypeMutation = {
  updateCaseType: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    order: number | null;
    active: boolean;
    updatedAt: Date;
  };
};

export type DeleteCaseTypeMutationVariables = Exact<{
  id: string;
}>;

export type DeleteCaseTypeMutation = {
  deleteCaseType: { id: string; name: string; slug: string };
};

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type GetCategoriesQuery = {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date;
  }>;
};

export type GetTagsQueryVariables = Exact<{ [key: string]: never }>;

export type GetTagsQuery = {
  tags: Array<{ id: string; name: string; slug: string; createdAt: Date }>;
};

export type GetCourtQueryVariables = Exact<{
  id: string;
}>;

export type GetCourtQuery = {
  court: {
    id: string;
    name: string;
    type: CourtType | null;
    jurisdiction: Jurisdiction | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

export type GetCourtsQueryVariables = Exact<{
  take?: number | null | undefined;
  skip?: number | null | undefined;
  filter?: CourtFilter | null | undefined;
  sort?: Array<CourtSort> | CourtSort | null | undefined;
}>;

export type GetCourtsQuery = {
  courts: {
    items: Array<{
      id: string;
      name: string;
      type: CourtType | null;
      jurisdiction: Jurisdiction | null;
      description: string | null;
    }>;
    pageInfo: {
      totalCount: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

export type GetLegalCaseQueryVariables = Exact<{
  id: string;
}>;

export type GetLegalCaseQuery = {
  legalCase: {
    id: string;
    caseNumber: string;
    caseName: string;
    slug: string;
    summary: string | null;
    parties: string | null;
    plaintiff: string | null;
    defendant: string | null;
    judges: string | null;
    verdict: string | null;
    legalBasis: string | null;
    jurisdiction: Jurisdiction | null;
    caseDate: Date | null;
    resolutionDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    court: { id: string; name: string };
    caseType: { id: string; name: string };
  } | null;
};

export type GetLegalCasesQueryVariables = Exact<{
  take?: number | null | undefined;
  skip?: number | null | undefined;
  filter?: LegalCaseFilter | null | undefined;
  sort?: Array<LegalCaseSort> | LegalCaseSort | null | undefined;
}>;

export type GetLegalCasesQuery = {
  legalCases: {
    items: Array<{
      id: string;
      caseNumber: string;
      caseName: string;
      slug: string;
      jurisdiction: Jurisdiction | null;
      caseDate: Date | null;
    }>;
    pageInfo: {
      totalCount: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

export type CreateLegalCaseMutationVariables = Exact<{
  input: CreateLegalCaseInput;
}>;

export type CreateLegalCaseMutation = {
  createLegalCase: {
    id: string;
    caseNumber: string;
    caseName: string;
    slug: string;
    jurisdiction: Jurisdiction | null;
    court: { id: string; name: string };
  };
};

export type UpdateLegalCaseMutationVariables = Exact<{
  id: string;
  input: UpdateLegalCaseInput;
}>;

export type UpdateLegalCaseMutation = {
  updateLegalCase: {
    id: string;
    caseNumber: string;
    caseName: string;
    slug: string;
    updatedAt: Date;
  };
};

export type DeleteLegalCaseMutationVariables = Exact<{
  id: string;
}>;

export type DeleteLegalCaseMutation = {
  deleteLegalCase: { id: string; caseNumber: string; caseName: string };
};

export type GetMediaQueryVariables = Exact<{
  id: string;
}>;

export type GetMediaQuery = {
  media: {
    id: string;
    objectKey: string;
    url: string;
    alt: string | null;
    type: MediaType;
    size: number;
    mimeType: string;
    filename: string;
    createdAt: Date;
    updatedAt: Date;
    uploader: { id: string; name: string | null };
  } | null;
};

export type GetMediasQueryVariables = Exact<{
  take?: number | null | undefined;
  skip?: number | null | undefined;
  filter?: MediaFilter | null | undefined;
  sort?: Array<MediaSort> | MediaSort | null | undefined;
}>;

export type GetMediasQuery = {
  medias: {
    items: Array<{
      id: string;
      objectKey: string;
      url: string;
      filename: string;
      type: MediaType;
      mimeType: string;
      size: number;
    }>;
    pageInfo: {
      totalCount: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

export type CreateMediaMutationVariables = Exact<{
  input: CreateMediaInput;
}>;

export type CreateMediaMutation = {
  createMedia: {
    id: string;
    objectKey: string;
    url: string;
    filename: string;
    type: MediaType;
    mimeType: string;
    size: number;
  };
};

export type UpdateMediaMutationVariables = Exact<{
  id: string;
  input: UpdateMediaInput;
}>;

export type UpdateMediaMutation = {
  updateMedia: {
    id: string;
    objectKey: string;
    url: string;
    alt: string | null;
    filename: string;
    updatedAt: Date;
  };
};

export type DeleteMediaMutationVariables = Exact<{
  id: string;
}>;

export type DeleteMediaMutation = {
  deleteMedia: { id: string; filename: string };
};

export type GetMeQueryVariables = Exact<{ [key: string]: never }>;

export type GetMeQuery = {
  me: {
    id: string;
    name: string | null;
    email: string;
    role: Role;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

export type GetUsersQueryVariables = Exact<{
  take?: number | null | undefined;
  skip?: number | null | undefined;
  filter?: UserFilter | null | undefined;
  sort?: Array<UserSort> | UserSort | null | undefined;
}>;

export type GetUsersQuery = {
  users: {
    items: Array<{
      id: string;
      name: string | null;
      email: string;
      role: Role;
      createdAt: Date;
    }>;
    pageInfo: {
      totalCount: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

export type UpdateMeMutationVariables = Exact<{
  input: UpdateUserInput;
}>;

export type UpdateMeMutation = {
  updateMe: {
    id: string;
    name: string | null;
    image: string | null;
    updatedAt: Date;
  };
};

export type DeleteMeMutationVariables = Exact<{ [key: string]: never }>;

export type DeleteMeMutation = {
  deleteMe: { id: string; name: string | null; email: string };
};

export const GetArticleByIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetArticleById" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "article" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "content" } },
                { kind: "Field", name: { kind: "Name", value: "excerpt" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "publishedAt" } },
                { kind: "Field", name: { kind: "Name", value: "views" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "readingTimeMin" },
                },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "author" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      { kind: "Field", name: { kind: "Name", value: "role" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "categories" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "slug" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "tags" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "slug" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "legalCases" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "caseName" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "caseNumber" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetArticleByIdQuery, GetArticleByIdQueryVariables>;
export const GetArticleBySlugDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetArticleBySlug" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "article" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "slug" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "slug" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "content" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetArticleBySlugQuery,
  GetArticleBySlugQueryVariables
>;
export const GetArticlesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetArticles" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "take" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "skip" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "filter" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "ArticleFilter" },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sort" } },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "ArticleSort" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "articles" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "take" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "take" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "skip" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "skip" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "filter" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sort" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sort" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "items" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "slug" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "status" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "publishedAt" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "views" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "author" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "totalCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasNextPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasPreviousPage" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetArticlesQuery, GetArticlesQueryVariables>;
export const CreateArticleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateArticle" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CreateArticleInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createArticle" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "content" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "author" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateArticleMutation,
  CreateArticleMutationVariables
>;
export const UpdateArticleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateArticle" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateArticleInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateArticle" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "content" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateArticleMutation,
  UpdateArticleMutationVariables
>;
export const DeleteArticleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteArticle" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteArticle" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteArticleMutation,
  DeleteArticleMutationVariables
>;
export const GetCaseTypeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetCaseType" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "caseType" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "color" } },
                { kind: "Field", name: { kind: "Name", value: "icon" } },
                { kind: "Field", name: { kind: "Name", value: "order" } },
                { kind: "Field", name: { kind: "Name", value: "active" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetCaseTypeQuery, GetCaseTypeQueryVariables>;
export const GetCaseTypesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetCaseTypes" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "take" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "skip" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "filter" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "CaseTypeFilter" },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sort" } },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "CaseTypeSort" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "caseTypes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "take" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "take" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "skip" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "skip" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "filter" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sort" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sort" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "items" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "slug" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "description" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "color" } },
                      { kind: "Field", name: { kind: "Name", value: "icon" } },
                      { kind: "Field", name: { kind: "Name", value: "order" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "active" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "totalCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasNextPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasPreviousPage" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetCaseTypesQuery, GetCaseTypesQueryVariables>;
export const CreateCaseTypeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateCaseType" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CreateCaseTypeInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createCaseType" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "color" } },
                { kind: "Field", name: { kind: "Name", value: "icon" } },
                { kind: "Field", name: { kind: "Name", value: "order" } },
                { kind: "Field", name: { kind: "Name", value: "active" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateCaseTypeMutation,
  CreateCaseTypeMutationVariables
>;
export const UpdateCaseTypeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateCaseType" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateCaseTypeInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateCaseType" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "color" } },
                { kind: "Field", name: { kind: "Name", value: "icon" } },
                { kind: "Field", name: { kind: "Name", value: "order" } },
                { kind: "Field", name: { kind: "Name", value: "active" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateCaseTypeMutation,
  UpdateCaseTypeMutationVariables
>;
export const DeleteCaseTypeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteCaseType" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteCaseType" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteCaseTypeMutation,
  DeleteCaseTypeMutationVariables
>;
export const GetCategoriesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetCategories" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "categories" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetTagsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetTags" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "tags" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTagsQuery, GetTagsQueryVariables>;
export const GetCourtDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetCourt" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "court" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "type" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "jurisdiction" },
                },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetCourtQuery, GetCourtQueryVariables>;
export const GetCourtsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetCourts" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "take" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "skip" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "filter" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "CourtFilter" },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sort" } },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "CourtSort" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "courts" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "take" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "take" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "skip" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "skip" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "filter" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sort" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sort" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "items" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "type" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "jurisdiction" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "description" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "totalCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasNextPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasPreviousPage" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetCourtsQuery, GetCourtsQueryVariables>;
export const GetLegalCaseDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetLegalCase" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "legalCase" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "caseNumber" } },
                { kind: "Field", name: { kind: "Name", value: "caseName" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "summary" } },
                { kind: "Field", name: { kind: "Name", value: "parties" } },
                { kind: "Field", name: { kind: "Name", value: "plaintiff" } },
                { kind: "Field", name: { kind: "Name", value: "defendant" } },
                { kind: "Field", name: { kind: "Name", value: "judges" } },
                { kind: "Field", name: { kind: "Name", value: "verdict" } },
                { kind: "Field", name: { kind: "Name", value: "legalBasis" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "jurisdiction" },
                },
                { kind: "Field", name: { kind: "Name", value: "caseDate" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "resolutionDate" },
                },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "court" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "caseType" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetLegalCaseQuery, GetLegalCaseQueryVariables>;
export const GetLegalCasesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetLegalCases" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "take" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "skip" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "filter" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "LegalCaseFilter" },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sort" } },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "LegalCaseSort" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "legalCases" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "take" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "take" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "skip" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "skip" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "filter" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sort" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sort" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "items" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "caseNumber" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "caseName" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "slug" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "jurisdiction" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "caseDate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "totalCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasNextPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasPreviousPage" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetLegalCasesQuery, GetLegalCasesQueryVariables>;
export const CreateLegalCaseDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateLegalCase" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CreateLegalCaseInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createLegalCase" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "caseNumber" } },
                { kind: "Field", name: { kind: "Name", value: "caseName" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "jurisdiction" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "court" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateLegalCaseMutation,
  CreateLegalCaseMutationVariables
>;
export const UpdateLegalCaseDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateLegalCase" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateLegalCaseInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateLegalCase" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "caseNumber" } },
                { kind: "Field", name: { kind: "Name", value: "caseName" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateLegalCaseMutation,
  UpdateLegalCaseMutationVariables
>;
export const DeleteLegalCaseDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteLegalCase" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteLegalCase" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "caseNumber" } },
                { kind: "Field", name: { kind: "Name", value: "caseName" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteLegalCaseMutation,
  DeleteLegalCaseMutationVariables
>;
export const GetMediaDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetMedia" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "media" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "objectKey" } },
                { kind: "Field", name: { kind: "Name", value: "url" } },
                { kind: "Field", name: { kind: "Name", value: "alt" } },
                { kind: "Field", name: { kind: "Name", value: "type" } },
                { kind: "Field", name: { kind: "Name", value: "size" } },
                { kind: "Field", name: { kind: "Name", value: "mimeType" } },
                { kind: "Field", name: { kind: "Name", value: "filename" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "uploader" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetMediaQuery, GetMediaQueryVariables>;
export const GetMediasDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetMedias" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "take" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "skip" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "filter" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "MediaFilter" },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sort" } },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "MediaSort" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "medias" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "take" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "take" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "skip" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "skip" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "filter" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sort" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sort" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "items" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "objectKey" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "url" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "filename" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "type" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "mimeType" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "size" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "totalCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasNextPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasPreviousPage" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetMediasQuery, GetMediasQueryVariables>;
export const CreateMediaDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateMedia" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CreateMediaInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createMedia" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "objectKey" } },
                { kind: "Field", name: { kind: "Name", value: "url" } },
                { kind: "Field", name: { kind: "Name", value: "filename" } },
                { kind: "Field", name: { kind: "Name", value: "type" } },
                { kind: "Field", name: { kind: "Name", value: "mimeType" } },
                { kind: "Field", name: { kind: "Name", value: "size" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateMediaMutation, CreateMediaMutationVariables>;
export const UpdateMediaDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateMedia" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateMediaInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateMedia" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "objectKey" } },
                { kind: "Field", name: { kind: "Name", value: "url" } },
                { kind: "Field", name: { kind: "Name", value: "alt" } },
                { kind: "Field", name: { kind: "Name", value: "filename" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateMediaMutation, UpdateMediaMutationVariables>;
export const DeleteMediaDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteMedia" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteMedia" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "filename" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteMediaMutation, DeleteMediaMutationVariables>;
export const GetMeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetMe" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "role" } },
                { kind: "Field", name: { kind: "Name", value: "image" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetUsersDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetUsers" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "take" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "skip" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "filter" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "UserFilter" },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sort" } },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "UserSort" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "users" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "take" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "take" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "skip" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "skip" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "filter" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sort" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sort" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "items" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      { kind: "Field", name: { kind: "Name", value: "role" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "totalCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasNextPage" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "hasPreviousPage" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const UpdateMeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateMe" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateUserInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateMe" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "image" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateMeMutation, UpdateMeMutationVariables>;
export const DeleteMeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteMe" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteMe" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteMeMutation, DeleteMeMutationVariables>;
