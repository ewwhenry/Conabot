import { PREFIX } from "../config";
import { Command } from "../types/Command";

export default {
  name: "help",
  alias: ["ayuda", "h"],
  description:
    "Comando de ayuda, da informacion general sobre como usar el bot.",
  usage: `${PREFIX}help`,
  async run(client, message, _args) {
    const commands: string = Array.from(client.commands.values())
      .map(
        (x) =>
          `- *${PREFIX}${x.name}*: ${x.description}\n\t\t\tuso: \`${x.usage}\``
      )
      .join("\n\n");

    message.reply(
      `*Lista de comandos*\n\n` +
        commands +
        "\n\n⚠️⚠️⚠️\n*El bot solo responde a mensajes que empiecen con el prefijo, el cual es `" +
        PREFIX +
        "`, si tu mensaje no empieza con el prefijo, no sera tomado en cuenta.*"
    );
  },
} as Command;
