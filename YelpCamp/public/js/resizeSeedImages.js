document.addEventListener('DOMContentLoaded', function () {
    const allImages = document.querySelectorAll('img');
    for (let image of allImages){
        if (image.src.includes('/images/campgroundSeeds/')){
            image.classList.add('seed-image');
        }
    }
})