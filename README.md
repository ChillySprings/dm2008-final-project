# Final Project — A Walk at Night

---

### The Project

A small visual sandbox where the player can light up their lantern, expanding the range at which they can see in the darkness. The environment can react with the player's lantern. Fireflies light up along with the lantern. The flowers will cause a chain reaction with nearby flowers. Lamps will create a large area of light that attracts moths.

It is a very minimal experience that simulates the feeling of walking in the dark at night, bumping into trees and rocks while the player uses their lantern to navigate the dark. However, we didn't want it to be a scary experience, it should be a calming walk with no threats or sense of danger. The fireflies lighting up randomly and flowers opening small pockets of light help make the overall feeling more beautiful than dangerous. Considering the small area and simplistic design, we think anyone can pick up and play this for a minute or so without issue.

[W, A, S, D] - To Move Around
[ SPACE ] - To Light Up Your Lantern

---

### Output

![Video](readme-assets/finalproject-video01.mp4)
Initial testing of the player's lantern, darkness, moths, and flowers chaining together upon touching light.

![Video](readme-assets/finalproject-video02.mp4)
Firefly testing.

![Video](readme-assets/finalproject-video03.mp4)
Added art assets, collisions and a lamp that lights up a wide area.

![Video](readme-assets/finalproject-video04.mp4)
Completed version with sound, trees and rocks.

---

### ✍️ Reflection

### Caden
I enjoyed working with Yan Hwei, collaborating and discussing what should be changed to achieve a desired outcome, and reworking and tweaking the code so it matched our wants. In my first week, I sought out to create a largely playable experience that could later be refined and polished in the next week. Most of the behaviour had been written in the first week, and from then on, I mainly added new behaviours and comments to help Yan Hwei finetune the variables.

I understood that aesthetic decisions existed beyond just the canvas; how fast the player moves, how "bright" the lights are, how the moths move, etc, can change how a game looks and feels. Hence, it was extremely important that he could understand the code that I wrote, resulting in me adding many comments to explain how everything worked and which variables could be changed to achieve a different result.

Biggest challenges was understanding some of the code I found online, specfically "butterfly" by candy - https://editor.p5js.org/candy/sketches/Y5BiZZm67 and "Flocking" by Darren Kessner https://p5js.org/examples/Classes-And-Objects-Flocking/ 

Their code felt like simulating realistic behaviour that's controlled by multiple different factors, like wanting to wander, move sideways, and vibrate, for "butterfly". It was so different from what we learnt in class that I was completely dumbfounded. It's not that the code was impossible to understand and read, but it was difficult to understand how someone could have planned and make this, and how everything worked.

Because our game worked differently from these scripts, I did have to change and remove some aspects. For "butterfly", the targetting behaviour was overhauled to have the moths calculate the nearest and brightest light every so often and move towards it. The fireflies also needed to have additional interactions.

This was a nice break from my other assignments. If I had more time, I'd unfortunately only have ideas for Yan Hwei to do. It'd be about adding more aesthetic elements to better describe and build the world.

### Yan Hwei

I think the final outcome came out better than I had expected. Caden was the biggest help with this project with his coding skills. He structured the project in an extremely organised fashion with added comments to multiple sections, which made it really easy for me to read and understand how everything works. I primarily handled the art and sound, coding them in. I also helped adjust certain values so that the game's overall atmosphere feels correct.

The black and white visuals helped make it feel like night-time, the lack of colour and saturation also added to the calming vibe. I picked out simple sounds with some ambience for the background, I decided against music as even the most calming music didn't improve the atmosphere. I am reminded of games like Minecraft where there are periods of silence which allows the player to think and reflect. I also made the player's lantern and ground lamps melodic ding and dong bells, which helped make the game feel more peaceful.

My biggest was trying to program the art and sound in. Even with Caden’s very organised code, I still struggled a ton trying to make sure the aesthetic elements were properly implemented. Sounds gave me the biggest headache as the footsteps and looping ambience had a number of problems while I was adding them in.

If given more time, I would want to have a bigger map for the player to explore. I initially imagined there would be a large set of ruins and scattered clues for the player to collect but seemed too large of a scope for a two to three week project.


<!-- 200–300 words on your process and outcome. Write freely — this is your story to tell.
     Some prompts to get you started:
     — What did you set out to create, and how did the final result compare to your original vision?
     — How is your project structured — what inputs does it respond to and how did you approach the code?
     — What were your key visual and/or sonic design decisions, and why?
     — What was your biggest challenge, and how did you work through it?
     — What would you change, add, or explore further given more time? -->

---

<!-- ─────────────────────────────────────────────────────
     GOING FURTHER — want to document more? Try any of these:

     ### ✨ Features
     A short list of what your project does.
     - Responds to mouse position and velocity
     - Generates sound based on particle density

     ### 🔍 Code Structure
     How are your files organised?
     - `sketch.js` — main setup and draw loop
     - `Agent.js` — autonomous agent class
     - `assets/` — images and sounds

     ### 🛠️ Hardware (if applicable)
     List any physical components used.
     - Arduino Uno
     - Sensor type and model

     ### 🧩 Something I'm Proud Of
     A snippet, a decision, a moment where it all came together.
     ```js
     // your code here
     ```

     ### 🔗 References
     Tutorials, libraries, artworks, or research that informed your project.
     ───────────────────────────────────────────────────── -->
