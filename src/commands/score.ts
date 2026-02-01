import { Command } from "../types/Command";
import getNotes from "../lib/getNotes";
import { PREFIX } from "../config";
import { prisma } from "../prisma";
import { Message } from "whatsapp-web.js";

let matricula_regex = /^\d{9}-\d{1}$/;

export default {
  name: "score",
  alias: ["s", "porcentaje"],
  description: "Obten tus calificaciones por tu nombre completo o matricula.",
  usage: `${PREFIX}calificaciones <Nombre completo> | ${PREFIX}calificaciones <MATRICULA>`,
  async run(client, message, args) {
    message.reply(`*⚠️ Base de datos del año 2023 ⚠️*`);
    let student;
    if (args.length < 2) {
      let content = args.join(" ").trim();
      if (!content || content.length !== 11 || !matricula_regex.test(content)) {
        message.reply(
          "Introduce una matricula valida. Se compone de 9 números, un guión y un último número. Como 123456789-0"
        );
        return;
      }

      student = await prisma.students.findFirst({
        where: {
          id: content,
        },
      });

      if (!student) {
        message.reply(`No se encontro un alumno con esta matricula.`);
        return;
      }

      await message.react("🕓");
    }
    if (args.length >= 2) {
      let nombre = args.join(" ").trim();

      student = await prisma.students.findFirst({
        where: {
          full_name: {
            contains: nombre,
            mode: "insensitive",
          },
        },
      });

      if (!student) {
        message.reply(`No se encontró un alumno con ese nombre.`);
        return;
      }
      await message.reply(
        "Buscando resultados para *" + student.full_name + "*"
      );
      await message.react("🕓");
    }

    if (!student) {
      message.reply(`No se encontró el alumno.`);
      return;
    }

    let notes = await getNotes(student.id.trim(), student.curp.trim());

    let total = 0;
    let count = 0;

    for (let semester of notes.semesters) {
      for (let subject of semester.subjects) {
        if (subject.score > 0) {
          // 👈 ignoramos materias con 0
          total += subject.score;
          count++;
        }
      }
    }

    const average = count > 0 ? total / count : 0;

    let chat = await message.getChat();
    client.sendMessage(
      chat.id._serialized,
      `*${notes.student.full_name}*\nPromedio: *${average}%*`
    );
  },
} as Command;
