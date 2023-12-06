# Shopify Gift Card Generator

![GitHub License](https://img.shields.io/github/license/dangreaves/shopify-gift-card-generator)

CLI tool for generating Shopify gift cards from CSV files.

> [!CAUTION]
> To enable detection of duplicates, this tool uses the [Sync API](https://csv.js.org/parse/api/sync) for CSV parsing, not the streaming API. This means that your import CSV must be small enough to fit into memory. If your CSV is too big, consider breaking it up into smaller files.

## Preparing customer file

You must prepare a CSV containing the customers and amounts for the generated gift cards.

It should include the following fields.

| Field      | Description                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| first_name | First name for customer. This will be used to create the customer if a customer with this email does not already exist. |
| last_name  | First name for customer. This will be used to create the customer if a customer with this email does not already exist. |
| email      | Email address for customer. Must be unique within the CSV.                                                              |
| amount     | Money amount for the gift card.                                                                                         |

## Generating gift cards

```zsh
# Install dependencies
npm install

# Validate CSV customer file.
npm start -- validate-customer-file ./path/to/file.csv
```
