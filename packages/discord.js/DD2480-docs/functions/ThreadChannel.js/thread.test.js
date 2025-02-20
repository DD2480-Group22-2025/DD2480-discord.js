import { ThreadChannel } from './ThreadChannelBranch.js';
import { BranchCoverage } from '../../BranchCoverage.js';

// contains all fields
let data1 = {
  name: 'thread',
  guild_id: '1234',
  parent_id: '5678',
  thread_metadata: {
    locked: true,
    invitable: null,
    archived: true,
    auto_archive_duration: 60,
    archive_timestamp: '2022-07-01T00:00:00.000Z',
    create_timestamp: '2022-07-01T00:00:00.000Z',
  },
  last_message_id: '1234',
  last_pin_timestamp: '2022-07-01T00:00:00.000Z',
  rate_limit_per_user: 60,
  message_count: 1,
  member_count: 1,
  total_message_sent: 1,
  applied_tags: ['1234'],
};

// missing parent_id and thread_metadata, applied_tags
let data2 = {
  name: 'test-thread',
  guild_id: '5678',
  last_message_id: '5678',
  last_pin_timestamp: '2023-01-01T00:00:00.000Z',
  rate_limit_per_user: 120,
  message_count: 10,
  member_count: 5,
  total_message_sent: 10,
};

// missing create_timestamp, last_message_id, last_pin_timestamp, rate_limit_per_user
let data3 = {
  name: 'another-thread',
  guild_id: '91011',
  parent_id: '121314',
  thread_metadata: {
    locked: false,
    invitable: null,
    archived: false,
    auto_archive_duration: 4320,
    archive_timestamp: '2024-01-01T00:00:00.000Z',
  },
  message_count: 20,
  member_count: 10,
  total_message_sent: 20,
  applied_tags: ['91011'],
};

// missing message_count, member_count, total_message_sent
let data4 = {
  name: 'thread',
  guild_id: '1234',
  parent_id: '5678',
  thread_metadata: {
    locked: true,
    invitable: null,
    archived: true,
    auto_archive_duration: 60,
    archive_timestamp: '2022-07-01T00:00:00.000Z',
    create_timestamp: '2022-07-01T00:00:00.000Z',
  },
  last_message_id: '1234',
  last_pin_timestamp: '2022-07-01T00:00:00.000Z',
  rate_limit_per_user: 60,
  applied_tags: ['1234'],
};

// initialize coverage tracking
export const bc = new BranchCoverage('ThreadChannelBranch.js:_patch');
bc.setTotal(29);

// mock ThreadChannel class
class MockThreadChannel extends ThreadChannel {
  constructor(data) {
    super(data);
  }
}

/**
 * test function to run the tests
 * takes input data and reports the number of new branches and assertions for the data set in the _patch function
 * @param {string} name - name of the test
 * @param {object} data - input data for the test
 * @param {number} originalCoverage - the number of branches covered before the test
 */
function runTest(name, data, originalCoverage) {
  console.log(name, ': Running test...');
  const threadChannel = new MockThreadChannel(data);
  threadChannel._patch(data);
  console.log(`${bc.coveredBranches.size - originalCoverage} new branches covered!`);

  // Assertions
  try {
    // Basic properties
    console.assert(threadChannel.name === data.name, 'Name should be set correctly');
    console.assert(threadChannel.guildId === data.guild_id, 'Guild ID should be set correctly');
    if (data.parent_id) console.assert(threadChannel.parentId === data.parent_id, 'Parent ID should be set correctly');

    // Thread_metadata
    if (data.thread_metadata) {
      console.assert(threadChannel.locked === data.thread_metadata.locked, 'Locked should be set correctly');
      console.assert(threadChannel.invitable === data.thread_metadata.invitable, 'Invitable should be set correctly');
      console.assert(threadChannel.archived === data.thread_metadata.archived, 'Archived should be set correctly');
      console.assert(
        threadChannel.autoArchiveDuration === data.thread_metadata.auto_archive_duration,
        'Auto Archive Duration should be set correctly',
      );
      console.assert(
        threadChannel.archiveTimestamp === Date.parse(data.thread_metadata.archive_timestamp),
        'Archive Timestamp should be set correctly',
      );
      if (data.thread_metadata.create_timestamp)
        console.assert(
          threadChannel._createdTimestamp === Date.parse(data.thread_metadata.create_timestamp),
          'Created Timestamp should be set correctly',
        );
    } else {
      console.assert(threadChannel.locked === null, 'Locked should be set correctly');
      console.assert(threadChannel.invitable === null, 'Invitable should be set correctly');
      console.assert(threadChannel.archived === null, 'Archived should be set correctly');
      console.assert(threadChannel.autoArchiveDuration === null, 'Auto Archive Duration should be set correctly');
      console.assert(threadChannel.archiveTimestamp === null, 'Archive Timestamp should be set correctly');
      console.assert(threadChannel._createdTimestamp === null, 'Created Timestamp should be set correctly');
    }
    // Message properties
    if (data.last_message_id)
      console.assert(threadChannel.lastMessageId === data.last_message_id, 'Last Message ID should be set correctly');
    if (data.last_pin_timestamp)
      console.assert(
        threadChannel.lastPinTimestamp === Date.parse(data.last_pin_timestamp),
        'Last Pin Timestamp should be set correctly',
      );
    if (data.rate_limit_per_user)
      console.assert(
        threadChannel.rateLimitPerUser === data.rate_limit_per_user,
        'Rate Limit Per User should be set correctly',
      );
    if (data.message_count)
      console.assert(threadChannel.messageCount === data.message_count, 'Message Count should be set correctly');
    if (data.member_count)
      console.assert(threadChannel.memberCount === data.member_count, 'Member Count should be set correctly');
    if (data.total_message_sent)
      console.assert(
        threadChannel.totalMessageSent === data.total_message_sent,
        'Total Message Sent should be set correctly',
      );
    if (data.applied_tags)
      console.assert(
        JSON.stringify(threadChannel.appliedTags) === JSON.stringify(data.applied_tags),
        'Applied Tags should be set correctly',
      );
  } catch (error) {
    console.log(`${name} : Failed`);
    console.error(error);
    return;
  }
  // print the results
  console.log(`${name} : Passed!\n`);
  console.log('-----------------------');
}

// Print the results of running the tests
console.log('Running ThreadChannel._patch coverage tests...\n');

// run the tests
runTest('TEST 1', data1, 0);
const beforeCoverage = bc.coveredBranches.size;
runTest('TEST 2', data2, beforeCoverage);
runTest('TEST 3', data3, beforeCoverage);
runTest('TEST 4', data4, beforeCoverage);

console.log('\n');
console.log(`Original version coverage:`);
bc.report();
