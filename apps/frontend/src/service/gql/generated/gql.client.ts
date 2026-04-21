"use client";

import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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


export const CreateArticleDocument = gql`
    mutation CreateArticle($input: CreateArticleInput!) {
  createArticle(input: $input) {
    id
    title
    slug
    status
  }
}
    `;

export function useCreateArticleMutation() {
  return Urql.useMutation<CreateArticleMutation, CreateArticleMutationVariables>(CreateArticleDocument);
};
export const UpdateArticleDocument = gql`
    mutation UpdateArticle($id: String!, $input: UpdateArticleInput!) {
  updateArticle(id: $id, input: $input) {
    id
    title
    slug
    status
  }
}
    `;

export function useUpdateArticleMutation() {
  return Urql.useMutation<UpdateArticleMutation, UpdateArticleMutationVariables>(UpdateArticleDocument);
};
export const UpdateArticleStatusDocument = gql`
    mutation UpdateArticleStatus($id: String!, $status: String!) {
  updateArticle(id: $id, input: {status: $status}) {
    id
    status
  }
}
    `;

export function useUpdateArticleStatusMutation() {
  return Urql.useMutation<UpdateArticleStatusMutation, UpdateArticleStatusMutationVariables>(UpdateArticleStatusDocument);
};
export const DeleteArticleDocument = gql`
    mutation DeleteArticle($id: String!) {
  deleteArticle(id: $id) {
    id
    title
  }
}
    `;

export function useDeleteArticleMutation() {
  return Urql.useMutation<DeleteArticleMutation, DeleteArticleMutationVariables>(DeleteArticleDocument);
};
export const CreateCaseTypeDocument = gql`
    mutation CreateCaseType($input: CreateCaseTypeInput!) {
  createCaseType(input: $input) {
    id
    name
    slug
    description
    color
    icon
    order
    active
    createdAt
    updatedAt
  }
}
    `;

export function useCreateCaseTypeMutation() {
  return Urql.useMutation<CreateCaseTypeMutation, CreateCaseTypeMutationVariables>(CreateCaseTypeDocument);
};
export const UpdateCaseTypeDocument = gql`
    mutation UpdateCaseType($id: String!, $input: UpdateCaseTypeInput!) {
  updateCaseType(id: $id, input: $input) {
    id
    name
    slug
    description
    color
    icon
    order
    active
    createdAt
    updatedAt
  }
}
    `;

export function useUpdateCaseTypeMutation() {
  return Urql.useMutation<UpdateCaseTypeMutation, UpdateCaseTypeMutationVariables>(UpdateCaseTypeDocument);
};
export const DeleteCaseTypeDocument = gql`
    mutation DeleteCaseType($id: String!) {
  deleteCaseType(id: $id) {
    id
    name
  }
}
    `;

export function useDeleteCaseTypeMutation() {
  return Urql.useMutation<DeleteCaseTypeMutation, DeleteCaseTypeMutationVariables>(DeleteCaseTypeDocument);
};
export const CreateMediaDocument = gql`
    mutation CreateMedia($input: CreateMediaInput!) {
  createMedia(input: $input) {
    id
    objectKey
    url
    alt
    type
    size
    mimeType
    filename
    createdAt
    updatedAt
    uploader {
      id
      name
      email
      image
    }
  }
}
    `;

export function useCreateMediaMutation() {
  return Urql.useMutation<CreateMediaMutation, CreateMediaMutationVariables>(CreateMediaDocument);
};
export const UpdateMediaDocument = gql`
    mutation UpdateMedia($id: String!, $input: UpdateMediaInput!) {
  updateMedia(id: $id, input: $input) {
    id
    objectKey
    url
    alt
    type
    size
    mimeType
    filename
    createdAt
    updatedAt
    uploader {
      id
      name
      email
      image
    }
  }
}
    `;

export function useUpdateMediaMutation() {
  return Urql.useMutation<UpdateMediaMutation, UpdateMediaMutationVariables>(UpdateMediaDocument);
};
export const DeleteMediaDocument = gql`
    mutation DeleteMedia($id: String!) {
  deleteMedia(id: $id) {
    id
    objectKey
    url
    alt
    type
    size
    mimeType
    filename
    createdAt
    updatedAt
  }
}
    `;

export function useDeleteMediaMutation() {
  return Urql.useMutation<DeleteMediaMutation, DeleteMediaMutationVariables>(DeleteMediaDocument);
};
export const UpdateMeDocument = gql`
    mutation updateMe($input: UpdateUserInput!) {
  updateMe(input: $input) {
    id
    email
    name
    image
    role
    createdAt
    updatedAt
  }
}
    `;

