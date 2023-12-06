import { generateCode } from "@/lib/codes.js";

import {
  writeGiftCardFile,
  parseCustomerFile,
  validateCustomers,
  type CustomerWithGiftCard,
} from "@/lib/csv.js";

export function generateGiftCards({
  note,
  input,
  output,
  prefix,
  expires,
}: {
  note?: string;
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
  const customersWithGiftCards: CustomerWithGiftCard[] = customers.map(
    (customer) => ({
      ...customer,
      code: generateCode({ prefix }),
      expires: expires ?? null,
      note: note ?? null,
    }),
  );

  // Write codes to file.
  writeGiftCardFile(output, customersWithGiftCards);

  // Finish.
  console.log(`${customers.length} gift cards written to file.`);
}
