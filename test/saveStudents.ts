import * as ExcelJS from "exceljs";
import { prisma } from "../src/prisma";

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("./correos.xlsx");

  const sheet = workbook.getWorksheet("Hoja1");

  let grupos = sheet?.columns[0].values?.map((value) => value);
  const grupos_3er = grupos?.filter(
    (grupo) => typeof grupo === "string" && grupo.startsWith("40")
  );
  const rows = sheet?.getRows(1, sheet.rowCount);

  const datos = rows
    ?.map((row) => row._cells.map((c) => c._value.toString()))
    .filter((row) => row[0].startsWith("40"));

  datos?.forEach(
    async ([
      grupo,
      matricula,
      apellido_p,
      apellido_m,
      nombres,
      correo,
      curp,
    ]: string[]) => {
      console.log(`Guardando el alumno: ${nombres} del grupo ${grupo}`);
      await prisma.students.create({
        data: {
          curp,
          email: correo,
          first_name: nombres,
          full_name: [nombres.trim(), apellido_p.trim(), apellido_m.trim()]
            .join(" ")
            .trim(),
          group: grupo,
          id: matricula,
          last_names: apellido_p,
        },
      });
    }
  );
}

main();
