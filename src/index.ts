import { Command } from "commander";

import { importGiftCards } from "@/commands/import-gift-cards.js";
import { generateGiftCards } from "@/commands/generate-gift-cards.js";
import { validateCustomerFile } from "@/commands/validate-customer-file.js";

const program = new Command();

program
  .command("validate-customer-file")
  .description("Validate the given CSV customer file")
  .argument("<file>", "Path to CSV customer file")
  .action((file) => validateCustomerFile(file));

program
  .command("generate-gift-cards")
  .description("Generate gift cards and write to file")
  .option("-n, --note <string>", "Optional internal note")
  .option("-p, --prefix <string>", "Optional prefix for codes")
  .option("-e, --expires <string>", "Optional expiry date in ISO 8601 format")
  .requiredOption("-i, --input <string>", "Input path for CSV customer file")
  .requiredOption("-o, --output <string>", "Output path for CSV codes file")
  .action((args) => generateGiftCards(args));

program
  .command("import-gift-cards")
  .description("Import the gift card file into Shopify")
  .requiredOption("-i, --input <string>", "Input path for gift card CSV file")
  .requiredOption("-o, --output <string>", "Output path for results CSV file")
  .requiredOption("-t, --token <string>", "Shopify Admin API access token")
  .requiredOption("-d, --shopify-domain <string>", "Shopify domain")
  .option("--suppress-email", "Suppress generic Shopify gift card email")
  .action((args) => importGiftCards(args));

await program.parse();
