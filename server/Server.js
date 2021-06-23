import Config from "./Config.js";
import express from "express";
import https from "https";
import fs from "fs";
import path from "path";

const app = express();

function downloadFile(url, file) {
    return new Promise(function(resolve, reject) {
        let fileStream = fs.createWriteStream(file);
        https.get(url, (response) => {
            let stream = response.pipe(fileStream);
            stream.on("finish", () => {
                resolve();
            });
        });
    });

}

function requestURL(url) {
    return new Promise(function(resolve, reject) {
        let data = "";
        https.get(url, (response) => {
            response.on("data", (chunk) => {
                data += chunk;
            });
            response.on("end", (chunk) => {
                let json = JSON.parse(data);
                resolve(json[0].url);
            });
            response.on("error", (error) => {
                reject(error);
            });
        });
    });

}

async function onImageRequested(request, response) {
    let imageURL = await requestURL(Config.CAT_API_URL),
        fileName = imageURL.substring(imageURL.lastIndexOf("/") + 1),
        filePath = path.join(Config.STORAGE_DIR, fileName);
    await downloadFile(imageURL, filePath);
    response.send({
        url: Config.STORAGE_ROUTE + "/" + fileName,
    });
}

class Server {

    start() {
        let server;
        app.get(Config.API_ROUTE, onImageRequested);
        app.use(Config.APP_ROUTE, express.static(Config.APP_DIR));
        app.use(Config.STORAGE_ROUTE, express.static(Config.STORAGE_DIR));
        server = app.listen(Config.PORT, "localhost", function() {
            console.log("Cat-Meme-Server listening at http://%s:%s", server.address().address, server.address().port);
        });
    }

}

export default new Server();