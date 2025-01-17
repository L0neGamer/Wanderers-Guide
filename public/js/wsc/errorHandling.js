/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

const IS_DEBUG = true;

let errorMessages = [];

function displayError(message){
  console.error('Error: '+message);
  errorMessages.push(message);
  reloadErrorMessages();
}

function clearErrorMessages() {
  errorMessages = [];
}

function reloadErrorMessages(){
    if(errorMessages.length > 0) {
        let errorHTML = '<p class="subtitle is-marginless has-text-weight-bold">Errors</p>';
        for(let errMsg of errorMessages){
            errorHTML += '<p class="has-txt-value-number">'+errMsg+'</p>';
        }
        $('#errorMessage').html(errorHTML);
        $('#errorDisplay').removeClass('is-hidden');
    } else {
        $('#errorMessage').html('');
        $('#errorDisplay').addClass('is-hidden');
    }
}

socket.on("returnErrorMessage", function(message){
  displayError(message);
});