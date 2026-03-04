const loadLessons = async () => {
  const res = await fetch("https://openapi.programming-hero.com/api/levels/all");
  const object = await res.json();
  const data = object.data;
  displayLessons(data);
};

const displayLessons = (data) => {
  const parentDiv = document.getElementById("lesson-container");
  parentDiv.innerHTML = "";

  for (const singleData of data) {
    parentDiv.innerHTML += `
    <div>
      <button id="lesson-${singleData.level_no}" onclick="loadLevelWords(${singleData.level_no})" class="btn btn-primary btn-soft lesson-btn">
        <i class="fa-solid fa-book-open"></i>Lesson ${singleData.level_no}
      </button>
    </div>
    `;
  }
};

const loadLevelWords = async (levelNo) => {
  manageSpinner(true);
  const res = await fetch(`https://openapi.programming-hero.com/api/level/${levelNo}`);
  const object = await res.json();
  const data = object.data;

  const lessonBtns = document.querySelectorAll(".lesson-btn");
  for (const lessonBtn of lessonBtns) {
    lessonBtn.classList.remove("active");
  }

  const clickBtn = document.getElementById(`lesson-${levelNo}`);
  clickBtn.classList.add("active");
  displayWords(data);
};

const displayWords = (data) => {
  const wordsSection = document.getElementById("words-section");
  wordsSection.innerHTML = "";

  if (data.length === 0) {
    wordsSection.innerHTML = `
      <div class="text-center col-span-full py-16 space-y-3">
        <img src="./assets/alert-error.png" class="mx-auto">
        <p class="text-[#79716bFF] font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="font-bangla font-medium text-3xl">নেক্সট Lesson এ যান</h2>
      </div>
    `;
      manageSpinner(false);
    return;
  }

  for (const singleData of data) {
    wordsSection.innerHTML += `
      <div class="rounded-xl bg-white space-y-6 text-center py-13 px-16">
        <h1 class="text-[#000000FF] text-2xl font-bold">${singleData.word ? singleData.word : "Word not found"}</h1>
        <p class="text-[#000000FF] font-medium">Meaning / Pronunciation</p>
        <p class="text-[#18181bFF] text-2xl font-bangla font-semibold">
          ${singleData.meaning ? singleData.meaning : "Meaning not found"} / ${singleData.pronunciation ? singleData.pronunciation : "Pronunciation not found"}
        </p>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetails(${singleData.id})" class="btn bg-sky-100 hover:bg-blue-400"><i class="fa-solid fa-circle-info"></i></button>
          <button class="btn bg-sky-100 hover:bg-blue-400"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>
    `;
  }

    manageSpinner(false);
};

const loadWordDetails = async (id) => {
  const res = await fetch(`https://openapi.programming-hero.com/api/word/${id}`);
  const wordObject = await res.json();
  const wordData = wordObject.data;
  displayWordDetails(wordData);
};

const displayWordDetails = (wordData) => {
  const wordDetails = document.getElementById("word-details");


  wordDetails.innerHTML = `
    <div class="space-y-2 mb-8">
      <h2 class="text-4xl font-semibold mb-8">${wordData.word} (<i class="fa-solid fa-microphone-lines"></i> : ${wordData.pronunciation})</h2>
      <h3 class="text-2xl font-semibold">Meaning</h3>
      <p class="text-2xl font-medium font-bangla">${wordData.meaning}</p>
    </div>
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">Example</h2>
      <p class="text-2xl">${wordData.sentence}</p>
    </div>
    <div class="space-y-2">
      <h2 class="text-2xl font-medium font-bangla">Synonyms</h2>
      <div id="synonyms-container" class="flex flex-wrap gap-2">
      ${showSynonyms(wordData.synonyms)}
      </div>
    </div>
  `;

  document.getElementById("my_modal_5").showModal();
};


const showSynonyms = (synonyms) => {
  return synonyms.map(synonym => `<span class="btn btn-outline btn-primary">${synonym}</span>`).join('');
};

const manageSpinner = (status) => {
 if(status == true){
  document.getElementById('spinner').classList.remove('hidden');
  document.getElementById('words-section').classList.add('hidden');
 } else {
  document.getElementById('spinner').classList.add('hidden');
  document.getElementById('words-section').classList.remove('hidden');
 }
};

loadLessons();

document.getElementById('search-btn').addEventListener('click', async () => {
  const searchInput = document.getElementById('search-input');
  const searchValue = searchInput.value.trim().toLowerCase();
  const res = await fetch('https://openapi.programming-hero.com/api/words/all');
  const wordsObject = await res.json();
  const wordsArray = wordsObject.data;
  const filteredWords = wordsArray.filter(wordArray => wordArray.word.toLowerCase().includes(searchValue));
  displayWords(filteredWords);
}
);

