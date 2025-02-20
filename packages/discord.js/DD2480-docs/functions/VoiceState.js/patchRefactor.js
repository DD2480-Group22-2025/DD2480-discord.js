'use strict';
const { BranchCoverage } = require('../../BranchCoverage.js');

const bcRef = new BranchCoverage('VoiceState.js:_patchRefactored');
bcRef.setTotal(21);

/**
 * @param {Object} obj The VoiceState instance.
 * @param {Object} data The raw data.
 */
function updateDeaf(obj, data) {
  if ('deaf' in data) {
    bcRef.cover(2);
    /**
     * Whether this member is deafened server-wide
     * @type {?boolean}
     */
    obj.serverDeaf = data.deaf;
  } else {
    bcRef.cover(3);
    obj.serverDeaf ??= null;
  }
}

/**
 * Updates the "mute" property.
 * @param {Object} obj The VoiceState instance.
 * @param {Object} data The raw data.
 */
function updateMute(obj, data) {
  if ('mute' in data) {
    bcRef.cover(4);
    /**
     * Whether this member is muted server-wide
     * @type {?boolean}
     */
    obj.serverMute = data.mute;
  } else {
    bcRef.cover(5);
    obj.serverMute ??= null;
  }
}

/**
 * Updates the "self_deaf" property.
 * @param {Object} obj The VoiceState instance.
 * @param {Object} data The raw data.
 */
function updateSelfDeaf(obj, data) {
  if ('self_deaf' in data) {
    bcRef.cover(6);
    /**
     * Whether this member is self-deafened
     * @type {?boolean}
     */
    obj.selfDeaf = data.self_deaf;
  } else {
    bcRef.cover(7);
    obj.selfDeaf ??= null;
  }
}

/**
 * Updates the "self_mute" property.
 * @param {Object} obj The VoiceState instance.
 * @param {Object} data The raw data.
 */
function updateSelfMute(obj, data) {
  if ('self_mute' in data) {
    bcRef.cover(8);
    /**
     * Whether this member is self-muted
     * @type {?boolean}
     */
    obj.selfMute = data.self_mute;
  } else {
    bcRef.cover(9);
    obj.selfMute ??= null;
  }
}

/**
 * Updates the "self_video" property.
 * @param {Object} obj The VoiceState instance.
 * @param {Object} data The raw data.
 */
function updateSelfVideo(obj, data) {
  if ('self_video' in data) {
    bcRef.cover(10);
    /**
     * Whether this member's camera is enabled
     * @type {?boolean}
     */
    obj.selfVideo = data.self_video;
  } else {
    bcRef.cover(11);
    obj.selfVideo ??= null;
  }
}

/**
 * Updates the "session_id" property.
 * @param {Object} obj The VoiceState instance.
 * @param {Object} data The raw data.
 */
function updateSessionId(obj, data) {
  if ('session_id' in data) {
    bcRef.cover(12);
    /**
     * The session id for this member's connection
     * @type {?string}
     */
    obj.sessionId = data.session_id;
  } else {
    bcRef.cover(13);
    obj.sessionId ??= null;
  }
}

/**
 * Updates the "streaming" property based on self_video.
 * @param {Object} obj The VoiceState instance.
 * @param {Object} data The raw data.
 */
function updateStreaming(obj, data) {
  // The self_stream property is omitted if false; we check 'self_video'
  if ('self_video' in data) {
    bcRef.cover(14);
    /**
     * Whether this member is streaming using "Screen Share"
     * @type {?boolean}
     */
    obj.streaming = data.self_stream ?? false;
  } else {
    bcRef.cover(15);
    obj.streaming ??= null;
  }
}

/**
 * Updates the "channel_id" property.
 * @param {Object} obj The VoiceState instance.
 * @param {Object} data The raw data.
 */
function updateChannelId(obj, data) {
  if ('channel_id' in data) {
    bcRef.cover(16);
    /**
     * The {@link VoiceChannel} or {@link StageChannel} id the member is in
     * @type {?Snowflake}
     */
    obj.channelId = data.channel_id;
  } else {
    bcRef.cover(17);
    obj.channelId ??= null;
  }
}

/**
 * Updates the "suppress" property.
 * @param {Object} obj The VoiceState instance.
 * @param {Object} data The raw data.
 */
function updateSuppress(obj, data) {
  if ('suppress' in data) {
    bcRef.cover(18);
    /**
     * Whether this member is suppressed from speaking. This property is specific to stage channels only.
     * @type {?boolean}
     */
    obj.suppress = data.suppress;
  } else {
    bcRef.cover(19);
    obj.suppress ??= null;
  }
}

/**
 * Updates the "request_to_speak_timestamp" property.
 * @param {Object} obj The VoiceState instance.
 * @param {Object} data The raw data.
 */
function updateRequestToSpeak(obj, data) {
  if ('request_to_speak_timestamp' in data) {
    bcRef.cover(20);
    /**
     * The time at which the member requested to speak. This property is specific to stage channels only.
     * @type {?number}
     */
    obj.requestToSpeakTimestamp =
      data.request_to_speak_timestamp && Date.parse(data.request_to_speak_timestamp);
  } else {
    bcRef.cover(21);
    obj.requestToSpeakTimestamp ??= null;
  }
}

// The refactored class now simply calls the helper functions.
class VoiceStateRefactored {
  _patch(data) {
    bcRef.cover(1);
    updateDeaf(this, data);
    updateMute(this, data);
    updateSelfDeaf(this, data);
    updateSelfMute(this, data);
    updateSelfVideo(this, data);
    updateSessionId(this, data);
    updateStreaming(this, data);
    updateChannelId(this, data);
    updateSuppress(this, data);
    updateRequestToSpeak(this, data);
    return this;
  }
}

module.exports = {
  VoiceStateRefactored,
  bcRef,
};

if (require.main === module) {
  console.log('Running patchRefactor.js standalone...');
  const vs = new VoiceStateRefactored();
  vs._patch({ mute: true });
  bcRef.report();
}

