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

function init() {
    console.log("### Cat-Meme-Generator ###");
}


init();