import countries from './countries.js';

const select_first = document.querySelector('.first');
const select_second = document.querySelector('.second');
const original_text = document.querySelector('.original_text');
const translated_text = document.querySelector('.translated_text');
const change = document.getElementById('change');
const read = document.querySelectorAll('.read');
const speech = document.querySelector('.speech');

const default_first_language = 'en-GB';
const default_second_language = 'es-ES';

for(const n in countries) {
 const key = Object.keys(countries[n]).toString();
 const value = Object.values(countries[n]).toString();

 select_first.innerHTML += `<option value=${key}> ${value} </option>`
 select_second.innerHTML += `<option value=${key}> ${value} </option>`
}

change.addEventListener('click', _=> {
 const select_first_value = select_first.value;
 const original_text_value = original_text.value;

 select_first.value = select_second.value;
 select_second.value = select_first_value;

 if(!translated_text.value) return

 original_text.value = translated_text.value;
 translated_text.value = original_text_value;
});

original_text.addEventListener('keyup', async _=>{
 if(!original_text.value) return
 
 const translate = await fetch(`https://api.mymemory.translated.net/get?q=${original_text.value}&langpair=${select_first.value}|${select_second.value}`);
 const translated = await translate.json()

 translated_text.value = translated.responseData.translatedText;
});


read.forEach((read, index) => {
 read.addEventListener('click', _=> {
  const text_to_read = index == 0 ? original_text.value : translated_text.value;

  if(!text_to_read) return
  speechSynthesis.speak(new SpeechSynthesisUtterance(text_to_read))
 });
});

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
 original_text.value = event.results[0][0].transcript;
}

speech.addEventListener('click', _=> {
 recognition.start();
});

select_first.value = default_first_language;
select_second.value = default_second_language;