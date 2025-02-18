# Coverage measurement and Improvement

## Task 1: DIY

Implement branch coverage by manual instrumentation of the source code for five functions
with high cyclomatic complexity. Use a separate development branch or repo for this, as this code is
not permanent. The simplest method for this is as follows:

1. Identify all branches in the given functions; assign a unique number (ID) to each one.
2. Before the program starts (before the first instruction in “main” or as the first step in the unit test
   harness), create data structures that hold coverage information about specific branches.
3. Before the first statement of each branch outcome (including to-be-added “else” clauses if none exist),
   add a line that sets a flag if the branch is reached.
4. At the end of the program (as the last instruction in “main” or at the end of all unit tests), write all
   information about the taken branches taken to a file or console.
   Note: It is perfectly fine if your coverage tool is inefficient (memory-wise or time-wise) and its output may
   be hard to read. For example, you may allocate 100 coverage measurement points to each function, so
   you can easily divide the entries into a fixed-size array.

- What is the quality of your own coverage measurement? Does it take into account ternary operators(condition ? yes : no) and exceptions, if available in your language?

The quality of our coverage measurement seems to be accurate. It takes in to account all of the branches available in the code, only counting the if statements. The ternary operators in JavaScript were also split into if/else statements in order to properly count the branches. We had no exceptions in any of your 5 functions so we did not need to meausre how the coverage would be affected by an exception.

- What are the limitations of your tool? How would the instrumentation change if you modify the program?

Our tools are made specifically for the functions we chose. The decision points are manually calculated and markers are put there to count the branches. If we were to modify the program, we would also need to modify our branch coverage checker to ensure that we are correctly counting the branch coverage.

- If you have an automated tool, are your results consistent with the ones produced by existing tool(s)?

We don't have an automated tool. ...?

### \src\structures\Attachment.js: \_patch - Carl

### \src\structures\VoiceState.js: \_patch - Klara

### \src\structures\ApplicationCommand.js: equals - Jacob

### \src\structures\ThreadChannel.js: \_patch - Phoebe

### \src\structures\Guild.js: \_patch - Samuel

## Task 2: Coverage improvement

Keep a copy of your original coverage, try to improve coverage with additional test cases on a new branch.

- Identify the requirements that are tested or untested by the given test suite.
- Document the requirements (as comments), and use them later as assertions.
- Create new test cases as needed to improve branch coverage in the given functions. Can you call the function directly? Can you expand on existing tests? Do you have to add additional interfaces to the system (as public methods) to make it possible to set up test data structures?

### \src\structures\Attachment.js: \_patch - Carl

### \src\structures\VoiceState.js: \_patch - Klara

### \src\structures\ApplicationCommand.js: equals - Jacob

### \src\structures\ThreadChannel.js: \_patch - Phoebe

### \src\structures\Guild.js: \_patch - Samuel

# Task 3: Refactoring Plan

Is the high complexity you identified really necessary? Is it possible to split up the code (in the five complex functions you have identified) into smaller units to reduce complexity? If so, how would you go about this? Document your plan.

### \src\structures\Attachment.js: \_patch - Carl

### \src\structures\VoiceState.js: \_patch - Klara

### \src\structures\ApplicationCommand.js: equals - Jacob

### \src\structures\ThreadChannel.js: \_patch - Phoebe

### \src\structures\Guild.js: \_patch - Samuel
