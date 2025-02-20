'use strict';
const { BranchCoverage } = require('../../BranchCoverage.js');

const bcOrig = new BranchCoverage('VoiceState.js:_patchOriginal');
bcOrig.setTotal(21);

class VoiceStateOriginal {
  _patch(data) {
    bcOrig.cover(1);
    if ('deaf' in data) {
      bcOrig.cover(2);
      this.serverDeaf = data.deaf;
    } else {
      bcOrig.cover(3);
      this.serverDeaf ??= null;
    }

    if ('mute' in data) {
      bcOrig.cover(4);
      this.serverMute = data.mute;
    } else {
      bcOrig.cover(5);
      this.serverMute ??= null;
    }

    if ('self_deaf' in data) {
      bcOrig.cover(6);
      this.selfDeaf = data.self_deaf;
    } else {
      bcOrig.cover(7);
      this.selfDeaf ??= null;
    }

    if ('self_mute' in data) {
      bcOrig.cover(8);
      this.selfMute = data.self_mute;
    } else {
      bcOrig.cover(9);
      this.selfMute ??= null;
    }

    if ('self_video' in data) {
      bcOrig.cover(10);
      this.selfVideo = data.self_video;
    } else {
      bcOrig.cover(11);
      this.selfVideo ??= null;
    }

    if ('session_id' in data) {
      bcOrig.cover(12);
      this.sessionId = data.session_id;
    } else {
      bcOrig.cover(13);
      this.sessionId ??= null;
    }

    // Update streaming based on presence of 'self_video'
    if ('self_video' in data) {
      bcOrig.cover(14);
      this.streaming = data.self_stream ?? false;
    } else {
      bcOrig.cover(15);
      this.streaming ??= null;
    }

    if ('channel_id' in data) {
      bcOrig.cover(16);
      this.channelId = data.channel_id;
    } else {
      bcOrig.cover(17);
      this.channelId ??= null;
    }

    if ('suppress' in data) {
      bcOrig.cover(18);
      this.suppress = data.suppress;
    } else {
      bcOrig.cover(19);
      this.suppress ??= null;
    }

    if ('request_to_speak_timestamp' in data) {
      bcOrig.cover(20);
      this.requestToSpeakTimestamp =
        data.request_to_speak_timestamp && Date.parse(data.request_to_speak_timestamp);
    } else {
      bcOrig.cover(21);
      this.requestToSpeakTimestamp ??= null;
    }
    return this;
  }
}

module.exports = { VoiceStateOriginal, bcOrig };

if (require.main === module) {
  console.log('Running VoiceStateOriginal standalone...');
  const vs = new VoiceStateOriginal();
  vs._patch({ deaf: true });
  bcOrig.report();
}
