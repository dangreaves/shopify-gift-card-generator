import PQueue from "p-queue";

import { AdminApiClient } from "./shopify.js";

import type {
  CustomerWithGiftCard,
  CustomerWithGiftCardResult,
} from "./csv.js";

export class Importer {
  readonly shopify: AdminApiClient;

  constructor({ shopify }: { shopify: AdminApiClient }) {
    this.shopify = shopify;
  }

  /**
   * Import the given list of gift cards into Shopify.
   *
   * If the email address does not yet exist in Shopify, a customer record
   * will be created.
   *
   * If the suppressEmail option is enabled, the gift card will first be
   * created unattached to a customer, and then attached in a second
   * API request. This avoids the generic gift card email being
   * sent from Shopify.
   */
  importGiftCards({
    giftCards,
    suppressEmail,
  }: {
    suppressEmail?: boolean;
    giftCards: CustomerWithGiftCard[];
  }): Promise<CustomerWithGiftCardResult[]> {
    return new Promise((resolve) => {
      // 2 requests at once, max 2 requests per second.
      const queue = new PQueue({
        concurrency: 2,
        intervalCap: 2,
        interval: 1000,
        autoStart: false,
      });

      let giftCardResults: CustomerWithGiftCardResult[] = [];

      queue.on("completed", () =>
        console.log(`Queue: ${queue.size} / Running: ${queue.pending}`),
      );

      queue.on("idle", () => resolve(giftCardResults));

      for (const giftCard of giftCards) {
        queue.add(async () => {
          try {
            const customer = await this._createCustomer({
              email: giftCard.email,
              lastName: giftCard.last_name,
              firstName: giftCard.first_name,
            });

            try {
              const shopifyGiftCard = await this._createGiftCard({
                suppressEmail,
                code: giftCard.code,
                note: giftCard.note,
                customerId: customer.id,
                expiresOn: giftCard.expires,
                initialValue: giftCard.amount,
              });

              giftCardResults.push({
                ...giftCard,
                customer_id: customer.id,
                gift_card_id: shopifyGiftCard.id,
                error: null,
              });
            } catch (e) {
              giftCardResults.push({
                ...giftCard,
                customer_id: customer.id,
                gift_card_id: null,
                error: e instanceof Error ? e.message : "Unknown error",
              });
            }
          } catch (e) {
            giftCardResults.push({
              ...giftCard,
              customer_id: null,
              gift_card_id: null,
              error: e instanceof Error ? e.message : "Unknown error",
            });
          }
        });
      }

      queue.start();
    });
  }

  /**
   * Create Shopify customer with the given attributes.
   *
   * If the customer already exists, the existing customer ID is
   * returned.
   */
  protected async _createCustomer({
    email,
    lastName,
    firstName,
  }: {
    email: string;
    lastName: string;
    firstName: string;
  }) {
    const { data, errors } = await this.shopify.request(
      CUSTOMER_CREATE_MUTATION,
      {
        variables: {
          input: {
            email,
            lastName,
            firstName,
          },
        },
      },
    );

    if (errors) {
      console.dir(errors.graphQLErrors, { depth: null });
      throw new Error(errors.message);
    }

    if (!data?.customerCreate) {
      throw new Error("No data returned.");
    }

    if (0 < data.customerCreate.userErrors.length) {
      // Email already exists.
      if (
        1 === data.customerCreate.userErrors.length &&
        "Email has already been taken" ===
          data.customerCreate.userErrors[0]?.message
      ) {
        const customer = await this._customerByEmail({ email });

        if (!customer) {
          throw new Error(
            "Shopify says customer exists, but nothing returned for email.",
          );
        }

        return customer;
      }

      console.dir(data.customerCreate.userErrors, { depth: null });
      throw new Error("User errors.");
    }

    if (!data.customerCreate.customer) {
      throw new Error("No customer returned. No user errors.");
    }

    return data.customerCreate.customer;
  }

  /**
   * Return customer with the given email.
   */
  protected async _customerByEmail({ email }: { email: string }) {
    const { data, errors } = await this.shopify.request(CUSTOMERS_QUERY, {
      variables: {
        query: `email:${email}`,
      },
    });

    if (errors) {
      console.dir(errors.graphQLErrors, { depth: null });
      throw new Error(errors.message);
    }

    return data?.customers.edges[0]?.node ?? null;
  }

  /**
   * Create Shopify gift card with the given attributes.
   *
   * If the suppressEmail option is enabled, the gift card will first be
   * created unattached to a customer, and then attached in a second
   * API request. This avoids the generic gift card email being
   * sent from Shopify.
   */
  protected async _createGiftCard({
    code,
    note,
    expiresOn,
    customerId,
    initialValue,
    suppressEmail,
  }: {
    code: string;
    customerId: string;
    note?: string | null;
    initialValue: string;
    expiresOn?: string | null;
    suppressEmail?: boolean | null;
  }) {
    const { data, errors } = await this.shopify.request(
      GIFT_CARD_CREATE_MUTATION,
      {
        variables: {
          input: {
            code,
            note,
            expiresOn,
            initialValue,
            ...(!suppressEmail ? { customerId } : {}),
          },
        },
      },
    );

    if (errors) {
      console.dir(errors.graphQLErrors, { depth: null });
      throw new Error(errors.message);
    }

    if (!data?.giftCardCreate) {
      throw new Error("No giftCardCreate returned.");
    }

    if (data.giftCardCreate.userErrors[0]?.message) {
      throw new Error(data.giftCardCreate.userErrors[0].message);
    }

    if (!data.giftCardCreate.giftCard) {
      throw new Error(
        "No giftCard returned from giftCardCreate. No userErrors.",
      );
    }

    const giftCard = data.giftCardCreate.giftCard;

    // Attach customer in a second request if suppressEmail is enabled.
    if (suppressEmail) {
      await this._assignGiftCard({ giftCardId: giftCard.id, customerId });
    }

    return giftCard;
  }

  /**
   * Assign gift card to the given customer.
   */
  protected async _assignGiftCard({
    giftCardId,
    customerId,
  }: {
    giftCardId: string;
    customerId: string;
  }) {
    const { data, errors } = await this.shopify.request(
      GIFT_CARD_UPDATE_MUTATION,
      {
        variables: {
          id: giftCardId,
          input: {
            customerId,
          },
        },
      },
    );

    if (errors) {
      console.dir(errors.graphQLErrors, { depth: null });
      throw new Error(errors.message);
    }

    if (!data?.giftCardUpdate) {
      throw new Error("No giftCardUpdate returned.");
    }

    if (data.giftCardUpdate.userErrors[0]?.message) {
      throw new Error(data.giftCardUpdate.userErrors[0].message);
    }
  }
}

const CUSTOMER_CREATE_MUTATION = /* GraphQL */ `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMERS_QUERY = /* GraphQL */ `
  query customers($query: String!) {
    customers(query: $query, first: 1) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

const GIFT_CARD_CREATE_MUTATION = /* GraphQL */ `
  mutation giftCardCreate($input: GiftCardCreateInput!) {
    giftCardCreate(input: $input) {
      giftCard {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const GIFT_CARD_UPDATE_MUTATION = /* GraphQL */ `
  mutation giftCardUpdate($id: ID!, $input: GiftCardUpdateInput!) {
    giftCardUpdate(id: $id, input: $input) {
      giftCard {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;
