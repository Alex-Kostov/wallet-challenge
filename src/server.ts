import http from 'http';
import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer(async (req, res) => {
	// Set API endpoints
	// Login
	if (req.url === "/auth/login" && req.method === "GET") {
		//response headers
		res.writeHead(200, { "Content-Type": "application/json" });
		//set the response
		res.write("Hi there, This is a Vanilla Node.js API");
		//end the response
		res.end();
	}

	// Logout
	if (req.url === "/auth/logout" && req.method === "GET") {
		//response headers
		res.writeHead(200, { "Content-Type": "application/json" });
		//set the response
		res.write("Hi there, This is a Vanilla Node.js API");
		//end the response
		res.end();
	}

	// Balance
	if (req.url === "/users/balance" && req.method === "GET") {
		//response headers
		res.writeHead(200, { "Content-Type": "application/json" });
		//set the response
		res.write("Hi there, This is a Vanilla Node.js API");
		//end the response
		res.end();
	}

	// Wallet list
	if (req.url === "/wallet/list" && req.method === "GET") {
		//response headers
		res.writeHead(200, { "Content-Type": "application/json" });
		//set the response
		res.write("Hi there, This is a Vanilla Node.js API");
		//end the response
		res.end();
	}

	// Wallet Withdraw
	if (req.url === "/wallet/withdraw" && req.method === "GET") {
		//response headers
		res.writeHead(200, { "Content-Type": "application/json" });
		//set the response
		res.write("Hi there, This is a Vanilla Node.js API");
		//end the response
		res.end();
	}

	// If no route present
	else {
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ message: "Route not found" }));
	}
});

server.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});