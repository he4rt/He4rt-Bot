import "dotenv/config"
import "module-alias/register"
import bot from "@/Core/Bot"

bot
  .start()
  .then(() => console.log("Bot on"))
  .catch(console.error)
