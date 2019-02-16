const translate = require('@vitalets/google-translate-api');

module.exports.run = async (client, message) => {
    let command = "tradutor";
    let txt = message.content.slice(client.config.prefix.length + command.length + 1); //Pegando da msg o texto pra traduzir

    translate(txt, {to: 'pt'})
    .then(res => {
        message.channel.send({embed: {
            color: 338519,
            author: {
                name: client.user.username,
                icon_url: client.user.avatarURL
            },
            title: "Tradução:",
            description: res.text,
            thumbnail: {
                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/250px-Google_Translate_logo.svg.png"
            },
            footer: {
                icon_url: client.user.avatarURL,
                text: `Traduzido do [${res.from.language.iso}]`
            },
            timestamp: new Date()
        }});
    }).catch(err => {console.log(err);});
}