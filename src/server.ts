import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SearchAllNewsTool } from "./tools/SearchAllNewsTool.js";

export class MarketMcpServer {
  private server: McpServer;
  private all_news_api: string;
  private similar_news_api: string;
  private SearchAllNewsTool: SearchAllNewsTool;

  constructor(private marketaux_api_key: string) {
    this.all_news_api = `https://api.marketaux.com/v1/news/all?api_token=${marketaux_api_key}&`;
    this.similar_news_api = `https://api.marketaux.com/v1/news/similar?api_token=${marketaux_api_key}&`;
    this.server = new McpServer({
      name: "News Mcp server",
      version: "0.0.1",
      capabilities: {
        resources: {},
        tools: {},
      },
    });
    this.SearchAllNewsTool = new SearchAllNewsTool(this.all_news_api, this.similar_news_api);
    this.setupTools();
  }
  private setupTools(): void {
    this.server.tool(
      this.SearchAllNewsTool.name,
      this.SearchAllNewsTool.description,
      this.SearchAllNewsTool.inputSchema.shape, // Remove .shape
      async (input) => {
        return await this.SearchAllNewsTool.executeSearchAll(input); // Proper binding
      }
    );
  }
  public async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("MarketAux MCP Server running on stdio");
  }
  public log(
    message: string,
    level: "error" | "debug" | "info" | "warning"
  ): void {
    this.server.server.sendLoggingMessage({
      level,
      message,
    });
  }
}
