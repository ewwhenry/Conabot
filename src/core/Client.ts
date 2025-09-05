import { Client as WWClient } from "whatsapp-web.js";
import { Command } from "../types/Command";

export class Client extends WWClient {
  commands: Map<string, Command> = new Map<string, Command>();
  constructor(o: any) {
    super(o);
  }
}
