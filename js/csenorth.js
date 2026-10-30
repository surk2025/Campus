// =====================================================
// CampusGuide - Floors & Rooms page
// Needs js/floors-data.js (CAMPUS_FLOORS) to be loaded first.
// =====================================================

(function () {

    var TYPE_LABEL = {
        room: "Room",
        lab: "Lab",
        faculty: "Faculty",
        hall: "Hall",
        other: "Facility",
        access: "Ramp / Lift",
        entrance: "Entrance"
    };

    var FILTERS = [
        { id: "all", label: "All" },
        { id: "room", label: "Rooms" },
        { id: "lab", label: "Labs" },
        { id: "faculty", label: "Faculty" },
        { id: "other", label: "Halls & Facilities" }
    ];

    function filterOf(type) {
        return (type === "room" || type === "lab" || type === "faculty") ? type : "other";
    }

    function norm(text) {
        return String(text).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    }

    function ordinal(n) {
        var s = ["th", "st", "nd", "rd"];
        var v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    // ---------- Build a flat list of places from the floor data ----------

    var places = [];
    var byId = {};

    function addPlace(cell, floor, rowKey, info) {
        var place = {
            id: "f" + floor.id + "-" + norm(cell.name).replace(/ /g, "-") + "-" + places.length,
            name: cell.name,
            type: cell.type,
            color: cell.color,
            floor: floor.id,
            floorName: floor.name,
            row: rowKey,
            fromLift: info.fromLift,
            before: info.before,
            after: info.after,
            icon: cell.icon || null
        };
        place.haystack = norm(
            cell.name + " " + TYPE_LABEL[cell.type] + " floor " + floor.id +
            (cell.type === "lab" ? " laboratory" : "") +
            (cell.type === "room" ? " room no" : "")
        ).split(" ");
        places.push(place);
        byId[place.id] = place;
        cell._id = place.id;
        return place;
    }

    function cellNames(cell) {
        if (cell.stack) {
            var names = [];
            cell.stack.forEach(function (row) {
                row.forEach(function (c) { names.push(c.name); });
            });
            return names.join(" / ");
        }
        return cell.name;
    }

    CAMPUS_FLOORS.forEach(function (floor) {
        ["top", "bottom"].forEach(function (rowKey) {
            var cells = floor[rowKey];
            var normal = cells.filter(function (c) { return c.type !== "access"; });

            cells.forEach(function (cell) {
                var idx = normal.indexOf(cell);
                var info = { fromLift: null, before: null, after: null };

                if (idx !== -1) {
                    info.fromLift = normal.length - idx;
                    info.before = idx > 0 ? cellNames(normal[idx - 1]) : null;
                    info.after = idx < normal.length - 1 ? cellNames(normal[idx + 1]) : null;
                }

                if (cell.stack) {
                    cell.stack.forEach(function (stackRow) {
                        stackRow.forEach(function (c) { addPlace(c, floor, rowKey, info); });
                    });
                } else {
                    addPlace(cell, floor, rowKey, info);
                }
            });
        });

        (floor.side || []).forEach(function (cell) {
            addPlace(cell, floor, "side", { fromLift: null, before: null, after: null });
        });
    });

    // ---------- State ----------

    var params = new URLSearchParams(window.location.search);
    var state = {
        floor: 0,
        type: "all",
        q: params.get("q") || "",
        selected: null
    };

    var typeParam = params.get("type");
    if (typeParam && FILTERS.some(function (f) { return f.id === typeParam; })) {
        state.type = typeParam;
    }

    var floorParam = parseInt(params.get("floor"), 10);
    if (!isNaN(floorParam) && CAMPUS_FLOORS.some(function (f) { return f.id === floorParam; })) {
        state.floor = floorParam;
    }

    var placeParam = params.get("place");
    if (placeParam && byId[placeParam]) {
        state.selected = placeParam;
        state.floor = byId[placeParam].floor;
    }

    function matches(place) {
        if (state.type !== "all" && filterOf(place.type) !== state.type) {
            return false;
        }
        var tokens = norm(state.q).split(" ").filter(Boolean);
        return tokens.every(function (token) {
            return place.haystack.some(function (word) {
                return word.indexOf(token) === 0;
            });
        });
    }

    function filterActive() {
        return state.type !== "all" || norm(state.q) !== "";
    }

    function countOnFloor(floorId) {
        return places.filter(function (p) { return p.floor === floorId && matches(p); }).length;
    }

    // If the open floor has no match, jump to the first floor that has one.
    function ensureFloorHasMatch() {
        if (!filterActive() || countOnFloor(state.floor) > 0) {
            return;
        }
        for (var i = 0; i < CAMPUS_FLOORS.length; i++) {
            if (countOnFloor(CAMPUS_FLOORS[i].id) > 0) {
                state.floor = CAMPUS_FLOORS[i].id;
                return;
            }
        }
    }

    // ---------- DOM helpers ----------

    function h(tag, attrs, children) {
        var el = document.createElement(tag);
        if (attrs) {
            Object.keys(attrs).forEach(function (key) {
                if (key === "class") { el.className = attrs[key]; }
                else if (key === "text") { el.textContent = attrs[key]; }
                else if (key === "style") { el.setAttribute("style", attrs[key]); }
                else { el.setAttribute(key, attrs[key]); }
            });
        }
        (children || []).forEach(function (child) {
            if (child) { el.appendChild(child); }
        });
        return el;
    }

    function refreshIcons() {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }

    var els = {
        search: document.getElementById("floorSearch"),
        clear: document.getElementById("clearSearch"),
        chips: document.getElementById("typeChips"),
        tabs: document.getElementById("floorTabs"),
        plan: document.getElementById("planHolder"),
        detail: document.getElementById("detailPanel"),
        listTitle: document.getElementById("listTitle"),
        list: document.getElementById("resultList")
    };

    // ---------- Render: chips & tabs ----------

    function renderChips() {
        els.chips.innerHTML = "";
        FILTERS.forEach(function (f) {
            var btn = h("button", {
                type: "button",
                "class": "chip" + (state.type === f.id ? " active" : ""),
                "aria-pressed": state.type === f.id ? "true" : "false",
                text: f.label
            });
            btn.addEventListener("click", function () {
                state.type = f.id;
                ensureFloorHasMatch();
                update();
            });
            els.chips.appendChild(btn);
        });
    }

    function renderTabs() {
        els.tabs.innerHTML = "";
        CAMPUS_FLOORS.forEach(function (floor) {
            var active = floor.id === state.floor;
            var btn = h("button", {
                type: "button",
                role: "tab",
                "class": "floor-tab" + (active ? " active" : ""),
                "aria-selected": active ? "true" : "false"
            }, [
                h("strong", { text: floor.name }),
                h("span", {
                    text: filterActive()
                        ? countOnFloor(floor.id) + " found"
                        : (floor.subtitle || "")
                })
            ]);
            btn.addEventListener("click", function () {
                state.floor = floor.id;
                update();
            });
            els.tabs.appendChild(btn);
        });
    }

    // ---------- Render: floor plan ----------

    function tileEl(cell) {
        var place = byId[cell._id];
        var isMatch = matches(place);
        var classes = "tile c-" + cell.color;

        if (!isMatch) { classes += " dim"; }
        if (state.selected === place.id) { classes += " selected"; }

        var kids = [h("span", { "class": "tile-name", text: cell.name })];

        if (cell.type === "access") {
            kids.unshift(h("i", { "data-lucide": cell.icon === "ramp" ? "trending-up" : "arrow-up-down", "class": "tile-icon" }));
        } else if (cell.type !== "room") {
            kids.push(h("span", { "class": "tile-type", text: TYPE_LABEL[cell.type] }));
        }

        var btn = h("button", {
            type: "button",
            "class": classes,
            style: "--w:" + (cell.w || 1),
            "aria-pressed": state.selected === place.id ? "true" : "false",
            "aria-label": cell.name + ", " + place.floorName
        }, kids);

        btn.addEventListener("click", function () {
            state.selected = place.id;
            update();
        });
        return btn;
    }

    function stackEl(cell) {
        var wrap = h("div", { "class": "tile-stack", style: "--w:" + (cell.w || 1) });
        cell.stack.forEach(function (row) {
            var rowEl = h("div", { "class": "stack-row" });
            row.forEach(function (c) { rowEl.appendChild(tileEl(c)); });
            wrap.appendChild(rowEl);
        });
        return wrap;
    }

    function rowEl(cells, extraClass) {
        var row = h("div", { "class": "plan-row " + extraClass });
        cells.forEach(function (cell) {
            row.appendChild(cell.stack ? stackEl(cell) : tileEl(cell));
        });
        return row;
    }

    function renderPlan() {
        var floor = CAMPUS_FLOORS.filter(function (f) { return f.id === state.floor; })[0];
        els.plan.innerHTML = "";

        var main = h("div", { "class": "plan-main" }, [
            rowEl(floor.top, "top"),
            h("div", { "class": "plan-gap", "aria-hidden": "true" }),
            rowEl(floor.bottom, "bottom")
        ]);

        var body = h("div", { "class": "plan-body" }, [main]);

        if (floor.side) {
            var side = h("div", { "class": "plan-side" });
            floor.side.forEach(function (cell, i) {
                side.appendChild(tileEl(cell));
                if (i === 0) {
                    side.appendChild(h("i", { "data-lucide": "arrow-down", "class": "side-arrow", "aria-hidden": "true" }));
                }
            });
            body.appendChild(side);
        }

        var label = floor.name.toUpperCase() + (floor.subtitle ? " - " + floor.subtitle.toUpperCase() : "");

        els.plan.appendChild(h("div", { "class": "plan-frame" }, [
            body,
            h("div", { "class": "plan-label", text: label })
        ]));
    }

    // ---------- Render: detail panel ----------

    function renderDetail() {
        els.detail.innerHTML = "";
        var place = state.selected ? byId[state.selected] : null;

        if (!place) {
            els.detail.appendChild(h("div", { "class": "detail-empty" }, [
                h("i", { "data-lucide": "mouse-pointer-click" }),
                h("h3", { text: "Select a place for Navigation" }),
                h("p", { text: "Tap any room or lab on the floor plan to see where it is and how to reach it." })
            ]));
            return;
        }

        var rows = [];
        rows.push(["Floor", place.floorName]);

        if (place.row === "top") {
            rows.push(["Position", "Right Hand-side of the plan" + (place.fromLift ? ", " + ordinal(place.fromLift) + " from the Ramp & Lift end" : "")]);
        } else if (place.row === "bottom") {
            rows.push(["Position", place.type === "access"
                ? "At the end of the lower row"
                : "Left Hand-side of the plan, " + ordinal(place.fromLift) + " from the Ramp & Lift end"]);
        } else {
            rows.push(["Position", "Right side of the plan"]);
        }

        if (place.before && place.after) {
            rows.push(["Nearby", "Between " + place.before + " and " + place.after]);
        } else if (place.before || place.after) {
            rows.push(["Nearby", "Next to " + (place.before || place.after)]);
        }

        var reach;
        if (place.type === "entrance") {
            reach = "This is the entrance used by hostel students. Ramp and Lift are right next to it.";
        } else if (place.floor === 0) {
            reach = "On Ground Floor. The Ramp and Lift are at the right end of the plan.";
        } else {
            reach = "Take the Ramp or Lift up to " + place.floorName + ", then follow the passage to reach it.";
        }
        rows.push(["How to reach", reach]);

        var card = h("div", { "class": "detail-card" }, [
            h("span", { "class": "detail-badge c-" + place.color, text: TYPE_LABEL[place.type] }),
            h("h3", { text: place.name })
        ]);

        var list = h("dl", { "class": "detail-list" });
        rows.forEach(function (r) {
            list.appendChild(h("dt", { text: r[0] }));
            list.appendChild(h("dd", { text: r[1] }));
        });
        card.appendChild(list);
        els.detail.appendChild(card);
    }

    // ---------- Render: list ----------

    function renderList() {
        els.list.innerHTML = "";
        var items;

        if (filterActive()) {
            items = places.filter(matches);
            els.listTitle.textContent = items.length + (items.length === 1 ? " result" : " results") + " on all floors";
        } else {
            items = places.filter(function (p) { return p.floor === state.floor; });
            els.listTitle.textContent = "All places on " + CAMPUS_FLOORS.filter(function (f) { return f.id === state.floor; })[0].name;
        }

        if (items.length === 0) {
            var empty = h("div", { "class": "empty-state" }, [
                h("strong", { text: "No place found" }),
                h("span", { text: "Try a room number like 432 or a name like Chemistry Lab." })
            ]);
            els.list.appendChild(empty);
            return;
        }

        items.forEach(function (place) {
            var btn = h("button", {
                type: "button",
                "class": "result-item" + (state.selected === place.id ? " selected" : "")
            }, [
                h("span", { "class": "dot c-" + place.color }),
                h("span", { "class": "result-name", text: place.name }),
                h("span", { "class": "result-meta", text: place.floorName + " · " + TYPE_LABEL[place.type] })
            ]);
            btn.addEventListener("click", function () {
                state.selected = place.id;
                state.floor = place.floor;
                update();
                var planTop = document.getElementById("planSection");
                if (planTop && window.innerWidth < 1000) {
                    planTop.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
            els.list.appendChild(btn);
        });
    }

    // ---------- Keep URL in sync (so a page can be shared) ----------

    function syncUrl() {
        if (!window.history || !window.history.replaceState) { return; }
        var p = new URLSearchParams();
        if (state.q) { p.set("q", state.q); }
        if (state.type !== "all") { p.set("type", state.type); }
        p.set("floor", state.floor);
        var query = p.toString();
        try {
            window.history.replaceState(null, "", window.location.pathname + (query ? "?" + query : ""));
        } catch (e) { /* ignore (e.g. file:// restrictions) */ }
    }

    function update() {
        els.clear.hidden = !state.q;
        renderChips();
        renderTabs();
        renderPlan();
        renderDetail();
        renderList();
        syncUrl();
        refreshIcons();
    }

    // ---------- Events ----------

    els.search.value = state.q;

    els.search.addEventListener("input", function () {
        state.q = els.search.value;
        ensureFloorHasMatch();
        update();
    });

    els.clear.addEventListener("click", function () {
        state.q = "";
        els.search.value = "";
        els.search.focus();
        update();
    });

    ensureFloorHasMatch();
    update();

})();
