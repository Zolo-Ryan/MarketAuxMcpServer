import { z } from "zod";

const newsSearchInputSchema = z.object({
  symbols: z
    .string()
    .describe(
      "Specify entity symbol(s) which have been identified within the article."
    )
    .optional(),
  entity_types: z
    .string()
    .describe(
      "Specify the type of entities which have been identified within the article"
    )
    .optional(),
  industries: z
    .string()
    .describe(
      "Specify the industries of entities which have been identified within the article."
    )
    .optional(),
  countries: z
    .string()
    .describe(
      "Specify the country of the exchange of which entities have been identified within the article."
    )
    .optional(),
  language: z
    .string()
    .describe("Comma separated list of languages to include. Default is all.")
    .optional(),
  published_before: z
    .string()
    .describe("Find all articles published before the specified date.")
    .optional(),
  published_after: z
    .string()
    .describe("Find all articles published after the specified date.")
    .optional(),
  published_on: z
    .string()
    .describe("Find all articles published on the specified date.")
    .optional(),
});

export class SearchAllNewsTool {
  public readonly name = "market_aux_news_search";
  public readonly description =
    "Search comprehensive market and financial news with advanced filtering options. Find news articles by stock symbols, entity types, industries, countries, languages, and date ranges. Perfect for market research, investment analysis, and staying updated on specific financial entities or market sectors.";
  public readonly inputSchema = newsSearchInputSchema;
  private searchAll: string;
  private similarSearch: string;

  constructor(all_news_api: string, similar_news_api: string) {
    this.searchAll = all_news_api;
    this.similarSearch = similar_news_api;
    console.error("This is searchAll:", all_news_api);
  }

  public async executeSearchAll(input: z.infer<typeof newsSearchInputSchema>) {
    const {
      industries,
      symbols,
      countries,
      entity_types,
      language,
      published_before,
      published_after,
      published_on,
    } = input;

    try {
      // Start with base URL (don't modify the original)
      let searchUrl = this.searchAll;

      // Add string parameters
      if (symbols) searchUrl += `symbols=${encodeURIComponent(symbols)}&`;
      if (entity_types)
        searchUrl += `entity_types=${encodeURIComponent(entity_types)}&`;
      if (industries)
        searchUrl += `industries=${encodeURIComponent(industries)}&`;
      if (countries) searchUrl += `countries=${encodeURIComponent(countries)}&`;
      if (language) searchUrl += `language=${encodeURIComponent(language)}&`;

      // Add date parameters (pass strings directly to API)
      if (published_before) {
        searchUrl += `published_before=${encodeURIComponent(
          published_before
        )}&`;
      }

      if (published_after) {
        searchUrl += `published_after=${encodeURIComponent(published_after)}&`;
      }

      if (published_on) {
        searchUrl += `published_on=${encodeURIComponent(published_on)}&`;
      }

      // Remove trailing '&' if present
      searchUrl = searchUrl.replace(/&$/, "");

      console.error("Final search URL:", searchUrl);

      const results = await fetch(searchUrl);
      if (!results.ok) {
        throw new Error(
          `API request failed with status ${results.status}: ${results.statusText}`
        );
      }

      const finalResult = await results.json();

      // Check if API returned an error
      if (finalResult.error) {
        throw new Error(`API Error: ${finalResult.error}`);
      }

      const text = JSON.stringify(finalResult.data, null, 2);

      return { content: [{ type: "text" as const, text }] };
    } catch (error) {
      console.error("Error while executing executeSearchAll:", error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Error searching news: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  }
}
