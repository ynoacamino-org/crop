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
  featuredImage?: Maybe<Media>;
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

export enum CaseType {
  Administrativo = 'ADMINISTRATIVO',
  Ambiental = 'AMBIENTAL',
  Civil = 'CIVIL',
  Comercial = 'COMERCIAL',
  Constitucional = 'CONSTITUCIONAL',
  Familia = 'FAMILIA',
  Laboral = 'LABORAL',
  Penal = 'PENAL',
  Tributario = 'TRIBUTARIO'
}

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

export type CreateLegalCaseInput = {
  caseDate?: InputMaybe<Scalars['DateTime']['input']>;
  caseName: Scalars['String']['input'];
  caseNumber: Scalars['String']['input'];
  caseType?: InputMaybe<Scalars['String']['input']>;
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
  caseType?: Maybe<CaseType>;
  court?: Maybe<Court>;
  createdAt: Scalars['DateTime']['output'];
  defendant?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  judges?: Maybe<Scalars['String']['output']>;
  jurisdiction?: Maybe<Jurisdiction>;
  legalBasis?: Maybe<Scalars['String']['output']>;
  parties?: Maybe<Scalars['String']['output']>;
  plaintiff?: Maybe<Scalars['String']['output']>;
  resolutionDate?: Maybe<Scalars['DateTime']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  verdict?: Maybe<Scalars['String']['output']>;
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
  uploader?: Maybe<User>;
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
  createLegalCase: LegalCase;
  createMedia: Media;
  deleteArticle: Article;
  deleteLegalCase: LegalCase;
  deleteMe: User;
  deleteMedia: Media;
  deleteUser: User;
  updateArticle: Article;
  updateLegalCase: LegalCase;
  updateMe: User;
  updateMedia: Media;
  updateUser: User;
};


export type MutationCreateArticleArgs = {
  input: CreateArticleInput;
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

export type Query = {
  __typename?: 'Query';
  article: Article;
  articles: Array<Article>;
  categories: Array<Category>;
  court: Court;
  courts: Array<Court>;
  legalCase: LegalCase;
  legalCases: Array<LegalCase>;
  me?: Maybe<User>;
  media?: Maybe<Media>;
  medias: Array<Media>;
  tags: Array<Tag>;
  users: Array<User>;
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
};


export type QueryLegalCasesArgs = {
  caseType?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateLegalCaseInput = {
  caseDate?: InputMaybe<Scalars['DateTime']['input']>;
  caseName?: InputMaybe<Scalars['String']['input']>;
  caseNumber?: InputMaybe<Scalars['String']['input']>;
  caseType?: InputMaybe<Scalars['String']['input']>;
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

export type CreateMediaMutationVariables = Exact<{
  input: CreateMediaInput;
}>;


export type CreateMediaMutation = { __typename?: 'Mutation', createMedia: { __typename?: 'Media', id: string, objectKey: string, url: string, alt?: string | null, type: MediaType, size: number, mimeType: string, filename: string, createdAt: Date, updatedAt: Date, uploader?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } | null } };

export type UpdateMediaMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateMediaInput;
}>;


export type UpdateMediaMutation = { __typename?: 'Mutation', updateMedia: { __typename?: 'Media', id: string, objectKey: string, url: string, alt?: string | null, type: MediaType, size: number, mimeType: string, filename: string, createdAt: Date, updatedAt: Date, uploader?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } | null } };

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

export type LegalCaseQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
  caseNumber?: InputMaybe<Scalars['String']['input']>;
}>;


export type LegalCaseQuery = { __typename?: 'Query', legalCase: { __typename?: 'LegalCase', id: string, caseNumber: string, caseName: string, summary?: string | null, parties?: string | null, plaintiff?: string | null, defendant?: string | null, judges?: string | null, verdict?: string | null, legalBasis?: string | null, jurisdiction?: Jurisdiction | null, caseType?: CaseType | null, caseDate?: Date | null, resolutionDate?: Date | null, createdAt: Date, updatedAt: Date, court?: { __typename?: 'Court', id: string, name: string, type?: CourtType | null, jurisdiction?: Jurisdiction | null, description?: string | null } | null, articles: Array<{ __typename?: 'Article', id: string, title: string, slug: string, excerpt?: string | null, status: ArticleStatus, publishedAt?: Date | null, createdAt: Date }> } };

