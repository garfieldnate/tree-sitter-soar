================================================================================
UnitTests/SoarTestAgents/Chunking/tests/eight-puzzle/eight-puzzle/_readme.soar
================================================================================

# eight-puzzle/README
# John Laird
# May 23, 2004
# 
# eight-puzzle.soar
#    Straightforward implementation of eight-puzzle
#    Uses look-ahead search to solve puzzle with simple
#    evaluation function - demonstrates chunking.
#    Look-ahead search is implemented in ../default/selection.soar
#
# eight-puzzle.tcl
#    Simple graphic depiction of eight puzzle states as 
#    problem is solved.  Source this file instead of eight-puzzle.soar
#    if you want the graphical interface. 

###
### Modifies the bindings, but does not create new bindings.
### State Structure: 
 ## Each state contains nine bindings.
 ## The bindings connect together a cell, one of the nine positions on 
 ## the board and a tile, one of the movable pieces. 
 ## The cells have pointers, ^cell, to each of their adjacent cells. 
 ## The state also has a pointer to the blank-cell and the cell
 ## that the last moved tile is in -- this improves efficiency and
 ## simplify computations that depend on the previous operator.
### Operator Staructure: 
 ## Each operator contains a pointer to the cell with the blank
 ## and the cell with the tile to be moved.
### 


--------------------------------------------------------------------------------

(source_file)
