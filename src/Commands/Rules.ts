import env from "@/env"
import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"

const rules = `
<:he4rt:546395281093034015> Sejam bem-vindos ao servidor He4rt Developers! [:flag_br:]

\`\`❗\`\` Nesta detalhada mensagem irá ser informado sobre tais artigos e cumprimentos a serem exercidos pelos usuários, impondo ordem, organização e respeito mútuo.
\`\`❗\`\` Para melhor organização do nosso discord, foi desenvolvido um sistema de apresentações em que poderá nos contar mais sobre você, suas linguagens e mais alguns detalhes. Apenas a partir do uso do comando \`\`!apresentar\`\` você terá acesso aos demais chats disponíveis em nosso discord.

\`\`$1\`\` - **Mensagens de caráter irritante, negativo, ou com o intuito de causar transtornos ou perturbar a ordem, não serão toleradas.**\`\`\`


• Flood/SPAM;
• Excesso de CAPSLOCK;
• Mensagens irritantes, repetitivas ou com a intenção de perturbar a ordem;
• Sobrecarregar algum sistema.

# Ocorrência (1º Ocorrência): Mudo por 8 horas;
# Ocorrência (2º Ocorrência): Banimento de 2 dias;
# Insistência (3º Ocorrênncia): Banimento permanente.\`\`\`
`

export default class Rules extends Command {
  public get description() {
    return "Envia as regras para o usuário."
  }

  public get permissions(): string[] {
    return ["MANAGE_GUILD"]
  }

  public help(): string {
    return ":x:Como usar: `!rules`"
  }

  public async run({ textChannels }: Context): Promise<void> {
    await textChannels.get(env.RULES_CHAT)!.send(rules)
  }
}
