================================================================================
UnitTests/SoarTestAgents/Chunking/tests/BW-LA/BW-LA/_readme.soar
================================================================================

# This project contains a version of blocks world that involves one level of problem spaces
# and look-ahead. Based on the blocks-world-simple agent.

# The top level has a single operator: move-block, which moves a block (moving-block) to a destination. 
# The destination can be the top of another block or the table.

# Change made to blocks-world to enable look ahead:
# 1. Add to elaborations/top-state: blocks-world*elaborate*problem-space
# 2. Change elaborations/detect-success: blocks-world*elaborate*state*success
#    so it marks the state with success - this will be used in look-ahead

#  To guarantee it will find the shortest solution, includes rules 
#  that maintain the last move (last-moved-block) and then avoiding operators that move the same block twice
#  in a row. Also, by using numeric preferences instead of symbolic (see blocks-world-lookahead-numeric)
#  will learn RL rules that ultimately should converge to shortest solutions.


--------------------------------------------------------------------------------

(source_file)
