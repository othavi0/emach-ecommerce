import { spawn } from "node:child_process";
import { createServer } from "node:net";

function isPortFree(port) {
	return new Promise((resolve) => {
		const server = createServer();
		server.once("error", () => resolve(false));
		server.once("listening", () => {
			server.close();
			resolve(true);
		});
		server.listen(port, "0.0.0.0");
	});
}

async function findPort(start, maxTries = 10) {
	for (let port = start; port < start + maxTries; port++) {
		if (await isPortFree(port)) {
			return port;
		}
	}
	return start;
}

const port = await findPort(3001);
if (port !== 3001) {
	process.stdout.write(`Porta 3001 ocupada — usando ${port}\n`);
}

const proc = spawn("next", ["dev", "--port", String(port)], {
	stdio: "inherit",
	shell: false,
});

proc.on("exit", (code) => process.exit(code ?? 0));
