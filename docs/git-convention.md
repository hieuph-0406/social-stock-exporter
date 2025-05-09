# Branch naming convention

### Create branch feature with format **feature.type.scope**

**feature**: constant

**type** enums:

new, bugfix, refactor, ut 

**scope** ticked No

Ex: #123

### Example
```
feature.new.123
feature.bugfix.123
feature.refactor.123
feature.ut.123
```

### Create branch hotfix with format **hotfix.scope**

**hotfix**: constant

**scope** ticked No

Ex: #123

### Example
```
hotfix.123
```

### Create branch chore (for setting/config) with format **chore.subject**

**chore**: constant

**subject** name of task

Ex: config session

### Example
```
chore.config-session
```

# Commit convention

### Commit with format  **type(scope?): subject**

**type** enums:

chore, feat, fix, perf, refactor, revert, ut

**scope** ticked No

Ex: #123

**subject** content message

### Example
```
feat(#123): create user
bugfix(#123,#456): fix bug edit form
refactor(#123): refactor user flow
ut(#123): content message
hotfix(#123): hotfix feature A
chore: config session
```