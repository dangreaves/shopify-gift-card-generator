import { parseCustomerFile, validateCustomers } from "@/lib/csv.js";

export function validateCustomerFile(file: string) {
  // Parse customers from CSV file.
  const customers = parseCustomerFile(file);

  // Validate customers.
  const { amountGroups, totalCustomers } = validateCustomers(customers);

  // Output summary.
  console.log(`Found ${totalCustomers} total customers.`);
  for (const amountGroup of amountGroups) {
    console.log(
      `Found ${amountGroup.count} customers for amount ${amountGroup.amount}.`,
    );
  }

  // Finish.
  console.log(`\nCustomer file validated.`);
}
