/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import * as AdminTypes from './admin.types.d.ts';

export type CustomerCreateMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.CustomerInput;
}>;


export type CustomerCreateMutation = { customerCreate?: AdminTypes.Maybe<{ customer?: AdminTypes.Maybe<Pick<AdminTypes.Customer, 'id'>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type CustomersQueryVariables = AdminTypes.Exact<{
  query: AdminTypes.Scalars['String']['input'];
}>;


export type CustomersQuery = { customers: { edges: Array<{ node: Pick<AdminTypes.Customer, 'id'> }> } };

export type GiftCardCreateMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.GiftCardCreateInput;
}>;


export type GiftCardCreateMutation = { giftCardCreate?: AdminTypes.Maybe<{ giftCard?: AdminTypes.Maybe<Pick<AdminTypes.GiftCard, 'id'>>, userErrors: Array<Pick<AdminTypes.GiftCardUserError, 'field' | 'message'>> }> };

export type GiftCardUpdateMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  input: AdminTypes.GiftCardUpdateInput;
}>;


export type GiftCardUpdateMutation = { giftCardUpdate?: AdminTypes.Maybe<{ giftCard?: AdminTypes.Maybe<Pick<AdminTypes.GiftCard, 'id'>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

interface GeneratedQueryTypes {
  "\n  query customers($query: String!) {\n    customers(query: $query, first: 1) {\n      edges {\n        node {\n          id\n        }\n      }\n    }\n  }\n": {return: CustomersQuery, variables: CustomersQueryVariables},
}

interface GeneratedMutationTypes {
  "\n  mutation customerCreate($input: CustomerInput!) {\n    customerCreate(input: $input) {\n      customer {\n        id\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: CustomerCreateMutation, variables: CustomerCreateMutationVariables},
  "\n  mutation giftCardCreate($input: GiftCardCreateInput!) {\n    giftCardCreate(input: $input) {\n      giftCard {\n        id\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: GiftCardCreateMutation, variables: GiftCardCreateMutationVariables},
  "\n  mutation giftCardUpdate($id: ID!, $input: GiftCardUpdateInput!) {\n    giftCardUpdate(id: $id, input: $input) {\n      giftCard {\n        id\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: GiftCardUpdateMutation, variables: GiftCardUpdateMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
