let interval;
let date;
let dayDifference;
let identity;
let backgroundColor;

document.addEventListener("DOMContentLoaded", async (event) => {
  const dayOverride = document.querySelector("#dayOverride");
  dayDifference = parseInt(sessionStorage.getItem("dayDifference"));
  identity = JSON.parse(sessionStorage.getItem("identity")) ?? {};
  if (!dayDifference) {
    dayDifference = 0;
  }
  const currentDate = new Date(Date.now());
  dayOverride.value = currentDate.getDay() - dayDifference;
  date = new Date(Date.now()) - dayDifference * 1000 * 60 * 60 * 24;
  refreshClock();

  dayOverride.addEventListener("change", () => {
    dayDifference = currentDate.getDay() - dayOverride.value;
    console.log(dayDifference);
    date = new Date(Date.now()) - dayDifference * 1000 * 60 * 60 * 24;
    sessionStorage.setItem("dayDifference", dayDifference);
    refreshClock();
  });

  const body = document.querySelector("body");
  backgroundColor =
    sessionStorage.getItem("backgroundColor") ?? "rgb(255,248,220)";
  const backgroundChanger = document.querySelector("#backgroundChanger");
  body.style.backgroundColor = backgroundColor;
  backgroundChanger.value = backgroundColor;

  backgroundChanger.addEventListener("change", () => {
    body.style.backgroundColor = backgroundChanger.value;
    const backgroundColor = backgroundChanger.value;
    let rgbValues = backgroundColor
      .substring(4, backgroundColor.length - 1)
      .split(",");
    const rgbSliders = document.querySelectorAll(".rgbSlider");
    for (let i = 0; i < rgbSliders.length; i++) {
      rgbSliders[i].value = rgbValues[i];
    }
    sessionStorage.setItem("backgroundColor", backgroundChanger.value);
  });

  const rgbSliders = document.querySelectorAll(".rgbSlider");
  rgbSliders.forEach((element) => {
    const guide = ["red", "green", "blue"];
    let rgbValues = backgroundColor
      .substring(4, backgroundColor.length - 1)
      .split(",");
    element.value = rgbValues[guide.indexOf(element.id)];
    console.log(rgbValues);

    element.addEventListener("change", () => {
      rgbValues = backgroundColor
        .substring(4, backgroundColor.length - 1)
        .split(",");
      rgbValues[guide.indexOf(element.id)] = element.value;
      console.log(element.id, element.value);
      const newBackgroundColor = `rgb(${rgbValues[0]},${rgbValues[1]},${rgbValues[2]})`;
      body.style.backgroundColor = newBackgroundColor;
      console.log(rgbValues);
      sessionStorage.setItem("backgroundColor", newBackgroundColor);
      backgroundColor = newBackgroundColor;
    });
  });

  const main = document.querySelector("main");
  if (!identity.username) {
    await loadHtml("assets/html/loginForm.html", main);
    const loginForm = document.querySelector("#loginForm");
    loginForm.addEventListener("submit", (event) =>
      handleLoginForm(event, loginForm, main)
    );
  } else {
    console.log(identity);
    showGreeting();
    await loadHtml("assets/html/games.html", main);
  }
});

const handleLoginForm = async (event, loginForm, main) => {
  event.preventDefault();

  const firstName = loginForm.querySelector("#firstName").value;
  const lastName = loginForm.querySelector("#lastName").value;

  if (firstName === "" || lastName === "") {
    alert("You have to fill in both your first and last name");
    return;
  }

  let username = lastName.toLowerCase().substring(0, 6);
  if (username.length === 6) {
    username += firstName.toLowerCase().substring(0, 2);
  } else {
    const difference = 8 - username.length;
    username += firstName.toLowerCase().substring(0, difference);
  }

  username.replace("å", "a");
  username.replace("ä", "a");
  username.replace("ö", "o");

  identity = {
    firstName: firstName,
    lastName: lastName,
    username: username,
  };

  sessionStorage.setItem("identity", JSON.stringify(identity));

  await loadHtml("assets/html/games.html", main);
  showGreeting();

  return;
};

const showGreeting = () => {
  const greeting = document.querySelector("#greeting");
  greeting.innerHTML = `Welcome ${identity.firstName} ${identity.lastName}, your username is ${identity.username}!`;
};

const refreshClock = () => {
  const clock = document.querySelector("#clock");
  if (interval) {
    clearInterval(interval);
  }
  const currentDate = new Date(date);
  if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
    interval = setInterval(() => {
      clock.innerHTML = `Today it is ${currentDate.toLocaleDateString(
        "fi"
      )} and the time is ${currentDate.toLocaleTimeString("en", {
        hour12: false,
      })}`;
      currentDate.setSeconds(currentDate.getSeconds() + 1);
    }, 1000);
  } else {
    const nextMonday = new Date();
    nextMonday.setDate(
      nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7)
    );
    nextMonday.setHours(0, 0, 0, 0);
    let timeUntilNextMonday = nextMonday - currentDate;

    interval = setInterval(() => {
      let seconds = Math.floor((timeUntilNextMonday / 1000) % 60);
      let minutes = Math.floor((timeUntilNextMonday / 1000 / 60) % 60);
      let hours = Math.floor((timeUntilNextMonday / (1000 * 60 * 60)) % 24);
      let days = Math.floor(timeUntilNextMonday / (1000 * 60 * 60 * 24));
      if (days >= 7) {
        days = 0;
      }
      clock.innerHTML = `The casino is closed on the weekends, in ${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds it will reopen!`;
      timeUntilNextMonday -= 1000;
    }, 1000);
  }
};
