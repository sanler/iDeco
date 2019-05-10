console.log("HOLAAAAAAAA");
const miArraydefotos=document.getElementsByClassName('prueba');
console.log(miArraydefotos);

for(i=0;i<miArraydefotos.length;i++){
  console.log(miArraydefotos[i].id);
  
  }

const grid = document.querySelector(".grid");
const rowSize = parseInt(getComputedStyle(grid).getPropertyValue("grid-auto-rows"), 10);
const rowGap = parseInt(getComputedStyle(grid).getPropertyValue("grid-gap"), 10);
const gridItems = [];

const positionGridItems = () => {
  gridItems.forEach(({ item, content }) => {
    content.classList.remove("cover");
    const rowSpan = Math.ceil(
    (content.offsetHeight + rowGap) / (rowSize + rowGap));

    item.style.setProperty("--row-span", rowSpan);
    content.classList.add("cover");
  });
};

window.addEventListener("load", positionGridItems);
//window.addEventListener("resize", _.debounce(positionGridItems, 100));


// DEMO CODE

const generateImages = (el, count = 10) => {
  const getRandomSize = (min, max) =>
  Math.round(Math.random() * (max - min) + min);

  const newImage = (i) => {
   
 //   console.log('****************************'+miArraydefotos[i]._id);


    const item = document.createElement("div");
    item.className = "grid__item";

    const a =document.createElement("a");
    a.className = "grid__link";

    a.setAttribute('href', `/picture/${miArraydefotos[i].id}`);
    item.appendChild(a);

    const content = document.createElement("img");
    //const width = getRandomSize(200, 600);
    //const height = getRandomSize(200, 400);
    content.src = miArraydefotos[i].src;

    a.appendChild(content);
    gridItems.push({ item,a,content });

    return item;
  };

  let images = document.createDocumentFragment();
  for (let i = 0; i < count; i++) images.appendChild(newImage(i));
  el.appendChild(images);
};

generateImages(grid, miArraydefotos.length);