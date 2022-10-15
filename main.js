import { RGBToHSL, hexToRGB, HSLToRGB, HSLToHex } from "./colorconvert.js";

/* DOM ELEMENTS */
const DOMelements = {
  colorInput: document.querySelector(".color-picker__color-input"),
  textInput: document.querySelector(".color-picker__text-input"),
  headingHEX: document.querySelector(".baseColor__HEX"),
  headingRGB: document.querySelector(".baseColor__RGB"),
  headingHSL: document.querySelector(".baseColor__HSL"),
  preview: document.querySelector(".baseColor__preview"),
  cssVariables: document.querySelector(".output__cssVariables"),
  darkmodeToggle: document.querySelector(".darkmodeToggle"),
};
const output = {};

/* GLOBALS */
let colorValues = {
  hex: "",
  rgb: "",
  hsl: "",
};
const settings = {
  tonalLightnessValue: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100],
};
let tonalPalette = [];

/* EVENT LISTENERS */

DOMelements.textInput.addEventListener("change", (event) => {
  console.log("Selected color value (text)", event.currentTarget.value);
  reset();
  convert(event.currentTarget.value);
});

DOMelements.colorInput.addEventListener("change", (event) => {
  console.log("Selected color value (picker)", event.currentTarget.value);
  // insert selected values into text input
  reset();
  DOMelements.textInput.value = event.currentTarget.value;
  convert(event.currentTarget.value);
});

DOMelements.darkmodeToggle.addEventListener("click", () => {
  console.log("darkmode pressed");
  console.log(DOMelements.darkmodeToggle);
  document.querySelector("body").classList.toggle("--darkmode");
});

/*  Convert
    Takes a color value as input and converts it to different formats 
*/
function convert(value) {
  // remove inactive class
  document.body.classList.remove("--inactive");
  saveHexValue(value);
  //saveRGBValue(value);
  //saveHSLValue(value);

  console.log(colorValues);
  updatePreview();
  generateTonalPalette();
  outputCSSVariables();
}

function updatePreview() {
  //colorValues = value;
  DOMelements.preview.style.backgroundColor = colorValues.hex;
  DOMelements.preview.textContent = colorValues.hex;
  // set preview textcolor dependent on lightness of color
  let lightness = parseInt(
    colorValues.hsl
      .replace("hsl(", "")
      .replace(")", "")
      .split(",")[2]
      .replace("%", "")
  );
  if (lightness < 45) {
    DOMelements.preview.style.color = "white";
  } else {
    DOMelements.preview.style.color = "black";
  }
  //*console.log("lightness", lightness);
  //*console.log("could be white?", lightness < 40);
  DOMelements.headingHEX.textContent = colorValues.hex;
  DOMelements.headingHEX.addEventListener("click", (e) => {
    console.log("copy color from ", e.currentTarget.textContent);
  });
  DOMelements.headingRGB.textContent = colorValues.rgb;
  DOMelements.headingRGB.addEventListener("click", (e) => {
    console.log("copy color from ", e.currentTarget.textContent);
  });
  DOMelements.headingHSL.textContent = colorValues.hsl;
  DOMelements.headingHSL.addEventListener("click", (e) => {
    console.log("copy color from ", e.currentTarget.textContent);
  });

  // set color picker to match if value is from text input
  DOMelements.colorInput.value = colorValues.hex;
}

function saveHexValue(value) {
  console.log("What is received for check", value);
  console.log(colorValues);

  // if (!value.startsWith("#")) {
  console.log("Converting to hex");

  console.log("Handle HEX values");
  colorValues.hex = value;

  colorValues.rgb = hexToRGB(value);
  console.log("Converted to RGB", colorValues.rgb);

  colorValues.hsl = RGBToHSL(colorValues.rgb);
  //*console.log("Converted to HSL", colorValues.hsl);
  // } else {
  //   console.log("Can't convert to HEX. Value already is HEX");
  // }
}

/* Generate Tonal Palette from base value */
function generateTonalPalette() {
  const baseHSL = colorValues.hsl;
  console.log("Base color HSL", baseHSL);

  // Prepare values
  let tempHSL = baseHSL.replace("hsl(", "");
  tempHSL = tempHSL.replace(")", "");
  //*console.log("Cleaned value", tempHSL);

  tempHSL = tempHSL.split(",");
  //*console.log(tempHSL);

  tempHSL[1] = tempHSL[1].replace("%", "");
  tempHSL[2] = tempHSL[2].replace("%", "");
  //*console.log(tempHSL);

  // Loop through tonal lightness values and generate colors
  settings.tonalLightnessValue.forEach((l) => {
    generateVariation(tempHSL[0], tempHSL[1], l);
  });
  //generateVariation(tempHSL[0],tempHSL[1],tempHSL[2]);
  console.log("List of generated tonal variations", tonalPalette);

  generatePreviews();
}

function generateVariation(h, s, l) {
  let colors = {
    hsl: "hsl(" + h + "," + s + "%," + l + "%)",
    hex: HSLToHex(h, s, l),
    rgb: HSLToRGB(h, s, l),
    l: l,
  };
  tonalPalette.push(colors);
  //console.log(tonalPalette);
  //*console.log("--primary" + l + ": " + colors.hex + ";");
}

function generatePreviews() {
  tonalPalette.forEach((preview) => {
    let element = document.createElement("div");
    let label = document.createElement("label");
    element.className = "tonalPreview";
    //console.log('preview',preview.hex);
    element.style.backgroundColor = preview.hex;
    label.innerText = preview.l;
    label.classList = "tonalPreview__label";
    element.append(label);
    document.querySelector(".tonalPreviews").append(element);
  });
}

function outputCSSVariables() {
  let i = 0;
  DOMelements.cssVariables.textContent = ":root {\n";
  settings.tonalLightnessValue.forEach((l) => {
    console.log("CSS variable", l);
    console.log(tonalPalette[i].hex);
    DOMelements.cssVariables.textContent +=
      "--primary" + l + ": " + tonalPalette[i].hex + ";\n";
    i++;
  });
  DOMelements.cssVariables.textContent += "}";
}
function reset() {
  colorValues = {
    hex: "",
    rgb: "",
    hsl: "",
  };
  tonalPalette = [];
  document.querySelector(".tonalPreviews").innerHTML = "";
}
