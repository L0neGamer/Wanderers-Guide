
function findItemDataByName(itemMap, itemName){
    for(const [itemID, itemData] of itemMap.entries()){
        if(itemData.Item.name.toUpperCase() == itemName){
            return itemData;
        }
    }
    return null;
}

function hasFamiliarityReduceProf(itemData){
    for(let weaponFamiliarity of g_weaponFamiliaritiesArray){
        let traitName = weaponFamiliarity.value+' - ITEM';
        let tag = itemData.TagArray.find(tag => {
            return tag.Tag.name.toUpperCase() == traitName;
        });
        if(tag != null){
            return true;
        }
    }
    return false;
}

function buildWeaponProfMap(){

    let weaponProfMap = new Map(); // Key: ItemID Value: { NumUps, UserBonus }

    for(const [profName, profData] of g_profMap.entries()){
        if(profData.For == "Attack"){

            if(profName == 'Simple_Weapons'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.WeaponData != null && itemData.WeaponData.category == "SIMPLE"){
                        weaponProfMap.set(parseInt(itemID), {
                            NumUps : profData.NumUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else if(profName == 'Martial_Weapons'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.WeaponData != null && itemData.WeaponData.category == "MARTIAL"){

                        let numUps = profData.NumUps;
                        if(hasFamiliarityReduceProf(itemData)){
                            let reducedProfData = g_profMap.get('Simple_Weapons');
                            if(reducedProfData != null){
                                numUps = reducedProfData.NumUps;
                            } else {
                                numUps = 0;
                            }
                        }

                        weaponProfMap.set(parseInt(itemID), {
                            NumUps : numUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else if(profName == 'Advanced_Weapons'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.WeaponData != null && itemData.WeaponData.category == "ADVANCED"){

                        let numUps = profData.NumUps;
                        if(hasFamiliarityReduceProf(itemData)){
                            let reducedProfData = g_profMap.get('Martial_Weapons');
                            if(reducedProfData != null){
                                numUps = reducedProfData.NumUps;
                            } else {
                                numUps = 0;
                            }
                        }

                        weaponProfMap.set(parseInt(itemID), {
                            NumUps : numUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else if(profName == 'Unarmed_Attacks'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.WeaponData != null && itemData.WeaponData.category == "UNARMED"){
                        weaponProfMap.set(parseInt(itemID), {
                            NumUps : profData.NumUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else {
                let dProfName = profName.toUpperCase().replace(/_/g,' ');
                let itemData = findItemDataByName(g_itemMap, dProfName);
                if(itemData != null && itemData.WeaponData != null){

                    let numUps = profData.NumUps;
                    if(hasFamiliarityReduceProf(itemData)){
                        let reducedProfData = null;
                        if(itemData.WeaponData.category == "MARTIAL"){
                            reducedProfData = g_profMap.get('Simple_Weapons');
                        } else if (itemData.WeaponData.category == "ADVANCED"){
                            reducedProfData = g_profMap.get('Martial_Weapons');
                        } else {
                            reducedProfData = profData;
                        }

                        if(reducedProfData != null){
                            numUps = reducedProfData.NumUps;
                        } else {
                            numUps = 0;
                        }
                    }

                    weaponProfMap.set(itemData.Item.id, {
                        NumUps : numUps,
                        UserBonus : profData.UserBonus
                    });
                }
            }

        }
    }

    return weaponProfMap;
}


function buildArmorProfMap(){

    let armorProfMap = new Map(); // Key: ItemID Value: { NumUps, UserBonus }

    for(const [profName, profData] of g_profMap.entries()){
        if(profData.For == "Defense"){

            if(profName == 'Light_Armor'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.ArmorData != null && itemData.ArmorData.category == "LIGHT"){
                        armorProfMap.set(parseInt(itemID), {
                            NumUps : profData.NumUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else if(profName == 'Medium_Armor'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.ArmorData != null && itemData.ArmorData.category == "MEDIUM"){
                        armorProfMap.set(parseInt(itemID), {
                            NumUps : profData.NumUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else if(profName == 'Heavy_Armor'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.ArmorData != null && itemData.ArmorData.category == "HEAVY"){
                        armorProfMap.set(parseInt(itemID), {
                            NumUps : profData.NumUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else if(profName == 'Unarmored_Defense'){
                for(const [itemID, itemData] of g_itemMap.entries()){
                    if(itemData.ArmorData != null && itemData.ArmorData.category == "UNARMORED"){
                        armorProfMap.set(parseInt(itemID), {
                            NumUps : profData.NumUps,
                            UserBonus : profData.UserBonus
                        });
                    }
                }
            } else {
                let dProfName = profName.toUpperCase().replace(/_/g,' ');
                let itemData = findItemDataByName(g_itemMap, dProfName);
                if(itemData != null){
                    armorProfMap.set(itemData.Item.id, {
                        NumUps : profData.NumUps,
                        UserBonus : profData.UserBonus
                    });
                }
            }

        }
    }

    return armorProfMap;
}