
const Character = require('../models/contentDB/Character');

const UserHomebrew = require('./UserHomebrew');

module.exports = class CharContentHomebrew {

    static getHomebrewArray(character){
        return JSON.parse(character.enabledHomebrew);
    }

    static addHomebrewBundle(socket, charID, homebrewID){
      return UserHomebrew.canAccessHomebrewBundle(socket, homebrewID)
      .then((canAccess) => {
        if(canAccess){
          return Character.findOne({ where: { id: charID } })
          .then((character) => {
              let homebrewArray = CharContentHomebrew.getHomebrewArray(character);
              homebrewArray.push(homebrewID);
              let charUpVals = {enabledHomebrew: JSON.stringify(homebrewArray) };
              return Character.update(charUpVals, { where: { id: character.id } })
              .then((result) => {
                  return;
              });
          });
        }
      });
    }

    static removeHomebrewBundle(charID, homebrewID){
        return Character.findOne({ where: { id: charID } })
        .then((character) => {
            let homebrewArray = CharContentHomebrew.getHomebrewArray(character);
            let bundleIndex = homebrewArray.indexOf(homebrewID);
            if (bundleIndex > -1) {
              homebrewArray.splice(bundleIndex, 1);
            }
            let charUpVals = {enabledHomebrew: JSON.stringify(homebrewArray) };
            return Character.update(charUpVals, { where: { id: character.id } })
            .then((result) => {
                return;
            });
        });
    }

};