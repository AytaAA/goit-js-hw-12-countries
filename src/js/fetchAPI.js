import countryCardTmpl from '../template/countries.hbs';
import API from './fetchCountries';
import countryListTmpl from '../template/list.hbs';
import debounce from 'lodash.debounce';
import { error } from '@pnotify/core';

const inputField = document.querySelector('.field');
const cardContainer = document.querySelector('.js-card-container');
const listCountry = document.querySelector('.list-country');

let form = '';
inputField.addEventListener('input', debounce(onSearchCountry, 500));
function onSearchCountry(e) {
  resetContent();
  form = e.target.value;
  renderMarkUp(form);
}
function renderMarkUp(data) {
  if (data !== '') {
    API.fetchCountries(data).then(onInputChange).catch(onFetchError);
  }
}

function onInputChange(data) {
  if (data.length === 1) {
    renderCountryMarkUp(data);
    deleteError();
  }
  if (data.length > 1 && data.length <= 10) {
    renderCountriesList(data);
    deleteError();
  }
  if (data.length > 10) {
    error({
      delay: 2000,
      text: 'Too many matches found! Please enter a more specific query!',
    });
  }
}
function onFetchError() {
  error({
    title: 'Oh No!',
    text: 'Error!',
    delay: 2000,
  });
}

function deleteError() {
  const errorMessage = document.querySelector('.pnotify');
  if (document.body.contains(errorMessage)) {
    errorMessage.style.display = 'none';
  }
}

function renderCountriesList(countries) {
  listCountry.innerHTML = countryListTmpl(countries);
}

function renderCountryMarkUp(countries) {
  cardContainer.innerHTML = countryCardTmpl(countries[0]);
}

function resetContent() {
  listCountry.innerHTML = '';
  cardContainer.innerHTML = '';
  deleteError();
}
