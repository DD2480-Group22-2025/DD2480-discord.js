import { ApplicationCommand } from './ApplicationCommand.js';
import { BranchCoverage } from '../../BranchCoverage.js';

// contains some fields
let data1 = {
  id: '1',
  name: 'command',
  description: 'some text',
  version: '1.1',
  default_member_permissions: null
};

// identical to data1
let data2 = {
  id: '1',
  name: 'command',
  description: 'some text',
  version: '1.1',
  default_member_permissions: null
};

// camelcase
let data3 = {
  id: '1',
  name: 'command',
  description: 'some text',
  version: '1.1',
  defaultMemberPermission: null
};

// different version
let data4 = {
  id: '1',
  name: 'command',
  description: 'some text',
  version: '1.112',
  default_member_permissions: null
};

// no description
let data5 = {
  id: '1',
  name: 'command',
  version: '1.1',
  default_member_permissions: null
};

// initialize coverage tracking
export const bc = new BranchCoverage('ApplicationCommand.js:equals');
bc.setTotal(5);

// mock ApplicationCommand class
class MockApplicationCommand extends ApplicationCommand {
  constructor(data) {
    super(null, data, null, null);
  }
}

/**
 * test function to run the tests
 * takes input data and reports the number of new branches and assertions for the data set in the equals function
 * @param {string} name - name of the test
 * @param {object} data1 - first input data for the test
 * @param {object} data2 - second input data for the test
 * @param {number} originalCoverage - the number of branches covered before the test
 * @param {boolean} res - what the test should evaluate to
 */
function runTest(name, data1, data2, originalCoverage, res) {
  console.log(name, ': Running test...');
  const firstApplicationCommand  = new MockApplicationCommand(data1);
  const secondApplicationCommand = new MockApplicationCommand(data2);
  console.log(bc)
  console.log(`${bc.coveredBranches.size - originalCoverage} new branches covered!`);

  // Assertions
  try {
    // Basic properties
    console.assert(firstApplicationCommand.equals(secondApplicationCommand) === res)
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
console.log('Running applicationCommand.equals coverage tests...\n');


// run the tests
const beforeCoverage = bc.coveredBranches.size;
runTest('TEST 1', data1, data2, beforeCoverage, true);
runTest('TEST 2', data1, data3, beforeCoverage, true);
runTest('TEST 3', data1, data4, beforeCoverage, false);
runTest('TEST 4', data1, data5, beforeCoverage, false);

console.log('\n');
console.log(`Original version coverage:`);
bc.report();
