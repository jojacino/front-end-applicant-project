Type Ahead React Component | 
Blockchains Sparks NV | 
Front-End-Applicant-Project

Joseph M. Davidson | 
Jojacino

Netify Deploy @ link below

https://loving-colden-f3be37.netlify.app

_______________________________

Component with closed vault door. Component has just loaded (Click to Open)
![](https://i.ibb.co/Wg6Zzwt/blockchains01.png)

Component with open vault door. Css Color mode selected
![](https://i.ibb.co/HgSBhQH/blockchains02.png)

Component in Css color mode. Searching through prop:colorsList
![](https://i.ibb.co/3mkfqBL/blockchains03.png)

Component in Css color mode. Searching through prop:colorsList : BurlyWood Selected
![](https://i.ibb.co/LC7GHyg/blockchains04.png)

Component in dictionary.com - dictionary mode. Searching for d
![](https://i.ibb.co/qkYmTpx/blockchains05.png)

Component in dictionary.com - dictionary mode. Searching for dog
![](https://i.ibb.co/7rX7MtR/blockchains06.png)

Component in dictionary.com - dictionary mode. Displaying Dog NOT SELECTED / HIGHLIGHTED
![](https://i.ibb.co/qdXGBYh/blockchains07.png)

Component in dictionary.com - dictionary mode. Displaying Watch Dog SELECTED / HIGHLIGHTED
![](https://i.ibb.co/5MtGHQD/blockchains08.png)

_______________________________

To View

Open git Bash in The Parent Directory 
where you want the Clone folder to be 
placed.

git clone

npm install or update

npm run start

Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.

_______________________________
# Original Project Instructions

- This app is currently in a broken state. You must create your component and add it to `ReactDOM.render` in `src/index.js` to get started.
- Using React and CSS, create a `Typeahead` component that takes a `list` prop.
- Use the `colorsList` list defined in `src/index.js` as the value for the `list` prop.
  - Please do not change `colorsList` or its contents.
  - If you want to go above and beyond, you can add other features or use another list that you receive from an async query, as long as it still meets all the same requirements when the `colorsList` is passed as the `list` prop.

## Submitting your Project
- Send the link to a public repository with your project submission to your recruitment contact.

#### Things we like to see

- Use of propTypes and/or other typing systems
- Responsive design
- Tasteful styling
- Tasteful animations are a bonus

#### Things we hope not to see

- Use of styling frameworks (Material, Bootstrap, Tailwind, etc.)
  - Styling writing libraries and pre-processors (Styled Components, SCSS, etc) are welcome but not expected.
- Copy/Pasted code from other source code

## Requirements

1. As the user types in the input field, a list of options should appear below it.
   - The list should only appear when input is not empty. Whitespace is considered empty.
   - The list should contain items from the `list` prop that **start** with the user entered value. Matching should be case insensitive. Every new character typed should filter the list.
2. Clicking on a list item should populate the input with the selected item's value and hide the list.
3. As the user types, the matching substring within the dipslayed options should be bold. The rest of the string should not be bold.
   1. Ex. When the user types `bl`, `bl` in `black`, `blanchedalmond`, `blue`, and `blueviolet` should be bold. The rest of each word should not be bold.
4. For visible options, style the substring the user has entered as **bold**.
5. Mousing over a list item should highlight it, at least darkening its background color. Other styling is up to you.
6. The input and list should also be navigable using the keyboard.
   - Using `tab` and `shift+tab`, the user should be able to move focus to and from the different list items.
     - With the cursor in the input, pressing the `tab` key should move focus to the first item with the default browser focus style.
     - Subsequent presses of the "tab" key should focus the next item in the list.
     - Pressing the `shift+tab` keys should focus the previous item in the list.
     - Pressing the `shift+tab` key when the first item is focused should focus
       the input again.
     - Mousing over other list items should highlight them while the keyboard-
       focused item remains focused.
     - Pressing the `tab` key when no list is visible should move focus away
       from the input.
   - Pressing the `enter` or `return` key when an item is focused should populate the input with the focused item's value, hide the list, and focus the input again.
   - Pressing the `escape` key should close the list.
7. Clicking outside the input or the list should close the list.

#### Development Instructions

1. Clone this repository and run `npm install` to install dependencies.
2. From the project directory, `npm start` runs the app in development mode.
3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

###### Attributions

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
