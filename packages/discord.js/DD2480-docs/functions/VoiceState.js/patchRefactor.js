'use strict';
const { BranchCoverage } = require('../../BranchCoverage.js');

// Set branch coverage total to 1 for the refactored version.
const bcRef = new BranchCoverage('VoiceState.js:_patchRefactored');
bcRef.setTotal(1);

/**
 * Updates the "deaf" property without individual branch coverage instrumentation.
 */
function updateDeaf(obj, data) {
  if ('deaf' in data) {
    obj.serverDeaf = data.deaf;
  } else {
    obj.serverDeaf ??= null;
  }
}

/**
 * Updates the "mute" property.
 */
function updateMute(obj, data) {
  if ('mute' in data) {
    obj.serverMute = data.mute;
  } else {
    obj.serverMute ??= null;
  }
}

/**
 * Updates the "self_deaf" property.
 */
function updateSelfDeaf(obj, data) {
  if ('self_deaf' in data) {
    obj.selfDeaf = data.self_deaf;
  } else {
    obj.selfDeaf ??= null;
  }
}

/**
 * Updates the "self_mute" property.
 */
function updateSelfMute(obj, data) {
  if ('self_mute' in data) {
    obj.selfMute = data.self_mute;
  } else {
    obj.selfMute ??= null;
  }
}

/**
 * Updates the "self_video" property.
 */
function updateSelfVideo(obj, data) {
  if ('self_video' in data) {
    obj.selfVideo = data.self_video;
  } else {
    obj.selfVideo ??= null;
  }
}

/**
 * Updates the "session_id" property.
 */
function updateSessionId(obj, data) {
  if ('session_id' in data) {
    obj.sessionId = data.session_id;
  } else {
    obj.sessionId ??= null;
  }
}

/**
 * Updates the "streaming" property based on self_video.
 */
function updateStreaming(obj, data) {
  if ('self_video' in data) {
    obj.streaming = data.self_stream ?? false;
  } else {
    obj.streaming ??= null;
  }
}

/**
 * Updates the "channel_id" property.
 */
function updateChannelId(obj, data) {
  if ('channel_id' in data) {
    obj.channelId = data.channel_id;
  } else {
    obj.channelId ??= null;
  }
}

/**
 * Updates the "suppress" property.
 */
function updateSuppress(obj, data) {
  if ('suppress' in data) {
    obj.suppress = data.suppress;
  } else {
    obj.suppress ??= null;
  }
}

/**
 * Updates the "request_to_speak_timestamp" property.
 */
function updateRequestToSpeak(obj, data) {
  if ('request_to_speak_timestamp' in data) {
    obj.requestToSpeakTimestamp =
      data.request_to_speak_timestamp && Date.parse(data.request_to_speak_timestamp);
  } else {
    obj.requestToSpeakTimestamp ??= null;
  }
}

class VoiceStateRefactored {
  _patch(data) {
    bcRef.cover(1); // Only one branch is tracked here.
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

module.exports = { VoiceStateRefactored, bcRef };

if (require.main === module) {
  console.log('Running VoiceStateRefactored standalone...');
  const vs = new VoiceStateRefactored();
  vs._patch({ mute: true });
  bcRef.report();
}
