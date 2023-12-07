import { Importer } from "@/lib/importer.js";
import { parseGiftCardFile } from "@/lib/csv.js";
import { createAdminApiClient } from "@/lib/shopify.js";

export async function importGiftCards({
  token,
  input,
  output,
  shopifyDomain,
  suppressEmail,
}: {
  token: string;
  input: string;
  output: string;
  shopifyDomain: string;
  suppressEmail?: boolean;
}) {
  // Parse gift cards from CSV file.
  const giftCards = parseGiftCardFile(input);

  // Construct an importer.
  const importer = new Importer({
    shopify: createAdminApiClient({
      accessToken: token,
      storeDomain: shopifyDomain,
    }),
  });

  // Import gift cards.
  const result = await importer.importGiftCards({
    giftCards,
    suppressEmail,
  });

  // Finish.
  console.log(`${result.giftCardCreatedCount} gift cards imported.`);
}
