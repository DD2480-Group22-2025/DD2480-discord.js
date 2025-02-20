'use strict';

const { VoiceStateOriginal, bcOrig } = require('./patch.js');
const { VoiceStateRefactored, bcRef } = require('./patchRefactor.js');

const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

/**
 * Compare key properties of two VoiceState instances.
 */
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
      `[${testName}] Mismatch in property "${prop}": original=${vsOrig[prop]} vs refactored=${vsRef[prop]}`
    );
  }
}

/**
 * Runs a test case by patching both implementations and comparing results.
 */
function runTest(name, data) {
  console.log(`\nRunning VoiceState._patch coverage test: ${name}`);

  // Original implementation.
  const vsOrig = new VoiceStateOriginal();
  const beforeOrig = bcOrig.coveredBranches.size;
  vsOrig._patch(data);
  console.log(
    `${GREEN}Original - ${name}: ${bcOrig.coveredBranches.size - beforeOrig} new branches covered${RESET}`
  );

  // Refactored implementation.
  const vsRef = new VoiceStateRefactored();
  const beforeRef = bcRef.coveredBranches.size;
  vsRef._patch(data);
  console.log(
    `${BLUE}Refactored - ${name}: ${bcRef.coveredBranches.size - beforeRef} new branches covered${RESET}`
  );

  compareVoiceStates(name, vsOrig, vsRef);
}

// Four test cases:
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
    name: 'All properties absent',
    data: {},
  },
  {
    name: 'Partial properties set',
    data: {
      deaf: false,
      mute: false,
      session_id: 'def456',
    },
  },
  {
    name: 'All booleans set to false',
    data: {
      deaf: false,
      mute: false,
      self_deaf: false,
      self_mute: false,
      self_video: false,
      self_stream: false,
      session_id: 'ghi789',
      channel_id: '888',
      suppress: false,
      // intentionally omitting request_to_speak_timestamp to use default
    },
  },
];

console.log('Running VoiceState._patch coverage tests...\n');
tests.forEach(test => runTest(test.name, test.data));

console.log('\nFinal coverage:');
console.log(`${GREEN}Original version coverage:${RESET}`);
bcOrig.report();
console.log(`${BLUE}Refactored version coverage:${RESET}`);
bcRef.report();
