/* English content — applied over the Mongolian data when LANG === "en" */
(function () {
  if (typeof LANG === "undefined" || LANG !== "en") return;

  const REGIONS_EN = {
    west:    { name: "Western Mongolia", desc: "Mongolian Altai and the Great Lakes Depression (Uvs, Khar Us and Achit lakes)" },
    khangai: { name: "Khangai & Khuvsgul", desc: "Khangai Mountains, Lake Khuvsgul, the Orkhon and Terkhiin Tsagaan Lake" },
    north:   { name: "Khentii & Selenge", desc: "Khentii Mountains, forest-steppe, the Onon, Tuul and Khurkh rivers" },
    central: { name: "Central steppe", desc: "Steppe around Ulaanbaatar, Hustai, northern Dundgovi" },
    east:    { name: "Eastern steppe", desc: "The vast plains of Dornod and Sukhbaatar, Lake Buir, Mongol Daguur" },
    gobi:    { name: "Gobi", desc: "Gobi Altai, Valley of the Lakes, Umnugovi, Dornogovi" }
  };
  const HOTSPOTS_EN = {
    ulaanbaatar: "Ulaanbaatar", hustai: "Hustai National Park", terelj: "Gorkhi-Terelj", khuvsgul: "Lake Khuvsgul",
    ugii: "Ugii Lake", terkh: "Terkhiin Tsagaan Lake", orkhon: "Orkhon Valley", kharus: "Khar Us Lake", uvs: "Uvs Lake",
    achit: "Achit Lake", ulgii: "Ulgii", tavanbogd: "Altai Tavan Bogd", yoliin: "Yolyn Am (Gobi Gurvan Saikhan)",
    ikhnart: "Ikh Nart Nature Reserve", boontsagaan: "Boon Tsagaan Lake", orog: "Orog Lake", taatsin: "Taatsiin Tsagaan Lake",
    ganga: "Ganga Lake (Dariganga)", buir: "Lake Buir", daguur: "Mongol Daguur (Ulz River)", khurkh: "Khurkh-Khuiten Valley", onon: "Onon-Balj"
  };
  const GROUPS_EN = { raptor: "Raptors", owl: "Owls", crane: "Cranes", stork: "Storks", waterfowl: "Swans & geese", duck: "Ducks", gull: "Gulls", gamebird: "Gamebirds & sandgrouse", woodpecker: "Woodpeckers", small: "Small birds" };
  const COLOR_EN = { black: "Black", white: "White", gray: "Grey", brown: "Brown", buff: "Buff", rufous: "Rufous / orange", yellow: "Yellow", red: "Red" };
  const SIZE_EN = {
    small: "Small (sparrow to pigeon size, up to 35 cm)",
    medium: "Medium (crow to duck size, 35–75 cm)",
    large: "Large (goose to eagle size, 75–110 cm)",
    xlarge: "Very large (swan, crane, vulture; over 110 cm)"
  };
  const HABITAT_EN = { mountain: "Mountains, cliffs", steppe: "Steppe grassland", desert: "Gobi, desert", water: "Lakes, rivers, marshes", forest: "Forest, woodland", settlement: "Towns, ger districts" };
  const BEAK_EN = {
    hooked: "Hooked raptor bill", long: "Long straight bill", flat: "Broad flat (duck-type) bill", pouch: "Long bill with a throat pouch",
    gull: "Medium bill with a slightly hooked tip", short: "Short thick bill", curved: "Long thin down-curved bill"
  };
  const BEHAVIOR_EN = { soar: "Soaring in circles", swim: "Swimming on water", walk: "Walking or feeding on the ground", perch: "Perched on a rock, pole or treetop", night: "Seen at night or dusk" };
  const SEASON_EN = { resident: "Year-round (resident)", summer: "Summer (Apr–Sep)", passage: "Spring and autumn migration", winter: "Winter (Nov–Mar)" };
  const VOICE_EN = {
    trumpet: { name: "Trumpeting", desc: "Loud, far-carrying trumpet or flute-like “krrroo”, “hook”" },
    honk:    { name: "Honking", desc: "Goose- or duck-like “ga-ga”, “aang”, “honk”" },
    screech: { name: "Screeching", desc: "Sharp, loud “kee-kee”, “kek-kek”, “peee-uh”" },
    whistle: { name: "Whistling", desc: "Thin, quavering whistles" },
    hoot:    { name: "Hooting “oo-hoo”", desc: "Soft, deep “oohoo” or repeated “hoo-hoo-hoo”" },
    song:    { name: "Musical song", desc: "Long, varied song full of mimicry" },
    croak:   { name: "Croaking, growling", desc: "Deep, hoarse, throaty sounds" },
    laugh:   { name: "Laughing, mewing", desc: "Gull-like “ka-ka-ka”, “kyow” laughing calls" },
    silent:  { name: "Mostly silent", desc: "Usually quiet; only hisses or bill-clapping at the nest" }
  };

  const ROUTES_EN = {
    "ub-short": {
      name: "Short trip around Ulaanbaatar", days: "1–2 days", distance: "≈ 320 km", season: "May–Aug", level: "Easy",
      transport: "Car; paved road to Hustai except the last 13 km of dirt road",
      stops: [
        { day: "Day 1, morning", note: "Tuul River banks on the edge of the city — Black Kites circle overhead in summer, Hoopoes near the ger districts and Ruddy Shelducks along the river." },
        { day: "Day 1, afternoon", note: "Forest, crags and the Terelj River valley: Black Stork, Cinereous Vulture, Upland Buzzard and small forest-steppe birds. At dusk, listen for the “oohoo” of the Eurasian Eagle-Owl." },
        { day: "Day 2", note: "Hustai National Park — besides Przewalski’s horses, look for steppe raptors (Saker Falcon, Upland Buzzard, vultures), Demoiselle Crane and Mongolian Lark." }
      ],
      intro: "Ideal for visitors short on time and for beginners. Within 1–2 hours of the capital it covers three habitats — forest, crags and steppe — with around 10 of the guide’s species possible.",
      tips: ["Birds are most active for 3 hours after sunrise and 2 hours before sunset.", "Hustai charges a protected-area entrance fee.", "Bring 8×42 binoculars, water, a hat and sunscreen."]
    },
    "central-lakes": {
      name: "Central Mongolia & the Khangai lakes", days: "5–7 days", distance: "≈ 1,500 km", season: "May–Sep", level: "Moderate",
      transport: "4×4; mostly paved, dirt roads around the Orkhon waterfall and Terkhiin Tsagaan Lake",
      stops: [
        { day: "Day 1", note: "Start. Watch the roadside poles for Upland Buzzards and Saker Falcons." },
        { day: "Day 1", note: "Steppe raptors, Demoiselle Crane and Mongolian Lark." },
        { day: "Day 2", note: "Ugii Lake — a waterbird paradise: Ruddy Shelduck, Whooper Swan, Demoiselle Crane, gulls and ducks. A Ramsar-listed wetland." },
        { day: "Days 3–4", note: "Orkhon Valley, Kharkhorin and Erdene Zuu monastery (Ruddy Shelducks), the Orkhon waterfall (Black Stork, vultures, occasionally Lammergeier)." },
        { day: "Day 5", note: "Terkhiin Tsagaan Lake and the Khorgo volcano — Whooper Swan, Ruddy Shelduck, Demoiselle Crane, and Eagle-Owl among the rocks." }
      ],
      intro: "The most popular route, combining Mongolia’s historical heritage (Kharkhorin, Erdene Zuu) with lakes rich in waterbirds. A trip can log 60–100 bird species.",
      tips: ["At Ugii Lake, watch from the west shore in the evening so the light is behind you.", "Don’t drive close to birds nesting on lake shores.", "Rain in July–August turns dirt roads to mud — plan a spare day."]
    },
    "gobi": {
      name: "The Gobi & the Valley of the Lakes", days: "7–9 days", distance: "≈ 1,900 km", season: "May–Jun, Sep", level: "Hard",
      transport: "4×4 with an experienced driver; mostly dirt roads — carry spare fuel and water",
      stops: [
        { day: "Day 1", note: "Start, heading south towards Dundgovi." },
        { day: "Days 1–2", note: "Ikh Nart — cliffs where Cinereous Vultures nest, Saker Falcon, Eagle-Owl, plus argali and ibex. Watch the vulture nests from a distance." },
        { day: "Days 3–4", note: "Gobi Gurvan Saikhan, Yolyn Am — Lammergeier, Golden Eagle, Altai Snowcock (high up) and small rock birds." },
        { day: "Day 5", note: "Orog Lake — a saline lake in the Valley of the Lakes: Relict Gull, Ruddy Shelduck and many waders on migration." },
        { day: "Day 6", note: "Boon Tsagaan Lake — Ruddy Shelduck, Whooper Swan, Relict Gull, Demoiselle Crane; thousands of birds at peak migration." },
        { day: "Day 7", note: "Taatsiin Tsagaan Lake — Relict Gull colony (in wet years)." }
      ],
      intro: "An adventurous route targeting cliff-nesting raptors and the rare Relict Gull of the Gobi lakes. Most of a birder’s Mongolian “must-see” list is on this route.",
      tips: ["Relict Gull colonies move between lakes from year to year — get the latest news from local ornithologists before you go.", "Gobi daytime heat reaches 35°C — bird early and late.", "Stay at least 200 m from colonies and nests."]
    },
    "east-cranes": {
      name: "Eastern steppe & the land of cranes", days: "8–10 days", distance: "≈ 2,400 km", season: "May–Jun, Aug–Sep", level: "Hard",
      transport: "4×4; mostly dirt roads beyond Khentii, border-zone permits required",
      stops: [
        { day: "Day 1", note: "Start, heading east to Khentii." },
        { day: "Days 2–3", note: "Khurkh-Khuiten Valley — a crane research centre: White-naped Crane, Demoiselle Crane, Swan Goose and Great Bustard." },
        { day: "Day 4", note: "Onon-Balj and Dadal (birthplace of Chinggis Khaan) — Black Stork, White-naped Crane, Swan Goose." },
        { day: "Days 5–6", note: "Mongol Daguur Strictly Protected Area, Ulz River — White-naped Crane, Siberian Crane on migration, Great Bustard." },
        { day: "Day 7", note: "Lake Buir — Swan Goose, Whooper Swan, many ducks and gulls." },
        { day: "Days 8–9", note: "Dariganga and Ganga Lake — autumn flocks of Whooper Swans, Mongolian Lark, Saker Falcon, Demoiselle Crane." }
      ],
      intro: "A rare chance to see Mongolia’s breeding and passage cranes (White-naped, Demoiselle, Siberian, Hooded) on one trip, across the world’s best-preserved temperate grassland.",
      tips: ["Obtain a border-zone permit before entering Mongol Daguur and the frontier.", "Siberian Cranes pass through only in mid-May and September — time your trip.", "Great Bustards are very wary — you’ll need a 60× telescope."]
    },
    "west-altai": {
      name: "Altai & the Great Lakes Depression", days: "8–10 days", distance: "≈ 1,000 km by road + flights", season: "Jun–Aug; Golden Eagle Festival in early October", level: "Hard",
      transport: "Flight UB–Ulgii, 4×4 overland, return flight from Khovd",
      stops: [
        { day: "Days 1–2", note: "Ulgii — visit a Kazakh eagle-hunter family and meet their trained eagles." },
        { day: "Days 3–4", note: "Altai Tavan Bogd — Lammergeier, Golden Eagle, Altai Snowcock and high-mountain birds." },
        { day: "Day 5", note: "Achit Lake — Dalmatian Pelican, Whooper Swan, Ruddy Shelduck, gulls." },
        { day: "Days 6–7", note: "Uvs Lake (UNESCO World Heritage) — waterbirds, thousands of birds on migration." },
        { day: "Days 8–9", note: "Khar Us Lake — Dalmatian Pelicans in the reedbeds, Whooper Swan, Ruddy Shelduck, rare ducks." }
      ],
      intro: "Kazakh eagle-hunting culture, the snow-capped Altai peaks and the rare Dalmatian Pelican of the Great Lakes. Unforgettable if timed with the autumn Golden Eagle Festival.",
      tips: ["Altai Tavan Bogd lies in the border zone, so a border permit is required.", "Nights in the high mountains drop to 0°C — bring warm clothes.", "Don’t approach pelican colonies by boat."]
    }
  };

  const PROGRAMS_EN = {
    "ub-short": [
      { title: "Ulaanbaatar → Gorkhi-Terelj", drive: "70 km · 1.5 h", stay: "Terelj tourist camp / ger lodge",
        am: "06:00 dawn birding on the Tuul River (Zaisan, Airport bridge): Ruddy Shelduck, Black Kite, Hoopoe.",
        pm: "Walk the Terelj valley around Turtle Rock: Black Stork, vultures, Upland Buzzard, small forest-steppe birds.",
        ev: "At sunset, listen for Eagle-Owls near the crags." },
      { title: "Terelj → Hustai → Ulaanbaatar", drive: "230 km · 4 h", stay: "—",
        am: "Leave early to reach Hustai by 9:00. On the steppe: Saker Falcon, Upland Buzzard, Demoiselle Crane, Mongolian Lark.",
        pm: "Przewalski’s horses and a vulture feeding site in the Hustai valley; lunch at the Hustai centre.",
        ev: "Back in Ulaanbaatar around 18:00." }
    ],
    "central-lakes": [
      { title: "Ulaanbaatar → Hustai", drive: "100 km · 2 h", stay: "Hustai tourist camp",
        am: "Upland Buzzards and Saker Falcons on roadside poles; Emeelt steppe.", pm: "Steppe raptors and Demoiselle Cranes at Hustai.", ev: "Przewalski’s horses; listen for Eagle-Owls." },
      { title: "Hustai → Ugii Lake", drive: "250 km · 4 h", stay: "Ger camp on Ugii Lake",
        am: "Early start via the Erdenesant and Bayan steppes.", pm: "East shore of Ugii Lake: Ruddy Shelduck, Whooper Swan, Demoiselle Crane, ducks, gulls.", ev: "Waterbird flights at sunset." },
      { title: "Ugii Lake → Kharkhorin", drive: "100 km · 2 h", stay: "Kharkhorin",
        am: "Dawn birding on the west shore of Ugii Lake.", pm: "Erdene Zuu monastery (Ruddy Shelducks on the walls), Orkhon riverbank.", ev: "Steppe around Kharkhorin — Upland Buzzard, Saker Falcon." },
      { title: "Kharkhorin → Orkhon waterfall", drive: "120 km · 3–4 h (dirt)", stay: "Ger camp at the waterfall",
        am: "Up the Orkhon Valley: Upland Buzzard, vultures, Hoopoe.", pm: "Waterfall gorge: Black Stork, rock birds, occasionally Lammergeier.", ev: "Vultures gliding past the gorge rim." },
      { title: "Orkhon waterfall → Terkhiin Tsagaan Lake", drive: "250 km · 5–6 h", stay: "Lakeside camp",
        am: "Via Tsenkher and Tariat.", pm: "Khorgo volcano crater and lava fields: Eagle-Owl, rock birds.", ev: "Lakeshore: Whooper Swan, Ruddy Shelduck." },
      { title: "Terkhiin Tsagaan Lake — full day", drive: "—", stay: "Terkhiin Tsagaan Lake",
        am: "Marshes on the north shore: Whooper Swan, Demoiselle Crane.", pm: "Lakeshore trip on horseback or on foot.", ev: "Compile the day’s bird list." },
      { title: "Terkhiin Tsagaan Lake → Ulaanbaatar", drive: "670 km · 10–11 h", stay: "—",
        am: "Early start.", pm: "Via Tsetserleg and Khoshoo Tsaidam (Upland Buzzards on the stone monuments).", ev: "Arrive in Ulaanbaatar in the evening." }
    ],
    "gobi": [
      { title: "Ulaanbaatar → Ikh Nart", drive: "300 km · 5 h", stay: "Ikh Nart field camp / tent",
        am: "Early start towards Choir.", pm: "Ikh Nart cliffs: vultures, Saker Falcon, argali.", ev: "Eagle-Owls calling at dusk." },
      { title: "Ikh Nart — full day", drive: "Local trips", stay: "Ikh Nart",
        am: "Watch vulture nesting cliffs from a distance.", pm: "Search rock crevices for roosting Eagle-Owls (with a guide).", ev: "Ibex and argali grazing." },
      { title: "Ikh Nart → Dalanzadgad → Yolyn Am", drive: "420 km · 7–8 h", stay: "Ger camp at Yolyn Am",
        am: "Long drive with Gobi birds along the way.", pm: "Refuel and restock water in Dalanzadgad.", ev: "Tent or ger at the mouth of Yolyn Am." },
      { title: "Yolyn Am — full day", drive: "Hike 8–10 km", stay: "Yolyn Am",
        am: "Walk the gorge: Lammergeier and Golden Eagle over the cliffs.", pm: "Search the heights for Altai Snowcock (listen for it).", ev: "Eagle-Owls among the rocks." },
      { title: "Yolyn Am → Orog Lake", drive: "350 km · 7 h", stay: "Tent on Orog Lake",
        am: "Via Bayanlig and Bogd.", pm: "Orog Lake: Relict Gull, Ruddy Shelduck, waders.", ev: "Sunset below Ikh Bogd mountain." },
      { title: "Orog Lake → Boon Tsagaan Lake", drive: "150 km · 3 h", stay: "Boon Tsagaan Lake",
        am: "Dawn birding at Orog Lake.", pm: "Boon Tsagaan Lake: Whooper Swan, Ruddy Shelduck, Relict Gull, Demoiselle Crane.", ev: "Migrating flocks coming in to roost." },
      { title: "Boon Tsagaan → Taatsiin Tsagaan Lake", drive: "200 km · 4 h", stay: "Taatsiin Tsagaan Lake",
        am: "Baidrag River delta.", pm: "Scope the Relict Gull colony.", ev: "The noise of the colony." },
      { title: "Taatsiin Tsagaan → Arvaikheer → Ulaanbaatar", drive: "~650 km · 10–11 h", stay: "—",
        am: "Early start.", pm: "Paved road from Arvaikheer.", ev: "Arrive in Ulaanbaatar." }
    ],
    "east-cranes": [
      { title: "Ulaanbaatar → Undurkhaan", drive: "330 km · 5 h", stay: "Undurkhaan",
        am: "East on the paved road.", pm: "Kherlen River valley: Ruddy Shelduck, Demoiselle Crane.", ev: "Steppe on the edge of town." },
      { title: "Undurkhaan → Khurkh-Khuiten Valley", drive: "200 km · 5 h", stay: "Khurkh field research camp / tent",
        am: "Towards Binder.", pm: "Khurkh River marshes: White-naped Crane, Swan Goose.", ev: "Crane pairs duetting." },
      { title: "Khurkh-Khuiten Valley — full day", drive: "Local", stay: "Khurkh",
        am: "Learn about the crane-ringing research (if possible).", pm: "Scope the steppe for Great Bustards.", ev: "Swan Geese on the lakeshore." },
      { title: "Khurkh → Dadal (Onon-Balj)", drive: "150 km · 4 h", stay: "Dadal ger camp",
        am: "Onon River valley.", pm: "Balj River: Black Stork, White-naped Crane.", ev: "Deluun Boldog (birthplace of Chinggis Khaan)." },
      { title: "Dadal → Mongol Daguur", drive: "350 km · 7–8 h", stay: "Chuluunkhoroot / tent",
        am: "Early start; have your border permit checked.", pm: "Ulz River marshes.", ev: "Daguur steppe: Great Bustard." },
      { title: "Mongol Daguur — full day", drive: "Local", stay: "Mongol Daguur",
        am: "White-naped Crane; Siberian Crane on migration.", pm: "Waders and ducks on the saline lakes.", ev: "Great Bustard display (in May)." },
      { title: "Mongol Daguur → Lake Buir", drive: "350 km · 6 h", stay: "Lake Buir shore",
        am: "Via Choibalsan.", pm: "Lake Buir: Swan Goose, Whooper Swan, ducks.", ev: "Sunset on the west shore." },
      { title: "Lake Buir → Dariganga", drive: "500 km · 9 h", stay: "Dariganga",
        am: "Long drive across the Dornod plains: Mongolian gazelle, Saker Falcon.", pm: "Dariganga and Shiliin Bogd.", ev: "Ganga Lake shore." },
      { title: "Ganga Lake → Baruun-Urt", drive: "180 km · 3 h", stay: "Baruun-Urt",
        am: "Ganga Lake: Whooper Swans (many in autumn), Demoiselle Crane.", pm: "Mongolian Larks around the sand dunes.", ev: "Rest." },
      { title: "Baruun-Urt → Ulaanbaatar", drive: "560 km · 8 h", stay: "—",
        am: "Paved road.", pm: "Upland Buzzards and Saker Falcons on the steppe.", ev: "Arrive in Ulaanbaatar." }
    ],
    "west-altai": [
      { title: "Ulaanbaatar → Ulgii (flight)", drive: "Flight ≈ 3.5 h", stay: "Ulgii",
        am: "Morning flight.", pm: "Khovd River banks around Ulgii.", ev: "Kazakh food and culture." },
      { title: "Ulgii — eagle-hunter family", drive: "80 km", stay: "With an eagle-hunter family",
        am: "To Sagsai district.", pm: "Meet trained eagles; learn about the eagle-hunting tradition.", ev: "Wild Golden Eagles on the mountainsides." },
      { title: "Ulgii → Altai Tavan Bogd", drive: "180 km · 6–7 h", stay: "Khoton Lake / Tavan Bogd tent",
        am: "Via Tsagaannuur.", pm: "Khoton and Khurgan lakes.", ev: "High-mountain eagles and Lammergeier." },
      { title: "Altai Tavan Bogd — full day", drive: "On foot / horseback", stay: "Tavan Bogd",
        am: "Listen for Altai Snowcocks (06:00).", pm: "Trek towards the Potanin Glacier: Lammergeier, Golden Eagle.", ev: "Stargazing." },
      { title: "Tavan Bogd → Achit Lake", drive: "280 km · 7 h", stay: "Achit Lake shore",
        am: "Back out via Ulgii.", pm: "Achit Lake: Dalmatian Pelican, Whooper Swan, Ruddy Shelduck.", ev: "Sunset by the lake." },
      { title: "Achit Lake → Uvs Lake", drive: "150 km · 3 h", stay: "Ulaangom / Uvs Lake",
        am: "Dawn birding at Achit Lake.", pm: "South shore of Uvs Lake.", ev: "Waterbird flocks." },
      { title: "Uvs Lake — full day", drive: "Local", stay: "Uvs Lake",
        am: "Tes River delta.", pm: "Ducks, gulls and waders along the shore.", ev: "Rest." },
      { title: "Uvs → Khar Us Lake", drive: "300 km · 6 h", stay: "Khar Us Lake camp",
        am: "Past Khyargas Lake.", pm: "Khar Us reedbeds: Dalmatian Pelican, Whooper Swan.", ev: "Bird song from the reeds." },
      { title: "Khar Us Lake → Khovd → Ulaanbaatar", drive: "90 km + flight", stay: "—",
        am: "Last birding at Khar Us Lake.", pm: "Flight from Khovd.", ev: "Arrive in Ulaanbaatar." }
    ]
  };

  const KINDS_EN = { lodging: "Lodging", culture: "History & culture", nature: "Natural sight" };
  const LODGING_EN = { hotel: "Hotel", guesthouse: "Guesthouse, hostel", camp: "Tourist ger camp", homestay: "Nomad family homestay" };
  const AIMAG_EN = {
    "Улаанбаатар": "Ulaanbaatar", "Төв": "Tuv", "Өвөрхангай": "Uvurkhangai", "Архангай": "Arkhangai", "Хөвсгөл": "Khuvsgul",
    "Өмнөговь": "Umnugovi", "Дундговь": "Dundgovi", "Дорноговь": "Dornogovi", "Хэнтий": "Khentii", "Дорнод": "Dornod",
    "Сүхбаатар": "Sukhbaatar", "Баян-Өлгий": "Bayan-Ulgii", "Увс": "Uvs", "Ховд": "Khovd", "Баянхонгор": "Bayankhongor",
    "Сэлэнгэ": "Selenge", "Завхан": "Zavkhan", "Булган / Өвөрхангай": "Bulgan / Uvurkhangai"
  };
  const PLACES_EN = {
    "l-ub": ["Ulaanbaatar", "Everything from international hotel chains to budget hostels and guesthouses. The main base before and after a trip."],
    "l-hustai": ["Hustai tourist camp", "Ger camp near the Hustai National Park gate — the closest base for watching Przewalski’s horses and birds at dawn and dusk."],
    "l-terelj": ["Gorkhi-Terelj camps", "Dozens of ger camps, resorts and hotels in the Terelj valley, 1.5 hours from Ulaanbaatar."],
    "l-kharkhorin": ["Kharkhorin", "Hotels and guesthouses in town, ger camps nearby. The hub for Erdene Zuu and the Orkhon Valley."],
    "l-ugii": ["Ugii Lake camps", "Several ger camps on the lakeshore, plus nomad-family homestays. Handy for dawn and dusk waterbird watching."],
    "l-orkhon": ["Orkhon waterfall camps", "Ger camps near the waterfall. The dirt road gets difficult after rain."],
    "l-tsetserleg": ["Tsetserleg", "Capital of Arkhangai, with hotels and guesthouses; a stopover on the way to Terkhiin Tsagaan Lake."],
    "l-terkh": ["Terkhiin Tsagaan Lake camps", "Ger camps and nomad families around the lake and Khorgo volcano."],
    "l-khatgal": ["Khatgal & the Khuvsgul shore", "Many guesthouses in Khatgal village and ger camps along the west shore. Book ahead for July–August."],
    "l-dalanzadgad": ["Dalanzadgad", "Capital of Umnugovi with hotels; the last big stop for fuel, food and water."],
    "l-yol": ["Camps near Yolyn Am", "Ger camps near the entrance to Gobi Gurvan Saikhan National Park."],
    "l-bayanzag": ["Bayanzag camps", "Ger camps near the Flaming Cliffs — the rock colours glow at sunset."],
    "l-khongor": ["Khongoryn Els camps", "Ger camps and camel-herding families at the northern foot of the dunes. Camel rides available."],
    "l-mandalgovi": ["Mandalgovi", "Capital of Dundgovi; a stopover between Ulaanbaatar and the Gobi."],
    "l-sainshand": ["Sainshand", "Capital of Dornogovi, reachable by train; base for Khamar monastery."],
    "l-chinggis": ["Chinggis City (Undurkhaan)", "Capital of Khentii; the first overnight stop heading east."],
    "l-dadal": ["Dadal", "A scenic district of forests and lakes, with ger camps and homestays."],
    "l-choibalsan": ["Choibalsan", "Capital of Dornod; the largest town before Lake Buir and Mongol Daguur."],
    "l-baruunurt": ["Baruun-Urt", "Capital of Sukhbaatar; a stopover on the way to Dariganga and Ganga Lake."],
    "l-ulgii": ["Ulgii", "Hotels and guesthouses; stays with Kazakh eagle-hunter families are arranged from here."],
    "l-ulaangom": ["Ulaangom", "Capital of Uvs, close to Uvs and Achit lakes."],
    "l-khovd": ["Khovd", "Capital of Khovd with an airport; 1.5 hours to Khar Us Lake."],
    "l-bayankhongor": ["Bayankhongor", "Stock up on fuel and food before the Valley of the Lakes, where you’ll usually camp on the lakeshore."],
    "c-gandan": ["Gandantegchinlen Monastery", "Mongolia’s main Buddhist monastery. The Megjid Janraisig temple houses a 26 m statue (rebuilt in 1996). Morning prayers are open to visitors."],
    "c-museum": ["National Museum of Mongolia", "Rich collections of Mongolian history and ethnography, from the Stone Age to the 20th century."],
    "c-bogdkhan": ["Bogd Khan Palace Museum", "Winter palace and temple complex of the last Mongolian monarch, the 8th Bogd Jebtsundamba (late 19th – early 20th century)."],
    "c-chinggis": ["Chinggis Khaan Equestrian Statue", "A 40 m steel statue erected at Tsonjin Boldog in 2008; a viewing deck on the horse’s head overlooks the steppe. 54 km from Ulaanbaatar."],
    "c-manzushir": ["Manzushir Monastery ruins", "Ruins of a monastery founded in 1733 on the south side of Bogd Khan mountain and destroyed in 1937. Forest hikes and forest-steppe birds."],
    "c-aryabal": ["Aryabal Meditation Temple", "A temple on a mountainside in Gorkhi-Terelj, reached by a 108-step bridge, with superb views over the valley."],
    "c-erdenezuu": ["Erdene Zuu Monastery", "Mongolia’s first major Buddhist monastery, founded in 1586 by Abtai Sain Khan and enclosed by a wall of 108 stupas. Part of the Orkhon Valley Cultural Landscape (UNESCO)."],
    "c-kharkhorum": ["Kharkhorum Museum", "Finds from excavations of Karakorum, 13th-century capital of the Mongol Empire, and a model of the city."],
    "c-khoshootsaidam": ["Khoshoo Tsaidam monuments", "8th-century inscribed stelae of the Turkic Bilge Khagan and Kul Tegin, with a museum. Part of the Orkhon Valley Cultural Landscape."],
    "c-amarbayasgalant": ["Amarbayasgalant Monastery", "Built in 1727–1736 in honour of Undur Gegeen Zanabazar; one of Mongolia’s most complete surviving monastery complexes, in a forest-steppe valley."],
    "c-khamar": ["Khamar Monastery", "Founded by the 19th-century poet and reformer Noyon Khutagt Danzanravjaa. The nearby pilgrimage site is known as “Shambhala”."],
    "c-deluun": ["Deluun Boldog", "A monument in Dadal district marking the traditional birthplace of Chinggis Khaan."],
    "c-petroglyph": ["Petroglyphic Complexes of the Mongolian Altai", "Thousands of rock carvings at Tsagaan Salaa and Baga Oigor spanning more than 12,000 years (UNESCO World Heritage)."],
    "n-turtle": ["Turtle Rock", "A turtle-shaped granite outcrop — the symbol of Gorkhi-Terelj — among crags, forest and the Terelj River."],
    "n-orkhonfalls": ["Orkhon Waterfall (Ulaan Tsutgalan)", "A waterfall of about 20 m plunging into a volcanic gorge. Black Storks and vultures."],
    "n-elsen": ["Elsen Tasarkhai (Khugnu Tarna dunes)", "A strip of sand dunes running between forest-steppe and grassland. Camel rides and Khugnu Khan mountain."],
    "n-taikhar": ["Taikhar Rock", "A huge granite rock rising alone in the Tamir River valley, carved with inscriptions from many eras and steeped in legend."],
    "n-tsenkher": ["Tsenkher Hot Springs", "Hot springs in a forested valley, with a spa and ger camps."],
    "n-khorgo": ["Khorgo volcano", "An extinct volcanic crater and lava field on the east shore of Terkhiin Tsagaan Lake."],
    "n-khuvsgul": ["Lake Khuvsgul", "Mongolia’s deepest freshwater lake (262 m), the “Blue Pearl of Mongolia”, ringed by taiga and mountains."],
    "n-otgontenger": ["Otgontenger mountain", "The highest, permanently snow-capped peak of the Khangai range (over 4,000 m); a state-worshipped mountain."],
    "n-khongor": ["Khongoryn Els", "Sand dunes over 100 km long and 200–300 m high, called the “singing dunes” for the sound they make in the wind."],
    "n-bayanzag": ["Bayanzag (Flaming Cliffs)", "Red-orange sandstone cliffs where an American expedition found the first dinosaur eggs in the 1920s."],
    "n-tsagaansuvarga": ["Tsagaan Suvarga", "Steep white, red and pink walls of ancient seabed sediments — spectacular at sunset."],
    "n-ikhgazar": ["Ikh Gazriin Chuluu", "A cluster of granite rock hills in the Gobi steppe, with rock art, argali, Eagle-Owls and rock birds."],
    "n-shiliinbogd": ["Shiliin Bogd mountain", "A 1,778 m extinct volcano and sacred mountain in Dariganga, famous for sunrise from its summit."],
    "n-khuiten": ["Khuiten Peak", "Mongolia’s highest point (4,374 m) in the Tavan Bogd range, above the Potanin Glacier."]
  };

  // ---- apply ----
  for (const k in REGIONS_EN) Object.assign(REGIONS[k], REGIONS_EN[k]);
  for (const k in HOTSPOTS_EN) HOTSPOTS[k].name = HOTSPOTS_EN[k];
  Object.assign(GROUPS, GROUPS_EN); Object.assign(COLOR_NAMES, COLOR_EN); Object.assign(SIZE_NAMES, SIZE_EN);
  Object.assign(HABITAT_NAMES, HABITAT_EN); Object.assign(BEAK_NAMES, BEAK_EN); Object.assign(BEHAVIOR_NAMES, BEHAVIOR_EN);
  Object.assign(SEASON_NAMES, SEASON_EN); Object.assign(VOICE_TYPES, VOICE_EN);
  ROUTES.forEach(r => {
    const e = ROUTES_EN[r.id]; if (!e) return;
    const { stops, ...rest } = e; Object.assign(r, rest);
    if (stops) r.stops.forEach((s, i) => { if (stops[i]) Object.assign(s, stops[i]); });
  });
  for (const k in PROGRAMS_EN) PROGRAMS[k].forEach((d, i) => { if (PROGRAMS_EN[k][i]) Object.assign(d, PROGRAMS_EN[k][i]); });
  for (const k in KINDS_EN) PLACE_KINDS[k].name = KINDS_EN[k];
  Object.assign(LODGING_TYPES, LODGING_EN);
  PLACES.forEach(p => { const e = PLACES_EN[p.id]; if (e) { p.name = e[0]; p.desc = e[1]; } p.aimag = AIMAG_EN[p.aimag] || p.aimag; });
  if (typeof BIRDS_EN !== "undefined") BIRDS.forEach(b => {
    const e = BIRDS_EN[b.id]; if (!e) return;
    const mnName = b.name; Object.assign(b, e); b.en = mnName;
  });
})();
