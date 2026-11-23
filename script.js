"use strict";

const photos = [
  "cell_0.jpg",
  "cell_1.jpg",
  "cell_2.jpg",
  "cell_3.jpg",
  "cell_4.jpg",
  "cell_5.jpg",
  "cell_6.jpg",
  "cell_7.jpg",
  "cell_8.jpg"
];

const gallery = document.querySelector("#gallery");
const sortButtons = document.querySelectorAll(".sort-button");

function mergeSortByFilename(filenames, order) {
  if (filenames.length <= 1) {
    return filenames;
  }

  const middle = Math.floor(filenames.length / 2);
  const left = mergeSortByFilename(filenames.slice(0, middle), order);
  const right = mergeSortByFilename(filenames.slice(middle), order);
  const merged = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    const comparison = left[leftIndex].localeCompare(right[rightIndex]);
    const takeLeft = order === "asc" ? comparison <= 0 : comparison >= 0;
    merged.push(takeLeft ? left[leftIndex++] : right[rightIndex++]);
  }

  return merged.concat(left.slice(leftIndex), right.slice(rightIndex));
}

function createPhotoCard(filename, index) {
  const card = document.createElement("article");
  card.className = "photo-card";

  const frame = document.createElement("div");
  frame.className = "photo-frame";

  const image = document.createElement("img");
  image.src = `assets/${filename}`;
  image.alt = `Photography portfolio image ${filename}`;
  image.loading = "lazy";
  image.decoding = "async";

  const toggle = document.createElement("button");
  toggle.className = "toggle-button";
  toggle.type = "button";
  toggle.textContent = "AFTER · B&W";
  toggle.setAttribute("aria-label", `Show ${filename} in black and white`);
  toggle.setAttribute("aria-pressed", "false");
  toggle.addEventListener("click", () => {
    const isAfter = image.classList.toggle("is-after");
    toggle.textContent = isAfter ? "BEFORE · COLOR" : "AFTER · B&W";
    toggle.setAttribute("aria-label", `Show ${filename} ${isAfter ? "in color" : "in black and white"}`);
    toggle.setAttribute("aria-pressed", String(isAfter));
  });

  frame.append(image, toggle);

  const meta = document.createElement("div");
  meta.className = "photo-meta";

  const caption = document.createElement("p");
  caption.className = "photo-caption";
  caption.textContent = filename;

  const photoIndex = document.createElement("span");
  photoIndex.className = "photo-index";
  photoIndex.textContent = String(index + 1).padStart(2, "0");

  meta.append(caption, photoIndex);
  card.append(frame, meta);
  return card;
}

function renderGallery(order) {
  const sortedPhotos = mergeSortByFilename(photos.slice(), order);
  gallery.replaceChildren(...sortedPhotos.map(createPhotoCard));
  sortButtons.forEach((button) => {
    const isActive = button.dataset.order === order;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

sortButtons.forEach((button) => {
  button.addEventListener("click", () => renderGallery(button.dataset.order));
});

renderGallery("asc");
