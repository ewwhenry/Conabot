import { PREFIX } from "../config";
import { Command } from "../types/Command";

export default {
  name: "hola",
  description:
    "Comando inicial, te digo de que va el bot, para que sirve y como empezar a usarlo.",
  usage: `${PREFIX}hola`,
  async run(client, message, args) {
    const commands: string = Array.from(client.commands.values())
      .map(
        (x) =>
          `- *${PREFIX}${x.name}*: ${x.description}\n\t\t\tuso: \`${x.usage}\``
      )
      .join("\n\n");

    message.reply(
      `*Hola!*\n\nGracias por usar el bot. Este bot está creado con el fin de hacer procesos frecuentes de forma más sencillas y rapidas.\nAquí hay algunos comandos:\n\n` +
        commands +
        "\n\n⚠️⚠️⚠️\n*El bot solo responde a mensajes que empiecen con el prefijo, el cual es `" +
        PREFIX +
        "`, si tu mensaje no empieza con el prefijo, no sera tomado en cuenta.*"
    );
  },
} as Command;
