================================================================================
UnitTests/SoarTestAgents/Chunking/tests/BW-Op-Subgoal/BW-Op-Subgoal/_readme.soar
================================================================================

## Modified version of blocks-world-simple that uses 
##   means-ends analysis and operator subgoaling (first used in General Problem Solver (GPS))
## Means-ends analysis involves proposing operators that can achieve part of the
##   goal. Thus, some operators will be proposed even if they do not apply 
##   to the current state.
## If an operator is selected that can not apply, an operator no-change impasse 
##   arises. In that substate, the goal is to achieve a state in which the 
##   impassed operator can apply. This leads to a recursive subgoal stack. 
##  
## Involves removing the original operator evaluation rules, changing the operator 
##  proposal rules, and modifying the application rules so they apply only
##  when they should.
## Also includes the addition of the operator no-change subset under move-block
##  and the inclusion of the desired state.

--------------------------------------------------------------------------------

(source_file)
