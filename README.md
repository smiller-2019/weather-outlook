# weather-outlook

Choose your city for the weather outlook

## Motivation

To create a weather dashboard displaying the current weather and 5 day forecast weather for a selected city. The use can input a city and the current weather dispalys: city name, weather icon, today's date, temperature, wind speed, humidity and UV index. The 5 day forecast also shows the the same data for the next 5 days excluding the UV Index.

## Build status

No files are given. The website is be created from scratch.

## Features

The following has been applied to the code:

1. The current day, date and year are displayed in the browser using moment.js.
2. Bootstrap and Jquery are used to display the timeblocks allowing events to be entered.
3. Javascript used to display hourly times between 9am until 17pm alongside the timeblocks for a week day.
4. A floppy disk icon to be displayed next to each timeblock to indicate to the user that the event can be saved.
5. Custom changes are made to the CSS file the row and span to reflect the demo.
6. A javascript file using jquery has been created from scratch to save the events entered to local storage.
7. Events saved to local storage are dynamically displayed using jquery when the user first loads the page or refreshes the page.
8. Moment.js and javascript are used to compare the hour of the day to check if it is in the past which will change the timeblock grey or red for the present or greee for future events.

[link to deployed application](https://smiller-2019.github.io/business-day-sheduler/)

![Screenshot of webpage](https://github.com/smiller-2019/business-day-sheduler/blob/main/assets/images/desktop-image.png)
![Screenshot of webpage](https://github.com/smiller-2019/business-day-sheduler/blob/main/assets/images/mobile-image.png)
