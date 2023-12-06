import z from "zod";
import fs from "node:fs";
import { parse } from "csv-parse/sync";

/**
 * Parse the given CSV customer file.
 *
 * This file should contain the following fields:
 *   - first_name
 *   - last_name
 *   - email
 *   - amount
 */
export function parseCustomerFile(file: string) {
  const buffer = fs.readFileSync(file);

  let records = parse(buffer, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
  });

  for (const record of records) {
    const result = CustomerSchema.safeParse(record);

    if (!result.success) {
      console.error("Record failed validation", record);
      throw result.error;
    }
  }

  return records as Customer[];
}

const CustomerSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().min(1).email(),
  amount: z.coerce.number(),
});

type Customer = z.infer<typeof CustomerSchema>;

/**
 * Validate the given customers for correctness.
 */
export function validateCustomers(customers: Customer[]) {
  // Calculate how many times each email appears in the list.
  const emailCounts = customers.reduce(
    (acc, customer) => {
      const currentCount =
        acc.find(({ email }) => email === customer.email)?.count ?? 0;

      return [
        ...acc.filter(({ email }) => email !== customer.email),
        { email: customer.email, count: currentCount + 1 },
      ];
    },
    [] as { email: string; count: number }[],
  );

  // Throw error when emails appear multiple times.
  const duplicateEmails = emailCounts.filter(({ count }) => 1 < count);
  if (0 < duplicateEmails.length) {
    throw new Error(
      `Found ${duplicateEmails.length} duplicate emails: ${duplicateEmails
        .map(({ email }) => email)
        .join(", ")}`,
    );
  }

  // Count emails in each amount group.
  const amountGroups = customers.reduce(
    (acc, customer) => {
      const currentCount =
        acc.find(({ amount }) => amount === customer.amount)?.count ?? 0;

      return [
        ...acc.filter(({ amount }) => amount !== customer.amount),
        { amount: customer.amount, count: currentCount + 1 },
      ];
    },
    [] as { amount: number; count: number }[],
  );

  // Return summary
  return {
    amountGroups,
    totalCustomers: customers.length,
  };
}
