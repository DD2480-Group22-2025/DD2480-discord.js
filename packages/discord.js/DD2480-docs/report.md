# Report

## Onboarding

### How good is the onboarding documentation? How easily can you build the project? Briefly describe if everything worked as documented or not:

**- Did you have to install a lot of additional tools to build the software?**

- Different for everyone, but as long as you have node installed, you should be able to build the project without any additional tools. Samuel had bun installed, and `bun add discord.js` worked fine. Phoebe and the rest of the group used pnpm after installing it, and it worked fine.

**- Were those tools well documented?**

- Yes, they were, and the whole process was simple because we only required a js runtime to install everything. As for Discord, the documentation was good and comprehensive. They had another page where they listed exactly how to get started and how to create new things [here](https://github.com/discordjs/discord.js/blob/main/.github/CONTRIBUTING.md). They also had a page that explains how to get started to work on the codebase. So this was extremely helpful in getting started. Given that this is a very popular library for discord and development of bots, the documentation is and has to be good and comprehensive.

**- Were other components installed automatically by the build script?**

- The components needed were installed using the runtime tools presented in the readme and everything was installed automatically. It was a really simple process to get started.

**- Did the build conclude automatically without errors?**

- The build concluded automatically without errors, when using pnpm as the package manager.

**- How well do examples and tests run on your system(s)?**

- Running `pnpm run test` ran 27 tasks that were all successful. Amazing!

## Complexity Measurement

### Running lizard on the code base

The top 5 cyclomatic complex functions were:

    NLOC    CCN   token  PARAM  length  location
     176     81   1120      1     357 _patch@129-485@.\packages\discord.js\src\structures\Guild.js
      69     55    521      1     154 _patch@54-207@.\packages\discord.js\src\structures\ThreadChannel.js
      37     51    319      2      46 equals@362-407@.\packages\discord.js\src\structures\ApplicationCommand.js
      53     34    290      1     105 _patch@27-131@.\packages\discord.js\src\structures\VoiceState.js
      53     30    303      1     121 _patch@27-147@.\packages\discord.js\src\structures\Attachment.js

### Cyclomatic complexity

Functions assigned to each group member:

#### \src\structures\Attachment.js: \_patch - Carl

- Samuel's count: 29
- Carl's count: 29

#### \src\structures\VoiceState.js: \_patch - Klara

- Carl's count: 30
- Klara's count: 29

#### \src\structures\ApplicationCommand.js: equals - Jacob

- Klara's count: 50
- Jacob's count: 47

#### \src\structures\ThreadChannel.js: \_patch - Phoebe

- Jacob's count: 48
- Phoebe's count: 50

#### \src\structures\Guild.js: \_patch - Samuel

- Phoebe's count: 73
- Samuel's count: 71

**- Did everyone get the same result? Is there something that is unclear? If you
have a tool, is its result the same as yours?**

- Everyone got different results for most of the functions. The tool consistently gave a higher count than we did. An unclear aspect was that, after looking at the source code for lizard, we noticed that it seems to recursively count branches and the frequency of different types of symbols. In any piece of code that is not trivially simple, humans will have a hard time counting the branches correctly, especially given the exponential growth of branches in the number of symbols. The formula for counting the cyclomatic complexity itself is quite simple, but it's hard to apply it correctly to a piece of code. Source code for TypeScript specifically:

  ```ts
  class TypeScriptReader(CodeReader, CCppCommentsMixin):
    # pylint: disable=R0903

    ext = ['ts']
    language_names = ['typescript', 'ts']
    _conditions = set(['if', 'elseif', 'for', 'while', '&&', '||', '?',
                      'catch', 'case'])

    def __init__(self, context):
        super().__init__(context)
        self.parallel_states = [TypeScriptStates(context)]

    @staticmethod
    @js_style_regex_expression
    def generate_tokens(source_code, addition='', token_class=None):
        addition = addition +\
            r"|(?:\$\w+)" + \
            r"|(?:\w+\?)" + \
            r"|`.*?`"
        js_tokenizer = JSTokenizer()
        for token in CodeReader.generate_tokens(
                source_code, addition, token_class):
            for tok in js_tokenizer(token):
                yield tok
  ```

**- Are the functions/methods with high CC also very long in terms of LOC?**

- It seems to be positively correlated, however, it's not always the case, see the equals function in ApplicationCommand.js.
  **- What is the purpose of these functions? Is it related to the high CC?**
- We have two different kinds of functions:
  - `equals`: determines whether two commands are the same
  - `_patch`: updates the relevant parts of the object based on the data received from the API
- It makes sense that the `equals` function has a high CC, because it has to check all properties of the object. The `_patch` functions are also quite long, but they are not as complex as the `equals` - they mostly just check if a property exists and then update the object accordingly.
  **- If your programming language uses exceptions: Are they taken into account by the tool? If you think of an exception as another possible branch (to the catch block or the end of the function), how is the CC affected?**
- Looking at the source code for the tool above, it seems that it does take exceptions into account as noted by the 'catch' in the \_conditions set.
  **- Is the documentation of the function clear about the different possible outcomes induced by different branches taken?**
- In the `_patch` functions, since they are not very complex, documentation is not really needed since the code is self-explanatory. For the `equals` function, the documentation is a little bit clearer.

## Refactoring Plan

**Is the high complexity you identified really necessary? Is it possible to split up the code (in the five complex functions you have identified) into smaller units to reduce complexity? If so, how would you go about this?
Document your plan.**

For 4/5 of our highly complex functions, they are considered `patch` functions. These are used to update object properties with new data. When new data is received from the API, the patch function will update the information for the specific object referenced. It is also necessary to have many of the conditions in these functions to check to see if any data is null so that it can handle the initialization properly. By keeping the logic of the patch function all in one place, it allows for updating these objects to be consistent since all of the updates occur in one place. It is possible to split up these complex functions, but perhaps for cohesiveness it would be best to keep them together. We each attempted to refactor our solutions to see if we could reduce the cyclomatic complexity by at least 35 percent, which we were able to do for all of the functions!

One (out of 5) of our most complex functions was the equals function in the ApplicationCommand.js file. It is quite a cyclomatically complex function since it aims to do a lot of top level parameter checks, null checks, and permissions checks all in one function, which results in many ternary operators and conditional checks.

#### \src\structures\Attachment.js: \_patch - Carl

My \_patch function in Attachment.js had an original CCN of 34. The purpose of the function was to update a bunch of instances of an object, which made it logical to split these actions into several smaller function. The refactored version of the \_patch function got a CCN of 3, while the smaller functions got a CCN of between 2 and 4. Lizard can be runned through `lizard .\packages\discord.js\DD2480-docs\functions\Attachment.js\patch_refactored.js`.

#### \src\structures\VoiceState.js: \_patch - Klara

My \_patch function in VoiceState.js had an original CCN of 34. It had a very high cyclomatic complexity, driven by many conditional checks on the incoming data. To address this, I extracted each property check (e.g., 'deaf' in data, 'mute' in data, etc.) into small, single-purpose helper functions. These changes can be found in file. This led me to shrink the complexity to 6 and give an average CCN of 4, reducing the CCN with 82.4%. You can run lizard on this file by running `lizard .\packages\discord.js\DD2480-docs\functions\VoiceState.js`.

#### \src\structures\ApplicationCommand.js: equals - Jacob

The function initially had a cyclomatic complexity (CCN) of 51. Mostly there is nothing to do to improve the function as the CCN comes from null-checks and other such precautions. The proposals are assuming some fundamental changes could be made to the rest of the code base, namely agreeing on a case convention for the project, now it needs to check for both snake and camelcase, also a huge improvement can be made if we assume all fields exist and don't have to do any null-checking. Simply removing redundant cases for whether fields are named as camel or snake case decreases CCN 42 and then removing all null-checks further decreases CCN to 13. Whether this can be done is however unclear, and it might just be a defect inherent to the language. Another option would simply be to split the function into multiple tiny functions. Doing this dropped the CCN of equals to 13, with an average of 4 for the entire file.

#### \src\structures\ThreadChannel.js: \_patch - Phoebe

My \_patch function in ThreadChannel.js had an original CCN of 55. There were many different conditional checks for what data was contained in the metadata. In order to reduce this number, I ended up splitting each of these conditional checks into their own functions. I made these changes and you can see them in this [file](../DD2480-docs/functions/ThreadChannel.js/ThreadChannelRefactor.js). By separating out each of the data checks into their own functions, I was able to reduce the CCN from 55 to 8. This created 13 new functions that all have a cyclomatic complexity of less than 11. You can run lizard on this file by running `lizard .\packages\discord.js\DD2480-docs\functions\ThreadChannel.js\ThreadChannelRefactor.js`.

#### \src\structures\Guild.js: \_patch - Samuel

My \_patch function in Guild.js had a CCN of 81 to begin with. Since the function itself was quite simple, and only had a series of conditional checks/updates, I was easily able to split this logic into smaller functions. You can see the refactored code in this [file](../DD2480-docs/functions/Guild.js/patch_refactored.js). By splitting the logic into smaller functions, I reduced the CCN from 81 to 3, believe it or not. This created many new atomic functions that have an average CCN of 2.8. You can run lizard on this file by running `lizard .\packages\discord.js\DD2480-docs\functions\Guild.js\GuildRefactor.js`.

## Coverage Measurement and Improvement

### Task 1: DIY

**- What is the quality of your own coverage measurement? Does it take into account ternary operators (condition ? yes : no) and exceptions, if available in your language?**

- It takes into account anything depending on what branches you decide on including in the coverage measurement. For ternary operators, you would have to rewrite the code to include the branches properly. Since we are manually adding flags to each branch, we can also easily include exceptions.

**- What are the limitations of your tool? How would the instrumentation change if you modify the program?**

- It would be a lot of work to modify the instrumentation to work with the program. Because of the manual nature of the instrumentation, you would have to rewrite the code to include the branches properly.
  **- If you have an automated tool, are your results consistent with the ones produced by existing tool(s)?**

- There is an automated testing suite for discordjs, but it doesn't cover any of the functions that we are analysing. Therefore, we can't compare the results, and have decided to create our own mini-suite to test the functions.

### \src\structures\VoiceState.js: \_patch - Klara

### \src\structures\ApplicationCommand.js: equals - Jacob

### \src\structures\ThreadChannel.js: \_patch - Phoebe

### \src\structures\Guild.js: \_patch - Samuel

## Coverage improvement

- In the five functions with high cyclomatic complexity, what is the current branch coverage? Is branch coverage
  higher or lower than in the rest of the code (if you have automated coverage)?

None of the \_patch functions have any branch coverage at all, so the coverage is definitely lower than in the rest of the code, which has about 38% branch coverage.

### \src\structures\Attachment.js: \_patch - Carl

- The branch coverage for the \_patch function in Attachment.js is 45%,
  with 8 out of 20 covered branches.

### \src\structures\VoiceState.js: \_patch - Klara

### \src\structures\ApplicationCommand.js: equals - Jacob

### \src\structures\ThreadChannel.js: \_patch - Phoebe

### \src\structures\Guild.js: \_patch - Samuel

## Way of working

We are currently in the state \[WORKING WELL\]. Our original process for working has been adapted to better suit our needs, such as communicating and meeting more frequently and updating each other on our progress. We natrually work well together and are able to support each other in different ways. In order to continue to improve, we could do a better job at agreeing on deadlines and communicating about reaching those deadlines. As we continue to work together, we are figuring out different practices that allow us to make more progress. The next state in the Essence standards is \[RETIRED\]. We will not want to reach this state until we are done with this class and working as a group.

## Development Guidelines

Issue guidelines

- Issues should have atomic names, for example: `feat - new feature`
- Issues should be linked to a commit
- Issues should be assigned to at least one member

Commit guidelines

- Commit messages should have atomic names, for example: `doc: update readme`
- Commit messages should be linked to an issue

Branch guidelines

- Branches should have atomic names and member initials, for example `doc/guidelines/ps`
- Branches should always be created to implement or fix features and pull requests are required to commit to the main branch
