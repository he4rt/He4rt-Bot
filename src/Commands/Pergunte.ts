import Command from "@core/Contracts/Command"
import * as embed from "@/Core/Misc/Embeds"
import dedent from "dedent"

const linusSayingTalkIsCheap =
  "https://recruitingdaily.com/wp-content/uploads/sites/6/2017/02/quote-talk-is-cheap-show-me-the-code-linus-torvalds-45-66-13-e1487242875427.jpg"

const command = Command({
  description: "Instrui um usuário a não pedir para perguntar.",
  help: ":x: Como usar: `!pergunte [@user]`",
  run: async ({ send, getMentionedUsers }) => {
    const [mentionedUser] = getMentionedUsers()

    const answer = embed
      .info()
      .setTitle("Não peça para perguntar")
      .setDescription(
        dedent`
				${mentionedUser ? `Ei ${mentionedUser.toString()}` : ""}
				Explique o problema
				Mostre o que você tentou
				Mostre o que deu errado
			`
      )
      .setImage(linusSayingTalkIsCheap)
      .setColor("#8146DC")

    await send(answer)
  },
})
export default command
