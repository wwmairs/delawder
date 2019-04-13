var categoryData = sessionStorage.getItem("categories");

if (categoryData == null) {
    categoryData = initData();
} else {
    categoryData = JSON.parse(categoryData);
    makeSidebar(categoryData);
}

// check url to build out images

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
            return categories;
        });
}

function makeSidebar(categoryData) {
    console.log(categoryData);
    for (categoryName in categoryData) {
        let projects = categoryData[categoryName];
        let ul = document.getElementById(categoryName);
        Object.keys(projects).map((pname) => {
            let li = document.createElement("li");
            let link = document.createElement("a");
            link.setAttribute("href", categoryName + ".html?project=" + pname);
            link.innerHTML = pname;
            li.appendChild(link);
            ul.appendChild(li);
        });
    }
}

// helper that takes a category name and creates all the projects
function makeImages(category, project, categoryData) {

}
