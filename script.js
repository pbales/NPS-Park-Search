'use strict';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson, maxResults) {
  console.log(responseJson);
  $('#js-error-message').empty();
  $('#search-results').empty();
  for (let i = 0; i < responseJson.data.length; i++) {
    $('#search-results').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p>Website URL: <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p>
      </li>`
    )
  }
  $('.results').removeClass('hidden');
}

function searchParks(states, maxResults, apiKey) {
  const params = {
    stateCode: states,
    limit: maxResults
  }
  const queryString = formatQueryParams(params);
  const requestUrl = 'https://developer.nps.gov/api/v1/parks?' + queryString + '&api_key=' + apiKey; 
  console.log(requestUrl);
  fetch(requestUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(error => {
      $('#js-error-message').text(`Something went wrong: ${error.message}`);
    });
}

function handleForm() {
  $('form').submit(evt => {
    evt.preventDefault();
    console.log('Searching');
    const states = $('#js-search-term').val().split(",");
    const maxResults = $('#js-max-results').val();
    const apiKey = 'jme0X4u6RiwBc6BgrEI5jSiuQhJ1SO2zrQcfy2uT'
    searchParks(states, maxResults, apiKey);
  });
}

$(handleForm);