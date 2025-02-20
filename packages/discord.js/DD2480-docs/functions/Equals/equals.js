import { BranchCoverage } from '../../BranchCoverage.js';
const bc = new BranchCoverage('guild.js:patch');

'use strict';

const { DiscordSnowflake } = require('@sapphire/snowflake');
const { ApplicationCommandOptionType } = require('discord-api-types/v10');
const isEqual = require('fast-deep-equal');
const { Base } = require('../../../src/structures/Base.js');
const { ApplicationCommandPermissionsManager } = require('../../../src/managers/ApplicationCommandPermissionsManager.js');
const { PermissionsBitField } = require('../../../src/util/PermissionsBitField.js');

/**
 * Represents an application appCommand.
 * @extends {Base}
 */
class ApplicationCommand extends Base {
  constructor(client, data, guild, guildId) {
    super(client);

    /**
     * The appCommand's id
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The parent application's id
     * @type {Snowflake}
     */
    this.applicationId = data.application_id;

    /**
     * The guild this appCommand is part of
     * @type {?Guild}
     */
    this.guild = guild ?? null;

    /**
     * The guild's id this appCommand is part of, this may be non-null when `guild` is `null` if the appCommand
     * was fetched from the `ApplicationCommandManager`
     * @type {?Snowflake}
     */
    this.guildId = guild?.id ?? guildId ?? null;

    /**
     * The manager for permissions of this appCommand on its guild or arbitrary guilds when the appCommand is global
     * @type {ApplicationCommandPermissionsManager}
     */
    this.permissions = new ApplicationCommandPermissionsManager(this);

    /**
     * The type of this application appCommand
     * @type {ApplicationCommandType}
     */
    this.type = data.type;

    /**
     * Whether this appCommand is age-restricted (18+)
     * @type {boolean}
     */
    this.nsfw = data.nsfw ?? false;

    this._patch(data);
  }

