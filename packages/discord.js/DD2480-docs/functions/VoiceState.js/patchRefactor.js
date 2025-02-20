'use strict';
const { BranchCoverage } = require('../../BranchCoverage.js');

const bcRef = new BranchCoverage('VoiceState.js:_patchRefactored');
bcRef.setTotal(21);

class VoiceStateRefactored {
  _patch(data) {
    bcRef.cover(1);

    if ('deaf' in data) {
      bcRef.cover(2);
      this.serverDeaf = data.deaf;
    } else {
      bcRef.cover(3);
      this.serverDeaf ??= null;
    }

    if ('mute' in data) {
      bcRef.cover(4);
      this.serverMute = data.mute;
    } else {
      bcRef.cover(5);
      this.serverMute ??= null;
    }

    if ('self_deaf' in data) {
      bcRef.cover(6);
      this.selfDeaf = data.self_deaf;
    } else {
      bcRef.cover(7);
      this.selfDeaf ??= null;
    }

    if ('self_mute' in data) {
      bcRef.cover(8);
      this.selfMute = data.self_mute;
    } else {
      bcRef.cover(9);
      this.selfMute ??= null;
    }

    if ('self_video' in data) {
      bcRef.cover(10);
      this.selfVideo = data.self_video;
    } else {
      bcRef.cover(11);
      this.selfVideo ??= null;
    }

    if ('session_id' in data) {
      bcRef.cover(12);
      this.sessionId = data.session_id;
    } else {
      bcRef.cover(13);
      this.sessionId ??= null;
    }

    if ('self_video' in data) {
      bcRef.cover(14);
      this.streaming = data.self_stream ?? false;
    } else {
      bcRef.cover(15);
      this.streaming ??= null;
    }

    if ('channel_id' in data) {
      bcRef.cover(16);
      this.channelId = data.channel_id;
    } else {
      bcRef.cover(17);
      this.channelId ??= null;
    }

    if ('suppress' in data) {
      bcRef.cover(18);
      this.suppress = data.suppress;
    } else {
      bcRef.cover(19);
      this.suppress ??= null;
    }

    if ('request_to_speak_timestamp' in data) {
      bcRef.cover(20);
      this.requestToSpeakTimestamp =
        data.request_to_speak_timestamp && Date.parse(data.request_to_speak_timestamp);
    } else {
      bcRef.cover(21);
      this.requestToSpeakTimestamp ??= null;
    }

    return this;
  }
}

module.exports = {
  VoiceStateRefactored,
  bcRef,
};

// Same pattern: if we run patchRefactor.js directly, do a quick check
if (require.main === module) {
  console.log('Running patchRefactor.js standalone...');
  const vs = new VoiceStateRefactored();
  vs._patch({ mute: true });
  bcRef.report();
}
