import express from 'express';
import { readFile } from 'fs';
import axios from 'axios';
//import { join } from 'path';

const app = express();      //Create our app
const PORT = 5500;          //Set port manually

let randDef = "";

// serve static files from 'public' dir to user
app.use(express.static('public'));

//listens for http GET named "/get-random-word" (comes from index.html)
app.get('/get-random-word', async (req, res) => { // async required for await

    const filePath = "./data/words.txt";
    readFile(filePath, { encoding: 'utf8' }, async (err, data) => { // async for await usage
        if (err) {  //Handle errors
            console.error("Error!:", err);
            res.status(500).send("Error reading file");
            return;
        }

        //parse words and get a random word
        const words = data.split(',');
        const trimmedWords = words.map(word => word.trim()).filter(word => word.length > 0);
        const randWord = trimmedWords[Math.floor(Math.random() * trimmedWords.length)];

        //make request for submittal with new random word
        const options = {
            method: 'GET',
            url: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
            params: {term: randWord}, 
            headers: {
              'X-RapidAPI-Key': '3750eff7d4mshffc8b601a477c29p1392c0jsn0165f99c8005',
              'X-RapidAPI-Host': 'mashape-community-urban-dictionary.p.rapidapi.com'
            }
        };

        //make request using axios
        try {
            const response = await axios.request(options); // USING await FROM async function

            const randIndex = Math.floor(Math.random() * response.data.list.length);  //Get random definition

            let randDef = response.data.list[randIndex].definition;

            randDef = randDef.replace(/\[|\]|\\r|\\n\\/g, '');

        } catch (error) {
            console.error(error);
        }
        res.json({ randWord, randDef }); // awaits on the axios call
    });
});

//log server and port to console
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
