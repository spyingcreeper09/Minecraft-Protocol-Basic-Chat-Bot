const minecraft = require('mineflayer')
const options = {
    host: process.argv[2],
    port: process.argv[3],
    version: process.argv[4], 
    username: process.argv[5]
}
const botSay = "Connection to the server successful"
console.log(`Bot will join with the following settings:\nHost: ${options.host}\nPort: ${options.port}\nUsername: ${options.username}\nVersion: ${options.version}`)
const bot = minecraft.createBot(options)
// AHA! Minecraft Protocol hangs here
bot.on("spawn", () => {
    console.log(botSay)
    bot.chat(botSay)
})