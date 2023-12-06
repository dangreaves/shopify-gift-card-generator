import { Command } from "commander";

import { validateCustomerFile } from "@/commands/validate-customer-file.js";

const program = new Command();

program
  .command("validate-customer-file")
  .description("Validate the given CSV customer file")
  .argument("<file>", "Path to CSV customer file")
  .action((file: string) => validateCustomerFile(file));

await program.parse();
