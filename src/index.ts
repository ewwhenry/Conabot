import { LocalAuth } from "whatsapp-web.js";
import * as qrcode from "qrcode-terminal";
import { SERIALIZED_ID, PREFIX, COMMANDS_PATH } from "./config";
import * as fs from "fs";
import * as path from "path";
import { Command } from "./types/Command";
import { Client } from "./core/Client";

const client = new Client({
  authStrategy: new LocalAuth(),
});

async function registerCommands(commands_path: string) {
  const commandFiles = fs.globSync(
    path.join(process.cwd(), commands_path) + "/**/*.ts"
  );

  for (let commandFile of commandFiles) {
    let command = ((await import(commandFile)) as { default: Command }).default;

    client.commands.set(command.name, command);
  }
}

client.once("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  console.log("QR recibido:", qr);
  qrcode.generate(qr, { small: true }, (qrcode) => console.log(qrcode));
});

client.on("message_create", async (m) => {
  if (!m.body.trim().startsWith(PREFIX)) return;

  let args = m.body.slice(PREFIX.length).split(/ +/g);
  let commandName = args.shift()?.toLowerCase();

  if (!commandName) return;

  let command =
    client.commands.get(commandName) ||
    Array.from(client.commands.values()).find((x) =>
      x.alias?.includes(commandName)
    );

  if (!command) {
    await m.reply("Comando desconocido.");
    return;
  }

  command.run(client, m, args);
});

registerCommands(COMMANDS_PATH);

client.initialize();
