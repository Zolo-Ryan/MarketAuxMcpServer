import 'dotenv/config'
import { MarketMcpServer } from './server.js';
const MARKETAUX_API_KEY = process.env.MARKETAUX_API_KEY;

if(!MARKETAUX_API_KEY){
  console.error("Env not working properly");
  process.exit(1);
}

const marketMcpServer = new MarketMcpServer(MARKETAUX_API_KEY);
marketMcpServer.start().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
})