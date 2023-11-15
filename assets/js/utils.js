const loadHtml = async (file, target) => {
  const response = await fetch(file);
  const html = await response.text();
  target.innerHTML = html;
};
