// check url to build out images
var params = new URLSearchParams(window.location.search);
var cname = params.get("c");
var pname = params.get("p");
var about = params.get("about") != null;
// this varname should change to something better
var categoryData = sessionStorage.getItem("categories");

if (categoryData == null) {
    categoryData = initData();
} else {
    categoryData = JSON.parse(categoryData);
    makeSidebar(categoryData);
    if (!(cname == null || pname == null)) {
        makeImages(cname, pname, categoryData);
    } else if (about) {
        makeAbout(categoryData);
    } else {
        makeSlideshow(categoryData);
    }
    bindEvents();
}

// bind events
function bindEvents() {
    document.getElementById("toggle-menu").onclick = function(e) {
        document.getElementById("links-container").classList.toggle("active");
        document.body.classList.toggle("noscroll");
    };
    
    let toggles = document.getElementsByClassName("toggle");
    for (let i = 0; i < toggles.length; i++) {
        toggles[i].onclick = function(e) {
            let currentlyToggled = document.getElementsByClassName("toggled");
            let el = e.target.parentElement
            for (let j = 0; j < currentlyToggled.length; j++) {
                if (currentlyToggled[j] != el) {
                    currentlyToggled[j].classList.remove("toggled");
                }
            }
            el.classList.toggle("toggled");
        }
    }
}


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
            } else if (about) {
                makeAbout(categoryData);
            } else {
                makeSlideshow(categories);
            }
            bindEvents();
            return categories;
        });
}

function makeSidebar(categoryData) {
    for (categoryName in categoryData) {
        if (categoryName != "slideshow" && categoryName != "about") {
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
                li.setAttribute("id", pname);
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
    // gotta make extra about and ig links
    [document.getElementById("links"), document.getElementById("mobile-links")].map((links) => {
        // about 
        let span = document.createElement("span");
        span.setAttribute("class", "sidebar-label");
        let link = document.createElement("a")
        link.innerHTML = "about";
        link.setAttribute("href", "?about");
        span.appendChild(link);
        links.appendChild(span);
        // ig
        span = document.createElement("span");
        link = document.createElement("a")
        link.setAttribute("class", "ig-link");
        link.setAttribute("href", "https://www.instagram.com/fern.boy/");
        span.appendChild(link);
        links.appendChild(span);
    });
}

// helper that takes a category name and creates all the projects
function makeImages(cname, pname, categoryData) {
    var i = 0;
    var cont = document.getElementById("gallery");
    var project = categoryData[cname][pname];
    // set sidebar according to cname and pname
    document.getElementById(cname).classList.add("toggled");
    document.getElementById(pname).classList.add("current");
    Array.prototype.map.call(document.getElementsByClassName("project-date"), (e) => e.innerHTML = project["date"]);
    Array.prototype.map.call(document.getElementsByClassName("project-description"), (e) => e.innerHTML = project["description"]);
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

function makeAbout(categoryData) {
    var bio = categoryData["about"]["about"]["description"];
    var div = document.createElement("div");
    var p = document.createElement("p");
    div.setAttribute("id", "about")
    p.setAttribute("id", "bio");
    p.innerHTML = bio;
    div.appendChild(p);
    p = document.createElement("p");
    p.setAttribute("id", "contact");
    p.innerHTML = "instagram ~ <a href='https://www.instagram.com/fern.boy/'>@fern.boy</a><br>email ~ ?<br>phone ~ ?";
    div.appendChild(p);
    document.getElementById("main").appendChild(div);
}

function makeSlideshow(categoryData) {
    var cont = document.getElementById("gallery");
    cont.classList.add("slideshow");
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
        setTimeout(() => nextSlide((slideIndex + 1) % slides.length), 3500);
    }

    nextSlide(0);
}
