/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

class DisplayBackground {
  constructor(containerID, backgroundID, homebrewID=null) {

    let backgroundDisplayContainerID = 'background-container-'+backgroundID;
    $('#'+containerID).parent().append('<div id="'+backgroundDisplayContainerID+'" class="is-hidden"></div>');
    $('#'+containerID).addClass('is-hidden');

    socket.emit('requestGeneralBackground', backgroundID, homebrewID);
    socket.off('returnGeneralBackground');
    socket.on("returnGeneralBackground", function(backgroundStruct){
      $('#'+backgroundDisplayContainerID).load("/templates/display-background.html");
      $.ajax({ type: "GET",
        url: "/templates/display-background.html",
        success : function(text)
        {

          $('#background-back-btn').click(function() {
            $('#'+backgroundDisplayContainerID).remove();
            $('#'+containerID).removeClass('is-hidden');
          });
          $('.category-tabs li').click(function() {
            $('#'+backgroundDisplayContainerID).remove();
            $('#'+containerID).removeClass('is-hidden');
          });

          $('#background-name').html(backgroundStruct.background.name);
          $('#background-description').html(processText(backgroundStruct.background.description, false, null, 'MEDIUM', false));

          let sourceStr = '';
          let backgroundRarity = convertRarityToHTML(backgroundStruct.background.rarity);
          if(backgroundRarity == ''){
            let sourceTextName = getContentSourceTextName(backgroundStruct.background.contentSrc);
            if(backgroundStruct.background.homebrewID != null){
              sourceTextName = 'Bundle #'+backgroundStruct.background.homebrewID;
            }
            sourceStr = sourceTextName;
          } else {
            let sourceTextName = getContentSourceTextName(backgroundStruct.background.contentSrc);
            if(backgroundStruct.background.homebrewID != null){
              sourceTextName = 'Bundle #'+backgroundStruct.background.homebrewID;
            }
            sourceStr = '<span class="pr-2">'+sourceTextName+'</span>';
          }
          $('#background-source').html(sourceStr+backgroundRarity);

          let boostStr = '';
          if(backgroundStruct.background.boostOne != null){
            let boostParts = backgroundStruct.background.boostOne.split(',');
            for (let i = 0; i < boostParts.length; i++) {
              if(i != 0) {
                if(i == boostParts.length-1){
                  boostStr += ' or ';
                } else {
                  boostStr += ', ';
                }
              }
              boostStr += lengthenAbilityType(boostParts[i]);
            }
          } else {
            boostStr = 'Free';
          }
          $('#background-boost-one').html(boostStr);
          $('#background-boost-two').html('Free');
          
          $('#'+backgroundDisplayContainerID).removeClass('is-hidden');
        }
      });
    });
  }
}