export function useUpdateMeMutation() {
  return Urql.useMutation<UpdateMeMutation, UpdateMeMutationVariables>(UpdateMeDocument);
};
export const UpdateUserDocument = gql`
    mutation updateUser($id: ID!, $input: AdminUpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    email
    name
    image
    role
    createdAt
    updatedAt
  }
}
    `;

export function useUpdateUserMutation() {
  return Urql.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument);
};
export const DeleteMeDocument = gql`
    mutation deleteMe {
  deleteMe {
    id
    email
  }
}
    `;

export function useDeleteMeMutation() {
  return Urql.useMutation<DeleteMeMutation, DeleteMeMutationVariables>(DeleteMeDocument);
};
export const DeleteUserDocument = gql`
    mutation deleteUser($id: ID!) {
  deleteUser(id: $id) {
    id
    email
  }
}
    `;

export function useDeleteUserMutation() {
  return Urql.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument);
};
export const AdminArticlesDocument = gql`
    query AdminArticles($take: Int, $skip: Int, $search: String, $status: String) {
  articles(take: $take, skip: $skip, search: $search, status: $status) {
    items {
      id
      title
      slug
      excerpt
      status
      publishedAt
      createdAt
      updatedAt
      views
      author {
        id
        name
        email
      }
      categories {
        id
        name
      }
    }
    pageInfo {
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

export function useAdminArticlesQuery(options?: Omit<Urql.UseQueryArgs<AdminArticlesQueryVariables>, 'query'>) {
  return Urql.useQuery<AdminArticlesQuery, AdminArticlesQueryVariables>({ query: AdminArticlesDocument, ...options });
};
export const AdminStatsDocument = gql`
    query AdminStats {
  articles(take: 1) {
    pageInfo {
      totalCount
    }
  }
  legalCases(take: 1) {
    pageInfo {
      totalCount
    }
  }
  users(take: 1) {
    pageInfo {
      totalCount
    }
  }
  caseTypes(take: 1) {
    pageInfo {
      totalCount
    }
  }
}
    `;

export function useAdminStatsQuery(options?: Omit<Urql.UseQueryArgs<AdminStatsQueryVariables>, 'query'>) {
  return Urql.useQuery<AdminStatsQuery, AdminStatsQueryVariables>({ query: AdminStatsDocument, ...options });
};
export const ArticleDocument = gql`
    query Article($slug: String!) {
  article(slug: $slug) {
    id
    title
    slug
    content
    excerpt
    publishedAt
    readingTimeMin
    views
    author {
      id
      name
      image
    }
    featuredImage {
      id
      url
      alt
    }
    categories {
      id
      name
      slug
    }
    tags {
      id
      name
      slug
    }
    legalCases {
      id
      slug
      caseNumber
      caseName
      jurisdiction
      caseType {
        id
        name
        slug
        color
        icon
      }
    }
  }
}
    `;

export function useArticleQuery(options: Omit<Urql.UseQueryArgs<ArticleQueryVariables>, 'query'>) {
  return Urql.useQuery<ArticleQuery, ArticleQueryVariables>({ query: ArticleDocument, ...options });
};
export const ArticleByIdDocument = gql`
    query ArticleById($id: String!) {
  article(id: $id) {
    id
    title
    slug
    content
    excerpt
    status
    publishedAt
    readingTimeMin
    featuredImage {
      id
      url
    }
    categories {
      id
      name
    }
    tags {
      id
      name
    }
  }
}
    `;

export function useArticleByIdQuery(options: Omit<Urql.UseQueryArgs<ArticleByIdQueryVariables>, 'query'>) {
  return Urql.useQuery<ArticleByIdQuery, ArticleByIdQueryVariables>({ query: ArticleByIdDocument, ...options });
};
export const RecentArticlesDocument = gql`
    query RecentArticles($take: Int, $skip: Int, $search: String) {
  articles(take: $take, skip: $skip, status: "PUBLISHED", search: $search) {
    items {
      id
      title
      slug
      excerpt
      publishedAt
      readingTimeMin
      views
      author {
        id
        name
        image
      }
      featuredImage {
        id
        url
        alt
      }
      categories {
        id
        name
        slug
      }
      tags {
        id
        name
        slug
      }
    }
    pageInfo {
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

export function useRecentArticlesQuery(options?: Omit<Urql.UseQueryArgs<RecentArticlesQueryVariables>, 'query'>) {
  return Urql.useQuery<RecentArticlesQuery, RecentArticlesQueryVariables>({ query: RecentArticlesDocument, ...options });
};
export const CaseTypesDocument = gql`
    query CaseTypes($take: Int, $skip: Int, $includeInactive: Boolean) {
  caseTypes(take: $take, skip: $skip, includeInactive: $includeInactive) {
    items {
      id
      name
      slug
      description
      color
      icon
      order
      active
    }
    pageInfo {
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

export function useCaseTypesQuery(options?: Omit<Urql.UseQueryArgs<CaseTypesQueryVariables>, 'query'>) {
  return Urql.useQuery<CaseTypesQuery, CaseTypesQueryVariables>({ query: CaseTypesDocument, ...options });
};
export const CategoriesDocument = gql`
    query Categories {
  categories {
    id
    name
    slug
  }
}
    `;

export function useCategoriesQuery(options?: Omit<Urql.UseQueryArgs<CategoriesQueryVariables>, 'query'>) {
  return Urql.useQuery<CategoriesQuery, CategoriesQueryVariables>({ query: CategoriesDocument, ...options });
};
export const TagsDocument = gql`
    query Tags {
  tags {
    id
    name
    slug
  }
}
    `;

export function useTagsQuery(options?: Omit<Urql.UseQueryArgs<TagsQueryVariables>, 'query'>) {
  return Urql.useQuery<TagsQuery, TagsQueryVariables>({ query: TagsDocument, ...options });
};
export const LegalCaseDocument = gql`
    query LegalCase($id: String, $slug: String, $caseNumber: String) {
  legalCase(id: $id, slug: $slug, caseNumber: $caseNumber) {
    id
    caseNumber
    caseName
    slug
    summary
    parties
    plaintiff
    defendant
    judges
    verdict
    legalBasis
    jurisdiction
    caseType {
      id
      name
      slug
      color
      icon
    }
    caseDate
    resolutionDate
    createdAt
    updatedAt
    court {
      id
      name
      type
      jurisdiction
      description
    }
    articles {
      id
      title
      slug
      excerpt
      status
      publishedAt
      createdAt
    }
  }
}
    `;

export function useLegalCaseQuery(options?: Omit<Urql.UseQueryArgs<LegalCaseQueryVariables>, 'query'>) {
  return Urql.useQuery<LegalCaseQuery, LegalCaseQueryVariables>({ query: LegalCaseDocument, ...options });
};
export const RecentLegalCasesDocument = gql`
    query RecentLegalCases($take: Int, $skip: Int, $search: String, $jurisdiction: String, $caseTypeId: String, $courtId: String) {
  legalCases(
    take: $take
    skip: $skip
    search: $search
    jurisdiction: $jurisdiction
    caseTypeId: $caseTypeId
    courtId: $courtId
  ) {
    items {
      id
      caseNumber
      caseName
      slug
      summary
      parties
      plaintiff
      defendant
      jurisdiction
      caseType {
        id
        name
        slug
        color
        icon
      }
      caseDate
      resolutionDate
      createdAt
      court {
        id
        name
        type
        jurisdiction
      }
    }
    pageInfo {
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

export function useRecentLegalCasesQuery(options?: Omit<Urql.UseQueryArgs<RecentLegalCasesQueryVariables>, 'query'>) {
  return Urql.useQuery<RecentLegalCasesQuery, RecentLegalCasesQueryVariables>({ query: RecentLegalCasesDocument, ...options });
};
export const MediasDocument = gql`
    query Medias($take: Int, $skip: Int, $type: String, $search: String) {
  medias(take: $take, skip: $skip, type: $type, search: $search) {
    id
    objectKey
    url
    alt
    type
    size
    mimeType
    filename
    createdAt
    updatedAt
    uploader {
      id
      name
      email
      image
    }
  }
}
    `;

export function useMediasQuery(options?: Omit<Urql.UseQueryArgs<MediasQueryVariables>, 'query'>) {
  return Urql.useQuery<MediasQuery, MediasQueryVariables>({ query: MediasDocument, ...options });
};
export const MediaDocument = gql`
    query Media($id: String!) {
  media(id: $id) {
    id
    objectKey
    url
    alt
    type
    size
    mimeType
    filename
    createdAt
    updatedAt
    uploader {
      id
      name
      email
      image
    }
  }
}
    `;

export function useMediaQuery(options: Omit<Urql.UseQueryArgs<MediaQueryVariables>, 'query'>) {
  return Urql.useQuery<MediaQuery, MediaQueryVariables>({ query: MediaDocument, ...options });
};
export const UsersDocument = gql`
    query users($take: Int, $skip: Int, $search: String) {
  users(take: $take, skip: $skip, search: $search) {
    items {
      id
      email
      name
      image
      role
      createdAt
      updatedAt
    }
    pageInfo {
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

export function useUsersQuery(options?: Omit<Urql.UseQueryArgs<UsersQueryVariables>, 'query'>) {
  return Urql.useQuery<UsersQuery, UsersQueryVariables>({ query: UsersDocument, ...options });
};
export const MeDocument = gql`
    query me {
  me {
    id
    name
    email
    emailVerified
    role
    image
    createdAt
    updatedAt
  }
}
    `;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};