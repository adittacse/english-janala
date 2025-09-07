function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}

const createElements = (arr) => {
    const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
    return htmlElements.join(" ");
}

const manageSpinner = (status) => {
    if (status === true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden");
    }
}

const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then((res) => res.json())
        .then((json) => displayLessons(json.data))
}

const removeActiveClass = () => {
    const btnLessons = document.getElementsByClassName("active");
    for (const btnLesson of btnLessons) {
        btnLesson.classList.remove("active");
    }
}

const loadLevelWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then((res) => res.json())
        .then((lesson) => {
            removeActiveClass();
            const clickedBtn = document.getElementById(`active-lesson-${id}`);
            clickedBtn.classList.add("active");
            displayLevelWord(lesson.data);
        });
}

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
}

const displayWordDetails = (details) => {
    const detailsContainer = document.getElementById("details-container");
    detailsContainer.innerHTML = `
    <div class="mb-8">
        <h2 class="text-4xl font-semibold">${details.word} (<i class="fa-solid fa-microphone-lines"></i> : ${details.pronunciation})</h2>
    </div>
    <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-2.5">Meaning</h2>
        <h2 class="text-2xl font-medium font-hind-siliguri">${details.meaning}</h2>
    </div>
    <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-2">Example</h2>
        <h2 class="text-2xl">${details.sentence}</h2>
    </div>
    <div class="mb-8">
        <h2 class="text-2xl font-medium mb-2">সমার্থক শব্দ গুলো</h2>
        <div class="flex gap-[18px]">
            ${createElements(details.synonyms)}
        </div>
    </div>
    `;

    document.getElementById("my_modal_5").showModal();
}

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if (words.length === 0) {
        wordContainer.innerHTML = `
        <div class="flex flex-col justify-center items-center font-hind-siliguri col-span-full h-[204px]">
            <img class="mb-3.5" src="../assets/alert-error.png" alt="alert error">
            <p class="text-[14px] third-color mb-5">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-[#292524] font-medium text-4xl">নেক্সট Lesson এ যান</h2>
        </div>
        `;
        manageSpinner(false);
        return;
    }

    words.forEach(word => {
        const card = document.createElement("div");
        card.innerHTML = `
        <div class="text-center bg-white rounded-xl mx-auto p-14">
            <h2 class="text-[32px] font-bold mb-6">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="text-[20px] font-medium mb-6">Meaning / Pronunciation</p>
            <h2 class="text-2xl font-semibold mb-6">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}"</h2>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-blue-200 hover:bg-blue-400 w-14 h-14 p-4 rounded-lg">
                    <i class="fa-solid fa-circle-info"></i>
                </button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-blue-200 hover:bg-blue-400 w-14 h-14 p-4 rounded-lg">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
        </div>
        `;
        wordContainer.appendChild(card);
    });
    manageSpinner(false);
}

const displayLessons = (lessons) => {
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";

    lessons.forEach(lesson => {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
        <button id="active-lesson-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary btn-lesson">
            <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
        </button>
        `;

        levelContainer.appendChild(btnDiv);
    });
}

loadLessons();

document.getElementById("btn-search").addEventListener("click", function() {
    removeActiveClass();
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();
    
    fetch("https://openapi.programming-hero.com/api/words/all")
        .then((res) => res.json())
        .then((data) => {
            const allWords = data.data;
            const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
            displayLevelWord(filterWords);
        });
});