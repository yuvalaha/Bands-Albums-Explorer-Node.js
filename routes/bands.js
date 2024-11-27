import axios from "axios";
import bodyParser from "body-parser";
import express from "express";
import cleanText from "../utils/cleanText.js";

// My Api Key Audioscrobbler
const apiKey = "8472a382a58cf0699fb2a75627b45ee6";


// My Token Discogs
const apiToken = "kPdNHgqFPstRcERatFfNBdkYTNkUQpfdfLkWPWsg";

let title = '';

const router = express.Router();


// Band page route 
router.get('/', async(req, res) => {
    title = 'Bands';
    const bandName = req.query.band;
    if (bandName){
        // Getting artist id
        const responseId = await axios.get(`https://api.discogs.com/database/search?q=${bandName}&type=artist&token=${apiToken}`);
        const bandId = responseId.data.results[0].id;

        // Get band information
        const responseBand = await axios.get(`https://api.discogs.com/artists/${bandId}?token=${apiToken}`)
        const bandData = responseBand.data;

        // "Clean" the band profile. (Remove unnecessary letters)
        let cleanedBandProfile = "";
        if(bandData.profile){
            cleanedBandProfile = cleanText(bandData.profile);
        }

        // Get band albums
        const responseAlbums = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${bandData.name}&api_key=${apiKey}&format=json`)
        const albumsData = responseAlbums.data;
        // console.log(albumsData.topalbums);



        res.render('bands.ejs', {band: bandData, bandProfile: cleanedBandProfile, allAlbums: albumsData.topalbums.album, title});
    }
    else res.render('bands.ejs', {band: null, topAlbums: null, title});
})

router.post('/', async(req, res) => {
    try{
        title = 'Bands';

        const band = req.body.band.trim();
        
        // Getting artist id
        const responseId = await axios.get(`https://api.discogs.com/database/search?q=${band}&type=artist&token=${apiToken}`);
        const bandId = responseId.data.results[0].id;

        // Get band information
        const responseBand = await axios.get(`https://api.discogs.com/artists/${bandId}?token=${apiToken}`)
        const bandData = responseBand.data;

        // "Clean" the band profile. (Remove unnecessary letters)
        let cleanedBandProfile = "";
        if(bandData.profile){
            cleanedBandProfile = cleanText(bandData.profile);
        }

        // Get band albums
        const responseAlbums = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${bandData.name}&api_key=${apiKey}&format=json`)
        const albumsData = responseAlbums.data;
        // console.log(albumsData.topalbums);



        res.render('bands.ejs', {band: bandData, bandProfile: cleanedBandProfile, allAlbums: albumsData.topalbums.album, title});
    }
    catch (error){
        return res.status(404).render('404.ejs', {title: "404 - Not Found"});

    }
});



export default router;