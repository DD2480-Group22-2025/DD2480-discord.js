const { BranchCoverage } = require('../../BranchCoverage.js');
const bc = new BranchCoverage('VoiceState.js:_patch');

class VoiceState {
    constructor() { }

    _patch(data) {
        bc.cover(1);
        if ('deaf' in data) {
            bc.cover(2);
            /**
             * Whether this member is deafened server-wide
             * @type {?boolean}
             */
            this.serverDeaf = data.deaf;
        } else {
            bc.cover(3);
            this.serverDeaf ??= null;
        }

        if ('mute' in data) {
            bc.cover(4);
            /**
             * Whether this member is muted server-wide
             * @type {?boolean}
             */
            this.serverMute = data.mute;
        } else {
            bc.cover(5);
            this.serverMute ??= null;
        }

        if ('self_deaf' in data) {
            bc.cover(6);
            /**
             * Whether this member is self-deafened
             * @type {?boolean}
             */
            this.selfDeaf = data.self_deaf;
        } else {
            bc.cover(7);
            this.selfDeaf ??= null;
        }

        if ('self_mute' in data) {
            bc.cover(8);
            /**
             * Whether this member is self-muted
             * @type {?boolean}
             */
            this.selfMute = data.self_mute;
        } else {
            bc.cover(9);
            this.selfMute ??= null;
        }

        if ('self_video' in data) {
            bc.cover(10);
            /**
             * Whether this member's camera is enabled
             * @type {?boolean}
             */
            this.selfVideo = data.self_video;
        } else {
            bc.cover(11);
            this.selfVideo ??= null;
        }

        if ('session_id' in data) {
            bc.cover(12);
            /**
             * The session id for this member's connection
             * @type {?string}
             */
            this.sessionId = data.session_id;
        } else {
            bc.cover(13);
            this.sessionId ??= null;
        }

        // The self_stream is property is omitted if false, check for another property
        // here to avoid incorrectly clearing this when partial data is specified
        if ('self_video' in data) {
            bc.cover(14);
            /**
             * Whether this member is streaming using "Screen Share"
             * @type {?boolean}
             */
            this.streaming = data.self_stream ?? false;
        } else {
            bc.cover(15);
            this.streaming ??= null;
        }

        if ('channel_id' in data) {
            bc.cover(16);
            /**
             * The {@link VoiceChannel} or {@link StageChannel} id the member is in
             * @type {?Snowflake}
             */
            this.channelId = data.channel_id;
        } else {
            bc.cover(17);
            this.channelId ??= null;
        }

        if ('suppress' in data) {
            bc.cover(18);
            /**
             * Whether this member is suppressed from speaking. This property is specific to stage channels only.
             * @type {?boolean}
             */
            this.suppress = data.suppress;
        } else {
            bc.cover(19);
            this.suppress ??= null;
        }

        if ('request_to_speak_timestamp' in data) {
            bc.cover(20);
            /**
             * The time at which the member requested to speak. This property is specific to stage channels only.
             * @type {?number}
             */
            this.requestToSpeakTimestamp = data.request_to_speak_timestamp && Date.parse(data.request_to_speak_timestamp);
        } else {
            bc.cover(21);
            this.requestToSpeakTimestamp ??= null;
        }

        return this;
    }
}

const voiceState = new VoiceState();
bc.setTotal(21);
voiceState._patch({}); // Pass an empty object for minimal coverage
bc.report();
