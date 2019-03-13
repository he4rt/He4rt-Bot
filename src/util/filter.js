const {
  ch,
  regexBlock,
  regexPath,
  allowPath,
  filtBan,
  filtAviso,
} = require('../../assets/filterCfg');

module.exports = {
  async filterChat(client, message) {
    const embedMsg = async (time = 60000) => {
      const msg = await message.channel.send(
        filtNotice(message.author.username, time)
      );
      msg.delete(20000).catch(err => {
        console.error(err);
      });
      message.delete(time);
    };

    if (!ch.some(oneVelueTrue => oneVelueTrue === message.channel.id)) return;
    const contents = message.content;

    if (
      contents.match(regexPath) &&
      !contents.match(regexBlock) &&
      !contents.match(allowPath)
    ) {
      embedMsg(60000 * 2);
    }

    if (message.content.match(regexBlock)) {
      const botMgs = await message.author.send(
        filtBan(message.author.username, 1)
      );
      message.channel.send(`<@ADM> <@ADM>`).then(a => a.delete(8000));
      message
        .delete(1)
        .catch(err => console.error(`Error no modulo Filter ${err}`));
      botMgs.delete(60000 * 30);
    }

    if (message.content.match(allowPath)) {
      embedMsg(60000 * 30);
    }
  },
};
