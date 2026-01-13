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

export type CreatePostInput = {
  /** Description of the post */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Image URL of the post */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Title of the post */
  title: Scalars['String']['input'];
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
  Image = 'IMAGE',
  Video = 'VIDEO'
}

export type Mutation = {
  __typename?: 'Mutation';
  createMedia: Media;
  createPost: Post;
  deleteMe: User;
  deleteMedia: Media;
  deletePost: Post;
  deleteUser: User;
  updateMe: User;
  updateMedia: Media;
  updatePost: Post;
  updateUser: User;
};


export type MutationCreateMediaArgs = {
  input: CreateMediaInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationDeleteMediaArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeletePostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateMeArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateMediaArgs = {
  id: Scalars['String']['input'];
  input: UpdateMediaInput;
};


export type MutationUpdatePostArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePostInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: AdminUpdateUserInput;
};

export type Post = {
  __typename?: 'Post';
  author: User;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  media?: Maybe<Media>;
  medias: Array<Media>;
  post?: Maybe<Post>;
  posts: Array<Post>;
  users: Array<User>;
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


export type QueryPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
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

export type UpdateMediaInput = {
  /** Alternative text for the media */
  alt?: InputMaybe<Scalars['String']['input']>;
  /** CDN URL of the media */
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePostInput = {
  /** Description of the post */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Image URL of the post */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Title of the post */
  title?: InputMaybe<Scalars['String']['input']>;
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
  posts: Array<Post>;
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

export type CreatePostMutationVariables = Exact<{
  input: CreatePostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: string, title: string, description?: string | null, image?: string | null, createdAt: Date, updatedAt: Date, author: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } } };

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdatePostInput;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost: { __typename?: 'Post', id: string, title: string, description?: string | null, image?: string | null, createdAt: Date, updatedAt: Date, author: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } } };

export type DeletePostMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: { __typename?: 'Post', id: string, title: string } };

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

export type PostsQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type PostsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', id: string, title: string, description?: string | null, image?: string | null, createdAt: Date, updatedAt: Date, author: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } }> };

export type PostQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PostQuery = { __typename?: 'Query', post?: { __typename?: 'Post', id: string, title: string, description?: string | null, image?: string | null, createdAt: Date, updatedAt: Date, author: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null } } | null };

export type UsersQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, email: string, name?: string | null, image?: string | null, role: Role, createdAt: Date, updatedAt: Date }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, name?: string | null, email: string, emailVerified: boolean, role: Role, image?: string | null, createdAt: Date, updatedAt: Date } | null };


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
export const CreatePostDocument = gql`
    mutation createPost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    description
    image
    createdAt
    updatedAt
    author {
      id
      name
      email
      image
    }
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const UpdatePostDocument = gql`
    mutation updatePost($id: ID!, $input: UpdatePostInput!) {
  updatePost(id: $id, input: $input) {
    id
    title
    description
    image
    createdAt
    updatedAt
    author {
      id
      name
      email
      image
    }
  }
}
    `;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const DeletePostDocument = gql`
    mutation deletePost($id: ID!) {
  deletePost(id: $id) {
    id
    title
  }
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
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
export const PostsDocument = gql`
    query posts($take: Int, $skip: Int, $search: String) {
  posts(take: $take, skip: $skip, search: $search) {
    id
    title
    description
    image
    createdAt
    updatedAt
    author {
      id
      name
      email
      image
    }
  }
}
    `;

export function usePostsQuery(options?: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'>) {
  return Urql.useQuery<PostsQuery, PostsQueryVariables>({ query: PostsDocument, ...options });
};
export const PostDocument = gql`
    query post($id: ID!) {
  post(id: $id) {
    id
    title
    description
    image
    createdAt
    updatedAt
    author {
      id
      name
      email
      image
    }
  }
}
    `;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'>) {
  return Urql.useQuery<PostQuery, PostQueryVariables>({ query: PostDocument, ...options });
};
export const UsersDocument = gql`
    query users($take: Int, $skip: Int, $search: String) {
  users(take: $take, skip: $skip, search: $search) {
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