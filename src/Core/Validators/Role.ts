import { PermissionResolvable } from "discord.js";

import Context from "@core/Contracts/Context";
import Validator from "@core/Contracts/Validator";
import Command from "@core/Contracts/Command";

export default class RoleValidator implements Validator {
  private internalFailed = false;

  private internalMessages: string[] = [];

  private validateRoles({ user }: Context, command: Command): void {
    for (const role of command.roles) {
      if (!user.hasRole(role)) {
        this.internalFailed = true;

        const unauthorizedMessage = command.roleValidationMessages[role];

        if (unauthorizedMessage) {
          this.internalMessages.push(unauthorizedMessage);
        }

        if (!command.validateAllRoles) {
          break;
        }
      }
    }
  }

  private validatePermissions({ message }: Context, command: Command): void {
    for (const permission of command.permissions) {
      if (!message.member.hasPermission(permission as PermissionResolvable)) {
        this.internalFailed = true;

        const unauthorizedMessage =
          command.permissionValidationMessages[permission];

        if (unauthorizedMessage) {
          this.internalMessages.push(unauthorizedMessage);
        }

        if (!command.validateAllPermissions) {
          break;
        }
      }
    }
  }

  public async validate(ctx: Context, command: Command): Promise<void> {
    this.validateRoles(ctx, command);
    this.validatePermissions(ctx, command);

    if (this.internalFailed && this.internalMessages.length === 0) {
      this.internalMessages.push(
        "Você não está autorizado a usar esse comando :("
      );
    }
  }

  public failed(): boolean {
    return this.internalFailed;
  }

  public messages(): string[] {
    return this.internalMessages;
  }
}
