'use strict';

// We import everything as usual:
const { VoiceStateOriginal, bcOrig } = require('./patch.js');
const { VoiceStateRefactored, bcRef } = require('./patchRefactor.js');

const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

function compareVoiceStates(testName, vsOrig, vsRef) {
  const props = [
    'serverDeaf',
    'serverMute',
    'selfDeaf',
    'selfMute',
    'selfVideo',
    'sessionId',
    'streaming',
    'channelId',
    'suppress',
    'requestToSpeakTimestamp',
  ];
  for (const prop of props) {
    console.assert(
      vsOrig[prop] === vsRef[prop],
      `[${testName}] mismatch "${prop}": orig=${vsOrig[prop]} vs ref=${vsRef[prop]}`
    );
  }
}

function runTest(name, data) {
  console.log(`\n[TEST] ${name}`);
  // Original
  const vsOrig = new VoiceStateOriginal();
  vsOrig._patch(data);
  console.log(`${GREEN}Original coverage so far${RESET}`);
  bcOrig.report();

  // Refactored
  const vsRef = new VoiceStateRefactored();
  vsRef._patch(data);
  console.log(`${BLUE}Refactored coverage so far${RESET}`);
  bcRef.report();

  compareVoiceStates(name, vsOrig, vsRef);
}

// Some test scenarios
const tests = [
  {
    name: 'All booleans set to true',
    data: {
      deaf: true,
      mute: true,
      self_deaf: true,
      self_mute: true,
      self_video: true,
      self_stream: true,
      session_id: 'abc123',
      channel_id: '999',
      suppress: true,
      request_to_speak_timestamp: new Date().toISOString(),
    },
  },
  {
    name: 'All booleans absent',
    data: {},
  },
  {
    name: 'Partial props set',
    data: { 
      deaf: false,
      mute: false,
      session_id: 'def456',
    },
  },
];

tests.forEach(t => runTest(t.name, t.data));

// final coverage
console.log('\nFinal coverage:');
console.log(`${GREEN}Original${RESET}`);
bcOrig.report();
console.log(`${BLUE}Refactored${RESET}`);
bcRef.report();
