import axios from "axios";
import express from "express";
import cleanText from "../utils/cleanText.js";


// My Api Key Audioscrobbler
const apiKey = "8472a382a58cf0699fb2a75627b45ee6";

// My Token Discogs
const apiToken = "kPdNHgqFPstRcERatFfNBdkYTNkUQpfdfLkWPWsg";

const router = express.Router();

let title = '';


// Albums page route
router.get('/', async(req, res) => {
    try{
        title = 'Albums';

        // Get the name of the band and the album from the user
        const userAlbum = req.query.album;
        const userBand = req.query.band;

        if (userBand && userAlbum){
            // Get the album information 
            const responseAlbum = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${apiKey}&artist=${userBand}&album=${userAlbum}&format=json`);
            const albumData = responseAlbum.data;

            // Get the band information
            const responseBand = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${userBand}&api_key=${apiKey}&format=json`);
            const bandData = responseBand.data;

            let cleanedBandBio = "";
            if(bandData.artist && bandData.artist.bio && bandData.artist.bio.summary){
            cleanedBandBio = cleanText(bandData.artist.bio.summary);
        }

        res.render('albums.ejs', { album: albumData.album, bandBio: cleanedBandBio, title });
        }

        else res.render('albums.ejs', { album: null, band: null, title });
    }
    catch (error){
        // return res.status(404).render('404.ejs', {title: "404 - Not Found"});
        console.log(error)
    }
    
});

router.post('/', async(req, res) => {
    try{

        // Get the name of the band and the album from the user
        const userBand = req.body.band.trim();
        const userAlbum = req.body.album.trim();

         // Encode user inputs to handle spaces and special characters
         const encodedUserBand = userBand.replace(/\s+/g, '%20');
         const encodedUserAlbum = userAlbum.replace(/\s+/g, '%20');
         

        // Get the album information 
        const responseAlbum = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${apiKey}&artist=${encodedUserBand}&album=${encodedUserAlbum}&format=json`);
        const albumData = responseAlbum.data;
        

        if (!albumData || !albumData.album || !albumData.album.tracks) {
            return res.status(404).render('404.ejs', {title: "404 - Not Found"});
            
        }


        const responseBand = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodedUserBand}&api_key=${apiKey}&format=json`);
        const bandData = responseBand.data;

        if (!bandData || !bandData.artist) {
            return res.status(404).render('404.ejs', {title: "404 - Not Found"});
        }

        let cleanedBandBio = "";
        if(bandData.artist && bandData.artist.bio && bandData.artist.bio.summary){
            cleanedBandBio = cleanText(bandData.artist.bio.summary);
        }

        res.render('albums.ejs', { album: albumData.album, bandBio: cleanedBandBio, title });
    }
    catch (error){
        res.status(404).render('404.ejs', {title: "404 - Not Found"});
        
    }
})

export default router;