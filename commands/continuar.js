const Discord = require('discord.js');
const roles = require('../assets/roles.json');

const TIMEOUT = 30000;

const hiddenRolesDev = [
  '540994118634176512',
  '540994295541399552',
  '540995072246939648',
  '540995379538165774',
  '540995627559944207',
  '541021498064896000',
  '540993488410378281',
  '546152565633449995'
];

const hiddenRolesEng = [
  '546148712833875985',
  '546148711416332298',
  '546148708077666315'
];

const createEmbeds = ({ devRoles, engRoles }) => {
  const name = new Discord.RichEmbed()
    .setTitle(`**Qual é seu nome?** (Exemplo: Daniel Reis)`)
    .setColor('#36393E');

  const nick = new Discord.RichEmbed()
    .setTitle(`**Qual é seu nick?** (Exemplo: DanielHe4rt)`)
    .setColor('#36393E');

  const about = new Discord.RichEmbed()
    .setTitle(`**Diga um pouco sobre você:** (Exemplo: Me chamo Gustavo...)`)
    .setColor('#36393E');

  const git = new Discord.RichEmbed()
    .setTitle(`**Qual é seu Git?** (Exemplo: https://github.com/DanielHe4rt)`)
    .setColor('#36393E');

  const languagesDescriptionLine = devRoles
    .map(devRole => `${devRole.react}  -  ${devRole.name}`)
    .join('\n');
  const languagesDescription = `${languagesDescriptionLine}'\n\n\n✅ - Pronto.'`;
  const languages = new Discord.RichEmbed()
    .setTitle(`**Linguagens?** (Reaja para adquirir seu cargo e prosseguir)`)
    .setDescription(languagesDescription)
    .setColor('#36393E');

  const englishDescription = engRoles
    .map(engRole => `${engRole.react}  -  ${engRole.name}`)
    .join('\n');
  const english = new Discord.RichEmbed()
    .setTitle(`**Nível de inglês?**`)
    .setDescription(englishDescription)
    .setColor('#36393E');
  return { name, nick, about, git, languages, english };
};
const createEmbedResponse = ({ author, collectors, client }) =>
  new Discord.RichEmbed()
    .setTitle(`**Apresentação** » ${author.username}`)
    .addField('**Sobre:**', collectors.about.collected.first().content)
    .setThumbnail(author.avatarURL)
    .setColor('#8146DC')
    .addField('**Nome:**', collectors.name.collected.first().content, true)
    .addField('**Nickname:**', collectors.nick.collected.first().content, true)
    .addField('**Git:**', collectors.git.collected.first().content, true)
    .addField(
      '**Linguagens:**',
      client.guilds
        .get(process.env.GUILD_ID)
        .members.get(author.id)
        .roles.filter(role => hiddenRolesDev.includes(role.id))
        .map(role => `<@&${role.id}>`)
        .join(', ') || '`Nenhuma`',
      true
    )
    .addField(
      '**Nível de inglês:**',
      client.guilds
        .get(process.env.GUILD_ID)
        .members.get(author.id)
        .roles.filter(role => hiddenRolesEng.includes(role.id))
        .map(role => `<@&${role.id}>`)
        .join(', ') || '`Nenhuma`',
      true
    )
    .setFooter(
      '2019 © He4rt Developers',
      'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
    )
    .setTimestamp();
const isAuthor = (message, author) => message.author.id === author.id;
const collectMessage = message =>
  new Promise(resolve => {
    const collector = message.author.dmChannel.createMessageCollector(
      ({ author }) => isAuthor(message, author),
      { time: TIMEOUT }
    );
    collector.on('collect', () => {
      collector.stop();
      resolve(collector);
    });
  });

const sendLanguageMessage = async (author, embeds) => {
  const message = await author.send(embeds.languages);

  await message.react('1⃣');
  await message.react('2⃣');
  await message.react('3⃣');
  await message.react('4⃣');
  await message.react('5⃣');
  await message.react('6⃣');
  await message.react('7⃣');
  await message.react('✅');
  return message;
};
const collectLanguagesReactions = async ({
  author,
  message, // message with languages reactions
  client,
  devRoles,
}) =>
  new Promise(resolve => {
    const collector = message.createReactionCollector(
      (reaction, user) => isAuthor({ author }, user),
      { time: TIMEOUT }
    );
    collector.on('collect', async (reaction, user) => {
      if (reaction.emoji.name === '✅') {
        collector.stop();
        resolve(collector);
        return;
      }

      const emoji = reaction.emoji.name;
      const selectedRole = devRoles.find(role => role.emoji === emoji);
      if (!selectedRole) {
        return;
      }
      await client.guilds
        .get(process.env.GUILD_ID)
        .members.get(author.id)
        .addRole(selectedRole.id);
      await author.send('``✅`` Linguagem adicionada com sucesso!');
    });
  });

const sendEnglishMessage = async (author, embeds) => {
  const message = await author.send(embeds.english);

  await message.react('🇦');
  await message.react('🇧');
  await message.react('🇨');
  return message;
};
const collectEnglishReactions = async ({
  author,
  message, // message with english reactions
  client,
  engRoles,
}) =>
  new Promise(resolve => {
    const collector = message.createReactionCollector(
      (reaction, user) => isAuthor({ author }, user),
      { time: TIMEOUT }
    );
    collector.on('collect', async reaction => {
      const emoji = reaction.emoji.name;
      const engRole = engRoles.find(role => role.react === emoji);
      if (!engRole) {
        return;
      }
      collector.stop();
      await client.guilds
        .get(process.env.GUILD_ID)
        .members.get(author.id)
        .addRole(engRole.id);
      resolve(collector);
    });
  });
module.exports = {
  run: async (client, message, args) => {
    const devRoles = roles.dev_roles;
    const engRoles = roles.eng_roles;
    const embeds = createEmbeds({ devRoles, engRoles });
    const collectors = {};

    const presentedRole = client.guilds
      .get(process.env.GUILD_ID)
      .roles.find('name', '🎓 Apresentou');

    if (
      !client.guilds
        .get(process.env.GUILD_ID)
        .members.get(message.author.id)
        .roles.exists('name', presentedRole.name)
    ) {
      await message.author.send(embeds.name);
      collectors.name = await collectMessage(message);

      await message.author.send(embeds.nick);
      collectors.nick = await collectMessage(message);

      await message.author.send(embeds.about);
      collectors.about = await collectMessage(message);

      // TODO: validar git se tiver inferir em algum canto
      await message.author.send(embeds.git);
      collectors.git = await collectMessage(message);

      const languageMessage = await sendLanguageMessage(message.author, embeds);
      await collectLanguagesReactions({
        client,
        devRoles,
        author: message.author,
        message: languageMessage,
      });

      const englishMessage = await sendEnglishMessage(message.author, embeds);
      await collectEnglishReactions({
        client,
        engRoles,
        author: message.author,
        message: englishMessage,
      });

      const embedResponse = createEmbedResponse({
        collectors,
        client,
        author: message.author,
      });
      client.guilds
        .get(process.env.GUILD_ID)
        .members.get(message.author.id)
        .addRole(process.env.APRESENTOU_ROLE);
      client.channels.get(process.env.APRESENTACAO_CHAT).send(embedResponse);
    } else {
      return message.channel
        .send('``❌`` Você já se apresentou.')
        .then(msg => msg.delete(8000));
    }
  },

  get command() {
    return {
      name: 'continuar',
      category: 'Users',
      description: 'O usuario irá continuar a apresentação.',
      usage: 'continuar',
    };
  },
};
