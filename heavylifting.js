// check url to build out images
var params = new URLSearchParams(window.location.search);
var cname = params.get("c");
var pname = params.get("p");
// this varname should change to something better
var categoryData = sessionStorage.getItem("categories");

if (categoryData == null) {
    categoryData = initData();
} else {
    categoryData = JSON.parse(categoryData);
    makeSidebar(categoryData);
    if (!(cname == null || pname == null)) {
        makeImages(cname, pname, categoryData);
    } else {
        makeSlideshow(categoryData);
    }
}

// bind events
document.getElementById("toggle-menu").onclick = function(e) {
    document.getElementById("links-container").classList.toggle("active");
};


// only if we haven't already got the photo srcs in session storage
function initData() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDnha3DVqY5UOC4JgKNfZKgvH_2wWqQHX0",
        authDomain: "delawder-e1b4f.firebaseapp.com",
        databaseURL: "https://delawder-e1b4f.firebaseio.com",
        projectId: "delawder-e1b4f",
        storageBucket: "delawder-e1b4f.appspot.com",
        messagingSenderId: "663943966446"
    };
    
    firebase.initializeApp(config);
    var db = firebase.database();
    var categories = {};
    db.ref("posts").once("value")
        .then((snapshot) => {
            snapshot.val().map((o) => {
                if (!(o.category in categories)) {
                    categories[o.category] = {};
                }
                categories[o.category][o.name] = {
                    "date": o.date,
                    "description": o.description,
                    "images": o.images
                };
                window.sessionStorage.setItem("categories", JSON.stringify(categories));
            });
            makeSidebar(categories);
            if (!(cname == null || pname == null)) {
                makeImages(cname, pname, categories);
            } else {
                makeSlideshow(categories);
            }
            return categories;
        });
}

function makeSidebar(categoryData) {
    for (categoryName in categoryData) {
        if (categoryName != "slideshow") {
            // desptop
            let links = document.getElementById("links");
            let toggle = document.createElement("span");
            let ul = document.createElement("ul");
            toggle.setAttribute("target", categoryName);
            toggle.setAttribute("class", "toggle sidebar-label");
            toggle.innerHTML = categoryName;
            ul.setAttribute("id", categoryName);
            ul.setAttribute("class", "project-link");
            ul.appendChild(toggle);
            links.appendChild(ul);
            // mobile
            let cont = document.getElementById("mobile-links");
            links = document.createElement("ul");
            let li = document.createElement("li");
            let label = document.createElement("span");
            label.setAttribute("class", "sidebar-label");
            label.innerHTML = categoryName;
            li.appendChild(label);
            links.appendChild(li);
            cont.appendChild(links);

            let projects = categoryData[categoryName];
            Object.keys(projects).map((pname) => {
                // desktop
                li = document.createElement("li");
                let link = document.createElement("a");
                link.setAttribute("href", "?c=" + categoryName + "&p=" + pname);
                link.innerHTML = pname;
                li.appendChild(link);
                ul.appendChild(li);
                // mobile
                li = document.createElement("li");
                link = document.createElement("a");
                link.setAttribute("href", "?c=" + categoryName + "&p=" + pname);
                link.setAttribute("class", "link");
                link.innerHTML = pname;
                li.appendChild(link);
                links.appendChild(li);
            });
        }
    }
}

// helper that takes a category name and creates all the projects
function makeImages(cname, pname, categoryData) {
    var i = 0;
    var cont = document.getElementById("gallery");
    var project = categoryData[cname][pname];
    document.getElementById("project-date").innerHTML = project["date"];
    document.getElementById("project-description").innerHTML = project["description"];
    project["images"].map((src) => {
        let div = document.createElement("div");
        let a = document.createElement("a");
        let img = document.createElement("img");
        div.setAttribute("class", "slide");
        img.setAttribute("class", "slide");
        img.setAttribute("src", src);
        a.setAttribute("name", i);
        i++;
        div.appendChild(a);
        div.appendChild(img);
        cont.appendChild(div);
    });
}

function makeSlideshow(categoryData){
    console.log("hey", categoryData);
    var cont = document.getElementById("gallery");
    var images = categoryData["slideshow"]["slideshow"]["images"];
    images.map((src) => {
        let img = document.createElement("img");
        img.setAttribute("class", "slide");
        img.setAttribute("src", src);
        img.style.display = "none";
        cont.appendChild(img);
    });
    // set up timer n shiz
    var nextSlide = function(slideIndex) {
        let slides = document.getElementsByClassName("slide");
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex].style.display = "inline-block";
        setTimeout(() => nextSlide((slideIndex + 1) % slides.length), 2000);
    }

    nextSlide(0);
}
