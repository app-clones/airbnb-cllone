import { GraphQLResolveInfo } from "graphql";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
    { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
    { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = {
    [X in Exclude<keyof T, K>]?: T[X];
} &
    { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
};

export type Error = {
    __typename?: "Error";
    path: Scalars["String"];
    message?: Maybe<Scalars["String"]>;
};

export type Mutation = {
    __typename?: "Mutation";
    sendForgotPasswordEmail?: Maybe<Scalars["Boolean"]>;
    forgotPasswordChange?: Maybe<Array<Error>>;
    login?: Maybe<Array<Error>>;
    logout?: Maybe<Scalars["Boolean"]>;
    register?: Maybe<Array<Error>>;
};

export type MutationSendForgotPasswordEmailArgs = {
    email: Scalars["String"];
};

export type MutationForgotPasswordChangeArgs = {
    newPassword: Scalars["String"];
    key: Scalars["String"];
};

export type MutationLoginArgs = {
    email: Scalars["String"];
    password: Scalars["String"];
};

export type MutationRegisterArgs = {
    email: Scalars["String"];
    password: Scalars["String"];
};

export type Query = {
    __typename?: "Query";
    bugfix: Scalars["String"];
    bugFix?: Maybe<Scalars["String"]>;
    me?: Maybe<User>;
};

export type User = {
    __typename?: "User";
    id: Scalars["ID"];
    email: Scalars["String"];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
    fragment: string;
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
    selectionSet: string;
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
    | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
    | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
    | ResolverFn<TResult, TParent, TContext, TArgs>
    | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
    TResult,
    TKey extends string,
    TParent,
    TContext,
    TArgs
> {
    subscribe: SubscriptionSubscribeFn<
        { [key in TKey]: TResult },
        TParent,
        TContext,
        TArgs
    >;
    resolve?: SubscriptionResolveFn<
        TResult,
        { [key in TKey]: TResult },
        TContext,
        TArgs
    >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
    resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
    TResult,
    TKey extends string,
    TParent,
    TContext,
    TArgs
> =
    | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
    | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
    TResult,
    TKey extends string,
    TParent = {},
    TContext = {},
    TArgs = {}
> =
    | ((
          ...args: any[]
      ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
    | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
    parent: TParent,
    context: TContext,
    info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
    obj: T,
    context: TContext,
    info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
    TResult = {},
    TParent = {},
    TContext = {},
    TArgs = {}
> = (
    next: NextResolverFn<TResult>,
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
    Error: ResolverTypeWrapper<Error>;
    String: ResolverTypeWrapper<Scalars["String"]>;
    Mutation: ResolverTypeWrapper<{}>;
    Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
    Query: ResolverTypeWrapper<{}>;
    User: ResolverTypeWrapper<User>;
    ID: ResolverTypeWrapper<Scalars["ID"]>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
    Error: Error;
    String: Scalars["String"];
    Mutation: {};
    Boolean: Scalars["Boolean"];
    Query: {};
    User: User;
    ID: Scalars["ID"];
};

export type ErrorResolvers<
    ContextType = any,
    ParentType extends ResolversParentTypes["Error"] = ResolversParentTypes["Error"]
> = {
    path?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
    message?: Resolver<
        Maybe<ResolversTypes["String"]>,
        ParentType,
        ContextType
    >;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
    ContextType = any,
    ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
    sendForgotPasswordEmail?: Resolver<
        Maybe<ResolversTypes["Boolean"]>,
        ParentType,
        ContextType,
        RequireFields<MutationSendForgotPasswordEmailArgs, "email">
    >;
    forgotPasswordChange?: Resolver<
        Maybe<Array<ResolversTypes["Error"]>>,
        ParentType,
        ContextType,
        RequireFields<MutationForgotPasswordChangeArgs, "newPassword" | "key">
    >;
    login?: Resolver<
        Maybe<Array<ResolversTypes["Error"]>>,
        ParentType,
        ContextType,
        RequireFields<MutationLoginArgs, "email" | "password">
    >;
    logout?: Resolver<
        Maybe<ResolversTypes["Boolean"]>,
        ParentType,
        ContextType
    >;
    register?: Resolver<
        Maybe<Array<ResolversTypes["Error"]>>,
        ParentType,
        ContextType,
        RequireFields<MutationRegisterArgs, "email" | "password">
    >;
};

export type QueryResolvers<
    ContextType = any,
    ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
    bugfix?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
    bugFix?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
    me?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
};

export type UserResolvers<
    ContextType = any,
    ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = {
    id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
    email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
    Error?: ErrorResolvers<ContextType>;
    Mutation?: MutationResolvers<ContextType>;
    Query?: QueryResolvers<ContextType>;
    User?: UserResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
