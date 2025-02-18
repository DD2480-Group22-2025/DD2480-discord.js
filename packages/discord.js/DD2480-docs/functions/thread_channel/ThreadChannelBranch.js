/**
 *
 * @param {*} data
 *
 * This function checks the branch coverage of the patch function in the ThreadChannel class.
 */

const BRANCH_COVERAGE = {};
const TOTAL_BRANCHES = 16;

function _patch(data) {
  super._patch(data);

  if ('message' in data) this.messages._add(data.message);

  if ('name' in data) {
    /**
     * The name of the thread
     * @type {string}
     */
    this.name = data.name;
  }

  if ('guild_id' in data) {
    this.guildId = data.guild_id;
  }

  if ('parent_id' in data) {
    /**
     * The id of the parent channel of this thread
     * @type {?Snowflake}
     */
    this.parentId = data.parent_id;
  } else {
    this.parentId ??= null;
  }

  if ('thread_metadata' in data) {
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
    this.invitable = this.type === ChannelType.PrivateThread ? (data.thread_metadata.invitable ?? false) : null;

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
      this._createdTimestamp = Date.parse(data.thread_metadata.create_timestamp);
    }
  } else {
    this.locked ??= null;
    this.archived ??= null;
    this.autoArchiveDuration ??= null;
    this.archiveTimestamp ??= null;
    this.invitable ??= null;
  }

  this._createdTimestamp ??= this.type === ChannelType.PrivateThread ? super.createdTimestamp : null;

  if ('last_message_id' in data) {
    /**
     * The last message id sent in this thread, if one was sent
     * @type {?Snowflake}
     */
    this.lastMessageId = data.last_message_id;
  } else {
    this.lastMessageId ??= null;
  }

  if ('last_pin_timestamp' in data) {
    /**
     * The timestamp when the last pinned message was pinned, if there was one
     * @type {?number}
     */
    this.lastPinTimestamp = data.last_pin_timestamp ? Date.parse(data.last_pin_timestamp) : null;
  } else {
    this.lastPinTimestamp ??= null;
  }

  if ('rate_limit_per_user' in data) {
    /**
     * The rate limit per user (slowmode) for this thread in seconds
     * @type {?number}
     */
    this.rateLimitPerUser = data.rate_limit_per_user ?? 0;
  } else {
    this.rateLimitPerUser ??= null;
  }

  if ('message_count' in data) {
    /**
     * The approximate count of messages in this thread
     * <info>Threads created before July 1, 2022 may have an inaccurate count.
     * If you need an approximate value higher than that, use `ThreadChannel#messages.cache.size`</info>
     * @type {?number}
     */
    this.messageCount = data.message_count;
  } else {
    this.messageCount ??= null;
  }

  if ('member_count' in data) {
    /**
     * The approximate count of users in this thread
     * <info>This stops counting at 50. If you need an approximate value higher than that, use
     * `ThreadChannel#members.cache.size`</info>
     * @type {?number}
     */
    this.memberCount = data.member_count;
  } else {
    this.memberCount ??= null;
  }

  if ('total_message_sent' in data) {
    /**
     * The number of messages ever sent in a thread, similar to {@link ThreadChannel#messageCount} except it
     * will not decrement whenever a message is deleted
     * @type {?number}
     */
    this.totalMessageSent = data.total_message_sent;
  } else {
    this.totalMessageSent ??= null;
  }

  if (data.member && this.client.user) this.members._add({ user_id: this.client.user.id, ...data.member });
  if (data.messages) for (const message of data.messages) this.messages._add(message);

  if ('applied_tags' in data) {
    /**
     * The tags applied to this thread
     * @type {Snowflake[]}
     */
    this.appliedTags = data.applied_tags;
  } else {
    this.appliedTags ??= [];
  }
}
