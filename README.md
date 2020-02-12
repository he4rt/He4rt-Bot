# Heart Bot

### Criando um comando

Crie uma classe dentro da pasta `Commands` e implemente os metódos obrigatórios:

`run` e `help`. O comando sempre será o nome da classe em minúsculo, nesse caso
o comando é `!sayhello`.

```ts
import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"

export default class SayHello extends Command {
  // help() sempre deve retornar um exemplo de como o
  // comando deve ser usado.
  public help(): string {
    return "Como usar: `!sayhello <names>`"
  }

  // run() recebe um objecto Context que contem outros
  // objetos e funções necessárias para interagir com o discord
  public async run({ send, args }: Context): Promise<void> {
    const names = args.join(" ").trim()

    await send(`Hello, ${names}`)
  }
}
```

### Objeto Context

Um objeto context é passado para função `run` de todos os comandos. Esse objeto contem tudo que você irá precisar para interagir com o discord.

```ts
// o objeto context normalmente contêm essas propriedades
{
  command // o comando que foi usado
  args // os argumentos passados com o comando
  message // a mensagem completa
  send(message) // manda uma mensagem pro canal onde o comando foi usado
  reply(message) // manda uma mensagem marcando a pessoa que usou o comando
  member // objeto com as informações do usuário que usou o comando
  textChannels // objeto para acessar os canais de texto do servidor
  voiceChannels // objeto para acessar os canais de voz do servidor
}
```

### Criando comandos que precisam de autorização

Para criar um comando que apenas usuários com certas permissões podem usar, basta implementar o método `permissions`.

```ts
export default class Rules extends Command {
  public get description(): string {
    return "Envia as regras para o usuário."
  }

  public get permissions(): string[] {
    // Somente usuários com a permissão MANAGE_GUILD podem usar esse comando
    // Se mais de uma permissão for retornada,
    // o usuário só será capaz de usar esse comando
    // caso tenha todas elas
    return ["MANAGE_GUILD"]
  }

  public help(): string {
    return "Como usar: `!rules`"
  }

  public async run({ textChannels }: Context): Promise<void> {
    await textChannels.get(process.env.RULES_CHAT!)!.send(rules)
  }
}
```

Por padrão, quando um usuário não tem uma permissão, a mensagem `"Você não está autorizado a usar esse comando :("` é retornada, é possível definir mensagens para cada permissão necessária implementando o método `permissionValidationMessages`.

```ts
export default class Rules extends Command {
  public get description(): string {
    return "Envia as regras para o usuário."
  }

  public get permissions(): string[] {
    return ["MANAGE_GUILD"]
  }

  public get permissionValidationMessages() {
    return {
      MANAGE_GUILD: "Mensagem personalizada"
    }
  }

  public help(): string {
    return "Como usar: `!rules`"
  }

  public async run({ textChannels }: Context): Promise<void> {
    await textChannels.get(process.env.RULES_CHAT!)!.send(rules)
  }
}
```

Caso o método `permissions` retorne mais de uma permissão, o comando pode escolher para a validação ao encontrar uma permissão que o usuário não possui, ou validar todas as permissões.

Para validar todas as permissões, implemente o método `validateAllPermissions`

```ts
export default class Rules extends Command {
  public get description(): string {
    return "Envia as regras para o usuário."
  }

  public get validateAllPermissions(): boolean {
    // Ao retornar true, todas as permissões serão validadas,
    // o validator não para ao encontrar uma permissão
    // que o usuário não possui
    return true
  }

  public get permissions(): string[] {
    return ["MANAGE_GUILD"]
  }

  public get permissionValidationMessages() {
    return {
      MANAGE_GUILD: "Mensagem personalizada"
    }
  }

  public help(): string {
    return "Como usar: `!rules`"
  }

  public async run({ textChannels }: Context): Promise<void> {
    await textChannels.get(process.env.RULES_CHAT!)!.send(rules)
  }
}
```

Para criar um comando que apenas usuários com certas roles podem usar, basta implementar o método `roles`.

```ts
export default class Say extends Command {
  public get description(): string {
    return "Manda uma mensagem pelo bot."
  }

  public get roles(): string[] {
    return [process.env.ADMIN_ROLE!]
  }

  public help(): string {
    return "Como usar: `!say hello world`"
  }

  public async run({ args, reply, send }: Context): Promise<void> {
    if (args.length === 0) {
      const message = await reply(":x: Voce deve informar uma mensagem")
      ;(message as Message).delete(5000)
      return
    }

    await send(args.join(" ").trim())
  }
}
```

Por padrão, quando um usuário não tem uma permissão, a mensagem `"Você não está autorizado a usar esse comando :("` é retornada, é possível definir mensagens para cada permissão necessária implementando o método `roleValidationMessages`.

```ts
export default class Say extends Command {
  public get description() {
    return "Manda uma mensagem pelo bot."
  }

  public get roles(): string[] {
    return [process.env.ADMIN_ROLE!]
  }

  public get roleValidationMessages() {
    return {
      [process.env
        .ADMIN_ROLE!]: "Apenas administradores podem usar esse comando"
    }
  }

  public help(): string {
    return "Como usar: `!say hello world`"
  }

  public async run({ args, reply, send }: Context): Promise<void> {
    if (args.length === 0) {
      const message = await reply(":x: Voce deve informar uma mensagem")
      ;(message as Message).delete(5000)
      return
    }

    await send(args.join(" ").trim())
  }
}
```

Caso o método `roles` retorne mais de uma role, o comando pode escolher para a validação ao encontrar uma role que o usuário não possui, ou validar todas as roles.

Para validar todas as permissões, implemente o método `validateAllRoles`.

```ts
export default class Say extends Command {
  public get description(): string {
    return "Manda uma mensagem pelo bot."
  }

  public get validateAllRoles(): boolean {
    // Ao retornar true, todas as roles serão validadas,
    // o validator não para ao encontrar uma role
    // que o usuário não possui
    return true
  }

  public get roles(): string[] {
    return [process.env.ADMIN_ROLE!]
  }

  public get roleValidationMessages() {
    return {
      [process.env
        .ADMIN_ROLE!]: "Apenas administradores podem usar esse comando"
    }
  }

  public help(): string {
    return "Como usar: `!say hello world`"
  }

  public async run({ args, reply, send }: Context): Promise<void> {
    if (args.length === 0) {
      const message = await reply(":x: Voce deve informar uma mensagem")
      ;(message as Message).delete(5000)
      return
    }

    await send(args.join(" ").trim())
  }
}
```
