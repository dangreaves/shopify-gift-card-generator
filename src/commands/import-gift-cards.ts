import { Importer } from "@/lib/importer.js";
import { createAdminApiClient } from "@/lib/shopify.js";
import { parseGiftCardFile, writeResultsFile } from "@/lib/csv.js";

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
  const results = await importer.importGiftCards({
    giftCards,
    suppressEmail,
  });

  // Write results to file.
  writeResultsFile(output, results);

  // Finish.
  console.log(`${results.length} gift cards imported.`);
}
