import { PermissionResolvable } from "discord.js"

import Context from "@core/Contracts/Context"
import Validator from "@core/Contracts/Validator"
import Command from "@core/Contracts/Command"

export default class RoleValidator implements Validator {
  private _failed = false
  private _messages: string[] = []

  public async validate({ member }: Context, command: Command): Promise<void> {
    if (command.roles.length === 0) {
      return
    }

    for (const role of command.roles) {
      if (!member.roles.has(role)) {
        this._failed = true

        const unauthorizedMessage = command.roleValidationMessages[role]
        if (unauthorizedMessage) {
          this._messages.push(unauthorizedMessage)
        }

        if (!command.validateAllRoles) {
          break
        }
      }
    }

    for (const permission of command.permissions) {
      if (!member.hasPermission(permission as PermissionResolvable)) {
        this._failed = true

        const unauthorizedMessage =
          command.permissionValidationMessages[permission]
        if (unauthorizedMessage) {
          this._messages.push(unauthorizedMessage)
        }

        if (!command.validateAllPermissions) {
          break
        }
      }
    }

    if (this._failed && this._messages.length === 0) {
      this._messages.push("Você não está autorizado a usar esse comando :(")
    }
  }

  public failed(): boolean {
    return this._failed
  }

  public messages(): string[] {
    return this._messages
  }
}