  _patch(data) {
    if ('name' in data) {
      /**
       * The name of this appCommand
       * @type {string}
       */
      this.name = data.name;
    }

    if ('name_localizations' in data) {
      /**
       * The name localizations for this appCommand
       * @type {?Object<Locale, string>}
       */
      this.nameLocalizations = data.name_localizations;
    } else {
      this.nameLocalizations ??= null;
    }

    if ('name_localized' in data) {
      /**
       * The localized name for this appCommand
       * @type {?string}
       */
      this.nameLocalized = data.name_localized;
    } else {
      this.nameLocalized ??= null;
    }

    if ('description' in data) {
      /**
       * The description of this appCommand
       * @type {string}
       */
      this.description = data.description;
    }

    if ('description_localizations' in data) {
      /**
       * The description localizations for this appCommand
       * @type {?Object<Locale, string>}
       */
      this.descriptionLocalizations = data.description_localizations;
    } else {
      this.descriptionLocalizations ??= null;
    }

    if ('description_localized' in data) {
      /**
       * The localized description for this appCommand
       * @type {?string}
       */
      this.descriptionLocalized = data.description_localized;
    } else {
      this.descriptionLocalized ??= null;
    }

    if ('options' in data) {
      /**
       * The options of this appCommand
       * @type {ApplicationCommandOption[]}
       */
      this.options = data.options.map(option => this.constructor.transformOption(option, true));
    } else {
      this.options ??= [];
    }

    if ('default_member_permissions' in data) {
      /**
       * The default bitfield used to determine whether this appCommand be used in a guild
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
       * Installation context(s) where the appCommand is available
       * <info>Only for globally-scoped commands</info>
       * @type {?ApplicationIntegrationType[]}
       */
      this.integrationTypes = data.integration_types;
    } else {
      this.integrationTypes ??= null;
    }

    if ('contexts' in data) {
      /**
       * Interaction context(s) where the appCommand can be used
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
   * The timestamp the appCommand was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return DiscordSnowflake.timestampFrom(this.id);
  }

  /**
   * The time the appCommand was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The manager that this appCommand belongs to
   * @type {ApplicationCommandManager}
   * @readonly
   */
  get manager() {
    return (this.guild ?? this.client.application).commands;
  }

  /**
   * Data for creating or editing an application appCommand.
   * @typedef {Object} ApplicationCommandData
   * @property {string} name The name of the appCommand, must be in all lowercase if type is
   * {@link ApplicationCommandType.ChatInput}
   * @property {Object<Locale, string>} [nameLocalizations] The localizations for the appCommand name
   * @property {string} description The description of the appCommand, if type is {@link ApplicationCommandType.ChatInput}
   * @property {boolean} [nsfw] Whether the appCommand is age-restricted
   * @property {Object<Locale, string>} [descriptionLocalizations] The localizations for the appCommand description,
   * if type is {@link ApplicationCommandType.ChatInput}
   * @property {ApplicationCommandType} [type=ApplicationCommandType.ChatInput] The type of the appCommand
   * @property {ApplicationCommandOptionData[]} [options] Options for the appCommand
   * @property {?PermissionResolvable} [defaultMemberPermissions] The bitfield used to determine the default permissions
   * a member needs in order to run the appCommand
   */

  /**
   * An option for an application appCommand or subcommand.
   * <info>In addition to the listed properties, when used as a parameter,
   * API style `snake_case` properties can be used for compatibility with generators like `@discordjs/builders`.</info>
   * <warn>Note that providing a value for the `camelCase` counterpart for any `snake_case` property
   * will discard the provided `snake_case` property.</warn>
   * @typedef {Object} ApplicationCommandOptionData
   * @property {ApplicationCommandOptionType} type The type of the option
   * @property {string} name The name of the option
   * @property {Object<Locale, string>} [nameLocalizations] The name localizations for the option
   * @property {string} description The description of the option
   * @property {Object<Locale, string>} [descriptionLocalizations] The description localizations for the option
   * @property {boolean} [autocomplete] Whether the autocomplete interaction is enabled for a
   * {@link ApplicationCommandOptionType.String}, {@link ApplicationCommandOptionType.Integer} or
   * {@link ApplicationCommandOptionType.Number} option
   * @property {boolean} [required] Whether the option is required
   * @property {ApplicationCommandOptionChoiceData[]} [choices] The choices of the option for the user to pick from
   * @property {ApplicationCommandOptionData[]} [options] Additional options if this option is a subcommand (group)
   * @property {ChannelType[]} [channelTypes] When the option type is channel,
   * the allowed types of channels that can be selected
   * @property {number} [minValue] The minimum value for an {@link ApplicationCommandOptionType.Integer} or
   * {@link ApplicationCommandOptionType.Number} option
   * @property {number} [maxValue] The maximum value for an {@link ApplicationCommandOptionType.Integer} or
   * {@link ApplicationCommandOptionType.Number} option
   * @property {number} [minLength] The minimum length for an {@link ApplicationCommandOptionType.String} option
   * (maximum of `6000`)
   * @property {number} [maxLength] The maximum length for an {@link ApplicationCommandOptionType.String} option
   * (maximum of `6000`)
   */

  /**
   * @typedef {Object} ApplicationCommandOptionChoiceData
   * @property {string} name The name of the choice
   * @property {Object<Locale, string>} [nameLocalizations] The localized names for this choice
   * @property {string|number} value The value of the choice
   */

  /**
   * Edits this application appCommand.
   * @param {Partial<ApplicationCommandData>} data The data to update the appCommand with
   * @returns {Promise<ApplicationCommand>}
   * @example
   * // Edit the description of this appCommand
   * appCommand.edit({
   *   description: 'New description',
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  edit(data) {
    return this.manager.edit(this, data, this.guildId);
  }

  /**
   * Edits the name of this ApplicationCommand
   * @param {string} name The new name of the appCommand
   * @returns {Promise<ApplicationCommand>}
   */
  setName(name) {
    return this.edit({ name });
  }

  /**
   * Edits the localized names of this ApplicationCommand
   * @param {Object<Locale, string>} nameLocalizations The new localized names for the appCommand
   * @returns {Promise<ApplicationCommand>}
   * @example
   * // Edit the name localizations of this appCommand
   * appCommand.setLocalizedNames({
   *   'en-GB': 'test',
   *   'pt-BR': 'teste',
   * })
   *   .then(console.log)
   *   .catch(console.error)
   */
  setNameLocalizations(nameLocalizations) {
    return this.edit({ nameLocalizations });
  }

  /**
   * Edits the description of this ApplicationCommand
   * @param {string} description The new description of the appCommand
   * @returns {Promise<ApplicationCommand>}
   */
  setDescription(description) {
    return this.edit({ description });
  }

  /**
   * Edits the localized descriptions of this ApplicationCommand
   * @param {Object<Locale, string>} descriptionLocalizations The new localized descriptions for the appCommand
   * @returns {Promise<ApplicationCommand>}
   * @example
   * // Edit the description localizations of this appCommand
   * appCommand.setDescriptionLocalizations({
   *   'en-GB': 'A test appCommand',
   *   'pt-BR': 'Um comando de teste',
   * })
   *   .then(console.log)
   *   .catch(console.error)
   */
  setDescriptionLocalizations(descriptionLocalizations) {
    return this.edit({ descriptionLocalizations });
  }

  /**
   * Edits the default member permissions of this ApplicationCommand
   * @param {?PermissionResolvable} defaultMemberPermissions The default member permissions required to run this appCommand
   * @returns {Promise<ApplicationCommand>}
   */
  setDefaultMemberPermissions(defaultMemberPermissions) {
    return this.edit({ defaultMemberPermissions });
  }

  /**
   * Edits the options of this ApplicationCommand
   * @param {ApplicationCommandOptionData[]} options The options to set for this appCommand
   * @returns {Promise<ApplicationCommand>}
   */
  setOptions(options) {
    return this.edit({ options });
  }

  /**
   * Deletes this appCommand.
   * @returns {Promise<ApplicationCommand>}
   * @example
   * // Delete this appCommand
   * appCommand.delete()
   *   .then(console.log)
   *   .catch(console.error);
   */
  delete() {
    return this.manager.delete(this, this.guildId);
  }

  /**
   * Whether this appCommand equals another appCommand. It compares all properties, so for most operations
   * it is advisable to just compare `appCommand.id === command2.id` as it is much faster and is often
   * what most users need.
   * @param {ApplicationCommand|ApplicationCommandData|APIApplicationCommand} appCommand The appCommand to compare with
   * @param {boolean} [enforceOptionOrder=false] Whether to strictly check that options and choices are in the same
   * order in the array <info>The client may not always respect this ordering!</info>
   * @returns {boolean}
   */
  equals(appCommand, enforceOptionOrder = false) {
    // If given an id, check if the id matches
    if (appCommand.id && this.id !== appCommand.id) {
      bc.cover(1)
      return false;
    }

    let defaultMemberPermissions = null;

    if ('default_member_permissions' in appCommand) {
      bc.cover(2)
      defaultMemberPermissions = appCommand.default_member_permissions
        ? new PermissionsBitField(BigInt(appCommand.default_member_permissions)).bitfield
        : null;
    }

    if ('defaultMemberPermissions' in appCommand) {
      bc.cover(3)
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
      bc.cover(4)
      return false;
    }

    if (appCommand.options) {
      bc.cover(5)
      return this.constructor.optionsEqual(this.options, appCommand.options, enforceOptionOrder);
    }
    return true;
  }

  /**
   * Recursively checks that all options for an {@link ApplicationCommand} are equal to the provided options.
   * In most cases it is better to compare using {@link ApplicationCommand#equals}
   * @param {ApplicationCommandOptionData[]} existing The options on the existing appCommand,
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

  /**
   * Checks that an option for an {@link ApplicationCommand} is equal to the provided option
   * In most cases it is better to compare using {@link ApplicationCommand#equals}
   * @param {ApplicationCommandOptionData} existing The option on the existing appCommand,
   * should be from {@link ApplicationCommand#options}
   * @param {ApplicationCommandOptionData|APIApplicationCommandOption} option The option to compare against
   * @param {boolean} [enforceOptionOrder=false] Whether to strictly check that options or choices are in the same
   * order in their array <info>The client may not always respect this ordering!</info>
   * @returns {boolean}
   * @private
   */
  static _optionEquals(existing, option, enforceOptionOrder = false) {
    if (
      option.name !== existing.name ||
      option.type !== existing.type ||
      option.description !== existing.description ||
      option.autocomplete !== existing.autocomplete ||
      (option.required ??
        ([ApplicationCommandOptionType.Subcommand, ApplicationCommandOptionType.SubcommandGroup].includes(option.type)
          ? undefined
          : false)) !== existing.required ||
      option.choices?.length !== existing.choices?.length ||
      option.options?.length !== existing.options?.length ||
      (option.channelTypes ?? option.channel_types)?.length !== existing.channelTypes?.length ||
      (option.minValue ?? option.min_value) !== existing.minValue ||
      (option.maxValue ?? option.max_value) !== existing.maxValue ||
      (option.minLength ?? option.min_length) !== existing.minLength ||
      (option.maxLength ?? option.max_length) !== existing.maxLength ||
      !isEqual(option.nameLocalizations ?? option.name_localizations ?? {}, existing.nameLocalizations ?? {}) ||
      !isEqual(
        option.descriptionLocalizations ?? option.description_localizations ?? {},
        existing.descriptionLocalizations ?? {},
      )
    ) {
      return false;
    }

    if (existing.choices) {
      if (
        enforceOptionOrder &&
        !existing.choices.every(
          (choice, index) =>
            choice.name === option.choices[index].name &&
            choice.value === option.choices[index].value &&
            isEqual(
              choice.nameLocalizations ?? {},
              option.choices[index].nameLocalizations ?? option.choices[index].name_localizations ?? {},
            ),
        )
      ) {
        return false;
      }
      if (!enforceOptionOrder) {
        const newChoices = new Map(option.choices.map(choice => [choice.name, choice]));
        for (const choice of existing.choices) {
          const foundChoice = newChoices.get(choice.name);
          if (!foundChoice || foundChoice.value !== choice.value) return false;
        }
      }
    }

    if (existing.channelTypes) {
      const newTypes = option.channelTypes ?? option.channel_types;
      for (const type of existing.channelTypes) {
        if (!newTypes.includes(type)) return false;
      }
    }

    if (existing.options) {
      return this.optionsEqual(existing.options, option.options, enforceOptionOrder);
    }
    return true;
  }

  /**
   * An option for an application appCommand or subcommand.
   * @typedef {Object} ApplicationCommandOption
   * @property {ApplicationCommandOptionType} type The type of the option
   * @property {string} name The name of the option
   * @property {Object<Locale, string>} [nameLocalizations] The localizations for the option name
   * @property {string} [nameLocalized] The localized name for this option
   * @property {string} description The description of the option
   * @property {Object<Locale, string>} [descriptionLocalizations] The localizations for the option description
   * @property {string} [descriptionLocalized] The localized description for this option
   * @property {boolean} [required] Whether the option is required
   * @property {boolean} [autocomplete] Whether the autocomplete interaction is enabled for a
   * {@link ApplicationCommandOptionType.String}, {@link ApplicationCommandOptionType.Integer} or
   * {@link ApplicationCommandOptionType.Number} option
   * @property {ApplicationCommandOptionChoice[]} [choices] The choices of the option for the user to pick from
   * @property {ApplicationCommandOption[]} [options] Additional options if this option is a subcommand (group)
   * @property {ApplicationCommandOptionAllowedChannelTypes[]} [channelTypes] When the option type is channel,
   * the allowed types of channels that can be selected
   * @property {number} [minValue] The minimum value for an {@link ApplicationCommandOptionType.Integer} or
   * {@link ApplicationCommandOptionType.Number} option
   * @property {number} [maxValue] The maximum value for an {@link ApplicationCommandOptionType.Integer} or
   * {@link ApplicationCommandOptionType.Number} option
   * @property {number} [minLength] The minimum length for an {@link ApplicationCommandOptionType.String} option
   * (maximum of `6000`)
   * @property {number} [maxLength] The maximum length for an {@link ApplicationCommandOptionType.String} option
   * (maximum of `6000`)
   */

  /**
   * A choice for an application appCommand option.
   * @typedef {Object} ApplicationCommandOptionChoice
   * @property {string} name The name of the choice
   * @property {?string} nameLocalized The localized name of the choice in the provided locale, if any
   * @property {?Object<string, string>} [nameLocalizations] The localized names for this choice
   * @property {string|number} value The value of the choice
   */

  /**
   * Transforms an {@link ApplicationCommandOptionData} object into something that can be used with the API.
   * @param {ApplicationCommandOptionData|ApplicationCommandOption} option The option to transform
   * @param {boolean} [received] Whether this option has been received from Discord
   * @returns {APIApplicationCommandOption}
   * @private
   */
  static transformOption(option, received) {
    const channelTypesKey = received ? 'channelTypes' : 'channel_types';
    const minValueKey = received ? 'minValue' : 'min_value';
    const maxValueKey = received ? 'maxValue' : 'max_value';
    const minLengthKey = received ? 'minLength' : 'min_length';
    const maxLengthKey = received ? 'maxLength' : 'max_length';
    const nameLocalizationsKey = received ? 'nameLocalizations' : 'name_localizations';
    const nameLocalizedKey = received ? 'nameLocalized' : 'name_localized';
    const descriptionLocalizationsKey = received ? 'descriptionLocalizations' : 'description_localizations';
    const descriptionLocalizedKey = received ? 'descriptionLocalized' : 'description_localized';
    return {
      type: option.type,
      name: option.name,
      [nameLocalizationsKey]: option.nameLocalizations ?? option.name_localizations,
      [nameLocalizedKey]: option.nameLocalized ?? option.name_localized,
      description: option.description,
      [descriptionLocalizationsKey]: option.descriptionLocalizations ?? option.description_localizations,
      [descriptionLocalizedKey]: option.descriptionLocalized ?? option.description_localized,
      required:
        option.required ??
        (option.type === ApplicationCommandOptionType.Subcommand ||
        option.type === ApplicationCommandOptionType.SubcommandGroup
          ? undefined
          : false),
      autocomplete: option.autocomplete,
      choices: option.choices?.map(choice => ({
        name: choice.name,
        [nameLocalizedKey]: choice.nameLocalized ?? choice.name_localized,
        [nameLocalizationsKey]: choice.nameLocalizations ?? choice.name_localizations,
        value: choice.value,
      })),
      options: option.options?.map(opt => this.transformOption(opt, received)),
      [channelTypesKey]: option.channelTypes ?? option.channel_types,
      [minValueKey]: option.minValue ?? option.min_value,
      [maxValueKey]: option.maxValue ?? option.max_value,
      [minLengthKey]: option.minLength ?? option.min_length,
      [maxLengthKey]: option.maxLength ?? option.max_length,
    };
  }
}


/* eslint-disable max-len */
/**
 * @external ApplicationCommandOptionAllowedChannelTypes
 * @see {@link https://discord.js.org/docs/packages/builders/stable/ApplicationCommandOptionAllowedChannelTypes:TypeAlias}
 */

let data = {
  name: 'phoebe',
  guild_id: '1234',
  parent_id: '5678',
  thread_metadata: {
    locked: true,
    invitable: false,
    archived: true,
    auto_archive_duration: 60,
    archive_timestamp: '2022-07-01T00:00:00.000Z',
    create_timestamp: '2022-07-01T00:00:00.000Z',
  },
  last_message_id: '1234',
  last_pin_timestamp: '2022-07-01T00:00:00.000Z',
  rate_limit_per_user: 60,
  message_count: 1,
  member_count: 1,
  total_message_sent: 1,
  applied_tags: ['1234'],
};

const guild = null
let guildID = 1234
client = null

const appCommand = new ApplicationCommand(client, data, guild, guildId);
bc.setTotal(5);
appCommand.equals(appCommand);
bc.report();
