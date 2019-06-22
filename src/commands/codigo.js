const categories = require('../userCategory');

module.exports = {
  run(client, message) {
    const answer =
      String.raw`
      Formate seu código:
      \`\`\`js
          CÓDIGO AQUI
      \`\`\`
Troque 'js' por sua linguagem
      `;

    const example = "\```js\n\
const foo = 10;\
    ```\
    ";

    message.channel.send(`${answer}\n${example}`);
  },

  get command() {
    return {
      name: 'codigo',
      category: categories.USER,
      description: 'Irá mostrar como formatar um bloco de código.',
      usage: 'codigo',
    };
  },
};
