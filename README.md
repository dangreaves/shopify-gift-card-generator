# CLI tool for generating Shopify gift cards from CSV files

![GitHub License](https://img.shields.io/github/license/dangreaves/shopify-gift-card-generator)

This CLI generates gift card codes from a CSV containing recipient email addresses. Those generated codes are then mass imported into Shopify using the [Shopify Admin API](https://shopify.dev/docs/api/admin-graphql).

## Motivation

In Shopify, it's not possible to mass create gift cards and see their codes prior to activation.

Sometimes, it's useful to get a list of the generated codes such that you can prepare custom emails from your marketing software, prior to activating the codes in Shopify.

This script allows you to import a list of customers, each with a desired gift card amount. For those customers, you can then generate a list of codes which is output into a separate file. You can use this file however you like, for example to import into your email tool and generate emails.

Then, when you're ready to actually create the gift cards in Shopify, run the import command which will take the generated codes and create them in Shopify. Optionally, you may suppress the generic gift card email which Shopify usually sends to the customer.

## Usage

1. [Install dependencies](#install-dependencies)
2. [Prepare customer file](#prepare-customer-file)
3. [Validate customer file](#validate-customer-file)
4. [Generate gift cards](#generate-gift-cards)
5. [Import gift cards](#import-gift-cards)

### Install dependencies

After cloning this repo, install dependencies using npm.

```sh
npm install
```

### Prepare customer file

You must prepare a CSV containing the customers and amounts for the generated gift cards. The customer emails are used to lookup the customer record in Shopify. If the customer does not exist, then it's created using the name attributes.

| Attribute  | Description                                                |
| ---------- | ---------------------------------------------------------- |
| first_name | First name for customer.                                   |
| last_name  | Last name for customer.                                    |
| email      | Email address for customer. Must be unique within the CSV. |
| amount     | Money amount for the gift card.                            |

To enable detection of duplicates, this tool uses the [Sync API](https://csv.js.org/parse/api/sync) for CSV parsing, not the streaming API. This means that your import CSV must be small enough to fit into memory. If your CSV is too big, consider breaking it up into smaller files.

### Validate customer file

It's advised to validate that your customer CSV file is ready to be imported. This command will check that the attribute names are correct, and that there are no duplicates. It will output a summary on completion.

```sh
npm start -- validate-customer-file ./path/to/customers.csv
```

### Generate gift cards

This command will take your customer CSV file, generate a unique gift card code for each one, and generate a new CSV file which is equal to your customer CSV file, but with additional `code`, `expires` and `note` attributes.

You may optionally provide a `--prefix` option, which will prefix the generated code with a static string. The tool will automatically remove ambiguous characters (like `1` and `I`) from the code. You should keep this as a short as possible, as the code can only be 20 characters long. The longer your prefix, the more likely you will generate a conflicting code.

You may optionally provide a `--expires` attribute, which must be a date in ISO 8601 format. If you leave this blank, the `expires` column in the resulting CSV will be empty.

You may optionally provide a `--note` attribute, which will set a private note on the gift card in Shopify. It's recommended that you use this to explain why the gift card was created.

```sh
npm start -- generate-gift-cards \
--input ./path/to/customers.csv \
--output ./path/to/gift-cards.csv \
--prefix "SUMMER" \
--expires "2023-01-01" \
--note "Summer VIP giveaway"
```

You may use the resulting file for creating personalized emails for your gift card recipients, and other marketing activity which would not be possible unless you knew the gift card codes.

### Import gift cards

When you are ready to import the codes into Shopify, run the import command using the CSV file generated in the previous step.

By default, Shopify will send a generic "You have a gift card" email to the customer when the gift card is created. If you would like to suppress this email (because you plan to send the codes in another way), use the `--suppress-email` option.

This works by creating the gift card without a customer first, and then attaching it to the customer in a second API request. When created like this, Shopify does not notify the customer.

You need to provide a Shopify access token with the `write_customers` and `write_gift_cards` scopts for the `--token` attribute. See the [Obtaining a Shopify access token](#obtaining-a-shopify-access-token) section if you're not sure how to do that.

The command will output a results file in CSV format, which is the same as your input gift cards file, but with additional `customer_id`, `gift_card_id` and `error` columns. You should review this file after the command completes to check that all the gift cards were created successfully.

```sh
npm start -- import-gift-cards \
--input ./path/to/gift-cards.csv \
--output ./path/to/results.csv \
--token ACCESS_TOKEN \
--shopify-domain foo.myshopify.com \
--suppress-email
```

## Obtaining a Shopify access token

Shopify regularly update this process, so here's a quick guide for creating a token.

1. Login to your Shopify admin
2. Click "Settings" in the bottom left
3. Click "Apps and sales channels" in the left column
4. Click "Develop apps" in the top right
5. Click "Create an app"
6. Enter something description for the app name, like "Shopify Gift Card Generator"
7. Select yourself as the app developer
8. Click the "Configure Admin API scopes" button
9. Enable `write_customers`, `read_customers`, `write_gift_cards` and `read_gift_cards`
10. Click the "Save" button in the top right
11. Click the "Install app" button in the top right
12. Click the "Install" button in the popup
13. On the "API credentials" tab, click "Reveal token once"
14. Copy the token, and store it somewhere safe (it should begin with `shpat_`)

When you are done with this tool, you should delete your access token.

1. Click the "Uninstall app" button in the top right
2. Click the "Uninstall" button in the popup
3. Click on the "App settings" tab
4. Click the "Delete app" button at the bottom
5. Click the "Delete" button in the popup
