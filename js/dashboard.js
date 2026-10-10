// CampusGuide Dashboard JavaScript

document.addEventListener("DOMContentLoaded", function () {

    // 1. Mobile sidebar toggle
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("open");
        });

        // Close sidebar after clicking a navigation link on mobile
        sidebar.querySelectorAll(".nav-link").forEach(function (link) {
            link.addEventListener("click", function () {
                sidebar.classList.remove("open");
            });
        });
    }

    // 2. Show the logged-in student's name
    const userName = document.getElementById("userName");
    const welcomeName = document.getElementById("welcomeName");
    const userAvatar = document.getElementById("userAvatar");

    // Uses the name saved by the login page, if available.
    const savedName = localStorage.getItem("campusUserName");
    const studentName = savedName || "Student";

    if (userName) {
        userName.textContent = studentName;
    }

    if (welcomeName) {
        welcomeName.textContent = studentName;
    }

    if (userAvatar) {
        userAvatar.textContent = studentName.charAt(0).toUpperCase();
    }

    // 3. Campus location search
    const searchForm = document.getElementById("searchForm");
    const campusSearch = document.getElementById("campusSearch");
    const searchMessage = document.getElementById("searchMessage");

    const campusLocations = [
        {
            name: "Computer Lab",
            keywords: ["computer lab", "computer laboratory", "cse lab"],
            page: "labs.html"
        },
        {
            name: "Library",
            keywords: ["library", "books"],
            page: "map.html"
        },
        {
            name: "Auditorium",
            keywords: ["auditorium", "seminar hall"],
            page: "map.html"
        },
        {
            name: "Classrooms",
            keywords: ["classroom", "classrooms", "class"],
            page: "classrooms.html"
        },
        {
            name: "Faculty",
            keywords: ["faculty", "teacher", "professor"],
            page: "faculty.html"
        },
        {
            name: "Campus Map",
            keywords: ["map", "campus map", "navigation"],
            page: "map.html"
        },
        {
            name: "Events",
            keywords: ["event", "events", "workshop"],
            page: "events.html"
        }
    ];

    if (searchForm && campusSearch && searchMessage) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const query = campusSearch.value.trim().toLowerCase();

            if (!query) {
                searchMessage.textContent = "Please enter a location.";
                return;
            }

            const foundLocation = campusLocations.find(function (location) {
                return location.name.toLowerCase().includes(query) ||
                    location.keywords.some(function (keyword) {
                        return keyword.includes(query) ||
                            query.includes(keyword);
                    });
            });

            if (foundLocation) {
                searchMessage.textContent =
                    "Opening " + foundLocation.name + "...";

                window.location.href = foundLocation.page;
            } else {
                searchMessage.textContent =
                    "Location not found. Try Library, Computer Lab, Classrooms or Faculty.";
            }
        });
    }

    // 4. Logout
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();

            const confirmed = window.confirm(
                "Are you sure you want to log out?"
            );

            if (confirmed) {
                // Remove the saved display name.
                localStorage.removeItem("campusUserName");

                // Redirect to login page.
                window.location.href = "login.html";
            }
        });
    }

});
