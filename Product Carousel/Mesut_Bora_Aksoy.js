const key = 'myData';

const fetchItems = async () => {
    const data = localStorage.getItem(key);
    if (data) {
        return JSON.parse(data);
    }

    const url = 'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json';
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        data.forEach(e => {
            e.isFav = false;
        })
        localStorage.setItem(key, JSON.stringify(data));
        return data;
    }
    catch (e) {
        console.log("Request failed: ", e.message);
    }
}

let productArray;

const productCarousel = async () => {
    productArray = await fetchItems();
    const carouselWrapper = document.body.querySelector('main.carouselWrapper');
    const products = document.body.querySelector('section.products');
    const babyBanner = document.body.querySelector('#babyBanner');
    productArray.forEach(e => {
        let originalPrice;
        const productWrapper = document.createElement('div');
        productWrapper.classList.add('productWrapper');
        const img = document.createElement('img');
        const favButton = document.createElement('button');
        favButton.classList.add('favButton');
        const favFalseIcon = document.createElement('i');
        const favTrueIcon = document.createElement('i');
        favFalseIcon.classList.add('fa-regular', 'fa-heart', 'favFalseIcon'); // thin version wasn't free
        favTrueIcon.classList.add('fa-solid', 'fa-heart', 'favTrueIcon');
        const name = document.createElement('p');
        name.classList.add('productName');
        const rating = document.createElement('div');
        const currentPrice = document.createElement('p');
        currentPrice.classList.add('currentPrice');
        const addButton = document.createElement('button');
        addButton.classList.add('addButton');
        const addIcon = document.createElement('i');
        addIcon.classList.add('fa-solid', 'fa-plus', 'addIcon');
        addButton.append(addIcon);

        if (e.original_price > e.price) {
            originalPrice = document.createElement('p');
            originalPrice.classList.add('originalPrice');
        }
        img.src = e.img;

        if (!e.isFav) favButton.append(favFalseIcon);
        else favButton.append(favTrueIcon);

        productWrapper.style.height = '400px';

        name.innerHTML = `<b class="brandName">${e.brand} -</b> ${e.name}`;
        Object.assign(name.style, {
            fontSize: '13px',
            paddingLeft: '10px'
        })
        name.style.paddingLeft = '10px';

        currentPrice.innerText = `${e.price} TL`;
        Object.assign(currentPrice.style, {
            innerText: `${e.price} TL`,
            fontSize: '18px',
            fontWeight: '500',
            paddingLeft: '10px'
        });

        productWrapper.append(img, favButton, name, currentPrice, addButton);
        if (originalPrice) {
            productWrapper.append(originalPrice);

            originalPrice.innerHTML = `${e.original_price} TL`;
            Object.assign(originalPrice.style, {
                order: 1,
                fontSize: '12px',
                fontWeight: '500',
                margin: 'auto 0 0 0',
                paddingLeft: '10px'
            });

            currentPrice.innerHTML = `<p class="sepette">Sepette</p> ${currentPrice.innerText}`;
            Object.assign(currentPrice.style, {
                order: 2,
                color: '#00A365',
                fontWeight: '800',
                marginTop: '8px',
                paddingLeft: '10px'
            });

        }

        products.append(productWrapper);

        favButton.addEventListener('click', (evt) => {
            evt.stopPropagation();
            e.isFav = !e.isFav;
            if (e.isFav) {
                favFalseIcon.remove();
                favButton.append(favTrueIcon);
            }
            else {
                favTrueIcon.remove();
                favButton.append(favFalseIcon);
            }
            localStorage.setItem(key, JSON.stringify(productArray))
        })

        productWrapper.addEventListener('click', () => {
            window.open(e.url, '_blank');
        })
    });

    carouselWrapper.append(products);
    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');
    const prevIcon = document.createElement('i');
    const nextIcon = document.createElement('i');

    prevButton.classList.add('prevButton');
    nextButton.classList.add('nextButton');
    prevIcon.classList.add('fa-solid', 'fa-arrow-left');
    nextIcon.classList.add('fa-solid', 'fa-arrow-right');

    prevButton.append(prevIcon);
    nextButton.append(nextIcon);
    carouselWrapper.append(prevButton, nextButton);

    prevButton.style.top = `${products.getBoundingClientRect().bottom - (products.getBoundingClientRect().height / 2)}px`;
    nextButton.style.top = `${products.getBoundingClientRect().bottom - (products.getBoundingClientRect().height / 2)}px`;
    prevButton.style.left = `${products.getBoundingClientRect().left - 60}px`;
    nextButton.style.left = `${products.getBoundingClientRect().right + 10}px`;
    window.addEventListener('resize', () => {
        prevButton.style.top = `${products.getBoundingClientRect().bottom - (products.getBoundingClientRect().height / 2)}px`;
        nextButton.style.top = `${products.getBoundingClientRect().bottom - (products.getBoundingClientRect().height / 2)}px`;
        prevButton.style.left = `${products.getBoundingClientRect().left - 60}px`;
        nextButton.style.left = `${products.getBoundingClientRect().right + 10}px`;
    })

    let index = 0, scrollX = 0;
    let productWidth = babyBanner.getBoundingClientRect().width + 20; // 20px is the gap
    let currentCarouselWidth = carouselWrapper.getBoundingClientRect().width;
    let visibleProductCount = currentCarouselWidth / productWidth;
    prevButton.addEventListener('click', () => {
        if (index > 0) index--;
        scrollX = index * productWidth;
        products.style.transform = `translateX(-${scrollX}px)`;
        products.style.transition = `transform 0.25s ease`;
    })

    nextButton.addEventListener('click', () => {
        if (index < productArray.length - visibleProductCount + 1) index++; // +1 is the baby banner
        scrollX = index * productWidth;
        products.style.transform = `translateX(-${scrollX}px)`;
        products.style.transition = `transform 0.25s ease`;
    })

    babyBanner.addEventListener('click', () => {
        const url = 'https://www.e-bebek.com/outlet-c0001';
        window.location.href = url;
    })

    const logo = document.body.querySelector('#logo');
    logo.style.cursor = 'pointer';
    babyBanner.style.cursor = 'pointer';
    prevButton.style.cursor = 'pointer';
    nextButton.style.cursor = 'pointer';

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState != 'visible') console.log('Wrong page!');
    })

}

productCarousel();