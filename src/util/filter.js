const {
  timeUrls,
  ch,
  regexBlock,
  regexPath,
  allowPath,
  filtBan,
  filtNotice,
  embedPunish,
} = require('../../assets/filterCfg');
require('dotenv').config();

const punish = process.env.PUNISHMENTS_CHAT;

module.exports = {
  async filterChat(client, message) {
    const embedMsg = async time => {
      const msg = await message.channel.send(
        filtNotice(message.author.username, time)
      );
      msg.delete(8000).catch(err => {
        console.error(err);
      });
      message.delete(time);
    };
    // console.log(`+++++++++++++++ ${message.mentions.users.first() /*message.mentions.members.first()*/} ++++++++++++++++++`)
    if (!ch.some(oneVelueTrue => oneVelueTrue === message.channel.id)) return;
    const contents = message.content;
    if (
      contents.match(regexPath) &&
      !contents.match(regexBlock) &&
      !contents.match(allowPath)
    ) {
      embedMsg(timeUrls.default);
    }

    if (message.content.match(regexBlock)) {
      const member = message.guild.member(message.author);
      await message.author
        .send(filtBan(message.author.username))
        .catch(err => console.error(err));
      message
        .delete(0)
        .catch(err => console.error(`Error ao dell regexBlock ${err}`));
      member.kick().catch(err => console.error(err));
      client.channels.get(punish).send(embedPunish(message));
    }

    if (message.content.match(allowPath)) {
      embedMsg(timeUrls.allow);
    }
  },
};
