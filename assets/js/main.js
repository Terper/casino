const menuIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>';
const closeIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>';

let clockInterval = null;

document.addEventListener("DOMContentLoaded", () => {
  loadNav();
  loadFooter();
  refreshClock();
  refreshBackgroundColor();
  refreshTextColor();
});

const loadNav = () => {
  const destinations = [
    { text: "Home", path: generatePath("index.html") },
    {
      text: "Rock Paper Scissors",
      path: generatePath("pages/rockpaperscissors.html"),
    },
    { text: "Settings", path: generatePath("pages/settings.html") },
  ];
  const icon = document.createElement("div");
  icon.className = "navIcon";
  icon.id = "navIcon";
  icon.innerHTML = menuIcon;

  const destinationsContainer = document.createElement("div");
  destinationsContainer.className = "destinationsContainer";

  const nav = document.querySelector("nav");
  nav.appendChild(icon);

  icon.addEventListener("click", () => toggleNavigationMenu());

  destinations.forEach((destination) => {
    const element = document.createElement("a");
    element.innerText = destination.text;
    element.href = destination.path;
    destinationsContainer.appendChild(element);
  });
  nav.appendChild(destinationsContainer);
};

const toggleNavigationMenu = () => {
  const destinationsContainer = document.querySelector(
    ".destinationsContainer"
  );
  destinationsContainer.classList.toggle("destinationsContainerOpen");
  const icon = document.querySelector("#navIcon");
  if (destinationsContainer.classList.contains("destinationsContainerOpen")) {
    icon.innerHTML = closeIcon;
  } else {
    icon.innerHTML = menuIcon;
  }
};

const loadFooter = async () => {
  const footer = document.querySelector("footer");
  footer.innerHTML = `
    <div>
      <button id="clearStorageButton">Clear storage</button>
      <select id="dayOverride" name="dayOverride">
        <option value="1">Monday</option>
        <option value="2">Tuesday</option>
        <option value="3">Wednesday</option>
        <option value="4">Thursday</option>
        <option value="5">Friday</option>
        <option value="6">Saturday</option>
        <option value="0">Sunday</option>
      </select>
    </div>
    <div>
      Rock Paper Scissors icons by <a href="https://lorcblog.blogspot.com/">Lorc</a> under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>
    </div>
    <div>
      Created by
      <a href="mailto:jann.totterman@arcada.fi">jann.totterman@arcada.fi</a>
    </div>`;

  const dayOverride = document.querySelector("#dayOverride");
  let dayDifference = parseInt(sessionStorage.getItem("dayDifference"));
  if (!dayDifference) {
    dayDifference = 0;
  }

  const currentDate = new Date(Date.now());
  dayOverride.value = currentDate.getDay() + dayDifference;
  sessionStorage.setItem("dayDifference", dayDifference);
  refreshClock();

  dayOverride.addEventListener("change", () => {
    dayDifference = parseInt(dayOverride.value) - currentDate.getDay();
    sessionStorage.setItem("dayDifference", dayDifference);
    refreshClock();
  });

  const clearStorageButton = document.querySelector("#clearStorageButton");
  clearStorageButton.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.reload();
  });
};

const refreshClock = () => {
  const clock = document.querySelector("#clock");
  clearInterval(clockInterval);

  const dayDifference = parseInt(sessionStorage.getItem("dayDifference"));
  // create a date object with the current date and time and add the dayDifference to it
  const dateModifier = dayDifference * 24 * 60 * 60 * 1000;
  let currentDate = new Date(Date.now() + dateModifier);

  if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
    // if weekday allow access
    clock.innerHTML = displayTime(currentDate);
    sessionStorage.setItem("isOpen", true);
    clockInterval = setInterval(() => {
      // update the clock every second by adding 1000 milliseconds to the current date, with or without the dayDifference
      clock.innerHTML = displayTime(currentDate);
      currentDate = new Date(currentDate.getTime() + 1000);
      // if the day switches over to the weekend, refresh the clock
      if (currentDate.getDay() >= 6) {
        refreshClock();
      }
    }, 1000);
  } else {
    // if weekend deny access
    sessionStorage.setItem("isOpen", false);
    let nextMonday = new Date();
    // since the casino is closed on saturday and sunday we can just add 2 or 8 days to the current date to get the next monday
    // we need to add 8 days on sunday since the week starts on sunday and we need to skip the current week
    // should have imported moment.js to make this much easier
    switch (currentDate.getDay()) {
      case 0:
        nextMonday.setDate(currentDate.getDate() + 8);
        break;
      case 6:
        nextMonday.setDate(currentDate.getDate() + 2);
        break;
    }
    nextMonday.setHours(0, 0, 0, 0);
    // gets the milliseconds until the next monday
    let timeUntilNextMonday = nextMonday - currentDate;
    let timeLeft = calculateTimeLeft(timeUntilNextMonday);
    clock.innerHTML = displayTimeLeft(timeLeft);
    clockInterval = setInterval(() => {
      // removes 1000 milliseconds from the timeUntilNextMonday and updates the clock
      timeLeft = calculateTimeLeft(timeUntilNextMonday);
      clock.innerHTML = displayTimeLeft(timeLeft);
      timeUntilNextMonday -= 1000;
      // if clock runs out, refresh the clock
      if (timeUntilNextMonday <= 0) {
        refreshClock();
      }
    }, 1000);
  }
};

const calculateTimeLeft = (timeUntilNextMonday) => {
  const timeLeft = {};
  timeLeft.seconds = Math.floor((timeUntilNextMonday / 1000) % 60);
  timeLeft.minutes = Math.floor((timeUntilNextMonday / 1000 / 60) % 60);
  timeLeft.hours = Math.floor((timeUntilNextMonday / (1000 * 60 * 60)) % 24);
  timeLeft.days = Math.floor(timeUntilNextMonday / (1000 * 60 * 60 * 24));
  // since in the code above when getting the timeUntilMonday somehow adds 7 days when its a sunday, we need to remove those 7 days
  if (timeLeft.days >= 7) {
    timeLeft.days = 0;
  }
  return timeLeft;
};

const displayTimeLeft = (timeLeft) => {
  const { days, hours, minutes, seconds } = timeLeft;
  return `The casino is closed on the weekends, in ${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds it will reopen!`;
};

const displayTime = (date) => {
  return `Today is ${date.toLocaleDateString(
    "fi"
  )} and the time is ${date.toLocaleTimeString("en-GB")}`;
};

const refreshTextColor = () => {
  // changes the variable --text-color in css
  const textColor = sessionStorage.getItem("textColor") ?? "rgb(0,0,0)";
  document.documentElement.style.setProperty("--text-color", textColor);
};

const refreshBackgroundColor = () => {
  // changes the variable --backgroundColor in css
  const backgroundColor =
    sessionStorage.getItem("backgroundColor") ?? "rgb(255,255,255)";
  document.documentElement.style.setProperty(
    "--background-color",
    backgroundColor
  );
};

const generatePath = (path) => {
  // uses the pathPrefix from the body's dataset to generate a relative path
  return document.querySelector("body").dataset.pathPrefix + path;
};
