Use basic javascript to write a gomuku game
Base on swap2 rules:
https://en.wikipedia.org/wiki/Gomoku#Swap2

# Design
- In Java Console programs, we can use one main method to be a single point of control.
- This is hard for Event Driven Design
- We can use yield* here to have a similar manner
- For larger projects, a state machine approach is more appropriate:
    - https://gameprogrammingpatterns.com/state.html

# Tasks
### Done
- Graphics
- Basic game engine
- Show game status
- Opening move
- Playable basic mode!

### TODO (Basic mode):
- Board Dots
- Beautify Panel
- Timer
- Let user export the whole track of the game (into CSV?)

### TODO (Free mode):
- Let user edit / import the board freely
- Can continue with current board

### TODO (AI):
- Add a simple AI
- AI suggested move on board
- Add a clever AI

# Issue
Try to use modules => Give me CORS error => Terrible Technology, don't use for this project