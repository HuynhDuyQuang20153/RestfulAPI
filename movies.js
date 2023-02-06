var express = require('express');
var router = express.Router();
var movies = [
      {id: 101, name: "Fight Club", year: 1999, rating: 8.1},
      {id: 102, name: "Inception", year: 2010, rating: 8.7},
      {id: 103, name: "The Dark Knight", year: 2008, rating: 9},
      {id: 104, name: "12 Angry Men", year: 1957, rating: 8.9}
   ];


//127.0.01: 3000/movies
//lay du lieu tu server
router.get('/', function(req, res){
    res.json(movies);   //hien thi ra toan bo cac movie
 });


//127.0.0.1: 3000/movies/101
//lay du lieu tu server thong qua id
router.get('/:id([0-9]{3,})', function(req, res){
   var currMovie = movies.filter(function(movie){
      if(movie.id == req.params.id){    //neu tim thay id thi true
         return true;
      }
   });
   if(currMovie.length == 1){           //neu ket qua chi co 1
      res.json(currMovie[0])            //hien thi
   } else {                             //neu co hon 1 ket qua hoac khong co ket qua nao
      res.status(404);                  
      res.json({message: "Not Found"}); //thong bao khong tim thay
   }
});


//127.0.0.1: 3000/movies/105
//dua du lieu len server
router.post('/', function(req, res){
      var newId = movies[movies.length-1].id+1;
      movies.push({
         id: newId,
         name: req.body.name,
         year: req.body.year,
         rating: req.body.rating
      });
      res.json(
         {message: "New movie created.", location: "/movies/" + newId}
      );
});


//127.0.0.1: 3000/movies/101
//cap nhat - sua doi du lieu len server thong qua id
router.put('/:id', function(req, res){
   //Check if all fields are provided and are valid:
   if(!req.body.name ||
      !req.body.year.toString().match(/^[0-9]{4}$/g) ||
      !req.body.rating.toString().match(/^[0-9]\.[0-9]$/g) ||
      !req.params.id.toString().match(/^[0-9]{3,}$/g)){
      
      res.status(400);
      res.json({message: "Bad Request"});
   } else {
      //lay vi tri cua movie thong qua id
      var updateIndex = movies.map(function(movie){
         return movie.id;
      }).indexOf(parseInt(req.params.id));
      
      if(updateIndex === -1){   
         //Movie not found, create new
         movies.push({
            id: req.params.id,
            name: req.body.name,
            year: req.body.year,
            rating: req.body.rating
         });
         res.json(
            {message: "New movie created.", location: "/movies/" + req.params.id}
         );
      } else {
         //Update existing movie
         movies[updateIndex] = {
            id: req.params.id,
            name: req.body.name,
            year: req.body.year,
            rating: req.body.rating
         };
         res.json(
            {message: "Movie id " + req.params.id + " updated.", location: "/movies/" + req.params.id}
         );
      }
   }
});


//127.0.0.1: 3000/movies/101
//xoa du lieu tu server thong qua id
router.delete('/:id', function(req, res){
   var removeIndex = movies.map(function(movie){
      return movie.id;
   }).indexOf(req.params.id); //Gets us the index of movie with given id.
   
   if(removeIndex === -1){  //khong tim thay
      res.json({message: "Not found"});
   } else {
      movies.splice(removeIndex, 1);
      res.send({message: "Movie id " + req.params.id + " removed."});
   }
});


//Routes will go here
module.exports = router;