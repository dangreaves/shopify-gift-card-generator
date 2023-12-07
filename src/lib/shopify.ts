import { createAdminApiClient as _createAdminApiClient } from "@shopify/admin-api-client";

export type AdminApiClient = ReturnType<typeof _createAdminApiClient>;

export type * from "@/types/admin.generated.d.ts";

/**
 * Create a Shopify Admin API client.
 */
export function createAdminApiClient({
  accessToken,
  storeDomain,
}: {
  accessToken: string;
  storeDomain: string;
}): AdminApiClient {
  return _createAdminApiClient({
    storeDomain,
    accessToken,
    apiVersion: "2023-04",
  });
}
