import { Command } from "../types/Command";
import getNotes from "../lib/getNotes";
import { PREFIX } from "../config";
import prisma from "../prisma";
import { Message } from "whatsapp-web.js";

let matricula_regex = /^\d{9}-\d{1}$/;

export default {
  name: "calificaciones",
  alias: ["c", "calificacion"],
  description: "Obten tus calificaciones por tu nombre completo o matricula.",
  usage: `${PREFIX}calificaciones <Nombre completo> | ${PREFIX}calificaciones <MATRICULA>`,
  async run(client, message, args) {
    await message.reply(`*⚠️ Base de datos del año 2023 ⚠️*`);

    let student;

    // --- Buscar por matrícula ---
    if (args.length < 2) {
      let content = args.join(" ").trim();
      if (!content || content.length !== 11 || !matricula_regex.test(content)) {
        await message.reply(
          "Introduce una matrícula válida. Ejemplo: 123456789-0"
        );
        return;
      }

      student = await prisma.students.findFirst({
        where: { id: content },
      });

      if (!student) {
        await message.reply(`No se encontró un alumno con esta matrícula.`);
        return;
      }

      await message.react("🕓");
    }

    // --- Buscar por nombre ---
    if (args.length >= 2) {
      let nombre = args.join(" ").trim();

      student = await prisma.students.findFirst({
        where: {
          full_name: {
            contains: nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            mode: "insensitive",
          },
        },
      });

      if (!student) {
        await message.reply(`No se encontró un alumno con ese nombre.`);
        return;
      }

      await message.reply(`Buscando resultados para *${student.full_name}*`);
      await message.react("🕓");
    }

    if (!student) {
      await message.reply(`No se encontró el alumno.`);
      return;
    }

    let studentData = await getNotes(student.id, student.curp);

    await message.reply(
      `*${studentData.semesters.length} semestres disponibles*\n` +
        `Responde con el número del semestre o "todas".`
    );

    // --- Escuchar solo al mismo usuario y en el mismo chat ---
    const filterChat = (await message.getChat()).id._serialized;
    const filterAuthor = (await message.getContact()).id._serialized;

    const handler = async (msg: Message) => {
      let msgAuthor = await msg.getContact();
      let msgChat = await msg.getChat();

      // DEBUG
      // console.log({
      //   filterAuthor,
      //   filterChat,
      //   isSameChat: msgChat.id._serialized === filterChat,
      //   isSameAuthor: msgAuthor.id._serialized === filterAuthor,
      // });

      if (
        msgChat.id._serialized !== filterChat ||
        msgAuthor.id._serialized !== filterAuthor
      ) {
        return;
      }

      let content = msg.body.trim();
      let chat = await msg.getChat();

      let user = (await msg.getContact()).id.user;

      if (content.toLowerCase() === "todas") {
        for (const semester of studentData.semesters) {
          for (const subject of semester.subjects) {
            await chat.sendMessage(
              `*🗒️ | Semestre ${semester.semester}*\n\n` +
                `> *📖 Materia*\n    ${subject.subject_name}\n\n` +
                `> *🧑‍🏫 Docente*\n    ${subject.teacher_name}\n\n` +
                `> *💯 Calificación*\n    ${subject.score}%` +
                `\n\n@${user}`,
              { mentions: [user + "@c.us"] }
            );
          }
        }
        client.removeListener("message_create", handler);
        return;
      }

      if (
        !isNaN(Number(content)) &&
        Number(content) <= studentData.semesters.length &&
        Number(content) > 0
      ) {
        let semester = studentData.semesters[Number(content) - 1];
        for (const subject of semester.subjects) {
          await chat.sendMessage(
            `*🗒️ | Semestre ${semester.semester}*\n\n` +
              `> *📖 Materia*\n    ${subject.subject_name}\n\n` +
              `> *🧑‍🏫 Docente*\n    ${subject.teacher_name}\n\n` +
              `> *💯 Calificación*\n    ${subject.score}%` +
              `\n\n@${user}`,
            { mentions: [user + "@c.us"] }
          );
        }
        client.removeListener("message_create", handler);
      }
    };

    client.on("message_create", handler);
  },
} as Command;
