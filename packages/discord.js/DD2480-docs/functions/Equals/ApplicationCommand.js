('use strict');

import { bc } from './ApplicationCommand.test.js';
const { DiscordSnowflake } = require('@sapphire/snowflake');
const { ApplicationCommandOptionType } = require('discord-api-types/v10');
const isEqual = require('fast-deep-equal');
// const { Base } = require('../../../src/structures/Base.js');
const { ApplicationCommandPermissionsManager } = require('../../../src/managers/ApplicationCommandPermissionsManager.js');
const { PermissionsBitField } = require('../../../src/util/PermissionsBitField.js');

/**
 * Represents an application command.
 * @extends {Base}
 */
class ApplicationCommand {
  constructor(client, data, guild, guildId) {
    // super(client);

    /**
     * The command's id
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The parent application's id
     * @type {Snowflake}
     */
    this.applicationId = data.application_id;

    /**
     * The guild this command is part of
     * @type {?Guild}
     */
    this.guild = guild ?? null;

    /**
     * The guild's id this command is part of, this may be non-null when `guild` is `null` if the command
     * was fetched from the `ApplicationCommandManager`
     * @type {?Snowflake}
     */
    this.guildId = guild?.id ?? guildId ?? null;

    /**
     * The manager for permissions of this command on its guild or arbitrary guilds when the command is global
     * @type {ApplicationCommandPermissionsManager}
     */
    this.permissions = new ApplicationCommandPermissionsManager(this);

    /**
     * The type of this application command
     * @type {ApplicationCommandType}
     */
    this.type = data.type;

    /**
     * Whether this command is age-restricted (18+)
     * @type {boolean}
     */
    this.nsfw = data.nsfw ?? false;

    this._patch(data);
  }

  _patch(data) {
    if ('name' in data) {
      /**
       * The name of this command
       * @type {string}
       */
      this.name = data.name;
    }

    if ('name_localizations' in data) {
      /**
       * The name localizations for this command
       * @type {?Object<Locale, string>}
       */
      this.nameLocalizations = data.name_localizations;
    } else {
      this.nameLocalizations ??= null;
    }

    if ('name_localized' in data) {
      /**
       * The localized name for this command
       * @type {?string}
       */
      this.nameLocalized = data.name_localized;
    } else {
      this.nameLocalized ??= null;
    }

    if ('description' in data) {
      /**
       * The description of this command
       * @type {string}
       */
      this.description = data.description;
    }

    if ('description_localizations' in data) {
      /**
       * The description localizations for this command
       * @type {?Object<Locale, string>}
       */
      this.descriptionLocalizations = data.description_localizations;
    } else {
      this.descriptionLocalizations ??= null;
    }

    if ('description_localized' in data) {
      /**
       * The localized description for this command
       * @type {?string}
       */
      this.descriptionLocalized = data.description_localized;
    } else {
      this.descriptionLocalized ??= null;
    }

    if ('options' in data) {
      /**
       * The options of this command
       * @type {ApplicationCommandOption[]}
       */
      this.options = data.options.map(option => this.constructor.transformOption(option, true));
    } else {
      this.options ??= [];
    }

    if ('default_member_permissions' in data) {
      /**
       * The default bitfield used to determine whether this command be used in a guild
       * @type {?Readonly<PermissionsBitField>}
       */
      this.defaultMemberPermissions = data.default_member_permissions
        ? new PermissionsBitField(BigInt(data.default_member_permissions)).freeze()
        : null;
    } else {
      this.defaultMemberPermissions ??= null;
    }

    if ('integration_types' in data) {
      /**
       * Installation context(s) where the command is available
       * <info>Only for globally-scoped commands</info>
       * @type {?ApplicationIntegrationType[]}
       */
      this.integrationTypes = data.integration_types;
    } else {
      this.integrationTypes ??= null;
    }

    if ('contexts' in data) {
      /**
       * Interaction context(s) where the command can be used
       * <info>Only for globally-scoped commands</info>
       * @type {?InteractionContextType[]}
       */
      this.contexts = data.contexts;
    } else {
      this.contexts ??= null;
    }

    if ('version' in data) {
      /**
       * Autoincrementing version identifier updated during substantial record changes
       * @type {Snowflake}
       */
      this.version = data.version;
    }
  }

