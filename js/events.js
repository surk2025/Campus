
const events = [
    {
        id: 1,
        title: "Campus Hackathon 2026",
        category: "Technical",
        date: "2026-11-08",
        time: "10:00 AM",
        venue: "Innovation Lab",
        description: "Build creative solutions, collaborate with developers and present your ideas.",
        icon: "code-2"
    },
    {
        id: 2,
        title: "AI & Machine Learning Workshop",
        category: "Workshop",
        date: "2026-11-12",
        time: "11:00 AM",
        venue: "Naidu Hall",
        description: "Explore AI concepts and practical demonstrations.",
        icon: "brain-circuit"
    },
    {
        id: 3,
        title: "Campus Cultural Fest",
        category: "Cultural",
        date: "2026-11-18",
        time: "4:00 PM",
        venue: "Main Ground",
        description: "Enjoy music, dance, performances and student activities.",
        icon: "music"
    },
    {
        id: 4,
        title: "Inter-Department Sports Meet",
        category: "Sports",
        date: "2026-11-22",
        time: "9:00 AM",
        venue: "Sports Ground",
        description: "Participate in team competitions and cheer for your department.",
        icon: "trophy"
    },
    {
        id: 5,
        title: "Web Development Bootcamp",
        category: "Workshop",
        date: "2026-11-27",
        time: "10:30 AM",
        venue: "Computer Lab 2",
        description: "Learn responsive website development and build a web project.",
        icon: "monitor"
    },
    {
        id: 6,
        title: "Project Showcase Day",
        category: "Technical",
        date: "2026-12-05",
        time: "12:00 PM",
        venue: "Auditorium",
        description: "Discover student projects and meet fellow innovators.",
        icon: "lightbulb"
    }
];

const eventGrid = document.getElementById("eventGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryFilters = document.getElementById("categoryFilters");
const sortSelect = document.getElementById("sortSelect");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const resetBtn = document.getElementById("resetBtn");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

let activeCategory = "All";
let searchTerm = "";

function formatDate(dateString) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(new Date(dateString + "T12:00:00"));
}

function escapeHTML(value) {
    const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    };

    return String(value).replace(/[&<>"']/g, char => entities[char]);
}

function getVisibleEvents() {
    const query = searchTerm.trim().toLowerCase();

    const filteredEvents = events.filter(event => {
        const matchesCategory =
            activeCategory === "All" ||
            event.category === activeCategory;

        const searchableText = [
            event.title,
            event.category,
            event.venue,
            event.description
        ].join(" ").toLowerCase();

        return matchesCategory && searchableText.includes(query);
    });

    if (sortSelect && sortSelect.value === "title") {
        filteredEvents.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    } else {
        filteredEvents.sort((a, b) =>
            a.date.localeCompare(b.date)
        );
    }

    return filteredEvents;
}

function renderEvents() {
    if (!eventGrid) return;

    const visibleEvents = getVisibleEvents();

    resultsCount.textContent =
        `${visibleEvents.length} event${visibleEvents.length === 1 ? "" : "s"} found`;

    emptyState.hidden = visibleEvents.length !== 0;
    eventGrid.hidden = visibleEvents.length === 0;

    eventGrid.innerHTML = visibleEvents.map(event => `
        <article class="event-card">
            <div class="event-banner ${event.category.toLowerCase()}">
                <span class="category-tag">
                    ${escapeHTML(event.category)}
                </span>
                <i data-lucide="${escapeHTML(event.icon)}"></i>
            </div>

            <div class="event-body">
                <div class="event-date">
                    <i data-lucide="calendar-days"></i>
                    ${formatDate(event.date)}
                </div>

                <h3>${escapeHTML(event.title)}</h3>

                <p class="event-description">
                    ${escapeHTML(event.description)}
                </p>

                <div class="event-meta">
                    <span>
                        <i data-lucide="clock"></i>
                        ${escapeHTML(event.time)}
                    </span>
                    <span>
                        <i data-lucide="map-pin"></i>
                        ${escapeHTML(event.venue)}
                    </span>
                </div>

                <div class="event-footer">
                    <small>Campus event</small>
                    <button class="details-btn" data-event-id="${event.id}">
                        Details
                        <i data-lucide="arrow-up-right"></i>
                    </button>
                </div>
            </div>
        </article>
    `).join("");

    if (window.lucide) {
        lucide.createIcons();
    }
}

// Category filter buttons
categoryFilters.addEventListener("click", event => {
    const button = event.target.closest(".filter-btn");

    if (!button) return;

    activeCategory = button.dataset.category;

    document.querySelectorAll(".filter-btn").forEach(filter => {
        const selected = filter.dataset.category === activeCategory;
        filter.classList.toggle("active", selected);
        filter.setAttribute("aria-pressed", String(selected));
    });

    renderEvents();
});

// Search as the user types
searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value;
    renderEvents();
});

searchBtn.addEventListener("click", () => {
    searchTerm = searchInput.value;
    renderEvents();
});

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        searchTerm = searchInput.value;
        renderEvents();
    }
});

// Sorting
sortSelect.addEventListener("change", renderEvents);

// Event details
eventGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-event-id]");

    if (!button) return;

    const selectedEvent = events.find(
        item => item.id === Number(button.dataset.eventId)
    );

    if (!selectedEvent) return;

    alert(
        `${selectedEvent.title}\n\n` +
        `Category: ${selectedEvent.category}\n` +
        `Date: ${formatDate(selectedEvent.date)}\n` +
        `Time: ${selectedEvent.time}\n` +
        `Venue: ${selectedEvent.venue}\n\n` +
        selectedEvent.description
    );
});

// Reset filters and search
resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchTerm = "";
    activeCategory = "All";

    document.querySelectorAll(".filter-btn").forEach(button => {
        const selected = button.dataset.category === "All";
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
    });

    renderEvents();
});

// Mobile navbar
menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
    });
});

// Initial page render
renderEvents();

if (window.lucide) {
    lucide.createIcons();
}
