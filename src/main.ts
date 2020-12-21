import "dotenv/config"
import "module-alias/register"
import { start } from "@/Core/Bot/start"

start()
  .then(() => console.log("Bot on"))
  .catch(console.error)
