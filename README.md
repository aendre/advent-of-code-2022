# Advent of code 2022

This is my repo of utilities and solutions for the Advent of Code 2022 written in JS/TS.

## Usage

Run `npm start <day> <year>` to start solving the puzzle of the selected day. This will:
- Automatically download your personalized input and copy to `src/day-XX/input.txt`
- Invoke the default export function located at `src/day-XX/solve.ts`

`npm start` will default to the current day in the current year.

`npm start 17` will default to day 17 in the current year.

`npm start 5 2020` will use the input of day 5 in year 2020.

## Auto-download 
- Create a file named `.session.cfg`
- Copy your sessionId to the file (nothing else)
- Input auto-downloader will use this sessionId when executing the webservice call

## Toolbelt
- Nodemon
- Eslint
- Lodash
- Moment
- Sugar.js
- Axios



