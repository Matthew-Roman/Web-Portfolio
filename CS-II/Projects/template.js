document.addEventListener("DOMContentLoaded", () => {
    const folder_close = document.getElementById("folder-close");
    folder_close.addEventListener("click", openNav);
    const navigation = document.querySelector(".header__nav");
    
    const folder_open = document.getElementById("folder-open");
    folder_open.addEventListener("click", closeNav);
    
    const main = document.querySelector("main");

    const footer = document.querySelector("footer");
    const page_indicator = document.querySelector(".header__top--page-indicator");
    
    console.log(screen.width);
    console.log(screen.height);
    function openNav() {
	if (screen.width > 700) { //if it is a desktop view
	    navigation.style.width = "20%";
	    main.style.marginLeft = "20%";
	    footer.style.marginLeft = "20%";
	} else { // if it is a mobile view
	    main.style.display = "none";
	    footer.style.display = "none";
	    page_indicator.style.visibility = "hidden";
	    navigation.style.width = "100%";
	}
	main.style.transition = ".5s";
	footer.style.transition = ".5s";
 	folder_close.style.visibility = "hidden";
    };
    function closeNav() {
	navigation.style.width = "0%";
	main.style.marginLeft = "0%";
	footer.style.marginLeft = "0%";
	main.style.transition = ".5s";
	footer.style.transition = ".5s";
	setTimeout(() => {	    
	    page_indicator.style.visibility = "visible";
            folder_close.style.visibility = "visible";
	    footer.style.display = "flex";
	    main.style.display = "block";

	}, 300);
    }
    
    //figure out later why the page title moves!
});


