// ==============================
// CampusGuide JavaScript
// ==============================


// ==============================
// INITIALIZE LUCIDE ICONS
// ==============================

if (window.lucide) {
    window.lucide.createIcons();
}


// ==============================
// MOBILE MENU
// ==============================

const menuBtn = document.getElementById("menuBtn");

const mobileMenu = document.getElementById("mobileMenu");

menuBtn?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("open");
});


// ==============================
// CLOSE MOBILE MENU
// ==============================

const mobileLinks = document.querySelectorAll(".mobile-menu a");

mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
        mobileMenu?.classList.remove("open");
    });
});


// ==============================
// NAVBAR SCROLL EFFECT
// ==============================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (!navbar) return;

    if (window.scrollY > 30) {
        navbar.style.boxShadow =
            "0 5px 25px rgba(15, 23, 42, 0.08)";
    } else {
        navbar.style.boxShadow = "none";
    }
});


// ==============================
// ACTIVE NAVIGATION
// ==============================

const sections = document.querySelectorAll("section[id]");

const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {
            currentSection = section.id;
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
});


// ==============================
// SMOOTH SCROLL
// ==============================

document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });


// ==============================
// HERO BUTTON INTERACTION
// ==============================

const exploreButton = document.querySelector(".primary-btn");

exploreButton?.addEventListener("click", () => {
    console.log("CampusGuide: Exploring campus...");
});


// ==============================
// PAGE LOAD ANIMATION
// ==============================

window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});