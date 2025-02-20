# Refactoring Plan

Is the high complexity you identified really necessary? Is it possible to split up the code (in the five complex functions you have identified) into smaller units to reduce complexity? If so, how would you go about this?
Document your plan.

For 4/5 of our highly complex functions, they are considered patch functions. These are used to update object properties with new data. When new data is received from the API, the patch function will update the information for the specific object referenced. It is also necessary to have many of the conditions in these functions to check to see if any data is null so that it can handle the initialization properly. By keeping the logic of the patch function all in one place, it allows for updating these objects to be consistent since all of the updates occur in one place. It is possible to split up these complex functions, but perhaps for cohesiveness it would be best to keep them together. We each attempted to refactor our solutions to see if we could reduce the cyclomatic complexity by at least 35 percent.

One (out of 5) of our most complex functions was the equals function in the ApplicationCommand.js file. It is quite a cyclomatic complex function since it aims to do a lot of top level parameter checks, null checks, and permissions checks all in one function.

Below we will need to show how we might make these changes (and how we implemented them for the P+) so that it reduces the cyclomatic complexity.

### \src\structures\Attachment.js: \_patch - Carl

My \_patch function in Attachment.js had an original CCN of 34. The purpose of the function was to update a bunch of
instances of an object, which made it logical to split these actions into several smaller function. The refactored version of the \_patch function got a CCN of 3, while the smaller functions got a CCN of between 2 and 4. Lizard can be runned through `lizard .\packages\discord.js\DD2480-docs\functions\Attachment.js\patch_refactored.js`.

### \src\structures\VoiceState.js: \_patch - Klara
My \_patch function in VoiceState.js had an original CCN of 34. It had a very high cyclomatic complexity, driven by many conditional checks on the incoming data. To address this, I extracted each property check (e.g., 'deaf' in data, 'mute' in data, etc.) into small, single-purpose helper functions. These changes can be found in [file](../DD2480-docs/functions/VoiceState.js/patchRefactor.js). This led me to shrink the complexity to 6 and give an average CCN of 4, reducing the CCN with 82.4%. You can run lizard on this file by running `lizard .\packages\discord.js\DD2480-docs\functions\VoiceState.js`.

### \src\structures\ApplicationCommand.js: equals - Jacob

The function initially had a cyclomatic complexity (CCN) of 51. Mostly there is nothing to do to improve the function as the CCN comes from null-checks and other such precautions. The proposals are assuming some fundamental changes could be made to the rest of the code base, namely agreeing on a case convention for the project, now it needs to check for both snake and camelcase, also a huge improvement can be made if we assume all fields exist and don't have to do any null-checking. Simply removing redundant cases for whether fields are named as camel or snake case decreases CCN 42 and then removing all null-checks further decreases CCN to 13. Whether this can be done is however unclear, and it might just be a defect inherent to the language. Another option would simply be to split the function into multiple tiny functions. Doing this dropped the CCN of equals to 13with an average of 4 for the entire file.


### \src\structures\ThreadChannel.js: \_patch - Phoebe

My \_patch function in ThreadChannel.js had an original CCN of 55. There were many different conditional checks for what data was contained in the metadata. In order to reduce this number, I ended up splitting each of these conditional checks into their own functions. I made these changes and you can see them in this [file](../DD2480-docs/functions/thread-patch-refactor.js). By separating out each of the data checks into their own functions, I was able to reduce the CCN from 55 to 8! This created 13 new functions that all have a cyclomatic complexity of less than 11. You can run lizard on this file by running `lizard .\packages\discord.js\DD2480-docs\functions\thread-patch-refactor.js`.

### \src\structures\Guild.js: \_patch - Samuel

My \_patch function in Guild.js had a CCN of 81 to begin with. Since the function itself was quite simple, and only had a series of conditional checks/updates, I was easily able to split this logic into smaller functions. You can see the refactored code in this [file](../DD2480-docs/functions/Guild.js/patch_refactored.js). By splitting the logic into smaller functions, I reduced the CCN from 81 to 3, believe it or not. This created many new atomic functions that have an average CCN of 2.8. You can run lizard on this file by running `lizard .\packages\discord.js\DD2480-docs\functions\Guild.js\patch_refactored.js`.
