/*global $:false */
'use strict';

var tournaments = (function(module){

  module.each_slice = function(arr){
    return _.chain(arr).groupBy(function(element,index){
      return Math.floor(index/2);
    }).toArray()._wrapped;
  };

  module.showTournament = function(){
    module.getTournament(76);
    };

  module.getTournament = function(id){
    $.ajax({
      url: module.tournaments_path + "/" + id.toString(),
    })
    .done(function(response) {
      module.active = response;
      if (response.status === 'open'){
        // module.renderOpenTournament(response);
        module.setup();
        module.runTournament();
      } else {
        module.renderClosedTournament(response);
      }

    })
    .fail(function() {
      console.log("error");
    });
  };

  module.setup = function(){
    module.array = module.active.images;
  };
  // declaring an array of images in the module.array variable. Then the second time around, we split the array into arrays of 2 objects within each array.
  //  i.e. arr = [1,2,3,4] --> [[1,2]], [[3,4]]

  module.runTournament = function(){
    module.count = 0;
    module.array = _.flatten(module.array);
    module.array = _.shuffle(module.array);

    if(module.array.length === 1){
      module.renderWinner();
    }
    else{
      module.array = module.each_slice(module.array);
      module.renderOpenTournament();
    }
  };

  module.renderOpenTournament = function(){
    console.log(module.array);
    console.log(module.count);
    if(module.count === module.array.length || module.array[module.count].length < 2){
      module.runTournament();

    }
    else{
      module.renderPairing();
    }
  };

  module.renderPairing = function(){
    var activeObject = {question: module.active.question, leftImage: module.array[module.count][0], rightImage: module.array[module.count][1]};
    var template = Handlebars.compile($('#showOpenTournamentTemplate').html());
    $('#container').html(template({
      tournament: activeObject
    }));
    $('#leftImage').click(function(){
      module.array[module.count].pop();
      module.count += 1;
      module.renderOpenTournament();
    });
    $('#rightImage').click(function(){
      module.array[module.count].shift();
      module.count += 1;
      module.renderOpenTournament();
    });
  };

  module.renderWinner = function(){
    module.active.winner = module.array[0];
    var template = Handlebars.compile($('#showWinnerTournamentTemplate').html());
    $('#container').html(template({
      tournament: module.active
    }));
  };

  module.renderClosedTournament = function(response){
    var template = Handlebars.compile($('#showClosedTournamentTemplate').html());
    $('#container').html(template({
      tournament: response
    }));
  };



  return module

})(tournaments || {});


$(document).ready(function(){

});
