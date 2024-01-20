import { config } from "dotenv";
config();

import { AddressInfo } from "node:net";
/**
 * Module dependencies.
 */
import { app } from "./app";
import { createServer } from "http";

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT ?? "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */
const server = createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);

server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: Error) {
  if ("syscall" in error && error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  if (!("code" in error)) {
    throw error;
  }

  const { code } = error;
  // handle specific listen errors with friendly messages
  switch (code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr: string | AddressInfo | null = server.address();
  const bind =
    typeof addr === "string"
      ? "pipe " + addr
      : "port " + addr?.port ?? "[NOT SPECIFIED]";
  console.log("App started. Listening on " + bind);
}
