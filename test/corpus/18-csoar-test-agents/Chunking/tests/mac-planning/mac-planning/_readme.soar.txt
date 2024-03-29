================================================================================
UnitTests/SoarTestAgents/Chunking/tests/mac-planning/mac-planning/_readme.soar
================================================================================

### ABSTRACT.
### This file provides a Soar system to solve the missionaries and
### cannibals problem.
###
### PROBLEM STATEMENT
### Three missionaries and three cannibals come to a river. There is a
### boat on their bank of the river that can be used by either one or
### two persons at a time.  This boat must be used to cross the river in
### such a way that cannibals never outnumber missionaries on either
### bank of the river.
###

### DESCRIPTION.
### Simple state representation where the state has two objects: one for
### each bank of the river. Each of these has augmentations for
### missionaries, cannibals, and the boat; with their values being the
### number of the entity type on that bank of the river. This is the
### version covered in the Soar Tutorial.  Copying the states is more
### complex (two-level-attributes) than other versions, but initial
### state definition, operator proposal and application are simplier.
###

--------------------------------------------------------------------------------

(source_file)
