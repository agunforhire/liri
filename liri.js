var fs = require("fs");
var axios = require("axios");
var inquirer = require("inquirer");

//Liri takes the following arguments
// * spotify-this-song
// * movie-this

//these add other programs to this one
require("dotenv").config();
let dataKeys = require("./keys.js");
var fs = require('fs');
let Spotify = require('node-spotify-api');
let request = require('request');
var inquirer = require('inquirer');

let space = "\n\n";
let divider = "================= ******************* ==================";


// Function that writes all the data from output to the logfile
function writeToLog(data) {
    fs.appendFile("log.txt", '\r\n\r\n', function(err) {
        if (err) {
            return console.log(err);
        }
    });

    fs.appendFile("log.txt", (data), function(err) {
        if (err) {
            return console.log(err);
        }
        console.log(space + "log.txt was updated!");
    });
}

function getSpotify(songName) {
    let spotify = new Spotify(dataKeys.spotify);
    
    if (!songName) {
        songName = "Bang a gong (Get it on)";
    }
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            var output = [
                "Song Name: "+ "'" + songName.toUpperCase() + "'",
                "Album Name: " + data.tracks.items[0].album.name,
                "Artist Name: " + data.tracks.items[0].album.artists[0].name,
                "URL: " + data.tracks.items[0].album.external_urls.spotify
            ].join(space);
            console.log(divider, space, output, space, divider);
            writeToLog(output);
        }
    });

}

let getMovie = function(movieName) {

    if (!movieName) {
        movieName = "Mac and Me";
    }
    let urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=630c703e";

    request(urlHit, function(err, res, body) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            let jsonData = JSON.parse(body);
            output = [
                'Title: ' + jsonData.Title,
                 'Year: ' + jsonData.Year,
                 'Rated: ' + jsonData.Rated,
                 'IMDB Rating: ' + jsonData.imdbRating,
                 'Country: ' + jsonData.Country,
                 'Language: ' + jsonData.Language,
                 'Plot: ' + jsonData.Plot,
                 'Actors: ' + jsonData.Actors,
                 'Tomato Rating: ' + jsonData.Ratings[1].Value,
                 'IMDb Rating: ' + jsonData.imdbRating
                ].join(space);

            console.log(divider, space, output, space, divider);
            writeToLog(divider, output);
        }
    });
};

let getConcert = function(concert) {
    if (!concert) {
        concert = "Melvins"
    }
    let url = "https://rest.bandsintown.com/artists/" + concert + "/events?app_id=codingbootcamp";
    request(url, function(err, res, body) {
    if (err)
    {
     console.log('An Error Occurred!',err);
     return;
    }

    else {
        let jsonData = JSON.parse(body);
        console.log(jsonData);

        for (var i = 0; i < jsonData.length; i++){
            output = [
                "Lineup: " + jsonData[i].lineup[0],
                "Date: " + jsonData[i].datetime,
                "Venue: " + jsonData[i].venue.name,
                "City: " + jsonData[i].venue.city,
                "State: " + jsonData[i].venue.region
            ].join(space);
            console.log(divider, space, output, space + divider);
            writeToLog(divider, output);
        }
    }})};

    

let questions = [{
        type: 'list',
        name: 'programs',
        message: 'What would you like to do?',
        choices: ['Spotify', 'Movie', 'Concert']
    },
    {
        type: 'input',
        name: 'movieChoice',
        message: 'What\'s the name of the movie you would like?',
        when: function(answers) {
            return answers.programs == 'Movie';
        }
    },
    {
        type: 'input',
        name: 'songChoice',
        message: 'What\'s the name of the song you would like?',
        when: function(answers) {
            return answers.programs == 'Spotify';
        }
    },
    {
        type: 'input',
        name: 'concertChoice',
        message: 'What artist or band are you looking for?',
        when: function(answers){
            return answers.programs == 'Concert';
        }
    }
];

inquirer
    .prompt(questions)
    .then(answers => {
        // Depending on which program the user chose to run it will do the function for that program
        switch (answers.programs) {
            case 'Spotify':
                getSpotify(answers.songChoice);
                break;
            case 'Movie':
                getMovie(answers.movieChoice);
                break;
            case 'Concert':
                getConcert(answers.concertChoice);
                break;
            default:
                console.log('I\'m sorry Dave, but I can\'t do that.');
        }
});