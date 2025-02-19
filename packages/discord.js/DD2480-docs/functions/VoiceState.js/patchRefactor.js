'use strict';

const { BranchCoverage } = require('../../BranchCoverage.js');
const bc = new BranchCoverage('VoiceState.js:_patch');

function updateDeaf(obj, data) {
  if ('deaf' in data) {
    bc.cover(2);
    /**
     * Whether this member is deafened server-wide
     * @type {?boolean}
     */
    obj.serverDeaf = data.deaf;
  } else {
    bc.cover(3);
    obj.serverDeaf ??= null;
  }
}

function updateMute(obj, data) {
  if ('mute' in data) {
    bc.cover(4);
    /**
     * Whether this member is muted server-wide
     * @type {?boolean}
     */
    obj.serverMute = data.mute;
  } else {
    bc.cover(5);
    obj.serverMute ??= null;
  }
}

function updateSelfDeaf(obj, data) {
  if ('self_deaf' in data) {
    bc.cover(6);
    /**
     * Whether this member is self-deafened
     * @type {?boolean}
     */
    obj.selfDeaf = data.self_deaf;
  } else {
    bc.cover(7);
    obj.selfDeaf ??= null;
  }
}

function updateSelfMute(obj, data) {
  if ('self_mute' in data) {
    bc.cover(8);
    /**
     * Whether this member is self-muted
     * @type {?boolean}
     */
    obj.selfMute = data.self_mute;
  } else {
    bc.cover(9);
    obj.selfMute ??= null;
  }
}

function updateSelfVideo(obj, data) {
  if ('self_video' in data) {
    bc.cover(10);
    /**
     * Whether this member's camera is enabled
     * @type {?boolean}
     */
    obj.selfVideo = data.self_video;
  } else {
    bc.cover(11);
    obj.selfVideo ??= null;
  }
}

function updateSessionId(obj, data) {
  if ('session_id' in data) {
    bc.cover(12);
    /**
     * The session id for this member's connection
     * @type {?string}
     */
    obj.sessionId = data.session_id;
  } else {
    bc.cover(13);
    obj.sessionId ??= null;
  }
}

function updateStreaming(obj, data) {
  // The self_stream property is omitted if false, so we check 'self_video'
  if ('self_video' in data) {
    bc.cover(14);
    /**
     * Whether this member is streaming using "Screen Share"
     * @type {?boolean}
     */
    obj.streaming = data.self_stream ?? false;
  } else {
    bc.cover(15);
    obj.streaming ??= null;
  }
}

function updateChannelId(obj, data) {
  if ('channel_id' in data) {
    bc.cover(16);
    /**
     * The {@link VoiceChannel} or {@link StageChannel} id the member is in
     * @type {?Snowflake}
     */
    obj.channelId = data.channel_id;
  } else {
    bc.cover(17);
    obj.channelId ??= null;
  }
}

function updateSuppress(obj, data) {
  if ('suppress' in data) {
    bc.cover(18);
    /**
     * Whether this member is suppressed from speaking. (Stage channels only)
     * @type {?boolean}
     */
    obj.suppress = data.suppress;
  } else {
    bc.cover(19);
    obj.suppress ??= null;
  }
}

function updateRequestToSpeak(obj, data) {
  if ('request_to_speak_timestamp' in data) {
    bc.cover(20);
    /**
     * The time at which the member requested to speak. (Stage channels only)
     * @type {?number}
     */
    obj.requestToSpeakTimestamp =
      data.request_to_speak_timestamp && Date.parse(data.request_to_speak_timestamp);
  } else {
    bc.cover(21);
    obj.requestToSpeakTimestamp ??= null;
  }
}

class VoiceState {
  _patch(data) {
    // Coverage for entering _patch
    bc.cover(1);

    // Call each helper function in turn
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


bc.setTotal(21);
const voiceState = new VoiceState();
voiceState._patch({}); 
bc.report();

module.exports = { VoiceState };
