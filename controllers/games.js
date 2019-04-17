const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const parser = require('xml2json');

module.exports = (db) => {

  /**
   * ===========================================
   * Controller logic
   * ===========================================
   */

   let searchGameControllerCallback = (request, response) => {
    response.render('gameRun/searchGame');
   };  // end of search game


   let searchControllerCallback = (request, response) => {
    let gameId = parseInt(request.params.id)
    console.log(gameId)

    response.render('gameRun/addGames', {id: gameId});
   }  // end of search


  let gamesControllerCallback = (request, response) => {
    db.games.getGames((err, results) => {
        if (err) {
            console.error(err);
            response.status(500).send("Error getting games list")
        } else {
            //response.send(results.rows);
            response.render('gamerun/games', {games:results.rows});
        }
    })  // end of db
  };  // end of get games


  let indvGameControllerCallback = (request, response) => {
    db.games.getIndvGame(request.params.id, (err, results) => {
        if (err) {
            console.error(err);
            response.status(500).send("Error getting indv game")
        } else {
            response.send(results.rows);
        }
    })
  }  // end of indv game details


  let addGamesFormControllerCallback = (request, response) => {
    let gameId = parseInt(request.params.id)
    console.log(gameId);
    // get game details first
    var req = new XMLHttpRequest();
    req.open("GET", `https://www.boardgamegeek.com/xmlapi2/thing?id=${gameId}`, false);

    req.send(null);
    const json = JSON.parse(parser.toJson(req.responseText));
    //console.log(json);


    //response.send(JSON.parse(json))
    ;

   response.render('gameRun/addGames', {id: gameId, data: json.items.item});
  }  // end of add games form


  let addGamesControllerCallback = (request, response) => {
    // add availability
    request.body.availability = true;
    db.games.addGames(request.body, (err, results) => {
        if (err) {
            console.error(err);
            response.status(500).send("Query error for adding games.")
        } else {
            //response.send("Add Game - Successful")
            response.redirect('/games');
        }
    })
  }  // end of adding games


  /**
   * ===========================================
   * Export controller functions as a module
   * ===========================================
   */
  return {
    searchGame: searchGameControllerCallback,
    search: searchControllerCallback,
    getGames: gamesControllerCallback,
    getIndvGame: indvGameControllerCallback,
    addGameForm: addGamesFormControllerCallback,
    addGame: addGamesControllerCallback,
  };

}