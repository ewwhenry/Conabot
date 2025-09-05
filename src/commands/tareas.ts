import { PREFIX } from "../config";
import { Command } from "../types/Command";

export default {
  name: "tareas",
  description: "Ver tareas pendientes.",
  usage: `${PREFIX}tareas`,
  run: (client, message, args) => {},
} as Command;
