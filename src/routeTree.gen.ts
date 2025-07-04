/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as VerifyImport } from './routes/verify'
import { Route as SignupImport } from './routes/signup'
import { Route as SigninImport } from './routes/signin'
import { Route as MyTiersImport } from './routes/my-tiers'
import { Route as MyReviewsImport } from './routes/my-reviews'
import { Route as CommunityFavoritesImport } from './routes/community-favorites'
import { Route as BooksImport } from './routes/books'
import { Route as AuthImport } from './routes/auth'
import { Route as AddBookImport } from './routes/add-book'
import { Route as AcademyImport } from './routes/academy'
import { Route as IndexImport } from './routes/index'
import { Route as RealmRealmIdImport } from './routes/realm.$realmId'
import { Route as BookBookIdImport } from './routes/book.$bookId'

// Create/Update Routes

const VerifyRoute = VerifyImport.update({
  id: '/verify',
  path: '/verify',
  getParentRoute: () => rootRoute,
} as any)

const SignupRoute = SignupImport.update({
  id: '/signup',
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any)

const SigninRoute = SigninImport.update({
  id: '/signin',
  path: '/signin',
  getParentRoute: () => rootRoute,
} as any)

const MyTiersRoute = MyTiersImport.update({
  id: '/my-tiers',
  path: '/my-tiers',
  getParentRoute: () => rootRoute,
} as any)

const MyReviewsRoute = MyReviewsImport.update({
  id: '/my-reviews',
  path: '/my-reviews',
  getParentRoute: () => rootRoute,
} as any)

const CommunityFavoritesRoute = CommunityFavoritesImport.update({
  id: '/community-favorites',
  path: '/community-favorites',
  getParentRoute: () => rootRoute,
} as any)

const BooksRoute = BooksImport.update({
  id: '/books',
  path: '/books',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/auth',
  path: '/auth',
  getParentRoute: () => rootRoute,
} as any)

const AddBookRoute = AddBookImport.update({
  id: '/add-book',
  path: '/add-book',
  getParentRoute: () => rootRoute,
} as any)

const AcademyRoute = AcademyImport.update({
  id: '/academy',
  path: '/academy',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const RealmRealmIdRoute = RealmRealmIdImport.update({
  id: '/realm/$realmId',
  path: '/realm/$realmId',
  getParentRoute: () => rootRoute,
} as any)

const BookBookIdRoute = BookBookIdImport.update({
  id: '/book/$bookId',
  path: '/book/$bookId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/academy': {
      id: '/academy'
      path: '/academy'
      fullPath: '/academy'
      preLoaderRoute: typeof AcademyImport
      parentRoute: typeof rootRoute
    }
    '/add-book': {
      id: '/add-book'
      path: '/add-book'
      fullPath: '/add-book'
      preLoaderRoute: typeof AddBookImport
      parentRoute: typeof rootRoute
    }
    '/auth': {
      id: '/auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/books': {
      id: '/books'
      path: '/books'
      fullPath: '/books'
      preLoaderRoute: typeof BooksImport
      parentRoute: typeof rootRoute
    }
    '/community-favorites': {
      id: '/community-favorites'
      path: '/community-favorites'
      fullPath: '/community-favorites'
      preLoaderRoute: typeof CommunityFavoritesImport
      parentRoute: typeof rootRoute
    }
    '/my-reviews': {
      id: '/my-reviews'
      path: '/my-reviews'
      fullPath: '/my-reviews'
      preLoaderRoute: typeof MyReviewsImport
      parentRoute: typeof rootRoute
    }
    '/my-tiers': {
      id: '/my-tiers'
      path: '/my-tiers'
      fullPath: '/my-tiers'
      preLoaderRoute: typeof MyTiersImport
      parentRoute: typeof rootRoute
    }
    '/signin': {
      id: '/signin'
      path: '/signin'
      fullPath: '/signin'
      preLoaderRoute: typeof SigninImport
      parentRoute: typeof rootRoute
    }
    '/signup': {
      id: '/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof SignupImport
      parentRoute: typeof rootRoute
    }
    '/verify': {
      id: '/verify'
      path: '/verify'
      fullPath: '/verify'
      preLoaderRoute: typeof VerifyImport
      parentRoute: typeof rootRoute
    }
    '/book/$bookId': {
      id: '/book/$bookId'
      path: '/book/$bookId'
      fullPath: '/book/$bookId'
      preLoaderRoute: typeof BookBookIdImport
      parentRoute: typeof rootRoute
    }
    '/realm/$realmId': {
      id: '/realm/$realmId'
      path: '/realm/$realmId'
      fullPath: '/realm/$realmId'
      preLoaderRoute: typeof RealmRealmIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/academy': typeof AcademyRoute
  '/add-book': typeof AddBookRoute
  '/auth': typeof AuthRoute
  '/books': typeof BooksRoute
  '/community-favorites': typeof CommunityFavoritesRoute
  '/my-reviews': typeof MyReviewsRoute
  '/my-tiers': typeof MyTiersRoute
  '/signin': typeof SigninRoute
  '/signup': typeof SignupRoute
  '/verify': typeof VerifyRoute
  '/book/$bookId': typeof BookBookIdRoute
  '/realm/$realmId': typeof RealmRealmIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/academy': typeof AcademyRoute
  '/add-book': typeof AddBookRoute
  '/auth': typeof AuthRoute
  '/books': typeof BooksRoute
  '/community-favorites': typeof CommunityFavoritesRoute
  '/my-reviews': typeof MyReviewsRoute
  '/my-tiers': typeof MyTiersRoute
  '/signin': typeof SigninRoute
  '/signup': typeof SignupRoute
  '/verify': typeof VerifyRoute
  '/book/$bookId': typeof BookBookIdRoute
  '/realm/$realmId': typeof RealmRealmIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/academy': typeof AcademyRoute
  '/add-book': typeof AddBookRoute
  '/auth': typeof AuthRoute
  '/books': typeof BooksRoute
  '/community-favorites': typeof CommunityFavoritesRoute
  '/my-reviews': typeof MyReviewsRoute
  '/my-tiers': typeof MyTiersRoute
  '/signin': typeof SigninRoute
  '/signup': typeof SignupRoute
  '/verify': typeof VerifyRoute
  '/book/$bookId': typeof BookBookIdRoute
  '/realm/$realmId': typeof RealmRealmIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/academy'
    | '/add-book'
    | '/auth'
    | '/books'
    | '/community-favorites'
    | '/my-reviews'
    | '/my-tiers'
    | '/signin'
    | '/signup'
    | '/verify'
    | '/book/$bookId'
    | '/realm/$realmId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/academy'
    | '/add-book'
    | '/auth'
    | '/books'
    | '/community-favorites'
    | '/my-reviews'
    | '/my-tiers'
    | '/signin'
    | '/signup'
    | '/verify'
    | '/book/$bookId'
    | '/realm/$realmId'
  id:
    | '__root__'
    | '/'
    | '/academy'
    | '/add-book'
    | '/auth'
    | '/books'
    | '/community-favorites'
    | '/my-reviews'
    | '/my-tiers'
    | '/signin'
    | '/signup'
    | '/verify'
    | '/book/$bookId'
    | '/realm/$realmId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AcademyRoute: typeof AcademyRoute
  AddBookRoute: typeof AddBookRoute
  AuthRoute: typeof AuthRoute
  BooksRoute: typeof BooksRoute
  CommunityFavoritesRoute: typeof CommunityFavoritesRoute
  MyReviewsRoute: typeof MyReviewsRoute
  MyTiersRoute: typeof MyTiersRoute
  SigninRoute: typeof SigninRoute
  SignupRoute: typeof SignupRoute
  VerifyRoute: typeof VerifyRoute
  BookBookIdRoute: typeof BookBookIdRoute
  RealmRealmIdRoute: typeof RealmRealmIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AcademyRoute: AcademyRoute,
  AddBookRoute: AddBookRoute,
  AuthRoute: AuthRoute,
  BooksRoute: BooksRoute,
  CommunityFavoritesRoute: CommunityFavoritesRoute,
  MyReviewsRoute: MyReviewsRoute,
  MyTiersRoute: MyTiersRoute,
  SigninRoute: SigninRoute,
  SignupRoute: SignupRoute,
  VerifyRoute: VerifyRoute,
  BookBookIdRoute: BookBookIdRoute,
  RealmRealmIdRoute: RealmRealmIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/academy",
        "/add-book",
        "/auth",
        "/books",
        "/community-favorites",
        "/my-reviews",
        "/my-tiers",
        "/signin",
        "/signup",
        "/verify",
        "/book/$bookId",
        "/realm/$realmId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/academy": {
      "filePath": "academy.tsx"
    },
    "/add-book": {
      "filePath": "add-book.tsx"
    },
    "/auth": {
      "filePath": "auth.tsx"
    },
    "/books": {
      "filePath": "books.tsx"
    },
    "/community-favorites": {
      "filePath": "community-favorites.tsx"
    },
    "/my-reviews": {
      "filePath": "my-reviews.tsx"
    },
    "/my-tiers": {
      "filePath": "my-tiers.tsx"
    },
    "/signin": {
      "filePath": "signin.tsx"
    },
    "/signup": {
      "filePath": "signup.tsx"
    },
    "/verify": {
      "filePath": "verify.tsx"
    },
    "/book/$bookId": {
      "filePath": "book.$bookId.tsx"
    },
    "/realm/$realmId": {
      "filePath": "realm.$realmId.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
