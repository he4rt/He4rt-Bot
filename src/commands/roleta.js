const Discord = require('discord.js');
client.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    if (message.content.startsWith('$')) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const comando = args.shift().toLocaleLowerCase();
        console.log(comando)
        if (comando === "rolet") {
            const m = await message.channel.send(`
[  ROLETA ]
------------------
:switch: : :java: : :js:

:js: : :php: : :python: <

:php: : :js: : :java:
------------------
|  Perdeu  |
            `)
            setTimeout(() => m.edit(`
[  ROLETA ]
------------------
:ruby: : :ruby: : :js:
            
:python: : :js: : :go: <
            
:ts: : :go: : :switch:
------------------
|   Perdeu  |
            `), 400)
            setTimeout(() => m.edit(`
[  ROLETA ]
------------------
:ruby: : :ruby: : :js:
            
:ts:  : :ts: : :ts: : <
            
:js: : :go: : :switch:
------------------
|  Vitoria  |
            `), 800)

        }
    }
    

});