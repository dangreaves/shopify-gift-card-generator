import { Command } from "commander";

import { generateCodes } from "@/commands/generate-codes.js";
import { validateCustomerFile } from "@/commands/validate-customer-file.js";

const program = new Command();

program
  .command("validate-customer-file")
  .description("Validate the given CSV customer file")
  .argument("<file>", "Path to CSV customer file")
  .action((file: string) => validateCustomerFile(file));

program
  .command("generate-codes")
  .description("Validate the given CSV customer file")
  .option("-p, --prefix <string>", "Optional prefix for codes")
  .option("-e, --expires <string>", "Optional expiry date in ISO 8601 format")
  .requiredOption("-i, --input <string>", "Input path for CSV customer file")
  .requiredOption("-o, --output <string>", "Output path for CSV codes file")
  .action((args: { input: string; output: string }) => generateCodes(args));

await program.parse();
