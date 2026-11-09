/** Temporary Hostinger runtime diagnostic. No MCP tools and no authorization bypass. */
import {createServer} from 'node:http';
const port = Number(process.env.PORT || 3000);
const server = createServer((req,res) => {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200);
    return res.end(JSON.stringify({service:'instagram-agent',auth:'locked',ready:false,diagnostic:true}));
  }
  res.writeHead(503);
  res.end(JSON.stringify({error:'MCP_AUTH_NOT_CONFIGURED'}));
});
server.listen(port,'0.0.0.0',()=>console.info('Isolated Instagram diagnostic listener started',port));
process.on('SIGTERM',()=>server.close(()=>process.exit(0)));
