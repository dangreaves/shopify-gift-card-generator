/** @see https://github.com/Shopify/shopify-api-js/tree/main/packages/api-codegen-preset */

import { shopifyApiProject, ApiType } from "@shopify/api-codegen-preset";

export default {
  schema: "https://shopify.dev/admin-graphql-direct-proxy/2023-10",
  documents: ["./src/**/*.{js,ts,jsx,tsx}"],
  projects: {
    default: shopifyApiProject({
      apiVersion: "2023-10",
      apiType: ApiType.Admin,
      outputDir: "./src/types",
      documents: ["./src/**/*.{js,ts,jsx,tsx}"],
    }),
  },
};
