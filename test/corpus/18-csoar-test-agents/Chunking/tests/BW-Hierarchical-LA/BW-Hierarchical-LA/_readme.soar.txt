================================================================================
UnitTests/SoarTestAgents/Chunking/tests/BW-Hierarchical-LA/BW-Hierarchical-LA/_readme.soar
================================================================================

## This project contains a version of blocks world that involves three levels of problem spaces 
## and look-ahead in the middle problem space.
## For the top and bottom problem spaces, there is pre-existing selection knowledge
##  that is sufficient to eliminate search.
##
## The middle problem space consists of the pick-up and put-down operators. For that problem space
##  there are rules that create the internal copy of the state 
##  (in evaluate-operator/move-block/elaborations) and there are rules that simulate the actions
##  on that internal copy (in evaluate-operator/move-block/pick-up & put-down
##  Finally, there are rules that provide some evaluations for the lookahead 
##   evaluate-operator/move-block/evaluation

# The top level has a single operator: move-block, which moves a block (moving-block) to a destination. 
# The destination can be the top of another block or the table.

# The next level consists of two operators: pick-up and put-down and they arise in an operator
#  no-change for move-block. The rules for these are found under move-block. This level
#  introduces the gripper, which can be holding a block or empty and is a structure on the top state.

# The bottom level has a variety of operators: open-gripper, close-gripper, move-gripper-above, 
#  move-gripper-down, and move-gripper-up. The structures manipulated by these operators are part
#  of the gripper structure on the top state. These operators arise in an operator no-change for
#  both pick-up and put-down and the rules for them are under pick-up. 





--------------------------------------------------------------------------------

(source_file)
