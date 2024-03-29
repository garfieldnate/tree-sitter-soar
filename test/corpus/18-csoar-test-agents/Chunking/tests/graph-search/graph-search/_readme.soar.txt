================================================================================
UnitTests/SoarTestAgents/Chunking/tests/graph-search/graph-search/_readme.soar
================================================================================

### Some limited documentation on graph-search
### This is a test application for the A* (a-star) default knowledge
###
###  Basic idea - there is a mission to go from place to place (in the mission structure) using go-to-location
###               for each go-to-location use an iterative form of A* search to find the minimal path
###                   between each place iteratively select go-to-waypoint to move through the graph               
### 
###  Key data structures (initialized in initialize-graph-search)
###
###   waypoints        set of waypoints in the system that can be visited
###       waypoint      contains x, y, id, and next pointers. x and y used to calculate distances in search
###         id         just a symbol to name waypoint. Used in mission structure.
###         next       set of waypoints that can be moved to from this waypoint. These are one-way links.
###
###   mission          is initialized with a linked-list of places
###       current      the place that the agent is executing a command for 
###                    places have information about waypoints, but are distinct because
###                    they are in a linked list of places, which for each place specifies 
###                    information about a waypoint and a command (in the name: go-to-location) to execute
###          x, y         coordinates of waypoint associated with this place (copied over from waypoint)
###          next         next command in the mission
###          id           name of waypoint
###          name         this is a command to perform at this point in the mission
###                       in this case it is always go-to-location
###
###   current-location is the waypoint the agent is at (confusing because it is not the same as mission.current)
###                     should probably be called current-waypoint

###
##############
### Key operators
###
###   go-to-location  Top-level operator that gets selected for the current place on the mission
###                   In substate will move through waypoints to that place
###                   Terminates when the current waypoint matches the mission.current, and
###                     then it updates the mission.current (in apply*go-to-location).
###       go-to-waypoint  Proposed for every next waypoint from current-location
###                       Applying this updates current-location
###

###  all of the search is controlled in selection-astar.soar

## IF you want to play around with RL, you can add the following rule that converts the evaluation
##   into an expected value, that with chunking "learn --only" will create RL rules.
## The end result is an agent that learns slower because the A* search finds the minimal path
##   in one shot.
#sp {Impasse__Operator_Tie*convert-total-estimated-cost*expected-value
#   :default
#   (state <s> ^name selection
#              ^operator <op1> +)
#   (<op1> ^name evaluate-operator
#          ^evaluation <e>)
#   (<e> ^total-estimated-cost <ec>)
#-->
#   (<e> ^expected-value <ec>)
#}
#rl -s learning on
#indifferent-selection --epsilon-greedy
--------------------------------------------------------------------------------

(source_file)
