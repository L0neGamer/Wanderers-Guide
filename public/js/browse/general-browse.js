/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();

// Core Quickview Data //
let g_featMap = null;
let g_skillMap = null;
let g_itemMap = null;
let g_spellMap = null;
let g_allLanguages = null;
let g_allConditions = null;
let g_allTags = null;
let g_allClasses = null;
let g_allAncestries = null;
let g_allArchetypes = null;
let g_allBackgrounds = null;
let g_allUniHeritages = null;
// ~~~~~~~~~~~~~~~~~ //

let activeSearchTab = 'ancestry';

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {
  
  socket.emit("requestBrowse");

});

socket.on("returnBrowse", function(featsObject, skillObject, itemObject, spellObject, allLanguages, allConditions, allTags, classes, ancestries, archetypes, backgrounds, uniHeritages) {
  let featMap = objToMap(featsObject);
  let skillMap = objToMap(skillObject);
  let itemMap = objToMap(itemObject);
  let spellMap = objToMap(spellObject);

  initBrowse(featMap, skillMap, itemMap, spellMap, allLanguages, allConditions, allTags, classes, ancestries, archetypes, backgrounds, uniHeritages);
});

function initBrowse(featMap, skillMap, itemMap, spellMap, allLanguages, allConditions, allTags, classes, ancestries, archetypes, backgrounds, uniHeritages) {
  finishLoadingPage();
  
  g_featMap = featMap;
  g_skillMap = skillMap;
  g_itemMap = itemMap;
  g_spellMap = spellMap;
  g_allLanguages = allLanguages;
  g_allConditions = allConditions;
  g_allTags = allTags;
  g_allClasses = classes;
  g_allAncestries = ancestries;
  g_allArchetypes = archetypes;
  g_allBackgrounds = backgrounds;
  g_allUniHeritages = uniHeritages;

  // Tags
  for(let tag of g_allTags){
    $('#filterTagsInput').append('<option value="'+tag.id+'">'+tag.name+'</option>');
  }
  $("#filterTagsInput").chosen({width: "100%"});
  $("#filterTagsInput").chosen();

  // Sources
  $('#filterSourceInput').append('<option value="ANY">Any</option>');
  for(let source of g_contentSources){
    $('#filterSourceInput').append('<option value="'+source.CodeName+'">'+source.TextName+'</option>');
  }

  // Skill
  $('#filterFeatSkillInput').append('<option value="ANY">Any</option>');
  for(const [skillName, skillData] of g_skillMap.entries()){
    $('#filterFeatSkillInput').append('<option value="'+skillData.Skill.id+'">'+skillName+'</option>');
  }


  // Highlighting Applied Filters //
  $("#filterNameInput").blur(function(){
    if($('#filterNameInput').val() != ''){
      $('#filterNameInput').addClass('is-info');
    } else {
      $('#filterNameInput').removeClass('is-info');
    }
  });
  $("#filterFeatPrereqInput").blur(function(){
    if($('#filterFeatPrereqInput').val() != ''){
      $('#filterFeatPrereqInput').addClass('is-info');
    } else {
      $('#filterFeatPrereqInput').removeClass('is-info');
    }
  });
  $("#filterItemUsageInput").blur(function(){
    if($('#filterItemUsageInput').val() != ''){
      $('#filterItemUsageInput').addClass('is-info');
    } else {
      $('#filterItemUsageInput').removeClass('is-info');
    }
  });
  $("#filterDescInput").blur(function(){
    if($('#filterDescInput').val() != ''){
      $('#filterDescInput').addClass('is-info');
    } else {
      $('#filterDescInput').removeClass('is-info');
    }
  });
  $("#filterSpellTraditionInput").blur(function(){
    if($('#filterSpellTraditionInput').val() != 'ANY'){
      $('#filterSpellTraditionInput').parent().addClass('is-info');
    } else {
      $('#filterSpellTraditionInput').parent().removeClass('is-info');
    }
  });
  $("#filterActionsInput").blur(function(){
    if($('#filterActionsInput').val() != 'ANY'){
      $('#filterActionsInput').parent().addClass('is-info');
    } else {
      $('#filterActionsInput').parent().removeClass('is-info');
    }
  });
  $("#filterSpellSavingThrowInput").blur(function(){
    if($('#filterSpellSavingThrowInput').val() != 'ANY'){
      $('#filterSpellSavingThrowInput').parent().addClass('is-info');
    } else {
      $('#filterSpellSavingThrowInput').parent().removeClass('is-info');
    }
  });
  $("#filterSpellFocusInput").blur(function(){
    if($('#filterSpellFocusInput').val() != 'ANY'){
      $('#filterSpellFocusInput').parent().addClass('is-info');
    } else {
      $('#filterSpellFocusInput').parent().removeClass('is-info');
    }
  });
  $("#filterLevelInput").blur(function(){
    if($('#filterLevelInput').val() != ''){
      $('#filterLevelInput').addClass('is-info');
    } else {
      $('#filterLevelInput').removeClass('is-info');
    }
  });
  $("#filterItemPriceInput").blur(function(){
    if($('#filterItemPriceInput').val() != ''){
      $('#filterItemPriceInput').addClass('is-info');
    } else {
      $('#filterItemPriceInput').removeClass('is-info');
    }
  });
  $("#filterItemBulkInput").blur(function(){
    if($('#filterItemBulkInput').val() != ''){
      $('#filterItemBulkInput').addClass('is-info');
    } else {
      $('#filterItemBulkInput').removeClass('is-info');
    }
  });
  $("#filterRarityInput").blur(function(){
    if($('#filterRarityInput').val() != 'ANY'){
      $('#filterRarityInput').parent().addClass('is-info');
    } else {
      $('#filterRarityInput').parent().removeClass('is-info');
    }
  });
  $("#filterFeatSkillInput").blur(function(){
    if($('#filterFeatSkillInput').val() != 'ANY'){
      $('#filterFeatSkillInput').parent().addClass('is-info');
    } else {
      $('#filterFeatSkillInput').parent().removeClass('is-info');
    }
  });
  $("#filterItemCategoryInput").blur(function(){
    if($('#filterItemCategoryInput').val() != 'ANY'){
      $('#filterItemCategoryInput').parent().addClass('is-info');
    } else {
      $('#filterItemCategoryInput').parent().removeClass('is-info');
    }
  });
  $("#filterSourceInput").blur(function(){
    if($('#filterSourceInput').val() != 'ANY'){
      $('#filterSourceInput').parent().addClass('is-info');
    } else {
      $('#filterSourceInput').parent().removeClass('is-info');
    }
  });

  // Changing Tabs //
  $('.searchTab').click(function(){
    let tabName = $(this).attr('data-tab-name');
    openTab(tabName);
  });
  openTab(activeSearchTab);

  // Search Filtering //
  $('#updateFilterButton').click(function(){
    filterSearch();
  });
  $(document).on('keypress',function(e) {
    if(e.which == 13) {
      filterSearch();
    }
  });

}

