import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: Date; output: Date; }
};

export type AdminUpdateUserInput = {
  /** Profile image URL of the user */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Name of the user */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Role of the user (admin only) */
  role?: InputMaybe<Role>;
};

export type Article = {
  __typename?: 'Article';
  attachments: Array<Media>;
  author: User;
  categories: Array<Category>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  excerpt?: Maybe<Scalars['String']['output']>;
  featuredImage: Media;
  id: Scalars['ID']['output'];
  legalCases: Array<LegalCase>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  readingTimeMin?: Maybe<Scalars['Int']['output']>;
  slug: Scalars['String']['output'];
  status: ArticleStatus;
  tags: Array<Tag>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  views: Scalars['Int']['output'];
};

export enum ArticleStatus {
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

/** Paginated list of Article */
export type ArticlesConnection = {
  __typename?: 'ArticlesConnection';
  items: Array<Article>;
  pageInfo: PaginationInfo;
};

export type CaseType = {
  __typename?: 'CaseType';
  active: Scalars['Boolean']['output'];
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  legalCases: Array<LegalCase>;
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Paginated list of CaseType */
export type CaseTypesConnection = {
  __typename?: 'CaseTypesConnection';
  items: Array<CaseType>;
  pageInfo: PaginationInfo;
};

export type Category = {
  __typename?: 'Category';
  articles: Array<Article>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Court = {
  __typename?: 'Court';
  cases: Array<LegalCase>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  jurisdiction?: Maybe<Jurisdiction>;
  name: Scalars['String']['output'];
  type?: Maybe<CourtType>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum CourtType {
  Constitucional = 'CONSTITUCIONAL',
  Especializada = 'ESPECIALIZADA',
  PrimeraInstancia = 'PRIMERA_INSTANCIA',
  Superior = 'SUPERIOR',
  Suprema = 'SUPREMA'
}

export type CreateArticleInput = {
  /** Array of category IDs */
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Full content of the article (Markdown/HTML) */
  content: Scalars['String']['input'];
  /** Short summary of the article */
  excerpt?: InputMaybe<Scalars['String']['input']>;
  /** ID of the featured image media */
  featuredImageId?: InputMaybe<Scalars['String']['input']>;
  /** Array of related legal case IDs */
  legalCaseIds?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Publication date (ISO 8601 datetime string) */
  publishedAt?: InputMaybe<Scalars['String']['input']>;
  /** Estimated reading time in minutes */
  readingTimeMin?: InputMaybe<Scalars['Int']['input']>;
  /** URL-friendly slug */
  slug: Scalars['String']['input'];
  /** Article status: DRAFT, PUBLISHED, or ARCHIVED */
  status?: InputMaybe<Scalars['String']['input']>;
  /** Array of tag IDs */
  tagIds?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Title of the article */
  title: Scalars['String']['input'];
};

export type CreateCaseTypeInput = {
  /** Whether this case type is active */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  /** Hex color code for UI display (e.g., '#3B82F6') */
  color?: InputMaybe<Scalars['String']['input']>;
  /** Optional description of the case type */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Icon name for UI display (e.g., 'FileText') */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Case type name (e.g., 'Civil', 'Penal') */
  name: Scalars['String']['input'];
  /** Display order (lower numbers appear first) */
  order?: InputMaybe<Scalars['Int']['input']>;
  /** URL-friendly slug (e.g., 'civil', 'penal') */
  slug: Scalars['String']['input'];
};

export type CreateLegalCaseInput = {
  caseDate?: InputMaybe<Scalars['DateTime']['input']>;
  caseName: Scalars['String']['input'];
  caseNumber: Scalars['String']['input'];
  caseTypeId?: InputMaybe<Scalars['String']['input']>;
  courtId?: InputMaybe<Scalars['String']['input']>;
  defendant?: InputMaybe<Scalars['String']['input']>;
  judges?: InputMaybe<Scalars['String']['input']>;
  jurisdiction?: InputMaybe<Scalars['String']['input']>;
  legalBasis?: InputMaybe<Scalars['String']['input']>;
  parties?: InputMaybe<Scalars['String']['input']>;
  plaintiff?: InputMaybe<Scalars['String']['input']>;
  resolutionDate?: InputMaybe<Scalars['DateTime']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  verdict?: InputMaybe<Scalars['String']['input']>;
};

export type CreateMediaInput = {
  /** Alternative text for the media */
  alt?: InputMaybe<Scalars['String']['input']>;
  /** Original filename */
  filename: Scalars['String']['input'];
  /** MIME type of the file */
  mimeType: Scalars['String']['input'];
  /** Unique ID in the storage bucket */
  objectKey: Scalars['String']['input'];
  /** Size of the file in bytes */
  size: Scalars['Int']['input'];
  /** Type of media: IMAGE, VIDEO, or AUDIO */
  type: Scalars['String']['input'];
  /** CDN URL of the media */
  url: Scalars['String']['input'];
};

export enum Jurisdiction {
  Internacional = 'INTERNACIONAL',
  Local = 'LOCAL',
  Nacional = 'NACIONAL',
  Regional = 'REGIONAL'
}

export type LegalCase = {
  __typename?: 'LegalCase';
  articles: Array<Article>;
  caseDate?: Maybe<Scalars['DateTime']['output']>;
  caseName: Scalars['String']['output'];
  caseNumber: Scalars['String']['output'];
  caseType: CaseType;
  court: Court;
  createdAt: Scalars['DateTime']['output'];
  defendant?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  judges?: Maybe<Scalars['String']['output']>;
  jurisdiction?: Maybe<Jurisdiction>;
  legalBasis?: Maybe<Scalars['String']['output']>;
  parties?: Maybe<Scalars['String']['output']>;
  plaintiff?: Maybe<Scalars['String']['output']>;
  resolutionDate?: Maybe<Scalars['DateTime']['output']>;
  slug: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  verdict?: Maybe<Scalars['String']['output']>;
};

/** Paginated list of LegalCase */
export type LegalCasesConnection = {
  __typename?: 'LegalCasesConnection';
  items: Array<LegalCase>;
  pageInfo: PaginationInfo;
};

export type Media = {
  __typename?: 'Media';
  alt?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mimeType: Scalars['String']['output'];
  objectKey: Scalars['String']['output'];
  size: Scalars['Int']['output'];
  type: MediaType;
  updatedAt: Scalars['DateTime']['output'];
  uploader: User;
  url: Scalars['String']['output'];
};

export enum MediaType {
  Audio = 'AUDIO',
  File = 'FILE',
  Image = 'IMAGE',
  Video = 'VIDEO'
}

export type Mutation = {
  __typename?: 'Mutation';
  createArticle: Article;
  createCaseType: CaseType;
  createLegalCase: LegalCase;
  createMedia: Media;
  deleteArticle: Article;
  deleteCaseType: CaseType;
  deleteLegalCase: LegalCase;
  deleteMe: User;
  deleteMedia: Media;
  deleteUser: User;
  updateArticle: Article;
  updateCaseType: CaseType;
  updateLegalCase: LegalCase;
  updateMe: User;
  updateMedia: Media;
  updateUser: User;
};


export type MutationCreateArticleArgs = {
  input: CreateArticleInput;
};


export type MutationCreateCaseTypeArgs = {
  input: CreateCaseTypeInput;
};


export type MutationCreateLegalCaseArgs = {
  input: CreateLegalCaseInput;
};


export type MutationCreateMediaArgs = {
  input: CreateMediaInput;
};


export type MutationDeleteArticleArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCaseTypeArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteLegalCaseArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteMediaArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateArticleArgs = {
  id: Scalars['String']['input'];
  input: UpdateArticleInput;
};


export type MutationUpdateCaseTypeArgs = {
  id: Scalars['String']['input'];
  input: UpdateCaseTypeInput;
};


export type MutationUpdateLegalCaseArgs = {
  id: Scalars['String']['input'];
  input: UpdateLegalCaseInput;
};


export type MutationUpdateMeArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateMediaArgs = {
  id: Scalars['String']['input'];
  input: UpdateMediaInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: AdminUpdateUserInput;
};

/** Information about pagination */
export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  /** Whether there is a next page */
  hasNextPage: Scalars['Boolean']['output'];
  /** Whether there is a previous page */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** Total number of items */
  totalCount: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  article: Article;
  articles: ArticlesConnection;
  /** Get a single case type by ID or slug */
  caseType?: Maybe<CaseType>;
  /** Get all case types with pagination */
  caseTypes: CaseTypesConnection;
  categories: Array<Category>;
  court: Court;
  courts: Array<Court>;
  legalCase: LegalCase;
  legalCases: LegalCasesConnection;
  me?: Maybe<User>;
  media?: Maybe<Media>;
  medias: Array<Media>;
  tags: Array<Tag>;
  users: UsersConnection;
};


export type QueryArticleArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryArticlesArgs = {
  authorId?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tagId?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCaseTypeArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCaseTypesArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCourtArgs = {
  id: Scalars['String']['input'];
};


export type QueryCourtsArgs = {
  jurisdiction?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLegalCaseArgs = {
  caseNumber?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLegalCasesArgs = {
  caseTypeId?: InputMaybe<Scalars['String']['input']>;
  courtId?: InputMaybe<Scalars['String']['input']>;
  jurisdiction?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMediaArgs = {
  id: Scalars['String']['input'];
};


export type QueryMediasArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUsersArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export enum Role {
  Admin = 'ADMIN',
  Collaborator = 'COLLABORATOR',
  Public = 'PUBLIC'
}

export type Tag = {
  __typename?: 'Tag';
  articles: Array<Article>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type UpdateArticleInput = {
  /** Array of category IDs */
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Full content of the article */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Short summary of the article */
  excerpt?: InputMaybe<Scalars['String']['input']>;
  /** ID of the featured image media */
  featuredImageId?: InputMaybe<Scalars['String']['input']>;
  /** Array of related legal case IDs */
  legalCaseIds?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Publication date (ISO 8601 datetime string) */
  publishedAt?: InputMaybe<Scalars['String']['input']>;
  /** Estimated reading time in minutes */
  readingTimeMin?: InputMaybe<Scalars['Int']['input']>;
  /** URL-friendly slug */
  slug?: InputMaybe<Scalars['String']['input']>;
  /** Article status: DRAFT, PUBLISHED, or ARCHIVED */
  status?: InputMaybe<Scalars['String']['input']>;
  /** Array of tag IDs */
  tagIds?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Title of the article */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCaseTypeInput = {
  /** Whether this case type is active */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  /** Hex color code for UI display */
  color?: InputMaybe<Scalars['String']['input']>;
  /** Description of the case type */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Icon name for UI display */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Case type name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Display order */
  order?: InputMaybe<Scalars['Int']['input']>;
  /** URL-friendly slug */
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLegalCaseInput = {
  caseDate?: InputMaybe<Scalars['DateTime']['input']>;
  caseName?: InputMaybe<Scalars['String']['input']>;
  caseNumber?: InputMaybe<Scalars['String']['input']>;
  caseTypeId?: InputMaybe<Scalars['String']['input']>;
  courtId?: InputMaybe<Scalars['String']['input']>;
  defendant?: InputMaybe<Scalars['String']['input']>;
  judges?: InputMaybe<Scalars['String']['input']>;
  jurisdiction?: InputMaybe<Scalars['String']['input']>;
  legalBasis?: InputMaybe<Scalars['String']['input']>;
  parties?: InputMaybe<Scalars['String']['input']>;
  plaintiff?: InputMaybe<Scalars['String']['input']>;
  resolutionDate?: InputMaybe<Scalars['DateTime']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  verdict?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMediaInput = {
  /** Alternative text for the media */
  alt?: InputMaybe<Scalars['String']['input']>;
  /** CDN URL of the media */
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  /** Profile image URL of the user */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Name of the user */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role: Role;
  updatedAt: Scalars['DateTime']['output'];
};

/** Paginated list of User */
export type UsersConnection = {
  __typename?: 'UsersConnection';
  items: Array<User>;
  pageInfo: PaginationInfo;
};

export type CreateArticleMutationVariables = Exact<{
  input: CreateArticleInput;
}>;


export type CreateArticleMutation = { __typename?: 'Mutation', createArticle: { __typename?: 'Article', id: string, title: string, slug: string, status: ArticleStatus } };

export type UpdateArticleMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateArticleInput;
}>;


export type UpdateArticleMutation = { __typename?: 'Mutation', updateArticle: { __typename?: 'Article', id: string, title: string, slug: string, status: ArticleStatus } };

export type UpdateArticleStatusMutationVariables = Exact<{
  id: Scalars['String']['input'];
  status: Scalars['String']['input'];
}>;


export type UpdateArticleStatusMutation = { __typename?: 'Mutation', updateArticle: { __typename?: 'Article', id: string, status: ArticleStatus } };

export type DeleteArticleMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteArticleMutation = { __typename?: 'Mutation', deleteArticle: { __typename?: 'Article', id: string, title: string } };

export type CreateCaseTypeMutationVariables = Exact<{
  input: CreateCaseTypeInput;
}>;


export type CreateCaseTypeMutation = { __typename?: 'Mutation', createCaseType: { __typename?: 'CaseType', id: string, name: string, slug: string, description?: string | null, color?: string | null, icon?: string | null, order?: number | null, active: boolean, createdAt: Date, updatedAt: Date } };

export type UpdateCaseTypeMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateCaseTypeInput;
}>;


export type UpdateCaseTypeMutation = { __typename?: 'Mutation', updateCaseType: { __typename?: 'CaseType', id: string, name: string, slug: string, description?: string | null, color?: string | null, icon?: string | null, order?: number | null, active: boolean, createdAt: Date, updatedAt: Date } };

export type DeleteCaseTypeMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteCaseTypeMutation = { __typename?: 'Mutation', deleteCaseType: { __typename?: 'CaseType', id: string, name: string } };

export type CreateMediaMutationVariables = Exact<{
  input: CreateMediaInput;
}>;


export type CreateMediaMutation = { __typename?: 'Mutation', createMedia: { __typename?: 'Media', id: string, objectKey: string, url: string, alt?: string | null, type: MediaType, size: number, mimeType: string, filename: string, createdAt: Date, updatedAt: Date, uploader: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } } };

export type UpdateMediaMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateMediaInput;
}>;


export type UpdateMediaMutation = { __typename?: 'Mutation', updateMedia: { __typename?: 'Media', id: string, objectKey: string, url: string, alt?: string | null, type: MediaType, size: number, mimeType: string, filename: string, createdAt: Date, updatedAt: Date, uploader: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } } };

export type DeleteMediaMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteMediaMutation = { __typename?: 'Mutation', deleteMedia: { __typename?: 'Media', id: string, objectKey: string, url: string, alt?: string | null, type: MediaType, size: number, mimeType: string, filename: string, createdAt: Date, updatedAt: Date } };

export type UpdateMeMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateMeMutation = { __typename?: 'Mutation', updateMe: { __typename?: 'User', id: string, email: string, name?: string | null, image?: string | null, role: Role, createdAt: Date, updatedAt: Date } };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: AdminUpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, email: string, name?: string | null, image?: string | null, role: Role, createdAt: Date, updatedAt: Date } };

export type DeleteMeMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteMeMutation = { __typename?: 'Mutation', deleteMe: { __typename?: 'User', id: string, email: string } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: { __typename?: 'User', id: string, email: string } };

export type AdminArticlesQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type AdminArticlesQuery = { __typename?: 'Query', articles: { __typename?: 'ArticlesConnection', items: Array<{ __typename?: 'Article', id: string, title: string, slug: string, excerpt?: string | null, status: ArticleStatus, publishedAt?: Date | null, createdAt: Date, updatedAt: Date, views: number, author: { __typename?: 'User', id: string, name?: string | null, email: string }, categories: Array<{ __typename?: 'Category', id: string, name: string }> }>, pageInfo: { __typename?: 'PaginationInfo', totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type AdminStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminStatsQuery = { __typename?: 'Query', articles: { __typename?: 'ArticlesConnection', pageInfo: { __typename?: 'PaginationInfo', totalCount: number } }, legalCases: { __typename?: 'LegalCasesConnection', pageInfo: { __typename?: 'PaginationInfo', totalCount: number } }, users: { __typename?: 'UsersConnection', pageInfo: { __typename?: 'PaginationInfo', totalCount: number } }, caseTypes: { __typename?: 'CaseTypesConnection', pageInfo: { __typename?: 'PaginationInfo', totalCount: number } } };

export type ArticleQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type ArticleQuery = { __typename?: 'Query', article: { __typename?: 'Article', id: string, title: string, slug: string, content: string, excerpt?: string | null, publishedAt?: Date | null, readingTimeMin?: number | null, views: number, author: { __typename?: 'User', id: string, name?: string | null, image?: string | null }, featuredImage: { __typename?: 'Media', id: string, url: string, alt?: string | null }, categories: Array<{ __typename?: 'Category', id: string, name: string, slug: string }>, tags: Array<{ __typename?: 'Tag', id: string, name: string, slug: string }>, legalCases: Array<{ __typename?: 'LegalCase', id: string, slug: string, caseNumber: string, caseName: string, jurisdiction?: Jurisdiction | null, caseType: { __typename?: 'CaseType', id: string, name: string, slug: string, color?: string | null, icon?: string | null } }> } };

export type ArticleByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ArticleByIdQuery = { __typename?: 'Query', article: { __typename?: 'Article', id: string, title: string, slug: string, content: string, excerpt?: string | null, status: ArticleStatus, publishedAt?: Date | null, readingTimeMin?: number | null, featuredImage: { __typename?: 'Media', id: string, url: string }, categories: Array<{ __typename?: 'Category', id: string, name: string }>, tags: Array<{ __typename?: 'Tag', id: string, name: string }> } };

export type RecentArticlesQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type RecentArticlesQuery = { __typename?: 'Query', articles: { __typename?: 'ArticlesConnection', items: Array<{ __typename?: 'Article', id: string, title: string, slug: string, excerpt?: string | null, publishedAt?: Date | null, readingTimeMin?: number | null, views: number, author: { __typename?: 'User', id: string, name?: string | null, image?: string | null }, featuredImage: { __typename?: 'Media', id: string, url: string, alt?: string | null }, categories: Array<{ __typename?: 'Category', id: string, name: string, slug: string }>, tags: Array<{ __typename?: 'Tag', id: string, name: string, slug: string }> }>, pageInfo: { __typename?: 'PaginationInfo', totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type CaseTypesQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CaseTypesQuery = { __typename?: 'Query', caseTypes: { __typename?: 'CaseTypesConnection', items: Array<{ __typename?: 'CaseType', id: string, name: string, slug: string, description?: string | null, color?: string | null, icon?: string | null, order?: number | null, active: boolean }>, pageInfo: { __typename?: 'PaginationInfo', totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, name: string, slug: string }> };

export type TagsQueryVariables = Exact<{ [key: string]: never; }>;


export type TagsQuery = { __typename?: 'Query', tags: Array<{ __typename?: 'Tag', id: string, name: string, slug: string }> };

export type LegalCaseQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  caseNumber?: InputMaybe<Scalars['String']['input']>;
}>;


export type LegalCaseQuery = { __typename?: 'Query', legalCase: { __typename?: 'LegalCase', id: string, caseNumber: string, caseName: string, slug: string, summary?: string | null, parties?: string | null, plaintiff?: string | null, defendant?: string | null, judges?: string | null, verdict?: string | null, legalBasis?: string | null, jurisdiction?: Jurisdiction | null, caseDate?: Date | null, resolutionDate?: Date | null, createdAt: Date, updatedAt: Date, caseType: { __typename?: 'CaseType', id: string, name: string, slug: string, color?: string | null, icon?: string | null }, court: { __typename?: 'Court', id: string, name: string, type?: CourtType | null, jurisdiction?: Jurisdiction | null, description?: string | null }, articles: Array<{ __typename?: 'Article', id: string, title: string, slug: string, excerpt?: string | null, status: ArticleStatus, publishedAt?: Date | null, createdAt: Date }> } };

export type RecentLegalCasesQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  jurisdiction?: InputMaybe<Scalars['String']['input']>;
  caseTypeId?: InputMaybe<Scalars['String']['input']>;
  courtId?: InputMaybe<Scalars['String']['input']>;
}>;


export type RecentLegalCasesQuery = { __typename?: 'Query', legalCases: { __typename?: 'LegalCasesConnection', items: Array<{ __typename?: 'LegalCase', id: string, caseNumber: string, caseName: string, slug: string, summary?: string | null, parties?: string | null, plaintiff?: string | null, defendant?: string | null, jurisdiction?: Jurisdiction | null, caseDate?: Date | null, resolutionDate?: Date | null, createdAt: Date, caseType: { __typename?: 'CaseType', id: string, name: string, slug: string, color?: string | null, icon?: string | null }, court: { __typename?: 'Court', id: string, name: string, type?: CourtType | null, jurisdiction?: Jurisdiction | null } }>, pageInfo: { __typename?: 'PaginationInfo', totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type MediasQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type MediasQuery = { __typename?: 'Query', medias: Array<{ __typename?: 'Media', id: string, objectKey: string, url: string, alt?: string | null, type: MediaType, size: number, mimeType: string, filename: string, createdAt: Date, updatedAt: Date, uploader: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } }> };

export type MediaQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type MediaQuery = { __typename?: 'Query', media?: { __typename?: 'Media', id: string, objectKey: string, url: string, alt?: string | null, type: MediaType, size: number, mimeType: string, filename: string, createdAt: Date, updatedAt: Date, uploader: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } } | null };

export type UsersQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type UsersQuery = { __typename?: 'Query', users: { __typename?: 'UsersConnection', items: Array<{ __typename?: 'User', id: string, email: string, name?: string | null, image?: string | null, role: Role, createdAt: Date, updatedAt: Date }>, pageInfo: { __typename?: 'PaginationInfo', totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, name?: string | null, email: string, emailVerified: boolean, role: Role, image?: string | null, createdAt: Date, updatedAt: Date } | null };


export const CreateArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateArticleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateArticleMutation, CreateArticleMutationVariables>;
export const UpdateArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateArticleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateArticleMutation, UpdateArticleMutationVariables>;
export const UpdateArticleStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateArticleStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateArticleStatusMutation, UpdateArticleStatusMutationVariables>;
export const DeleteArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<DeleteArticleMutation, DeleteArticleMutationVariables>;
export const CreateCaseTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCaseType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCaseTypeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCaseType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateCaseTypeMutation, CreateCaseTypeMutationVariables>;
export const UpdateCaseTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCaseType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCaseTypeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCaseType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateCaseTypeMutation, UpdateCaseTypeMutationVariables>;
export const DeleteCaseTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCaseType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCaseType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DeleteCaseTypeMutation, DeleteCaseTypeMutationVariables>;
export const CreateMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMedia"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMediaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMedia"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"uploader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]} as unknown as DocumentNode<CreateMediaMutation, CreateMediaMutationVariables>;
export const UpdateMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMedia"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMediaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMedia"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"uploader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateMediaMutation, UpdateMediaMutationVariables>;
export const DeleteMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMedia"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMedia"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<DeleteMediaMutation, DeleteMediaMutationVariables>;
export const UpdateMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateMe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateMeMutation, UpdateMeMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AdminUpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const DeleteMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<DeleteMeMutation, DeleteMeMutationVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const AdminArticlesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminArticles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"articles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<AdminArticlesQuery, AdminArticlesQueryVariables>;
export const AdminStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"articles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"legalCases"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"caseTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<AdminStatsQuery, AdminStatsQueryVariables>;
export const ArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Article"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"article"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"readingTimeMin"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"legalCases"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"caseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"caseName"}},{"kind":"Field","name":{"kind":"Name","value":"jurisdiction"}},{"kind":"Field","name":{"kind":"Name","value":"caseType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ArticleQuery, ArticleQueryVariables>;
export const ArticleByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArticleById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"article"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"readingTimeMin"}},{"kind":"Field","name":{"kind":"Name","value":"featuredImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ArticleByIdQuery, ArticleByIdQueryVariables>;
export const RecentArticlesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecentArticles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"articles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"StringValue","value":"PUBLISHED","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"readingTimeMin"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<RecentArticlesQuery, RecentArticlesQueryVariables>;
export const CaseTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CaseTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"caseTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeInactive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<CaseTypesQuery, CaseTypesQueryVariables>;
export const CategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<CategoriesQuery, CategoriesQueryVariables>;
export const TagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<TagsQuery, TagsQueryVariables>;
export const LegalCaseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LegalCase"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"caseNumber"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"legalCase"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"caseNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"caseNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"caseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"caseName"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"parties"}},{"kind":"Field","name":{"kind":"Name","value":"plaintiff"}},{"kind":"Field","name":{"kind":"Name","value":"defendant"}},{"kind":"Field","name":{"kind":"Name","value":"judges"}},{"kind":"Field","name":{"kind":"Name","value":"verdict"}},{"kind":"Field","name":{"kind":"Name","value":"legalBasis"}},{"kind":"Field","name":{"kind":"Name","value":"jurisdiction"}},{"kind":"Field","name":{"kind":"Name","value":"caseType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"caseDate"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"court"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"jurisdiction"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"articles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<LegalCaseQuery, LegalCaseQueryVariables>;
export const RecentLegalCasesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecentLegalCases"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jurisdiction"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"caseTypeId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courtId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"legalCases"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"jurisdiction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jurisdiction"}}},{"kind":"Argument","name":{"kind":"Name","value":"caseTypeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"caseTypeId"}}},{"kind":"Argument","name":{"kind":"Name","value":"courtId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courtId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"caseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"caseName"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"parties"}},{"kind":"Field","name":{"kind":"Name","value":"plaintiff"}},{"kind":"Field","name":{"kind":"Name","value":"defendant"}},{"kind":"Field","name":{"kind":"Name","value":"jurisdiction"}},{"kind":"Field","name":{"kind":"Name","value":"caseType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"caseDate"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"court"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"jurisdiction"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<RecentLegalCasesQuery, RecentLegalCasesQueryVariables>;
export const MediasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Medias"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"medias"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"uploader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]} as unknown as DocumentNode<MediasQuery, MediasQueryVariables>;
export const MediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Media"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"uploader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]} as unknown as DocumentNode<MediaQuery, MediaQueryVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"users"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;