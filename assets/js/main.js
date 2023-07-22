import countries from './countries.js';

$(function () {
 const select_first = $('.first');
 const select_second = $('.second');
 const original_text = $('.original_text');
 const translated_text = $('.translated_text');
 const change = $('#change');
 const listen = $('.listen');
 const speech = $('.speech');
 const copy = $('.copy');

 const default_first_language = 'en-GB';
 const default_second_language = 'es-ES';

 //Función para llenar los select con las opciones de países
 function fillSelectOptions() {
  $.each(countries, function (index, country) {
   const key = Object.keys(country).toString();
   const value = Object.values(country).toString();

   select_first.append(`<option value="${key}">${value}</option>`);
   select_second.append(`<option value="${key}">${value}</option>`);
  });
 }

 //Función para intercambiar el contenido de los campos de texto
 function swapTextFields() {
  const select_first_value = select_first.val();
  const original_text_value = original_text.val();

  select_first.val(select_second.val());
  select_second.val(select_first_value);

  if (!translated_text.val()) return;

  original_text.val(translated_text.val());
  translated_text.val(original_text_value);
 }

 //Función para realizar la traducción
 async function translateText() {
  if (!original_text.val()) return;

  try {
   const translate = await fetch(`https://api.mymemory.translated.net/get?q=${original_text.val()}&langpair=${select_first.val()}|${select_second.val()}`);
   const translated = await translate.json();
   
   translated_text.val(translated.responseData.translatedText);
  } catch (error) {
   console.error('Error during translation:', error);
  }
 }

 //Función para activar la síntesis de voz
 function speakText() {
  const index = listen.index(this);
  const text_to_listen = index == 0 ? original_text.val() : translated_text.val();

  if (!text_to_listen) return;
   speechSynthesis.speak(new SpeechSynthesisUtterance(text_to_listen));
  }

 //Evento para intercambiar los idiomas
 change.click(swapTextFields);

 //Evento para traducir cuando se escribe en el campo de texto original
 original_text.on('keyup', translateText);

 //Evento para escuchar el texto con síntesis de voz
 listen.click(speakText);

 //Evento para escuchar el texto con el micrófono
 var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
 const recognition = new SpeechRecognition();

 recognition.onresult = function (event) {
  original_text.val(event.results[0][0].transcript);
 };

 speech.click(function () {
  recognition.start();
 });

 //Evento para copiar el texto traducido al portapapeles
 copy.click(function () {
  navigator.clipboard.writeText(translated_text.val());
 });

 //Rellenar los select con las opciones de países al cargar la página
 fillSelectOptions();

 //Establecer los valores por defecto para los select
 select_first.val(default_first_language);
 select_second.val(default_second_language);
});