# Shopify Gift Card Generator

![GitHub License](https://img.shields.io/github/license/dangreaves/shopify-gift-card-generator)

CLI tool for generating Shopify gift cards from CSV files.

> [!CAUTION]
> To enable detection of duplicates, this tool uses the [Sync API](https://csv.js.org/parse/api/sync) for CSV parsing, not the streaming API. This means that your import CSV must be small enough to fit into memory. If your CSV is too big, consider breaking it up into smaller files.
