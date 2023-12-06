import { Command } from "commander";

import { generateGiftCards } from "@/commands/generate-gift-cards.js";
import { validateCustomerFile } from "@/commands/validate-customer-file.js";

const program = new Command();

program
  .command("validate-customer-file")
  .description("Validate the given CSV customer file")
  .argument("<file>", "Path to CSV customer file")
  .action((file: string) => validateCustomerFile(file));

program
  .command("generate-gift-cards")
  .description("Generate gift cards and write to file")
  .option("-n, --note <string>", "Optional internal note")
  .option("-p, --prefix <string>", "Optional prefix for codes")
  .option("-e, --expires <string>", "Optional expiry date in ISO 8601 format")
  .requiredOption("-i, --input <string>", "Input path for CSV customer file")
  .requiredOption("-o, --output <string>", "Output path for CSV codes file")
  .action(
    (args: {
      note?: string;
      input: string;
      output: string;
      prefix?: string;
      expires?: string;
    }) => generateGiftCards(args),
  );

await program.parse();
