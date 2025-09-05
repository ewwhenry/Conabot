import puppeteer from "puppeteer";
import prisma from "../prisma";
import type { Output, Semester, Subject } from "../types/Structures";

export default async function getNotes(
  matricula: string,
  curp: string
): Promise<Output> {
  const student = await prisma.students.findFirst({ where: { id: matricula } });
  console.log({
    student,
  });
  const browser = await puppeteer.launch({
    timeout: 60_000,
  });
  const page = await browser.newPage();

  await page.goto("https://alumno.conalep.edu.mx/saac");
  await page.waitForSelector("input#inputMatricula");
  await page.type("input#inputMatricula", matricula);
  await page.waitForSelector("input#inputCurp");
  await page.type("input#inputCurp", curp);

  await page.waitForSelector("button.btn.btn-primary");
  await page.click("button.btn.btn-primary");

  await page.waitForNavigation();
  await page.goto(
    "https://alumno.conalep.edu.mx/saac/home/academico/historial/"
  );

  await page.waitForSelector('div[role="tabpanel"] div.col-xs-12');
  const tables = await page.evaluate((student) => {
    let semesters = document.querySelectorAll(
      'div[role="tabpanel"] div.col-xs-12'
    );
    let res: Semester[] = [];
    for (let i = semesters.length - 1; i >= 0; i--) {
      let table = semesters.item(i).querySelector("table")!.innerText;

      let subjects: Subject[] = table
        .split("\n")
        .slice(1, table.split("\n").length)
        .map((line) => {
          const [materia, docente, calendario, periodo_escolar, calificacion] =
            line.split("\t");

          return {
            period: periodo_escolar,
            score:
              isNaN(Number(calificacion)) && calificacion.trim() === "A"
                ? 100
                : Number(calificacion) * 10,
            subject_name: materia,
            teacher_name: docente,
          };
        });

      res.push({
        semester: semesters.length - i,
        cicle: subjects[0].period,
        subjects,
      });
    }

    return {
      student: student,
      semesters: res,
    } as Output;
  }, student);

  await browser.close();
  return tables;
}
