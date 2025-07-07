function createCampgroundCard(campground) {
    return `
        <div class="card mb-3">
            <div class="row">
                <div class="col-md-4">
                    <img src="${campground.images[0]?.url || '#'}" alt="" class="img-fluid index-image">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${campground.title}</h5>
                        <p class="card-text" id="campgroundDescription">${campground.description}</p>
                        <p class="card-text">
                            <small class="text-muted">${campground.location}</small>
                        </p>
                        <a class="btn btn-primary" href="/campgrounds/${campground._id}">View</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

let currentPage = 1;
const limit = 10;

function loadCampgrounds() {
    fetch(`/campgrounds?page=${currentPage + 1}&limit=${limit}`, {
        headers: { 'Accept': 'application/json' }
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            const container = document.querySelector('.campgrounds-container');
            data.forEach(campground => {
                const html = createCampgroundCard(campground);
                container.insertAdjacentHTML('beforeend', html);
            })
            currentPage++;
        })
        .catch(e => console.log(e));
}

window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        loadCampgrounds();
    }
})