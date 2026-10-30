// =====================================================
// CampusGuide - Floors & Rooms data
// Source: floor plans of Floor 0 to Floor 4.
//
// To add a new floor (e.g. Floor 5), copy one object in
// CAMPUS_FLOORS, change `id`, `name` and the cells.
// Rows are written LEFT -> RIGHT exactly as in the plan.
// `w` is the relative width of a block in the plan.
// =====================================================

const room = (no, color, w = 1) => ({ name: "Room " + no, type: "room", color: color, w: w });
const lab = (name, color, w = 1) => ({ name: name, type: "lab", color: color, w: w });
const faculty = (name, color, w = 1) => ({ name: name, type: "faculty", color: color, w: w });
const hall = (name, color, w = 1) => ({ name: name, type: "hall", color: color, w: w });
const other = (name, color, w = 1) => ({ name: name, type: "other", color: color, w: w });
const ramp = (w = 1) => ({ name: "Ramp", type: "access", color: "purple", w: w, icon: "ramp" });
const lift = (w = 1) => ({ name: "Lift", type: "access", color: "purple", w: w, icon: "lift" });

const CAMPUS_FLOORS = [
    {
        id: 0,
        name: "Ground Floor",
        top: [
            lab("Field Lab", "orange", 128),
            lab("CAD Lab", "yellow", 160),
            lab("BM Lab", "lime", 161),
            lab("Hydraulic Lab", "dgreen", 175),
            lab("Geotechnical Lab", "cyan", 202),
            hall("Raman Hall", "blue", 326)
        ],
        bottom: [
            room(135, "blue", 198),
            room(134, "cyan", 198),
            room(133, "pink", 192),
            room(132, "lime", 180),
            room(131, "yellow", 190),
            room(130, "orange", 190)
        ],
        // Right-hand side of Floor 0 (outside the two rows)
        side: [
            { name: "Entrance of Hostel Student", type: "entrance", color: "white", w: 1 },
            { name: "Ramp and Lift", type: "access", color: "purple", w: 1, icon: "lift" }
        ]
    },
    {
        id: 1,
        name: "First Floor",
        top: [
            lab("Environmental Engg. Lab", "yellow", 250),
            lab("Surveying Lab", "orange", 238),
            room(238, "green", 226),
            lab("Theory of Mechanics", "cyan", 245),
            lab("EGD Lab", "blue", 390)
        ],
        bottom: [
            room(234, "cyan", 216),
            faculty("Faculty Room", "pink", 262),
            room(232, "lime", 214),
            room(231, "yellow", 210),
            room(230, "orange", 208),
            ramp(120),
            lift(105)
        ]
    },
    {
        id: 2,
        name: "Second Floor",
        top: [
            room(336, "yellow", 276),
            room(337, "orange", 277),
            room(338, "green", 281),
            room(339, "cyan", 272),
            room(340, "blue", 404)
        ],
        bottom: [
            room(335, "blue", 228),
            room(334, "cyan", 223),
            room(333, "pink", 217),
            room(332, "lime", 201),
            room(331, "yellow", 185),
            room(330, "orange", 207),
            ramp(140),
            lift(105)
        ]
    },
    {
        id: 3,
        name: "Third Floor",
        top: [
            room(437, "red", 226),
            room(438, "yellow", 211),
            room(439, "orange", 211),
            lab("Chemistry Lab", "green", 223),
            lab("Microprocessor / Microcontroller Lab", "cyan", 251),
            lab("Communication Lab", "blue", 260)
        ],
        bottom: [
            room(435, "blue", 200),
            room(434, "cyan", 190),
            room(433, "pink", 184),
            room(432, "lime", 188),
            room(431, "yellow", 181),
            room(430, "orange", 180),
            ramp(145),
            lift(113)
        ]
    },
    {
        id: 4,
        name: "Fourth Floor",
        subtitle: "Labs",
        top: [
            lab("Salt Lab", "orange", 250),
            // Two faculty cabins with the sitting area below them
            {
                stack: [
                    [faculty("Faculty Room", "pink", 1), faculty("Faculty Room", "pink", 1)],
                    [other("Sitting Area", "dgreen", 1)]
                ],
                w: 320
            },
            lab("National Instruments", "cyan", 190),
            lab("AWS Academy", "yellow", 180),
            other("Store Room", "grey", 160),
            lab("Unnati Lab", "blue", 170)
        ],
        bottom: [
            other("Meeting Room", "dgreen", 220),
            lab("Networking Academy", "blue", 220),
            lab("Rockwell Automation", "red", 230),
            lab("iOS Lab", "cyan", 190),
            lab("Centre of Excellence", "green", 240),
            ramp(85),
            lift(85)
        ]
    }
];
