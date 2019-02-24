module.exports = {
  isCommand: message => message.content.startsWith(process.env.COMMAND_PREFIX),
};
