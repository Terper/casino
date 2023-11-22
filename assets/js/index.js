let identity;
let selectedImage;

document.addEventListener("DOMContentLoaded", () => {
  const identity = JSON.parse(sessionStorage.getItem("identity"));
  if (!identity) {
    loadLoginForm();
  } else {
    loadGreeting();
    loadGallery();
  }
});

const loadLoginForm = () => {
  const main = document.querySelector("main");
  main.innerHTML = `<form id="loginForm" class="loginForm">
  <label for="firstName">First name</label>
    <input
      type="firstName"
      name="firstName"
      id="firstName"
      placeholder="First name"
    />
    <label for="lastName">Last name</label>
    <input
      type="lastName"
      name="lastName"
      id="lastName"
      placeholder="Last name"
    />
    <button type="submit">Continue</button>
  </form>`;
  const loginForm = document.querySelector("#loginForm");
  loginForm.addEventListener("submit", (event) => handleLoginForm(event));
};

const handleLoginForm = (event) => {
  event.preventDefault();

  const loginForm = document.querySelector("#loginForm");

  const firstName = loginForm.querySelector("#firstName").value;
  const lastName = loginForm.querySelector("#lastName").value;

  if (firstName === "" || lastName === "") {
    alert("You have to fill in both your first and last name");
    return;
  }

  // formats name to username
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
  loginForm.remove();

  loadGreeting();
  loadGallery();

  return;
};

const loadGreeting = () => {
  const main = document.querySelector("main");
  const greeting = document.createElement("div");
  greeting.id = "greeting";
  greeting.className = "greeting";
  const identity = JSON.parse(sessionStorage.getItem("identity"));
  greeting.innerHTML = `Welcome ${identity.firstName} ${identity.lastName}, your username is ${identity.username}!`;
  main.appendChild(greeting);
};

const loadGallery = async () => {
  const main = document.querySelector("main");
  const images = [
    { alt: "Blablabla" },
    { alt: "Blablabla" },
    { alt: "Blablabla" },
    { alt: "Blablabla" },
    { alt: "Blablabla" },
    { alt: "Blablabla" },
  ];

  const galleryElement = document.createElement("div");
  galleryElement.className = "galleryContainer";
  galleryElement.innerHTML = `
    <span>Previous winners</span>
    <div class="gallery" id="gallery"></div>`;
  main.appendChild(galleryElement);

  const gallery = document.querySelector("#gallery");
  for (let i = 0; i < images.length; i++) {
    const wrapper = document.createElement("div");
    wrapper.className = "thumbnailWrapper";
    const thumbnail = document.createElement("img");
    thumbnail.className = "thumbnail";
    thumbnail.id = `thumbnail${i}`;
    thumbnail.alt = images[i].alt;
    thumbnail.src = `./assets/img/gallery/thumbnails/${i}.jpg`;
    wrapper.appendChild(thumbnail);
    gallery.appendChild(wrapper);

    thumbnail.addEventListener("click", (event) => {
      // could also just use the numbnail from the for loop
      const main = document.querySelector("main");
      const clickedImage = event.target;
      const imageIndex = parseInt(clickedImage.id.substring(9));
      const image = document.createElement("img");
      const imageContainer = document.createElement("div");
      const lightbox = document.createElement("div");
      const icon = document.createElement("div");
      image.src = `./assets/img/gallery/full/${imageIndex}.jpg`;
      image.alt = clickedImage.alt;
      imageContainer.className = "lightboxImageContainer";
      lightbox.className = "lightbox";
      icon.innerHTML = closeIcon;

      imageContainer.appendChild(image);
      imageContainer.appendChild(icon);
      lightbox.appendChild(imageContainer);
      main.appendChild(lightbox);

      lightbox.addEventListener("click", (event) => {
        if (event.target != image) {
          lightbox.remove();
        }
      });
    });
  }
};
