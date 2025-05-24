import { z } from "zod";

const newsSearchInputSchema = z.object({
  industries: z.string().describe("Search by industry like metal, software").optional(),
  symbols: z.string().describe("Search by stock symbols").optional(),
  countries: z.string().describe("search by country code").optional(),
});

export class NewsTool {
  public readonly name = "market_aux_news_search";
  public readonly description = "used to search market news about the asked shit.";
  public readonly inputSchema = newsSearchInputSchema;
  private searchAll: string;
  private similarSearch: string;

  constructor(all_news_api: string, similar_news_api: string) {
    this.searchAll = all_news_api;
    this.similarSearch = similar_news_api;
    console.error("This is searchAll:",all_news_api);
  }

  public async executeSearchAll(input: z.infer<typeof newsSearchInputSchema>) {
    const { industries, symbols, countries } = input;
    try {
      if (industries)
        this.searchAll = this.searchAll + `industries=${industries}&`;
      if (symbols) this.searchAll = this.searchAll + `symbols=${symbols}&`;
      if (countries) this.searchAll = this.searchAll + `countries=${countries}`;
      console.error("this is url:" + this.searchAll);

      const results = await fetch(this.searchAll);
      if (!results.ok)
        throw new Error("No result recieved from search all news api");
      const finalResult = await results.json();
      const text = JSON.stringify(finalResult.data);
      
      return { content: [{ type: "text" as const, text }] };
    } catch (error) {
      console.error("Error while executing executeSearchAll: ", error);
      return {
        content: [
          {
            type: "text" as const,
            text: error as string,
          },
        ],
      };
    }
  }
}
