import { PREFIX } from "../config";
import { Command } from "../types/Command";
import prisma from "../prisma";
import ms, { StringValue } from "ms";
import { Message } from "whatsapp-web.js";

type Subcommand = "CREAR" | "ELIMINAR" | "LISTA";

export default {
  name: "tarea",
  alias: ["tarea"],
  description: "Ver tareas pendientes.",
  usage: `${PREFIX}tarea [crear|eliminar|lista] TITULO\n...CONTENIDO`,
  run: async (client, message, args) => {
    const subcommand = args.shift()?.toLowerCase().trim();
    const content = args.join(" ").split("\n");

    const title = content.shift();
    const body = content.join("\n").trim();

    let homeworkObject: {
      [key: string]: any;
    } = {
      limit: Date.now() + ms("1d"),
    };

    if (!subcommand)
      return message.reply(`Especifica la accion: crear | eliminar | lista.`);

    switch (subcommand.toUpperCase().trim() as Subcommand) {
      case "CREAR":
        if (!title)
          return message.reply(
            `Debes asignar un titulo a la tarea.\n*Ejemplo:*\n\n\`${PREFIX}tarea crear Quimica: Investigacion\`\n\n\`Investigar sobre la evolucion\``
          );

        homeworkObject.title = title;
        homeworkObject.content = body ?? "";

        // Ask to user the limit of the homework.
        message.reply(
          `Escribe a continuación el limite de tiempo para la tarea.\n\n*Ejemplos:*\n1 dia -> \`1d\`\n1 semana -> \`7d\``
        );

        const filterChat = (await message.getChat()).id._serialized;
        const filterAuthor = (await message.getContact()).id._serialized;

        const handler = async (msg: Message) => {
          let msgAuthor = await msg.getContact();
          let msgChat = await msg.getChat();

          if (
            msgChat.id._serialized !== filterChat ||
            msgAuthor.id._serialized !== filterAuthor
          )
            return; // Ignorar mensajes de otros usuarios o chats
          try {
            homeworkObject.limit = new Date(
              Date.now() + ms((msg.body.trim() ?? "1d") as StringValue)
            );
          } catch (err) {
            console.log(err);
          }

          let homework = await prisma.homeworks.create({
            data: {
              title: homeworkObject.title,
              content: homeworkObject.content,
              limit: homeworkObject.limit,
              status: "PENDING",
            },
          });

          await message.reply(
            `*Tarea creada*\n\n*Titulo:* ${homework.title}\n*Descripción:* ${
              homework.content
            }\nLimite: ${
              homework.limit
                ? new Date(homework.limit.getTime()).toLocaleString()
                : "Indefinido."
            }`
          );

          client.removeListener("message_create", handler);
        };

        client.on("message_create", handler);
        break;
      default:
        return message.reply(`Acción inválida.`);
    }
  },
} as Command;
