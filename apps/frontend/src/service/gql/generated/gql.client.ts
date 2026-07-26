/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AdminUpdateUserInput = {
  /** URL of the user's profile image */
  image?: string | null | undefined;
  /** Display name of the user */
  name?: string | null | undefined;
  /** User role: PUBLIC, COLLABORATOR, or ADMIN */
  role?: string | null | undefined;
};

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

export enum ArticleStatus {
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

export enum CourtType {
  Constitucional = 'CONSTITUCIONAL',
  Especializada = 'ESPECIALIZADA',
  PrimeraInstancia = 'PRIMERA_INSTANCIA',
  Superior = 'SUPERIOR',
  Suprema = 'SUPREMA'
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
  Internacional = 'INTERNACIONAL',
  Local = 'LOCAL',
  Nacional = 'NACIONAL',
  Regional = 'REGIONAL'
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

export enum MediaType {
  Audio = 'AUDIO',
  File = 'FILE',
  Image = 'IMAGE',
  Video = 'VIDEO'
}

export enum Role {
  Admin = 'ADMIN',
  Collaborator = 'COLLABORATOR',
  Public = 'PUBLIC'
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

export type CreateArticleMutationVariables = Exact<{
  input: CreateArticleInput;
}>;


export type CreateArticleMutation = { createArticle: { id: string, title: string, slug: string, status: ArticleStatus } };

export type UpdateArticleMutationVariables = Exact<{
  id: string;
  input: UpdateArticleInput;
}>;


export type UpdateArticleMutation = { updateArticle: { id: string, title: string, slug: string, status: ArticleStatus } };

export type UpdateArticleStatusMutationVariables = Exact<{
  id: string;
  status: string;
}>;


export type UpdateArticleStatusMutation = { updateArticle: { id: string, status: ArticleStatus } };

export type DeleteArticleMutationVariables = Exact<{
  id: string;
}>;


export type DeleteArticleMutation = { deleteArticle: { id: string, title: string } };

export type CreateCaseTypeMutationVariables = Exact<{
  input: CreateCaseTypeInput;
}>;


export type CreateCaseTypeMutation = { createCaseType: { id: string, name: string, slug: string, description: string | null, color: string | null, icon: string | null, order: number | null, active: boolean, createdAt: Date, updatedAt: Date } };

export type UpdateCaseTypeMutationVariables = Exact<{
  id: string;
  input: UpdateCaseTypeInput;
}>;


export type UpdateCaseTypeMutation = { updateCaseType: { id: string, name: string, slug: string, description: string | null, color: string | null, icon: string | null, order: number | null, active: boolean, createdAt: Date, updatedAt: Date } };

export type DeleteCaseTypeMutationVariables = Exact<{
  id: string;
}>;


export type DeleteCaseTypeMutation = { deleteCaseType: { id: string, name: string } };

export type CreateMediaMutationVariables = Exact<{
  input: CreateMediaInput;
}>;


export type CreateMediaMutation = { createMedia: { id: string, objectKey: string, url: string, alt: string | null, type: MediaType, size: number, mimeType: string, filename: string, createdAt: Date, updatedAt: Date, uploader: { id: string, name: string | null, email: string, image: string | null } } };

export type UpdateMediaMutationVariables = Exact<{
  id: string;
  input: UpdateMediaInput;
}>;


export type UpdateMediaMutation = { updateMedia: { id: string, objectKey: string, url: string, alt: string | null, type: MediaType, size: number, mimeType: string, filename: string, createdAt: Date, updatedAt: Date, uploader: { id: string, name: string | null, email: string, image: string | null } } };

export type DeleteMediaMutationVariables = Exact<{
  id: string;
}>;


export type DeleteMediaMutation = { deleteMedia: { id: string, objectKey: string, url: string, alt: string | null, type: MediaType, size: number, mimeType: string, filename: string, createdAt: Date, updatedAt: Date } };

export type UpdateMeMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateMeMutation = { updateMe: { id: string, email: string, name: string | null, image: string | null, role: Role, createdAt: Date, updatedAt: Date } };

export type UpdateUserMutationVariables = Exact<{
  id: string | number;
  input: AdminUpdateUserInput;
}>;


export type UpdateUserMutation = { updateUser: { id: string, email: string, name: string | null, image: string | null, role: Role, createdAt: Date, updatedAt: Date } };

export type DeleteMeMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteMeMutation = { deleteMe: { id: string, email: string } };

export type DeleteUserMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteUserMutation = { deleteUser: { id: string, email: string } };

export type AdminArticlesQueryVariables = Exact<{
  take?: number | null | undefined;
  skip?: number | null | undefined;
  filter?: ArticleFilter | null | undefined;
}>;


export type AdminArticlesQuery = { articles: { items: Array<{ id: string, title: string, slug: string, excerpt: string | null, status: ArticleStatus, publishedAt: Date | null, createdAt: Date, updatedAt: Date, views: number, author: { id: string, name: string | null, email: string }, categories: Array<{ id: string, name: string }> }>, pageInfo: { totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type AdminStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminStatsQuery = { articles: { pageInfo: { totalCount: number } }, legalCases: { pageInfo: { totalCount: number } }, users: { pageInfo: { totalCount: number } }, caseTypes: { pageInfo: { totalCount: number } } };

export type ArticleQueryVariables = Exact<{
  slug: string;
}>;


export type ArticleQuery = { article: { id: string, title: string, slug: string, content: string, excerpt: string | null, publishedAt: Date | null, readingTimeMin: number | null, views: number, author: { id: string, name: string | null, image: string | null }, featuredImage: { id: string, url: string, alt: string | null } | null, categories: Array<{ id: string, name: string, slug: string }>, tags: Array<{ id: string, name: string, slug: string }>, legalCases: Array<{ id: string, slug: string, caseNumber: string, caseName: string, jurisdiction: Jurisdiction | null, caseType: { id: string, name: string, slug: string, color: string | null, icon: string | null } }> } | null };

export type ArticleByIdQueryVariables = Exact<{
  id: string;
}>;


export type ArticleByIdQuery = { article: { id: string, title: string, slug: string, content: string, excerpt: string | null, status: ArticleStatus, publishedAt: Date | null, readingTimeMin: number | null, featuredImage: { id: string, url: string } | null, categories: Array<{ id: string, name: string }>, tags: Array<{ id: string, name: string }> } | null };

export type RecentArticlesQueryVariables = Exact<{
  take?: number | null | undefined;
  skip?: number | null | undefined;
  filter?: ArticleFilter | null | undefined;
}>;


export type RecentArticlesQuery = { articles: { items: Array<{ id: string, title: string, slug: string, excerpt: string | null, publishedAt: Date | null, readingTimeMin: number | null, views: number, author: { id: string, name: string | null, image: string | null }, featuredImage: { id: string, url: string, alt: string | null } | null, categories: Array<{ id: string, name: string, slug: string }>, tags: Array<{ id: string, name: string, slug: string }> }>, pageInfo: { totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type CaseTypesQueryVariables = Exact<{
  take?: number | null | undefined;
  skip?: number | null | undefined;
}>;


export type CaseTypesQuery = { caseTypes: { items: Array<{ id: string, name: string, slug: string, description: string | null, color: string | null, icon: string | null, order: number | null, active: boolean }>, pageInfo: { totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { categories: Array<{ id: string, name: string, slug: string }> };

export type TagsQueryVariables = Exact<{ [key: string]: never; }>;


export type TagsQuery = { tags: Array<{ id: string, name: string, slug: string }> };

export type LegalCaseQueryVariables = Exact<{
  id?: string | null | undefined;
  slug?: string | null | undefined;
  caseNumber?: string | null | undefined;
}>;


export type LegalCaseQuery = { legalCase: { id: string, caseNumber: string, caseName: string, slug: string, summary: string | null, parties: string | null, plaintiff: string | null, defendant: string | null, judges: string | null, verdict: string | null, legalBasis: string | null, jurisdiction: Jurisdiction | null, caseDate: Date | null, resolutionDate: Date | null, createdAt: Date, updatedAt: Date, caseType: { id: string, name: string, slug: string, color: string | null, icon: string | null }, court: { id: string, name: string, type: CourtType | null, jurisdiction: Jurisdiction | null, description: string | null }, articles: Array<{ id: string, title: string, slug: string, excerpt: string | null, status: ArticleStatus, publishedAt: Date | null, createdAt: Date }> } | null };

export type RecentLegalCasesQueryVariables = Exact<{
  take?: number | null | undefined;
  skip?: number | null | undefined;
  filter?: LegalCaseFilter | null | undefined;
}>;


export type RecentLegalCasesQuery = { legalCases: { items: Array<{ id: string, caseNumber: string, caseName: string, slug: string, summary: string | null, parties: string | null, plaintiff: string | null, defendant: string | null, jurisdiction: Jurisdiction | null, caseDate: Date | null, resolutionDate: Date | null, createdAt: Date, caseType: { id: string, name: string, slug: string, color: string | null, icon: string | null }, court: { id: string, name: string, type: CourtType | null, jurisdiction: Jurisdiction | null } }>, pageInfo: { totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type MediasQueryVariables = Exact<{
  take?: number | null | undefined;
  skip?: number | null | undefined;
  filter?: MediaFilter | null | undefined;
}>;


export type MediasQuery = { medias: { items: Array<{ id: string, objectKey: string, url: string, alt: string | null, type: MediaType, size: number, mimeType: string, filename: string, createdAt: Date, updatedAt: Date, uploader: { id: string, name: string | null, email: string, image: string | null } }>, pageInfo: { totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type MediaQueryVariables = Exact<{
  id: string;
}>;


export type MediaQuery = { media: { id: string, objectKey: string, url: string, alt: string | null, type: MediaType, size: number, mimeType: string, filename: string, createdAt: Date, updatedAt: Date, uploader: { id: string, name: string | null, email: string, image: string | null } } | null };

export type UsersQueryVariables = Exact<{
  take?: number | null | undefined;
  skip?: number | null | undefined;
  filter?: UserFilter | null | undefined;
}>;


export type UsersQuery = { users: { items: Array<{ id: string, email: string, name: string | null, image: string | null, role: Role, createdAt: Date, updatedAt: Date }>, pageInfo: { totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, name: string | null, email: string, emailVerified: boolean, role: Role, image: string | null, createdAt: Date, updatedAt: Date } | null };


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
    query AdminArticles($take: Int, $skip: Int, $filter: ArticleFilter) {
  articles(take: $take, skip: $skip, filter: $filter) {
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
    query RecentArticles($take: Int, $skip: Int, $filter: ArticleFilter) {
  articles(take: $take, skip: $skip, filter: $filter) {
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
    query CaseTypes($take: Int, $skip: Int) {
  caseTypes(take: $take, skip: $skip) {
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
    query RecentLegalCases($take: Int, $skip: Int, $filter: LegalCaseFilter) {
  legalCases(take: $take, skip: $skip, filter: $filter) {
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
    query Medias($take: Int, $skip: Int, $filter: MediaFilter) {
  medias(take: $take, skip: $skip, filter: $filter) {
    items {
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
    pageInfo {
      totalCount
      hasNextPage
      hasPreviousPage
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
    query users($take: Int, $skip: Int, $filter: UserFilter) {
  users(take: $take, skip: $skip, filter: $filter) {
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