  /**
   * Whether this command equals another command. It compares all properties, so for most operations
   * it is advisable to just compare `command.id === command2.id` as it is much faster and is often
   * what most users need.
   * @param {ApplicationCommand|ApplicationCommandData|APIApplicationCommand} command The command to compare with
   * @param {boolean} [enforceOptionOrder=false] Whether to strictly check that options and choices are in the same
   * order in the array <info>The client may not always respect this ordering!</info>
   * @returns {boolean}
   */
  equals(appCommand, enforceOptionOrder = false) {
    // If given an id, check if the id matches
    if (appCommand.id && this.id !== appCommand.id) {
      bc.cover(1);
      return false;
    }

    let defaultMemberPermissions = null;

    if ('default_member_permissions' in appCommand) {
      bc.cover(2);
      defaultMemberPermissions = appCommand.default_member_permissions
        ? new PermissionsBitField(BigInt(appCommand.default_member_permissions)).bitfield
        : null;
    }

    if ('defaultMemberPermissions' in appCommand) {
      bc.cover(3);
      defaultMemberPermissions =
        appCommand.defaultMemberPermissions !== null
          ? new PermissionsBitField(appCommand.defaultMemberPermissions).bitfield
          : null;
    }

    // Check top level parameters
    if (
      appCommand.name !== this.name ||
      ('description' in appCommand && appCommand.description !== this.description) ||
      ('version' in appCommand && appCommand.version !== this.version) ||
      (appCommand.type && appCommand.type !== this.type) ||
      ('nsfw' in appCommand && appCommand.nsfw !== this.nsfw) ||
      // Future proof for options being nullable
      // TODO: remove ?? 0 on each when nullable
      (appCommand.options?.length ?? 0) !== (this.options?.length ?? 0) ||
      defaultMemberPermissions !== (this.defaultMemberPermissions?.bitfield ?? null) ||
      !isEqual(appCommand.nameLocalizations ?? appCommand.name_localizations ?? {}, this.nameLocalizations ?? {}) ||
      !isEqual(
        appCommand.descriptionLocalizations ?? appCommand.description_localizations ?? {},
        this.descriptionLocalizations ?? {},
      ) ||
      !isEqual(appCommand.integrationTypes ?? appCommand.integration_types ?? [], this.integrationTypes ?? []) ||
      !isEqual(appCommand.contexts ?? [], this.contexts ?? [])
    ) {
      bc.cover(4);
      return false;
    }

    if (appCommand.options) {
      bc.cover(5);
      return this.constructor.optionsEqual(this.options, appCommand.options, enforceOptionOrder);
    }
    return true;
  }

  /**
   * Recursively checks that all options for an {@link ApplicationCommand} are equal to the provided options.
   * In most cases it is better to compare using {@link ApplicationCommand#equals}
   * @param {ApplicationCommandOptionData[]} existing The options on the existing command,
   * should be {@link ApplicationCommand#options}
   * @param {ApplicationCommandOptionData[]|APIApplicationCommandOption[]} options The options to compare against
   * @param {boolean} [enforceOptionOrder=false] Whether to strictly check that options and choices are in the same
   * order in the array <info>The client may not always respect this ordering!</info>
   * @returns {boolean}
   */
  static optionsEqual(existing, options, enforceOptionOrder = false) {
    if (existing.length !== options.length) return false;
    if (enforceOptionOrder) {
      return existing.every((option, index) => this._optionEquals(option, options[index], enforceOptionOrder));
    }
    const newOptions = new Map(options.map(option => [option.name, option]));
    for (const option of existing) {
      const foundOption = newOptions.get(option.name);
      if (!foundOption || !this._optionEquals(option, foundOption)) return false;
    }
    return true;
  }
}

export { ApplicationCommand };
