import { Command } from "../types/Command";
import getNotes from "../lib/getNotes";
import { PREFIX } from "../config";
import prisma from "../prisma";
import { Message } from "whatsapp-web.js";

let matricula_regex = /^\d{9}-\d{1}$/;

export default {
  name: "calificaciones",
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

    let studentData = await getNotes(student.id, student.curp);

    await message.reply(
      `Hay calificaciones de ${studentData.semesters.length} semestres, De cual semestre quieres obtenerlas? numero del 1 al ${studentData.semesters.length} o "todas" para obtener todas (puede resultar molesto).`
    );

    client.once("message_create", async (msg: Message) => {
      if (msg.from !== message.from || msg.to !== message.to) return;

      let content = msg.body;
      if (content.trim() === "todas") {
        studentData.semesters.forEach(async (semester, i) => {
          semester.subjects.forEach(async (c: any) => {
            client.sendMessage(
              (await message.getChat()).id._serialized,
              `*SEMESTRE ${i + 1}*\n\n*Materia:* ${c.materia}\n*Docente:* ${
                c.docente
              }\n*Calificacion:* ${c.calificacion}`
            );
          });
        });
      }

      if (
        !isNaN(Number(content)) &&
        Number(content) <= studentData.semesters.length &&
        Number(content) > 0
      ) {
        studentData.semesters[Number(content) - 1].subjects.forEach(
          async (subject) => {
            client.sendMessage(
              (await message.getChat()).id._serialized,
              `*SEMESTRE ${Number(content)}*\n\n*Materia:* ${
                subject.subject_name
              }\n*Docente:* ${subject.teacher_name}\n*Calificacion:* ${
                subject.score
              }`
            );
          }
        );
      }
    });
  },
} as Command;
