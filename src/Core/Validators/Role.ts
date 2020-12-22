import { PermissionResolvable } from "discord.js"

import Context from "@core/Contracts/Context"
import Validator from "@core/Contracts/Validator"
import Command from "@core/Contracts/Command"

export default new (class RoleValidator implements Validator {
  private _failed = false

  private _messages: string[] = []

  private validateRoles({ user }: Context, command: Command): void {
    for (const role of command.roles) {
      if (!user.hasRole(role)) {
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
  }

  private validatePermissions({ message }: Context, command: Command): void {
    for (const permission of command.permissions) {
      const { member } = message
      if (!member) {
        return
      }

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
  }

  public async validate(ctx: Context, command: Command): Promise<void> {
    this.validateRoles(ctx, command)
    this.validatePermissions(ctx, command)

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
})()