export type RecentLegalCasesQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecentLegalCasesQuery = { __typename?: 'Query', legalCases: Array<{ __typename?: 'LegalCase', id: string, caseNumber: string, caseName: string, summary?: string | null, parties?: string | null, plaintiff?: string | null, defendant?: string | null, jurisdiction?: Jurisdiction | null, caseType?: CaseType | null, caseDate?: Date | null, resolutionDate?: Date | null, createdAt: Date, court?: { __typename?: 'Court', id: string, name: string, type?: CourtType | null, jurisdiction?: Jurisdiction | null } | null }> };

export type MediasQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type MediasQuery = { __typename?: 'Query', medias: Array<{ __typename?: 'Media', id: string, objectKey: string, url: string, alt?: string | null, type: MediaType, size: number, mimeType: string, filename: string, createdAt: Date, updatedAt: Date, uploader?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } | null }> };

export type MediaQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type MediaQuery = { __typename?: 'Query', media?: { __typename?: 'Media', id: string, objectKey: string, url: string, alt?: string | null, type: MediaType, size: number, mimeType: string, filename: string, createdAt: Date, updatedAt: Date, uploader?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } | null } | null };

export type UsersQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, email: string, name?: string | null, image?: string | null, role: Role, createdAt: Date, updatedAt: Date }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, name?: string | null, email: string, emailVerified: boolean, role: Role, image?: string | null, createdAt: Date, updatedAt: Date } | null };


export const CreateMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMedia"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMediaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMedia"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"uploader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]} as unknown as DocumentNode<CreateMediaMutation, CreateMediaMutationVariables>;
export const UpdateMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMedia"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMediaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMedia"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"uploader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateMediaMutation, UpdateMediaMutationVariables>;
export const DeleteMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMedia"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMedia"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<DeleteMediaMutation, DeleteMediaMutationVariables>;
export const UpdateMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateMe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateMeMutation, UpdateMeMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AdminUpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const DeleteMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<DeleteMeMutation, DeleteMeMutationVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const LegalCaseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LegalCase"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"caseNumber"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"legalCase"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"caseNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"caseNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"caseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"caseName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"parties"}},{"kind":"Field","name":{"kind":"Name","value":"plaintiff"}},{"kind":"Field","name":{"kind":"Name","value":"defendant"}},{"kind":"Field","name":{"kind":"Name","value":"judges"}},{"kind":"Field","name":{"kind":"Name","value":"verdict"}},{"kind":"Field","name":{"kind":"Name","value":"legalBasis"}},{"kind":"Field","name":{"kind":"Name","value":"jurisdiction"}},{"kind":"Field","name":{"kind":"Name","value":"caseType"}},{"kind":"Field","name":{"kind":"Name","value":"caseDate"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"court"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"jurisdiction"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"articles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<LegalCaseQuery, LegalCaseQueryVariables>;
export const RecentLegalCasesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecentLegalCases"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"legalCases"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"caseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"caseName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"parties"}},{"kind":"Field","name":{"kind":"Name","value":"plaintiff"}},{"kind":"Field","name":{"kind":"Name","value":"defendant"}},{"kind":"Field","name":{"kind":"Name","value":"jurisdiction"}},{"kind":"Field","name":{"kind":"Name","value":"caseType"}},{"kind":"Field","name":{"kind":"Name","value":"caseDate"}},{"kind":"Field","name":{"kind":"Name","value":"resolutionDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"court"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"jurisdiction"}}]}}]}}]}}]} as unknown as DocumentNode<RecentLegalCasesQuery, RecentLegalCasesQueryVariables>;
export const MediasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Medias"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"medias"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"uploader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]} as unknown as DocumentNode<MediasQuery, MediasQueryVariables>;
export const MediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Media"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"uploader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]} as unknown as DocumentNode<MediaQuery, MediaQueryVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"users"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;