function openTab(tabName){
  activeSearchTab = tabName;
  let searchOnTabOpen = false;

  $('#ancestriesSearchTab').parent().removeClass("is-active");
  $('#archetypesSearchTab').parent().removeClass("is-active");
  $('#backgroundsSearchTab').parent().removeClass("is-active");
  $('#classesSearchTab').parent().removeClass("is-active");
  $('#featsSearchTab').parent().removeClass("is-active");
  $('#itemsSearchTab').parent().removeClass("is-active");
  $('#spellsSearchTab').parent().removeClass("is-active");
  $('#vHeritagesSearchTab').parent().removeClass("is-active");

  $('.filterFieldSection').each(function(){
    $(this).addClass('is-hidden');
  });

  // Reset Filter Sections //
  $('#filterNameInput').val('');
  $('#filterTagsInput').val('');
  $('#filterTagsInput').trigger("chosen:updated");
  $('#filterFeatPrereqInput').val('');
  $('#filterItemUsageInput').val('');
  $('#filterDescInput').val('');
  $('#filterSpellTraditionInput').val('ANY');
  $('#filterActionsInput').val('ANY');
  $('#filterLevelRelationInput').val('EQUAL');
  $('#filterLevelInput').val('');
  $('#filterSpellSavingThrowInput').val('ANY');
  $('#filterSpellFocusInput').val('ANY');
  $('#filterItemPriceRelationInput').val('EQUAL');
  $('#filterItemPriceInput').val('');
  $('#filterItemBulkRelationInput').val('EQUAL');
  $('#filterItemBulkInput').val('');
  $('#filterRarityInput').val('ANY');
  $('#filterFeatSkillInput').val('ANY');
  $('#filterItemCategoryInput').val('ANY');
  $('#filterSourceInput').val('ANY');

  switch(tabName){
    case 'ancestry':
      $('#filterNameSection').removeClass('is-hidden');
      $('#filterRaritySection').removeClass('is-hidden');
      $('#filterSourceSection').removeClass('is-hidden');

      $('#ancestriesSearchTab').parent().addClass("is-active");

      searchOnTabOpen = true;
      break;
    case 'archetype':
      $('#filterNameSection').removeClass('is-hidden');
      $('#filterLevelSection').removeClass('is-hidden');
      $('#filterRaritySection').removeClass('is-hidden');
      $('#filterSourceSection').removeClass('is-hidden');

      $('#archetypesSearchTab').parent().addClass("is-active");

      // Defaults //
      $('#filterLevelInput').attr('max', 20);
      $('#filterLevelInput').attr('min', 0);
      searchOnTabOpen = true;
      break;
    case 'background':
      $('#filterNameSection').removeClass('is-hidden');
      $('#filterRaritySection').removeClass('is-hidden');
      $('#filterSourceSection').removeClass('is-hidden');

      $('#backgroundsSearchTab').parent().addClass("is-active");

      searchOnTabOpen = true;
      break;
    case 'class':
      $('#filterNameSection').removeClass('is-hidden');
      $('#filterSourceSection').removeClass('is-hidden');

      $('#classesSearchTab').parent().addClass("is-active");

      searchOnTabOpen = true;
      break;
    case 'feat':
      $('#filterNameSection').removeClass('is-hidden');
      $('#filterTagsSection').removeClass('is-hidden');
      $('#filterFeatPrereqSection').removeClass('is-hidden');
      $('#filterDescSection').removeClass('is-hidden');
      $('#filterActionsSection').removeClass('is-hidden');
      $('#filterLevelSection').removeClass('is-hidden');
      $('#filterRaritySection').removeClass('is-hidden');
      $('#filterFeatSkillSection').removeClass('is-hidden');
      $('#filterSourceSection').removeClass('is-hidden');

      $('#featsSearchTab').parent().addClass("is-active");

      // Defaults //
      $('#filterLevelRelationInput').val('GREATER-EQUAL');
      $('#filterLevelInput').val('1');
      $('#filterLevelInput').attr('max', 20);
      $('#filterLevelInput').attr('min', -1);
      break;
    case 'item':
      $('#filterNameSection').removeClass('is-hidden');
      $('#filterTagsSection').removeClass('is-hidden');
      $('#filterItemUsageSection').removeClass('is-hidden');
      $('#filterDescSection').removeClass('is-hidden');
      $('#filterLevelSection').removeClass('is-hidden');
      $('#filterItemPriceSection').removeClass('is-hidden');
      $('#filterItemBulkSection').removeClass('is-hidden');
      $('#filterRaritySection').removeClass('is-hidden');
      $('#filterItemCategorySection').removeClass('is-hidden');
      $('#filterSourceSection').removeClass('is-hidden');

      $('#itemsSearchTab').parent().addClass("is-active");

      // Defaults //
      $('#filterLevelInput').attr('max', 30);
      $('#filterLevelInput').attr('min', 0);
      break;
    case 'spell':
      $('#filterNameSection').removeClass('is-hidden');
      $('#filterTagsSection').removeClass('is-hidden');
      $('#filterDescSection').removeClass('is-hidden');
      $('#filterSpellTraditionSection').removeClass('is-hidden');
      $('#filterActionsSection').removeClass('is-hidden');
      $('#filterLevelSection').removeClass('is-hidden');
      $('#filterSpellSavingThrowSection').removeClass('is-hidden');
      $('#filterSpellFocusSection').removeClass('is-hidden');
      $('#filterRaritySection').removeClass('is-hidden');
      $('#filterSourceSection').removeClass('is-hidden');

      $('#spellsSearchTab').parent().addClass("is-active");

      // Defaults //
      $('#filterLevelInput').attr('max', 10);
      $('#filterLevelInput').attr('min', 0);
      break;
    case 'v-heritage':
      $('#filterNameSection').removeClass('is-hidden');
      $('#filterSourceSection').removeClass('is-hidden');

      $('#vHeritagesSearchTab').parent().addClass("is-active");

      searchOnTabOpen = true;
      break;
    default: break;
  }

  // Triggers all blur events, updating highlights
  $('.input').blur();
  $('.select select').blur();

  // Default Search Results
  if(searchOnTabOpen){
    filterSearch();
  } else {
    $('#searchResultCountContainer').html('');
    displayDefaultResults();
  }
}

function filterSearch(){
  switch(activeSearchTab){
    case 'ancestry': filterAncestrySearch(); return;
    case 'archetype': filterArchetypeSearch(); return;
    case 'background': filterBackgroundSearch(); return;
    case 'class': filterClassSearch(); return;
    case 'feat': filterFeatSearch(); return;
    case 'item': filterItemSearch(); return;
    case 'spell': filterSpellSearch(); return;
    case 'v-heritage': filterUniHeritageSearch(); return;
    default: return;
  }
}

function displayDefaultResults(){
  $('#browsingList').html('<p class="has-text-centered is-italic">Apply some filters and click to search!</p>');
}

function finishLoadingPage() {
  // Turn off page loading
  $('.pageloader').addClass("fadeout");
}