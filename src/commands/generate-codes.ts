import { generateCode } from "@/lib/codes.js";

import {
  writeCodesFile,
  parseCustomerFile,
  validateCustomers,
} from "@/lib/csv.js";

export function generateCodes({
  input,
  output,
  prefix,
  expires,
}: {
  input: string;
  output: string;
  prefix?: string;
  expires?: string;
}) {
  // Parse customers from CSV file.
  const customers = parseCustomerFile(input);

  // Validate customers.
  validateCustomers(customers);

  // Loop customers and append codes.
  const customersWithGiftCards = customers.map((customer) => ({
    ...customer,
    code: generateCode({ prefix }),
    expires: expires ?? null,
  }));

  // Write codes to file.
  writeCodesFile(output, customersWithGiftCards);

  // Finish.
  console.log(`${customers.length} codes written to file.`);
}
