import { PermissionResolvable } from "discord.js"

import Context from "@core/Contracts/Context"
import Validator from "@core/Contracts/Validator"
import Command from "@core/Contracts/Command"

export const validate: Validator = (ctx: Context, command: Command) => {
  const messages: string[] = []
  let failed = false

  for (const permission of command.permissions) {
    const { member } = ctx.message
    if (!member) {
      return []
    }

    if (!member.hasPermission(permission as PermissionResolvable)) {
      failed = true

      const unauthorizedMessage =
        command.permissionValidationMessages[permission]

      if (unauthorizedMessage) {
        messages.push(unauthorizedMessage)
      }

      if (!command.validateAllPermissions) {
        break
      }
    }
  }

  for (const role of command.roles) {
    if (!ctx.user.hasRole(role)) {
      failed = true

      const unauthorizedMessage = command.roleValidationMessages[role]

      if (unauthorizedMessage) {
        messages.push(unauthorizedMessage)
      }

      if (!command.validateAllRoles) {
        break
      }
    }
  }

  if (failed && messages.length === 0) {
    messages.push("Você não está autorizado a usar esse comando :(")
  }

  return messages
}
