import { Message } from "whatsapp-web.js";
import { Client } from "../core/Client";

export interface Command {
  name: string;
  description: string;
  usage: string;
  run: (client: Client, message: Message, args: string[]) => void;
}
