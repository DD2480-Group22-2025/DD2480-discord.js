'use strict';

/**
 *
 * @param {*} data
 *
 * This function checks the branch coverage of the patch function in the ThreadChannel class.
 */
import { bc } from './thread.test.js';
const { ChannelFlags, ChannelType, PermissionFlagsBits, Routes } = require('discord-api-types/v10');
const { TextBasedChannel } = require('../../../src/structures/interfaces/TextBasedChannel.js');
const { GuildMessageManager } = require('../../../src/managers/GuildMessageManager.js');

/**
 * Represents a thread channel on Discord.
 * @extends {BaseChannel}
 * @implements {TextBasedChannel}
 */
class ThreadChannel {
  constructor(data) {
    /**
     * A manager of the messages sent to this thread
     * @type {GuildMessageManager}
     */
    if (data) this._patch(data);
  }

  _patch(data) {
    if ('message' in data) {
      this.messages._add(data.message);
      bc.cover(0);
    }

    if ('name' in data) {
      /**
       * The name of the thread
       * @type {string}
       */
      bc.cover(1);
      this.name = data.name;
    }

    if ('guild_id' in data) {
      bc.cover(2);
      this.guildId = data.guild_id;
    }

    if ('parent_id' in data) {
      /**
       * The id of the parent channel of this thread
       * @type {?Snowflake}
       */
      bc.cover(3);
      this.parentId = data.parent_id;
    } else {
      bc.cover(4);
      this.parentId ??= null;
    }

    if ('thread_metadata' in data) {
      bc.cover(5);
      /**
       * Whether the thread is locked
       * @type {?boolean}
       */
      this.locked = data.thread_metadata.locked ?? false;

      /**
       * Whether members without the {@link PermissionFlagsBits.ManageThreads} permission
       * can invite other members to this thread.
       * <info>This property is always `null` in public threads.</info>
       * @type {?boolean}
       */
      if (this.type === ChannelType.PrivateThread) {
        bc.cover(6);
        this.invitable = data.thread_metadata.invitable ?? false;
      } else {
        bc.cover(7);
        this.invitable = null;
      }

      /**
       * Whether the thread is archived
       * @type {?boolean}
       */
      this.archived = data.thread_metadata.archived;

      /**
       * The amount of time (in minutes) after which the thread will automatically archive in case of no recent activity
       * @type {?ThreadAutoArchiveDuration}
       */
      this.autoArchiveDuration = data.thread_metadata.auto_archive_duration;

      /**
       * The timestamp when the thread's archive status was last changed
       * <info>If the thread was never archived or unarchived, this is the timestamp at which the thread was
       * created</info>
       * @type {?number}
       */
      this.archiveTimestamp = Date.parse(data.thread_metadata.archive_timestamp);

      if ('create_timestamp' in data.thread_metadata) {
        // Note: this is needed because we can't assign directly to getters
        bc.cover(8);
        this._createdTimestamp = Date.parse(data.thread_metadata.create_timestamp);
      }
    } else {
      bc.cover(9);
      this.locked ??= null;
      this.archived ??= null;
      this.autoArchiveDuration ??= null;
      this.archiveTimestamp ??= null;
      this.invitable ??= null;
    }

    if ((this._createdTimestamp ??= this.type === ChannelType.PrivateThread)) {
      bc.cover(10);
      this._createdTimestamp = this._createdTimestamp;
    } else {
      bc.cover(11);
      this._createdTimestamp = null;
    }

    if ('last_message_id' in data) {
      /**
       * The last message id sent in this thread, if one was sent
       * @type {?Snowflake}
       */
      this.lastMessageId = data.last_message_id;
      bc.cover(12);
    } else {
      this.lastMessageId ??= null;
      bc.cover(13);
    }

    if ('last_pin_timestamp' in data) {
      /**
       * The timestamp when the last pinned message was pinned, if there was one
       * @type {?number}
       */
      bc.cover(14);

      if (data.last_pin_timestamp) {
        bc.cover(15);
        this.lastPinTimestamp = Date.parse(data.last_pin_timestamp);
      } else {
        bc.cover(16);
        this.lastPinTimestamp = null;
      }
    } else {
      this.lastPinTimestamp ??= null;
      bc.cover(17);
    }

    if ('rate_limit_per_user' in data) {
      /**
       * The rate limit per user (slowmode) for this thread in seconds
       * @type {?number}
       */
      this.rateLimitPerUser = data.rate_limit_per_user ?? 0;
      bc.cover(18);
    } else {
      this.rateLimitPerUser ??= null;
      bc.cover(19);
    }

    if ('message_count' in data) {
      /**
       * The approximate count of messages in this thread
       * <info>Threads created before July 1, 2022 may have an inaccurate count.
       * If you need an approximate value higher than that, use `ThreadChannel#messages.cache.size`</info>
       * @type {?number}
       */
      this.messageCount = data.message_count;
      bc.cover(20);
    } else {
      this.messageCount ??= null;
      bc.cover(21);
    }

    if ('member_count' in data) {
      /**
       * The approximate count of users in this thread
       * <info>This stops counting at 50. If you need an approximate value higher than that, use
       * `ThreadChannel#members.cache.size`</info>
       * @type {?number}
       */
      this.memberCount = data.member_count;
      bc.cover(22);
    } else {
      this.memberCount ??= null;
      bc.cover(23);
    }

    if ('total_message_sent' in data) {
      /**
       * The number of messages ever sent in a thread, similar to {@link ThreadChannel#messageCount} except it
       * will not decrement whenever a message is deleted
       * @type {?number}
       */
      this.totalMessageSent = data.total_message_sent;
      bc.cover(24);
    } else {
      this.totalMessageSent ??= null;
      bc.cover(25);
    }

    if (data.member && this.client.user) {
      bc.cover(26);
      this.members._add({ user_id: this.client.user.id, ...data.member });
    }
    if (data.messages) {
      bc.cover(27);
      for (const message of data.messages) {
        this.messages._add(message);
      }
    }

    if ('applied_tags' in data) {
      /**
       * The tags applied to this thread
       * @type {Snowflake[]}
       */
      bc.cover(28);
      this.appliedTags = data.applied_tags;
    } else {
      bc.cover(29);
      this.appliedTags ??= [];
    }
  }
}

export { ThreadChannel };
