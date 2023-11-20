let interval;
let date;
let dayDifference;
let identity;
let selectedImage;

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
    date = new Date(Date.now()) - dayDifference * 1000 * 60 * 60 * 24;
    sessionStorage.setItem("dayDifference", dayDifference);
    refreshClock();
  });

  const body = document.querySelector("body");

  // initialize backgroundColorChanger from storage or default
  const backgroundColor =
    sessionStorage.getItem("backgroundColor") ?? "rgb(255,255,255)";
  const backgroundChanger = document.querySelector("#backgroundChanger");
  backgroundChanger.value = backgroundColor;
  // set backgroundColor to the value of backgroundColorChanger
  backgroundChanger.addEventListener("change", () => {
    sessionStorage.setItem("backgroundColor", backgroundChanger.value);
    refreshBackgroundColor();
  });

  // initialize rgbSliders from storage or default
  const rgbSliders = document.querySelectorAll(".rgbSlider");
  const textColor = sessionStorage.getItem("textColor") ?? "rgb(0,0,0)";
  rgbSliders.forEach((element) => {
    const guide = ["red", "green", "blue"];
    // removes "rgb(" + ")" and gets the values seperated by commas
    let rgbValues = textColor.substring(4, textColor.length - 1).split(",");
    // set the value of the slider to the value of the respective rgbValues
    element.value = rgbValues[guide.indexOf(element.id)];
    // event listener for any change in the sliders
    element.addEventListener("change", () => {
      // gets the newest textColor
      const currentTextColor =
        sessionStorage.getItem("textColor") ?? "rgb(0,0,0)";
      // isolates rgb values
      rgbValues = currentTextColor
        .substring(4, currentTextColor.length - 1)
        .split(",");
      // changes the respective rgb value
      rgbValues[guide.indexOf(element.id)] = element.value;
      // generates new rgb(x,x,x) string for usage and storage
      const newTextColor = `rgb(${rgbValues[0]},${rgbValues[1]},${rgbValues[2]})`;
      sessionStorage.setItem("textColor", newTextColor);
      refreshTextColor();
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
    loadGallery();
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

  identity = {
    firstName: firstName,
    lastName: lastName,
    username: username,
  };

  sessionStorage.setItem("identity", JSON.stringify(identity));

  showGreeting();
  loadGallery();

  return;
};

const showGreeting = () => {
  const greeting = document.querySelector("#greeting");
  greeting.innerHTML = `Welcome ${identity.firstName} ${identity.lastName}, your username is ${identity.username}!`;
};

const loadGallery = async () => {
  const main = document.querySelector("main");
  const images = [
    { alt: "Blablabla" },
    { alt: "Blablabla" },
    { alt: "Blablabla" },
    { alt: "Blablabla" },
  ];
  await loadHtml("assets/html/gallery.html", main);
  const gallery = document.querySelector("#gallery");
  for (let i = 0; i < images.length; i++) {
    const wrapper = document.createElement("div");
    wrapper.className = "thumbnailWrapper";
    const thumbnail = document.createElement("img");
    thumbnail.className = "thumbnail";
    thumbnail.id = `thumbnail${i}`;
    thumbnail.alt = images[i].alt;
    thumbnail.src = `./assets/img/gallery/thumbnails/${i}.jpeg`;
    wrapper.appendChild(thumbnail);
    gallery.appendChild(wrapper);

    thumbnail.addEventListener("click", (event) => {
      // could also just use the numbnail from the for loop
      const body = document.querySelector("body");
      const clickedImage = event.target;
      const imageIndex = parseInt(clickedImage.id.substring(9));
      const image = document.createElement("img");
      const imageContainer = document.createElement("div");
      const lightbox = document.createElement("div");
      const closeIcon = document.createElement("i");
      image.src = `./assets/img/gallery/thumbnails/${imageIndex}.jpeg`;
      image.alt = clickedImage.alt;
      imageContainer.className = "lightboxImageContainer";
      lightbox.className = "lightbox";
      closeIcon.className = "closeIcon";

      imageContainer.appendChild(image);
      imageContainer.appendChild(closeIcon);
      lightbox.appendChild(imageContainer);
      body.appendChild(lightbox);

      lightbox.addEventListener("click", (event) => {
        if (event.target != image) {
          lightbox.remove();
        }
      });
    });
  }
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
