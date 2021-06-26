/* eslint-disable no-console */
/* eslint-env browser */

/* TODO
* Der Download eines (zufälligen) Bildes aus der API nach Klick. 
* Der Download eines fertigen, bearbeiteten Bildes soll möglich sein.
* Text soll hinzugefügt und nach den Kriterien Schriftgröße, -art, und -farbe durch Klicks auf die entsprechenden Buttons anpassbar sein. 
* Wird erneut auf den Text-Button geklickt, soll der alte Text editiert werden, und kein neuer hinzugefügt (*toggling*).
* SoC realisieren
* ESLinting
*/

const AVAILABLE_FONT_COLORS = ["#FFF", "#000"],
    AVAILABLE_FONT_SIZES = ["14px", "24px", "36px", "48px", "72px", "96px", "144px"],
    AVAILABLE_FONTS = ["Arial", "Verdana", "Helvetica", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Garamond", "Courier New", "Brush Script MT"];

let canvas, ctx, catImage, text, currentFont = 0, currentFontSize = 3, currentFontColor = 0;

function init() {
    console.log("### Cat-Meme-Generator ###");

    canvas = document.querySelectorAll(".generator>.canvas-area>canvas")[0];
    ctx = canvas.getContext("2d");
    ctx.textAlign = "center";
    updateCanvasText();

    //Draw Image of Cat
    (async () => {
        catImage = await getCatImage(); //Set current Cat Image
        drawCatImageWithText(false); //Draw it, but without text, because there is no text yet.
    })(); 

    const inputElement = document.querySelectorAll(".generator>.canvas-area>input")[0];
    inputElement.classList.add("hidden");
    inputElement.addEventListener("keydown", (e) => {
        if(e.key === "Enter") {
            text = inputElement.value; //Update Text
            inputElement.classList.add("hidden"); //Hide the Input Element
            drawCatImageWithText(true); //Draw Cat Image with the new Text ontop
        }
    });

    initButton("reload", async () => {
        catImage = await getCatImage();
        drawCatImageWithText(true); //Change to "false", if old Text should disappear when new picture is loaded
    });

    initButton("write", () => {
        drawCatImageWithText(false);
        inputElement.classList.remove("hidden");
        inputElement.focus();
    });

    initButton("font", () => {
        currentFont = (currentFont+1) % AVAILABLE_FONTS.length; //Increment Index of current Font.
        updateCanvasText(true);
    });

    initButton("fontColor", () => {
        currentFontColor = (currentFontColor+1) % AVAILABLE_FONT_COLORS.length; //Increment Index of current Font Color
        updateCanvasText(true);
    });

    initButton("fontSize", () => {
        currentFontSize = (currentFontSize+1) % AVAILABLE_FONT_SIZES.length; //Increment Index of current Font Size
        updateCanvasText(true);
    });

    initButton("download", () => {
        let downloadLink = document.createElement("a");
        downloadLink.setAttribute("download", "Your Cat Meme.png");
        canvas.toBlob(blob => {
          let url = URL.createObjectURL(blob);
          downloadLink.setAttribute("href", url);
          downloadLink.click();
        });
    });
}

async function getCatImage() {
    const resp = await fetch("/image"),
     data = await resp.json();
    let image = new Image();
    image.src = data.url;
    await image.decode();
    return image;
}

function drawCatImageWithText(drawText) {
    ctx.drawImage(catImage, 0, 0,canvas.width,canvas.height);
    if (drawText && text) {
        // eslint-disable-next-line no-magic-numbers
        ctx.fillText(text, canvas.width/2, canvas.height/1.2);
    }
}

function updateCanvasText(refreshImage) {
    ctx.font = AVAILABLE_FONT_SIZES[currentFontSize] + " " + AVAILABLE_FONTS[currentFont];
    ctx.fillStyle = AVAILABLE_FONT_COLORS[currentFontColor];

    if (refreshImage) {drawCatImageWithText(true);}
}

function initButton(buttonAction, func) {
    const button = document.querySelectorAll(`[data-action="${buttonAction}"]`)[0].parentElement;
    button.addEventListener("click", func);
}

init();