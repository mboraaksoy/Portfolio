let timeoutID;
let lastValue = '';

const buttonElement = document.querySelector('#searchButton')
const textElement = document.querySelector('#textid');
const moviesDOM = document.querySelector('section.movies');

const apiRequest = async (userInput) => {
    const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${userInput}`);
    return res;
}

const clearPage = () => {
    if (moviesDOM){
        moviesDOM.innerHTML = '';
    }
}
   
const displayAndStyleShows = (res) => {
    for (let data of res.data){
        const br = document.createElement('br');
        const imgElement = document.createElement('img');
        const movieName = document.createElement('p');
        const moviesWithNames = document.createElement('div');

        if (data.show.image['medium']){
            imgElement.src = data.show.image['medium'];
        }
        movieName.append(data.show.name);
        imgElement.alt = data.show.name;
        imgElement.title = data.show.name;
        moviesWithNames.append(imgElement, br, movieName);
        moviesDOM.append(moviesWithNames);

        moviesWithNames.style.textAlign = 'center';
        moviesWithNames.style.fontSize = '1.5em';
        moviesWithNames.style.fontFamily = 'calibri';
    }
}

const autoSearchTrigger = () => {
    if (timeoutID){
        clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => {
        if (lastValue !== textElement.value) {
            lastValue = textElement.value;
            searchShow(lastValue);
        }
    }, 2000);
};

buttonElement.addEventListener('click', (event) => {
    event.preventDefault();
    searchShow(textElement.value);
})

textElement.addEventListener('input', autoSearchTrigger);

const searchShow = async (textValue) => {
    const res = await apiRequest(textValue);
    clearPage();
    displayAndStyleShows(res);
}





