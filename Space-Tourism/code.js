"use strict";
const htmlUrl = window.location.href;

if(!(htmlUrl.includes('index')) &&
    !(htmlUrl.includes('destination')) &&
    !(htmlUrl.includes('crew')) &&
    !(htmlUrl.includes('destination')) &&
    !(htmlUrl.includes('technology'))) window.location.href+= "/index";

const links = document.querySelectorAll(".links-container__links");
//*Si en la url contiene el mismo id que el link seleccionado, le añadimos el borde al link.
for (const link of links) {if(htmlUrl.includes(link.id)) {if(window.innerWidth > 500) link.classList.add("active")}};

//*Configuración del botón del NAV de mobile
const navButton = document.getElementById("header__nav-button");
const closeButton = document.getElementById("close-button-container__close-button");

const nav = document.getElementById("header__nav");

navButton.addEventListener("click",()=>{
    navButton.style.display = "none";
    nav.style.display = "block";
});

closeButton.addEventListener("click",()=>{
    navButton.style.display = "block";
    nav.style.display = "none";
});

//*Destination Code
if(htmlUrl.includes('destination')){
    const destinationButtons = document.querySelectorAll(".destination-selection__destination-button");
    const updateInformation = destinationChange => {
        const changeHTML = (destinationsJSON) => {
            const destinations = destinationsJSON.destinations;
            const planetImage = document.querySelector(".destination-image-container__image");
            const planetName = document.getElementById('destination-selected__destination-name');
            const planetDescription = document.getElementById('destination-selected__destination-description');
            const planetTravel = document.getElementById('duration');
            const planetDisctance = document.getElementById('size');
            for(let i = 0; i < destinationsJSON.destinations.length; i++){
                if(destinations[i].name.toLowerCase() === destinationChange) {
                    planetImage.setAttribute('src',destinations[i].images.png);
                    planetName.textContent = destinations[i].name.toUpperCase();
                    planetDescription.textContent = destinations[i].description;
                    planetDisctance.textContent = destinations[i].distance.toUpperCase();
                    planetTravel.textContent = destinations[i].travel.toUpperCase();
                };
            };
            destinationButtons.forEach(button => button.classList.remove('active-destination'));
            document.getElementById(destinationChange).classList.add('active-destination');
        };
        fetch('data.json').then(res => res.json()).then(ar => changeHTML(ar));
        
    };
    if(sessionStorage.getItem('destination') === null) sessionStorage.setItem('destination','moon');
    let currentDestination = sessionStorage.getItem('destination');
    updateInformation(currentDestination);
    for(const destinationButton of destinationButtons){
        destinationButton.addEventListener("click",()=>{
            currentDestination = destinationButton.id;
            sessionStorage.setItem('destination',currentDestination);
            updateInformation(currentDestination);
        });
    };
}


//*Crew Code

else if(htmlUrl.includes("crew")){
    //?Elementos a modificar
    const roleElement = document.getElementById("crew-article__role");
    const nameElement = document.getElementById("crew-article__name");
    const descriptionElement = document.getElementById("crew-article__description");
    const imgPersonElement = document.getElementById("crew-article__person-image");

    if(sessionStorage.getItem('person') === null) sessionStorage.setItem('person','0');

    //?Funcion actualziación de datos
    const changeCrewInfo = (ar,optionSelected,click) => {
        const changeData = data => {
            roleElement.textContent = data.role.toUpperCase();
            nameElement.textContent = data.name.toUpperCase();
            descriptionElement.textContent = data.bio;
            imgPersonElement.setAttribute('src',data.images.png);
        };
        sessionStorage.setItem('person',optionSelected);
        if(click === true){
            const data = ar.crew[optionSelected];
            changeData(data);
        }
        else{
            const optionSaved = parseInt(sessionStorage.getItem('person'));
            const data = ar.crew[optionSaved];
            changeData(data);
        };
    };

    //?Cargar datos por defecto del Session Storage
    fetch('data.json').then(res => res.json()).then(ar => changeCrewInfo(ar,parseInt(sessionStorage.getItem('person')),false));
    document.querySelectorAll(".span-options").forEach(spanElement => document.querySelectorAll(".span-options")[parseInt(sessionStorage.getItem('person'))].classList.add("checked"));
    

    //?Cambiar datos en evento click
    for(let i = 0; i < document.querySelectorAll(".span-options").length; i++){
        document.querySelectorAll(".span-options")[i].addEventListener("click",()=>{
            document.querySelectorAll(".span-options").forEach(spanElement => spanElement.classList.remove('checked'));
            document.querySelectorAll(".span-options")[i].classList.add("checked");
            fetch('data.json').then(res => res.json()).then(ar => changeCrewInfo(ar,i,true) )
        });
    };
}
//*Technology Code

else if(htmlUrl.includes("technology")){
    //? Elementos a modificar
    const nameElement = document.getElementById("text-section__name");
    const descriptionElement = document.getElementById("text-section__description");
    const imageElement = document.getElementById("image-section__image");
    const spanElements = document.querySelectorAll('.options-container__options');

    if(sessionStorage.getItem('technology') === null) sessionStorage.setItem('technology',0);

    const changeData = technologyData => {
        //? Cambio de datos
        const changeImage = () => {
            if(window.innerWidth > 1000) imageElement.setAttribute('src',technologyData[optionSelected].images.portrait);
            else imageElement.setAttribute('src',technologyData[optionSelected].images.landscape);
        };
        const optionSelected = parseInt(sessionStorage.getItem('technology'));
        nameElement.textContent = technologyData[optionSelected].name.toUpperCase();
        descriptionElement.textContent = technologyData[optionSelected].description;
        changeImage()
        window.addEventListener("resize", ()=>changeImage());
        spanElements.forEach(spanElement => spanElement.classList.remove('checked'));
        spanElements[optionSelected].classList.add('checked');
    };
    //? Actualización de datos(click)
    for (let i = 0; i < spanElements.length; i++) {
        spanElements[i].addEventListener("click",()=>{
            sessionStorage.setItem('technology',i);
            fetch('data.json').then(res => res.json()).then(data => changeData(data.technology));
        });
        
    };
    //? Actualización de datos(default)
    fetch('data.json').then(res => res.json()).then(data => changeData(data.technology));
};