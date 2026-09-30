/* Contenu français — appliqué par-dessus les données (anglais puis mongol) quand LANG === "fr" */
(function () {
  if (typeof LANG === "undefined" || LANG !== "fr") return;

  const REGIONS_FR = {
    west:    { name: "Mongolie occidentale", desc: "Altaï mongol et dépression des Grands Lacs (lacs Uvs, Khar Us et Achit)" },
    khangai: { name: "Khangaï et Khövsgöl", desc: "Monts Khangaï, lac Khövsgöl, vallée de l’Orkhon et lac Terkhiin Tsagaan" },
    north:   { name: "Khentii et Selenge", desc: "Monts Khentii, steppe boisée, rivières Onon, Tuul et Khurkh" },
    central: { name: "Steppe centrale", desc: "Steppe autour d’Oulan-Bator, Hustai, nord du Dundgovi" },
    east:    { name: "Steppe orientale", desc: "Vastes plaines du Dornod et du Sükhbaatar, lac Buir, Mongol Daguur" },
    gobi:    { name: "Gobi", desc: "Altaï du Gobi, vallée des Lacs, Ömnögovi, Dornogovi" }
  };
  const HOTSPOTS_FR = {
    ulaanbaatar: "Oulan-Bator", hustai: "Parc national de Hustai", terelj: "Gorkhi-Terelj", khuvsgul: "Lac Khövsgöl",
    ugii: "Lac Ögii", terkh: "Lac Terkhiin Tsagaan", orkhon: "Vallée de l’Orkhon", kharus: "Lac Khar Us", uvs: "Lac Uvs",
    achit: "Lac Achit", ulgii: "Ölgii", tavanbogd: "Altaï Tavan Bogd", yoliin: "Yolyn Am (Gobi Gurvan Saikhan)",
    ikhnart: "Réserve naturelle d’Ikh Nart", boontsagaan: "Lac Böön Tsagaan", orog: "Lac Orog", taatsin: "Lac Taatsiin Tsagaan",
    ganga: "Lac Ganga (Dariganga)", buir: "Lac Buir", daguur: "Mongol Daguur (rivière Ulz)", khurkh: "Vallée de Khurkh-Khüiten", onon: "Onon-Balj",
    amarbayasgalant: "Amarbayasgalant, vallée de l’Iven", murun: "Mörön, rivière Delger Mörön", bayanzag: "Bayanzag", khongor: "Khongoryn Els"
  };
  const GROUPS_FR = { raptor: "Rapaces", owl: "Rapaces nocturnes", crane: "Grues", stork: "Cigognes", heron: "Hérons et ibis", waterfowl: "Cygnes et oies", duck: "Canards", waterbird: "Grèbes, pélicans et autres oiseaux d’eau", gull: "Mouettes, goélands et sternes", wader: "Limicoles", gamebird: "Gallinacés et gangas", nearpass: "Pigeons, coucous et apparentés", woodpecker: "Pics", lark: "Alouettes, pipits et bergeronnettes", crow: "Corvidés, hirondelles et pies-grièches", thrush: "Grives, traquets et gobemouches", warbler: "Fauvettes, pouillots et mésanges", finch: "Fringilles, bruants et moineaux", small: "Petits oiseaux" };
  const COLOR_FR = { black: "Noir", white: "Blanc", gray: "Gris", brown: "Brun", buff: "Chamois", rufous: "Roux / orangé", yellow: "Jaune", red: "Rouge" };
  const SIZE_FR = {
    small: "Petit (du moineau au pigeon, jusqu’à 35 cm)",
    medium: "Moyen (de la corneille au canard, 35–75 cm)",
    large: "Grand (de l’oie à l’aigle, 75–110 cm)",
    xlarge: "Très grand (cygne, grue, vautour ; plus de 110 cm)"
  };
  const HABITAT_FR = { mountain: "Montagnes, falaises", steppe: "Steppe", desert: "Gobi, désert", water: "Lacs, rivières, marais", forest: "Forêts, bois", settlement: "Villes, quartiers de yourtes" };
  const BEAK_FR = {
    hooked: "Bec crochu de rapace", long: "Bec long et droit", flat: "Bec large et plat (type canard)", pouch: "Bec long avec poche gulaire",
    gull: "Bec moyen à pointe légèrement crochue", short: "Bec court et épais", curved: "Bec long, fin et arqué vers le bas"
  };
  const BEHAVIOR_FR = { soar: "Planait en cercles", swim: "Nageait sur l’eau", walk: "Marchait ou se nourrissait au sol", perch: "Perché sur un rocher, un poteau ou une cime", night: "Vu la nuit ou au crépuscule" };
  const SEASON_FR = { resident: "Toute l’année (sédentaire)", summer: "Été (avril–sept.)", passage: "Migration de printemps et d’automne", winter: "Hiver (nov.–mars)" };
  const VOICE_FR = {
    trumpet: { name: "Trompetant", desc: "Cris forts portant loin, en trompette ou flûtés : « krrroo », « houk »" },
    honk:    { name: "Cacardant", desc: "Cris d’oie ou de canard : « ga-ga », « aang », « honk »" },
    screech: { name: "Cris perçants", desc: "Cris aigus et forts : « kii-kii », « kek-kek », « piii-eu »" },
    whistle: { name: "Sifflant", desc: "Sifflements fins et chevrotants" },
    hoot:    { name: "Hululant « ou-hou »", desc: "« ouhou » doux et grave, ou « hou-hou-hou » répété" },
    song:    { name: "Chant mélodieux", desc: "Chant long et varié, riche en imitations" },
    croak:   { name: "Croassant, grognant", desc: "Sons graves, rauques, venant de la gorge" },
    laugh:   { name: "Riant, miaulant", desc: "Cris rieurs de mouette : « ka-ka-ka », « kiaou »" },
    silent:  { name: "Presque silencieux", desc: "Généralement muet ; simples sifflements ou claquements de bec au nid" }
  };

  const ROUTES_FR = {
    "ub-short": {
      name: "Court séjour autour d’Oulan-Bator", days: "1–2 jours", distance: "≈ 320 km", season: "mai–août", level: "Facile",
      transport: "Voiture ; route goudronnée jusqu’à Hustai, sauf les 13 derniers km de piste",
      stops: [
        { day: "Jour 1, matin", note: "Berges de la Tuul en bordure de ville — Milans noirs en été, Huppes près des quartiers de yourtes et Tadornes casarcas le long de la rivière." },
        { day: "Jour 1, après-midi", note: "Forêt, rochers et vallée de la Terelj : Cigogne noire, Vautour moine, Buse de Chine et petits oiseaux de la steppe boisée. Au crépuscule, guettez le « ouhou » du Hibou grand-duc." },
        { day: "Jour 2", note: "Parc national de Hustai — outre les chevaux de Przewalski, cherchez les rapaces de steppe (Faucon sacre, Buse de Chine, vautours), la Grue demoiselle et l’Alouette de Mongolie." }
      ],
      intro: "Idéal pour les visiteurs pressés et les débutants. À 1–2 heures de la capitale, il couvre trois milieux — forêt, rochers et steppe — avec une dizaine d’espèces du guide possibles.",
      tips: ["Les oiseaux sont les plus actifs dans les 3 heures après le lever du soleil et les 2 heures avant son coucher.", "L’entrée à Hustai est payante (aire protégée).", "Emportez des jumelles 8×42, de l’eau, un chapeau et de la crème solaire."]
    },
    "central-lakes": {
      name: "Mongolie centrale et lacs du Khangaï", days: "5–7 jours", distance: "≈ 1 500 km", season: "mai–sept.", level: "Moyen",
      transport: "4×4 ; surtout goudronné, pistes autour de la cascade de l’Orkhon et du lac Terkhiin Tsagaan",
      stops: [
        { day: "Jour 1", note: "Départ. Surveillez les poteaux au bord de la route : Buses de Chine et Faucons sacres." },
        { day: "Jour 1", note: "Rapaces de steppe, Grue demoiselle et Alouette de Mongolie." },
        { day: "Jour 2", note: "Lac Ögii — un paradis des oiseaux d’eau : Tadorne casarca, Cygne chanteur, Grue demoiselle, mouettes et canards. Zone humide inscrite à la convention de Ramsar." },
        { day: "Jours 3–4", note: "Vallée de l’Orkhon, Kharkhorin et monastère d’Erdene Zuu (Tadornes casarcas), cascade de l’Orkhon (Cigogne noire, vautours, parfois Gypaète barbu)." },
        { day: "Jour 5", note: "Lac Terkhiin Tsagaan et volcan Khorgo — Cygne chanteur, Tadorne casarca, Grue demoiselle, et Hibou grand-duc dans les rochers." }
      ],
      intro: "L’itinéraire le plus prisé, qui associe le patrimoine historique de la Mongolie (Kharkhorin, Erdene Zuu) à des lacs riches en oiseaux d’eau. Un voyage peut totaliser 60 à 100 espèces.",
      tips: ["Au lac Ögii, observez depuis la rive ouest le soir pour avoir la lumière dans le dos.", "Ne vous approchez pas en voiture des oiseaux nichant sur les rives.", "En juillet–août, la pluie transforme les pistes en boue — prévoyez un jour de marge."]
    },
    "gobi": {
      name: "Le Gobi et la vallée des Lacs", days: "7–9 jours", distance: "≈ 1 900 km", season: "mai–juin, sept.", level: "Difficile",
      transport: "4×4 avec chauffeur expérimenté ; surtout des pistes — emportez carburant et eau de réserve",
      stops: [
        { day: "Jour 1", note: "Départ vers le sud, direction Dundgovi." },
        { day: "Jours 1–2", note: "Ikh Nart — falaises où nichent les Vautours moines, Faucon sacre, Hibou grand-duc, ainsi qu’argalis et bouquetins. Observez les nids de vautours de loin." },
        { day: "Jours 3–4", note: "Gobi Gurvan Saikhan, Yolyn Am — Gypaète barbu, Aigle royal, Tétraogalle de l’Altaï (en altitude) et petits oiseaux rupestres." },
        { day: "Jour 5", note: "Lac Orog — lac salé de la vallée des Lacs : Mouette relique, Tadorne casarca et nombreux limicoles en migration." },
        { day: "Jour 6", note: "Lac Böön Tsagaan — Tadorne casarca, Cygne chanteur, Mouette relique, Grue demoiselle ; des milliers d’oiseaux au pic de migration." },
        { day: "Jour 7", note: "Lac Taatsiin Tsagaan — colonie de Mouettes reliques (les années humides)." }
      ],
      intro: "Un itinéraire d’aventure à la recherche des rapaces nicheurs des falaises et de la rare Mouette relique des lacs du Gobi. L’essentiel de la liste « à voir absolument » en Mongolie se trouve sur ce parcours.",
      tips: ["Les colonies de Mouettes reliques changent de lac d’une année à l’autre — renseignez-vous auprès d’ornithologues locaux avant de partir.", "Dans le Gobi, la chaleur atteint 35 °C en journée — observez tôt le matin et en fin de journée.", "Restez à au moins 200 m des colonies et des nids."]
    },
    "east-cranes": {
      name: "Steppe orientale et pays des grues", days: "8–10 jours", distance: "≈ 2 400 km", season: "mai–juin, août–sept.", level: "Difficile",
      transport: "4×4 ; surtout des pistes au-delà du Khentii, permis de zone frontalière requis",
      stops: [
        { day: "Jour 1", note: "Départ vers l’est, direction Khentii." },
        { day: "Jours 2–3", note: "Vallée de Khurkh-Khüiten — centre de recherche sur les grues : Grue à cou blanc, Grue demoiselle, Oie cygnoïde et Grande Outarde." },
        { day: "Jour 4", note: "Onon-Balj et Dadal (lieu de naissance de Gengis Khan) — Cigogne noire, Grue à cou blanc, Oie cygnoïde." },
        { day: "Jours 5–6", note: "Aire strictement protégée de Mongol Daguur, rivière Ulz — Grue à cou blanc, Grue de Sibérie en migration, Grande Outarde." },
        { day: "Jour 7", note: "Lac Buir — Oie cygnoïde, Cygne chanteur, nombreux canards et mouettes." },
        { day: "Jours 8–9", note: "Dariganga et lac Ganga — bandes automnales de Cygnes chanteurs, Alouette de Mongolie, Faucon sacre, Grue demoiselle." }
      ],
      intro: "Une occasion rare d’observer en un seul voyage les grues nicheuses et migratrices de Mongolie (à cou blanc, demoiselle, de Sibérie, moine), dans la prairie tempérée la mieux préservée du monde.",
      tips: ["Obtenez un permis de zone frontalière avant d’entrer à Mongol Daguur et dans les zones frontalières.", "Les Grues de Sibérie ne passent qu’à la mi-mai et en septembre — planifiez en conséquence.", "Les Grandes Outardes sont très farouches — une longue-vue 60× est nécessaire."]
    },
    "west-altai": {
      name: "L’Altaï et la dépression des Grands Lacs", days: "8–10 jours", distance: "≈ 1 000 km par la route + vols", season: "juin–août ; festival de l’Aigle royal début octobre", level: "Difficile",
      transport: "Vol Oulan-Bator–Ölgii, 4×4 par voie terrestre, vol retour depuis Khovd",
      stops: [
        { day: "Jours 1–2", note: "Ölgii — visite d’une famille kazakhe de fauconniers et de leurs aigles dressés." },
        { day: "Jours 3–4", note: "Altaï Tavan Bogd — Gypaète barbu, Aigle royal, Tétraogalle de l’Altaï et oiseaux de haute montagne." },
        { day: "Jour 5", note: "Lac Achit — Pélican frisé, Cygne chanteur, Tadorne casarca, mouettes." },
        { day: "Jours 6–7", note: "Lac Uvs (patrimoine mondial de l’UNESCO) — oiseaux d’eau, des milliers d’oiseaux en migration." },
        { day: "Jours 8–9", note: "Lac Khar Us — Pélicans frisés dans les roselières, Cygne chanteur, Tadorne casarca, canards rares." }
      ],
      intro: "Culture kazakhe de la chasse à l’aigle, sommets enneigés de l’Altaï et rare Pélican frisé des Grands Lacs. Inoubliable s’il coïncide avec le festival de l’Aigle royal en automne.",
      tips: ["L’Altaï Tavan Bogd se trouve en zone frontalière : un permis est obligatoire.", "En haute montagne, les nuits descendent à 0 °C — prévoyez des vêtements chauds.", "N’approchez pas les colonies de pélicans en bateau."]
    },
    "khuvsgul-taiga": {
      name: "Le lac Khövsgöl et les forêts du Nord", days: "7–8 jours", distance: "≈ 1 700 km", season: "juin–août", level: "Moyen",
      transport: "4×4 ; routes surtout goudronnées, pistes vers Amarbayasgalant et au-delà de Khatgal. On peut raccourcir en prenant l’avion jusqu’à Mörön",
      stops: [
        { day: "Jour 1", note: "Départ. Cap au nord vers la steppe boisée de la Selenge." },
        { day: "Jours 1–2", note: "Vallée de l’Iven et forêt autour du monastère : Cigogne noire, Tétras lyre, Pic épeiche, petits oiseaux forestiers." },
        { day: "Jour 3", note: "Rives de la Delger Mörön : Tadorne casarca, Oie à tête barrée, oiseaux des saulaies." },
        { day: "Jours 4–6", note: "Lac Khövsgöl et taïga : Cygne chanteur, Garrot à œil d’or, Harle bièvre, Grand Tétras, Mésangeai imitateur, Pic noir." }
      ],
      intro: "À la découverte des oiseaux forestiers sibériens autour du lac Khövsgöl, la « Perle bleue » de la Mongolie, et de sa taïga — en passant par le monastère d’Amarbayasgalant et la steppe boisée de la Selenge.",
      tips: ["En juillet, Khatgal et les rives du lac sont très fréquentés — réservez l’hébergement.", "Moustiques et tiques abondent dans la taïga — prévoyez un répulsif et des manches longues.", "L’entrée du parc national du Khövsgöl est payante."]
    },
    "south-gobi-fly": {
      name: "Court séjour dans le Gobi du Sud (avec vols)", days: "4–5 jours", distance: "≈ 600 km par la route + vols", season: "mai–juin, septembre", level: "Moyen",
      transport: "Vol Oulan-Bator–Dalanzadgad (≈ 1 h 30), 4×4 sur place, surtout des pistes",
      stops: [
        { day: "Jours 1–2", note: "Yolyn Am : Gypaète barbu, Aigle royal, Vautour moine et Tétraogalle de l’Altaï sur les falaises ; Tichodrome échelette sur les parois." },
        { day: "Jour 3", note: "Khongoryn Els : saxaouls et saules au pied des dunes — Moineau des saxaouls, Traquet du désert, Syrrhapte paradoxal." },
        { day: "Jour 4", note: "Bayanzag : forêt de saxaouls et falaises rouges — Podoce de Henderson, Moineau des saxaouls, Roselin de Mongolie." }
      ],
      intro: "Pour qui dispose de peu de temps mais veut voir l’essentiel du Gobi et ses oiseaux emblématiques. L’avion évite la longue route et permet de couvrir Yolyn Am, Khongoryn Els et Bayanzag.",
      tips: ["Les bagages sont limités en avion — gardez télescope et jumelles en cabine.", "Le Gobi est chaud le jour et froid la nuit — prévoyez plusieurs couches.", "Cherchez le Podoce de Henderson tôt le matin dans les saxaouls, à l’écoute de son cri."]
    },
    "winter-ub": {
      name: "Oiseaux d’hiver autour d’Oulan-Bator", days: "1–3 jours", distance: "≈ 320 km", season: "novembre–mars", level: "Facile",
      transport: "Voiture ; routes goudronnées. Un 4×4 est préférable après la neige",
      stops: [
        { day: "Jour 1", note: "Portions non gelées de la Tuul et pied du mont Bogd Khan : Garrot à œil d’or, Harle bièvre, Jaseur boréal, Durbec des sapins, Pic épeiche." },
        { day: "Jour 2", note: "Forêt et vallée de Terelj : Tétras lyre, Bouvreuil pivoine, Roselin rose, Mésange boréale, bandes de Sizerins flammés." },
        { day: "Jour 3", note: "Steppe de Hustai : Buse pattue, Vautour moine, Faucon sacre, bandes de Bruants des neiges." }
      ],
      intro: "L’observation des oiseaux se pratique aussi par grand froid ! Hivernants venus du nord — Jaseur boréal, Durbec des sapins, Sizerin flammé, Bruant des neiges — et espèces sédentaires, tout près d’Oulan-Bator.",
      tips: ["Jusqu’à −30 °C — bottes chaudes, gants et bonnet indispensables. Les batteries se vident vite.", "Les jours sont courts — observez entre 10 h et 16 h.", "Ne marchez pas sur la glace près des eaux libres de la Tuul."]
    }
  };

  const PROGRAMS_FR = {
    "ub-short": [
      { title: "Oulan-Bator → Gorkhi-Terelj", drive: "70 km · 1 h 30", stay: "Camp touristique / lodge de yourtes à Terelj",
        am: "06:00, observation à l’aube au bord de la Tuul (Zaisan, pont de l’aéroport) : Tadorne casarca, Milan noir, Huppe fasciée.",
        pm: "Balade dans la vallée de Terelj autour du rocher de la Tortue : Cigogne noire, vautours, Buse de Chine, petits oiseaux de la steppe boisée.",
        ev: "Au coucher du soleil, guettez le Hibou grand-duc près des rochers." },
      { title: "Terelj → Hustai → Oulan-Bator", drive: "230 km · 4 h", stay: "—",
        am: "Départ matinal pour arriver à Hustai vers 9 h. Dans la steppe : Faucon sacre, Buse de Chine, Grue demoiselle, Alouette de Mongolie.",
        pm: "Chevaux de Przewalski et site de nourrissage des vautours dans la vallée de Hustai ; déjeuner au centre de Hustai.",
        ev: "Retour à Oulan-Bator vers 18 h." }
    ],
    "central-lakes": [
      { title: "Oulan-Bator → Hustai", drive: "100 km · 2 h", stay: "Camp touristique de Hustai",
        am: "Buses de Chine et Faucons sacres sur les poteaux ; steppe d’Emeelt.", pm: "Rapaces de steppe et Grues demoiselles à Hustai.", ev: "Chevaux de Przewalski ; écoutez le Hibou grand-duc." },
      { title: "Hustai → lac Ögii", drive: "250 km · 4 h", stay: "Camp de yourtes au lac Ögii",
        am: "Départ matinal par les steppes d’Erdenesant et de Bayan.", pm: "Rive est du lac Ögii : Tadorne casarca, Cygne chanteur, Grue demoiselle, canards, mouettes.", ev: "Vols d’oiseaux d’eau au coucher du soleil." },
      { title: "Lac Ögii → Kharkhorin", drive: "100 km · 2 h", stay: "Kharkhorin",
        am: "Observation à l’aube sur la rive ouest du lac Ögii.", pm: "Monastère d’Erdene Zuu (Tadornes casarcas sur les murs), berges de l’Orkhon.", ev: "Steppe autour de Kharkhorin — Buse de Chine, Faucon sacre." },
      { title: "Kharkhorin → cascade de l’Orkhon", drive: "120 km · 3–4 h (piste)", stay: "Camp de yourtes près de la cascade",
        am: "Remontée de la vallée de l’Orkhon : Buse de Chine, vautours, Huppe fasciée.", pm: "Gorge de la cascade : Cigogne noire, oiseaux rupestres, parfois Gypaète barbu.", ev: "Vautours planant le long de la gorge." },
      { title: "Cascade de l’Orkhon → lac Terkhiin Tsagaan", drive: "250 km · 5–6 h", stay: "Camp au bord du lac",
        am: "Par Tsenkher et Tariat.", pm: "Cratère du volcan Khorgo et champs de lave : Hibou grand-duc, oiseaux rupestres.", ev: "Rive du lac : Cygne chanteur, Tadorne casarca." },
      { title: "Lac Terkhiin Tsagaan — journée complète", drive: "—", stay: "Lac Terkhiin Tsagaan",
        am: "Marais de la rive nord : Cygne chanteur, Grue demoiselle.", pm: "Tour du lac à cheval ou à pied.", ev: "Mise en commun de la liste du jour." },
      { title: "Lac Terkhiin Tsagaan → Oulan-Bator", drive: "670 km · 10–11 h", stay: "—",
        am: "Départ matinal.", pm: "Par Tsetserleg et Khoshoo Tsaidam (Buses de Chine sur les stèles).", ev: "Arrivée à Oulan-Bator le soir." }
    ],
    "gobi": [
      { title: "Oulan-Bator → Ikh Nart", drive: "300 km · 5 h", stay: "Camp de terrain / tente à Ikh Nart",
        am: "Départ matinal vers Choir.", pm: "Falaises d’Ikh Nart : vautours, Faucon sacre, argalis.", ev: "Chant du Hibou grand-duc au crépuscule." },
      { title: "Ikh Nart — journée complète", drive: "Déplacements locaux", stay: "Ikh Nart",
        am: "Observation à distance des falaises où nichent les vautours.", pm: "Recherche des Hiboux grands-ducs dans les fissures des rochers (avec un guide).", ev: "Bouquetins et argalis au pâturage." },
      { title: "Ikh Nart → Dalanzadgad → Yolyn Am", drive: "420 km · 7–8 h", stay: "Camp de yourtes à Yolyn Am",
        am: "Longue route avec des oiseaux du Gobi en chemin.", pm: "Plein de carburant et d’eau à Dalanzadgad.", ev: "Tente ou yourte à l’entrée de Yolyn Am." },
      { title: "Yolyn Am — journée complète", drive: "Randonnée de 8–10 km", stay: "Yolyn Am",
        am: "Marche dans la gorge : Gypaète barbu et Aigle royal au-dessus des falaises.", pm: "Recherche du Tétraogalle de l’Altaï sur les hauteurs (à l’oreille).", ev: "Hiboux grands-ducs dans les rochers." },
      { title: "Yolyn Am → lac Orog", drive: "350 km · 7 h", stay: "Tente au lac Orog",
        am: "Par Bayanlig et Bogd.", pm: "Lac Orog : Mouette relique, Tadorne casarca, limicoles.", ev: "Coucher de soleil au pied du mont Ikh Bogd." },
      { title: "Lac Orog → lac Böön Tsagaan", drive: "150 km · 3 h", stay: "Lac Böön Tsagaan",
        am: "Observation à l’aube au lac Orog.", pm: "Lac Böön Tsagaan : Cygne chanteur, Tadorne casarca, Mouette relique, Grue demoiselle.", ev: "Arrivée des bandes migratrices au dortoir." },
      { title: "Böön Tsagaan → lac Taatsiin Tsagaan", drive: "200 km · 4 h", stay: "Lac Taatsiin Tsagaan",
        am: "Delta de la rivière Baidrag.", pm: "Observation à la longue-vue de la colonie de Mouettes reliques.", ev: "Le vacarme de la colonie." },
      { title: "Taatsiin Tsagaan → Arvaikheer → Oulan-Bator", drive: "~650 km · 10–11 h", stay: "—",
        am: "Départ matinal.", pm: "Route goudronnée depuis Arvaikheer.", ev: "Arrivée à Oulan-Bator." }
    ],
    "east-cranes": [
      { title: "Oulan-Bator → Öndörkhaan", drive: "330 km · 5 h", stay: "Öndörkhaan",
        am: "Vers l’est par la route goudronnée.", pm: "Vallée du Kherlen : Tadorne casarca, Grue demoiselle.", ev: "Steppe aux abords de la ville." },
      { title: "Öndörkhaan → vallée de Khurkh-Khüiten", drive: "200 km · 5 h", stay: "Camp de recherche de Khurkh / tente",
        am: "Vers Binder.", pm: "Marais de la rivière Khurkh : Grue à cou blanc, Oie cygnoïde.", ev: "Duos des couples de grues." },
      { title: "Vallée de Khurkh-Khüiten — journée complète", drive: "Local", stay: "Khurkh",
        am: "Découverte des travaux de baguage des grues (si possible).", pm: "Recherche des Grandes Outardes à la longue-vue dans la steppe.", ev: "Oies cygnoïdes sur la rive du lac." },
      { title: "Khurkh → Dadal (Onon-Balj)", drive: "150 km · 4 h", stay: "Camp de yourtes de Dadal",
        am: "Vallée de l’Onon.", pm: "Rivière Balj : Cigogne noire, Grue à cou blanc.", ev: "Deluun Boldog (lieu de naissance de Gengis Khan)." },
      { title: "Dadal → Mongol Daguur", drive: "350 km · 7–8 h", stay: "Chuluunkhoroot / tente",
        am: "Départ matinal ; contrôle du permis de zone frontalière.", pm: "Marais de la rivière Ulz.", ev: "Steppe de Daguur : Grande Outarde." },
      { title: "Mongol Daguur — journée complète", drive: "Local", stay: "Mongol Daguur",
        am: "Grue à cou blanc ; Grue de Sibérie en migration.", pm: "Limicoles et canards sur les lacs salés.", ev: "Parade de la Grande Outarde (en mai)." },
      { title: "Mongol Daguur → lac Buir", drive: "350 km · 6 h", stay: "Rive du lac Buir",
        am: "Par Choibalsan.", pm: "Lac Buir : Oie cygnoïde, Cygne chanteur, canards.", ev: "Coucher de soleil sur la rive ouest." },
      { title: "Lac Buir → Dariganga", drive: "500 km · 9 h", stay: "Dariganga",
        am: "Longue traversée des plaines du Dornod : gazelles de Mongolie, Faucon sacre.", pm: "Dariganga et le mont Shiliin Bogd.", ev: "Rive du lac Ganga." },
      { title: "Lac Ganga → Baruun-Urt", drive: "180 km · 3 h", stay: "Baruun-Urt",
        am: "Lac Ganga : Cygnes chanteurs (nombreux en automne), Grue demoiselle.", pm: "Alouettes de Mongolie autour des dunes.", ev: "Repos." },
      { title: "Baruun-Urt → Oulan-Bator", drive: "560 km · 8 h", stay: "—",
        am: "Route goudronnée.", pm: "Buses de Chine et Faucons sacres dans la steppe.", ev: "Arrivée à Oulan-Bator." }
    ],
    "west-altai": [
      { title: "Oulan-Bator → Ölgii (vol)", drive: "Vol ≈ 3 h 30", stay: "Ölgii",
        am: "Vol du matin.", pm: "Berges de la rivière Khovd autour d’Ölgii.", ev: "Cuisine et culture kazakhes." },
      { title: "Ölgii — famille de fauconniers", drive: "80 km", stay: "Chez une famille de fauconniers",
        am: "Vers le district de Sagsai.", pm: "Rencontre avec des aigles dressés ; découverte de la tradition de la chasse à l’aigle.", ev: "Aigles royaux sauvages sur les versants." },
      { title: "Ölgii → Altaï Tavan Bogd", drive: "180 km · 6–7 h", stay: "Lac Khoton / tente à Tavan Bogd",
        am: "Par Tsagaannuur.", pm: "Lacs Khoton et Khurgan.", ev: "Aigles de haute montagne et Gypaète barbu." },
      { title: "Altaï Tavan Bogd — journée complète", drive: "À pied / à cheval", stay: "Tavan Bogd",
        am: "Écoute des Tétraogalles de l’Altaï (06:00).", pm: "Marche vers le glacier Potanine : Gypaète barbu, Aigle royal.", ev: "Observation des étoiles." },
      { title: "Tavan Bogd → lac Achit", drive: "280 km · 7 h", stay: "Rive du lac Achit",
        am: "Retour par Ölgii.", pm: "Lac Achit : Pélican frisé, Cygne chanteur, Tadorne casarca.", ev: "Coucher de soleil au bord du lac." },
      { title: "Lac Achit → lac Uvs", drive: "150 km · 3 h", stay: "Ulaangom / lac Uvs",
        am: "Observation à l’aube au lac Achit.", pm: "Rive sud du lac Uvs.", ev: "Bandes d’oiseaux d’eau." },
      { title: "Lac Uvs — journée complète", drive: "Local", stay: "Lac Uvs",
        am: "Delta de la rivière Tes.", pm: "Canards, mouettes et limicoles le long de la rive.", ev: "Repos." },
      { title: "Uvs → lac Khar Us", drive: "300 km · 6 h", stay: "Camp du lac Khar Us",
        am: "En longeant le lac Khyargas.", pm: "Roselières du Khar Us : Pélican frisé, Cygne chanteur.", ev: "Chants d’oiseaux dans les roseaux." },
      { title: "Lac Khar Us → Khovd → Oulan-Bator", drive: "90 km + vol", stay: "—",
        am: "Dernière observation au lac Khar Us.", pm: "Vol depuis Khovd.", ev: "Arrivée à Oulan-Bator." }
    ],
    "khuvsgul-taiga": [
      { title: "Oulan-Bator → Amarbayasgalant", drive: "360 km · 6–7 h", stay: "Camp de yourtes près du monastère",
        am: "Route goudronnée vers Darkhan ; Buse de Chine et Faucon sacre en chemin.", pm: "Les 35 derniers km en piste jusqu’à la vallée de l’Iven.", ev: "Tétras lyre et Pic épeiche en lisière." },
      { title: "Amarbayasgalant → Erdenet → Bulgan", drive: "250 km · 5 h", stay: "Ville de Bulgan",
        am: "Visite du monastère ; observation matinale sur l’Iven : Cigogne noire.", pm: "Par Erdenet jusqu’à Bulgan.", ev: "Oiseaux des lisières de Bulgan." },
      { title: "Bulgan → Mörön", drive: "350 km · 6 h", stay: "Ville de Mörön",
        am: "Arrêt possible au volcan Uran Togoo.", pm: "Rives de la Delger Mörön : Tadorne casarca, Oie à tête barrée.", ev: "Nuit à Mörön." },
      { title: "Mörön → Khatgal, lac Khövsgöl", drive: "100 km · 2 h", stay: "Camp de yourtes sur la rive ouest du Khövsgöl",
        am: "Route goudronnée jusqu’à Khatgal.", pm: "Rive sud et source de l’Egiin : Cygne chanteur, Garrot à œil d’or, Harle bièvre.", ev: "Hibou grand-duc en lisière de taïga." },
      { title: "Lac Khövsgöl — journée complète", drive: "À pied / à cheval", stay: "Lac Khövsgöl",
        am: "6 h, marche en taïga : Grand Tétras, Gélinotte des bois, Mésangeai imitateur, Pic noir.", pm: "Le long de la rive : Cincle plongeur sur les torrents.", ev: "Coucher de soleil sur le lac." },
      { title: "Lac Khövsgöl → Mörön", drive: "100 km · 2 h", stay: "Ville de Mörön",
        am: "Dernière observation matinale au lac.", pm: "Retour à Mörön (ou vol Mörön–Oulan-Bator).", ev: "Repos." },
      { title: "Mörön → Oulan-Bator", drive: "670 km · 11 h", stay: "—",
        am: "Départ matinal.", pm: "Par Bulgan et Erdenet.", ev: "Arrivée à Oulan-Bator le soir." }
    ],
    "south-gobi-fly": [
      { title: "Oulan-Bator → Dalanzadgad → Yolyn Am", drive: "Vol 1 h 30 + 60 km", stay: "Camp de yourtes près de Yolyn Am",
        am: "Vol du matin.", pm: "Entrée du canyon de Yolyn Am : Gypaète barbu et Vautour moine au-dessus des crêtes.", ev: "Hibou grand-duc sur les rochers." },
      { title: "Yolyn Am — journée complète", drive: "Marche de 8–10 km", stay: "Yolyn Am",
        am: "6 h, montée dans le canyon : Tichodrome échelette, Crave à bec rouge.", pm: "Recherche du Tétraogalle de l’Altaï sur les pentes (à l’oreille).", ev: "Aigle royal au-dessus du canyon." },
      { title: "Yolyn Am → Khongoryn Els", drive: "180 km · 4 h", stay: "Camp de Khongoryn Els / famille de chameliers",
        am: "Plaines du Gobi : Alouette hausse-col, Syrrhapte paradoxal.", pm: "Saxaouls et saules au pied des dunes : Moineau des saxaouls, Traquet du désert.", ev: "Coucher de soleil depuis les dunes." },
      { title: "Khongoryn Els → Bayanzag", drive: "200 km · 4–5 h", stay: "Camp de yourtes de Bayanzag",
        am: "Départ matinal.", pm: "Forêt de saxaouls : Podoce de Henderson, Roselin de Mongolie.", ev: "Lumière du couchant sur les falaises rouges." },
      { title: "Bayanzag → Dalanzadgad → Oulan-Bator", drive: "100 km + vol", stay: "—",
        am: "Dernière observation matinale dans les saxaouls.", pm: "Vol depuis Dalanzadgad.", ev: "Arrivée à Oulan-Bator." }
    ],
    "winter-ub": [
      { title: "Oulan-Bator — la Tuul et le mont Bogd Khan", drive: "En ville · 40 km", stay: "Oulan-Bator",
        am: "10 h, eaux libres de la Tuul : Garrot à œil d’or, Harle bièvre.", pm: "Forêt au pied du Bogd Khan (Zaisan, Jargalant) : Durbec des sapins, Jaseur boréal, Pic épeiche.", ev: "La nuit tombe tôt — retour vers 17 h." },
      { title: "Oulan-Bator → Gorkhi-Terelj", drive: "70 km · 1 h 30", stay: "Hébergement chauffé / hôtel à Terelj",
        am: "Lisière de Terelj : Tétras lyre, Bouvreuil pivoine, Roselin rose.", pm: "Vallée : bandes de Sizerins flammés, Mésange boréale.", ev: "Hibou grand-duc au crépuscule." },
      { title: "Terelj → Hustai → Oulan-Bator", drive: "230 km · 4 h", stay: "—",
        am: "Steppe de Hustai : Buse pattue, bandes de Bruants des neiges.", pm: "Vautour moine, Faucon sacre, chevaux de Przewalski.", ev: "Retour à Oulan-Bator." }
    ]
  };

  const KINDS_FR = { lodging: "Hébergement", culture: "Histoire et culture", nature: "Site naturel" };
  const LODGING_FR = { hotel: "Hôtel", guesthouse: "Maison d’hôtes, auberge", camp: "Camp de yourtes touristique", homestay: "Séjour chez une famille nomade" };
  const AIMAG_FR = {
    "Улаанбаатар": "Oulan-Bator", "Төв": "Töv", "Өвөрхангай": "Övörkhangai", "Архангай": "Arkhangai", "Хөвсгөл": "Khövsgöl",
    "Өмнөговь": "Ömnögovi", "Дундговь": "Dundgovi", "Дорноговь": "Dornogovi", "Хэнтий": "Khentii", "Дорнод": "Dornod",
    "Сүхбаатар": "Sükhbaatar", "Баян-Өлгий": "Bayan-Ölgii", "Увс": "Uvs", "Ховд": "Khovd", "Баянхонгор": "Bayankhongor",
    "Сэлэнгэ": "Selenge", "Завхан": "Zavkhan", "Булган / Өвөрхангай": "Bulgan / Övörkhangai",
    "Орхон": "Orkhon", "Булган": "Bulgan", "Дархан-Уул": "Darkhan-Uul", "Говь-Алтай": "Govi-Altaï"
  };
  const PLACES_FR = {
    "l-ub": ["Oulan-Bator", "De tout, des chaînes hôtelières internationales aux auberges et maisons d’hôtes bon marché. La base principale avant et après un voyage."],
    "l-hustai": ["Camp touristique de Hustai", "Camp de yourtes près de l’entrée du parc national de Hustai — la base la plus proche pour observer chevaux de Przewalski et oiseaux à l’aube et au crépuscule."],
    "l-terelj": ["Camps de Gorkhi-Terelj", "Des dizaines de camps de yourtes, complexes et hôtels dans la vallée de Terelj, à 1 h 30 d’Oulan-Bator."],
    "l-kharkhorin": ["Kharkhorin", "Hôtels et maisons d’hôtes en ville, camps de yourtes aux alentours. Point de départ pour Erdene Zuu et la vallée de l’Orkhon."],
    "l-ugii": ["Camps du lac Ögii", "Plusieurs camps de yourtes sur la rive, ainsi que des séjours chez des familles nomades. Pratique pour observer les oiseaux d’eau à l’aube et au crépuscule."],
    "l-orkhon": ["Camps de la cascade de l’Orkhon", "Camps de yourtes près de la cascade. La piste devient difficile après la pluie."],
    "l-tsetserleg": ["Tsetserleg", "Capitale de l’Arkhangai, avec hôtels et maisons d’hôtes ; étape sur la route du lac Terkhiin Tsagaan."],
    "l-terkh": ["Camps du lac Terkhiin Tsagaan", "Camps de yourtes et familles nomades autour du lac et du volcan Khorgo."],
    "l-khatgal": ["Khatgal et rive du Khövsgöl", "Nombreuses maisons d’hôtes au village de Khatgal et camps de yourtes sur la rive ouest. Réservez pour juillet–août."],
    "l-dalanzadgad": ["Dalanzadgad", "Capitale de l’Ömnögovi, avec des hôtels ; dernière grande étape pour le carburant, la nourriture et l’eau."],
    "l-yol": ["Camps près de Yolyn Am", "Camps de yourtes près de l’entrée du parc national Gobi Gurvan Saikhan."],
    "l-bayanzag": ["Camps de Bayanzag", "Camps de yourtes près des Falaises flamboyantes — les couleurs des roches s’embrasent au coucher du soleil."],
    "l-khongor": ["Camps de Khongoryn Els", "Camps de yourtes et familles de chameliers au pied nord des dunes. Balades à dos de chameau possibles."],
    "l-mandalgovi": ["Mandalgovi", "Capitale du Dundgovi ; étape entre Oulan-Bator et le Gobi."],
    "l-sainshand": ["Sainshand", "Capitale du Dornogovi, accessible en train ; base pour le monastère de Khamar."],
    "l-chinggis": ["Chinggis (Öndörkhaan)", "Capitale du Khentii ; première nuit en direction de l’est."],
    "l-dadal": ["Dadal", "Un district pittoresque de forêts et de lacs, avec camps de yourtes et séjours chez l’habitant."],
    "l-choibalsan": ["Choibalsan", "Capitale du Dornod ; la plus grande ville avant le lac Buir et Mongol Daguur."],
    "l-baruunurt": ["Baruun-Urt", "Capitale du Sükhbaatar ; étape sur la route de Dariganga et du lac Ganga."],
    "l-ulgii": ["Ölgii", "Hôtels et maisons d’hôtes ; les séjours chez des familles kazakhes de fauconniers s’organisent d’ici."],
    "l-ulaangom": ["Ulaangom", "Capitale de l’Uvs, proche des lacs Uvs et Achit."],
    "l-khovd": ["Khovd", "Capitale de la province de Khovd, avec aéroport ; à 1 h 30 du lac Khar Us."],
    "l-bayankhongor": ["Bayankhongor", "Faites le plein de carburant et de vivres avant la vallée des Lacs, où l’on campe généralement au bord des lacs."],
    "c-gandan": ["Monastère de Gandantegchinlen", "Principal monastère bouddhiste de Mongolie. Le temple Megjid Janraisig abrite une statue de 26 m (reconstruite en 1996). Les prières du matin sont ouvertes aux visiteurs."],
    "c-museum": ["Musée national de Mongolie", "Riches collections d’histoire et d’ethnographie mongoles, de l’âge de pierre au XXe siècle."],
    "c-bogdkhan": ["Palais-musée du Bogd Khan", "Palais d’hiver et ensemble de temples du dernier monarque mongol, le 8e Bogd Jebtsundamba (fin XIXe – début XXe siècle)."],
    "c-chinggis": ["Statue équestre de Gengis Khan", "Statue d’acier de 40 m érigée à Tsonjin Boldog en 2008 ; une plate-forme sur la tête du cheval domine la steppe. À 54 km d’Oulan-Bator."],
    "c-manzushir": ["Ruines du monastère de Manzushir", "Ruines d’un monastère fondé en 1733 sur le versant sud du mont Bogd Khan et détruit en 1937. Randonnées en forêt et oiseaux de la steppe boisée."],
    "c-aryabal": ["Temple de méditation d’Aryabal", "Temple accroché à une montagne de Gorkhi-Terelj, accessible par un pont de 108 marches, avec une vue superbe sur la vallée."],
    "c-erdenezuu": ["Monastère d’Erdene Zuu", "Premier grand monastère bouddhiste de Mongolie, fondé en 1586 par Abtai Sain Khan et entouré d’un mur de 108 stupas. Partie du paysage culturel de la vallée de l’Orkhon (UNESCO)."],
    "c-kharkhorum": ["Musée de Karakorum", "Objets issus des fouilles de Karakorum, capitale de l’Empire mongol au XIIIe siècle, et maquette de la ville."],
    "c-khoshootsaidam": ["Monuments de Khoshoo Tsaidam", "Stèles inscrites du VIIIe siècle des Turcs Bilge Khagan et Kül Tegin, avec un musée. Partie du paysage culturel de la vallée de l’Orkhon."],
    "c-amarbayasgalant": ["Monastère d’Amarbayasgalant", "Construit en 1727–1736 en l’honneur d’Öndör Gegeen Zanabazar ; l’un des ensembles monastiques les mieux conservés de Mongolie, dans une vallée de steppe boisée."],
    "c-khamar": ["Monastère de Khamar", "Fondé par le poète et réformateur du XIXe siècle Noyon Khutagt Danzanravjaa. Le lieu de pèlerinage voisin est appelé « Shambhala »."],
    "c-deluun": ["Deluun Boldog", "Monument du district de Dadal marquant le lieu de naissance traditionnel de Gengis Khan."],
    "c-petroglyph": ["Ensembles pétroglyphiques de l’Altaï mongol", "Des milliers de gravures rupestres à Tsagaan Salaa et Baga Oigor, couvrant plus de 12 000 ans (patrimoine mondial de l’UNESCO)."],
    "n-turtle": ["Rocher de la Tortue", "Affleurement granitique en forme de tortue — symbole de Gorkhi-Terelj — parmi les rochers, la forêt et la rivière Terelj."],
    "n-orkhonfalls": ["Cascade de l’Orkhon (Ulaan Tsutgalan)", "Chute d’environ 20 m plongeant dans une gorge volcanique. Cigognes noires et vautours."],
    "n-elsen": ["Elsen Tasarkhai (dunes de Khögnö Tarna)", "Bande de dunes de sable entre steppe boisée et prairie. Balades à dos de chameau et mont Khögnö Khan."],
    "n-taikhar": ["Rocher de Taikhar", "Immense rocher granitique isolé dans la vallée du Tamir, couvert d’inscriptions de nombreuses époques et chargé de légendes."],
    "n-tsenkher": ["Sources chaudes de Tsenkher", "Sources chaudes dans une vallée boisée, avec spa et camps de yourtes."],
    "n-khorgo": ["Volcan Khorgo", "Cratère volcanique éteint et champ de lave sur la rive est du lac Terkhiin Tsagaan."],
    "n-khuvsgul": ["Lac Khövsgöl", "Le lac d’eau douce le plus profond de Mongolie (262 m), la « perle bleue de Mongolie », entouré de taïga et de montagnes."],
    "n-otgontenger": ["Mont Otgontenger", "Le plus haut sommet du Khangaï, couvert de neiges éternelles (plus de 4 000 m) ; montagne sacrée vénérée par l’État."],
    "n-khongor": ["Khongoryn Els", "Dunes de plus de 100 km de long et de 200 à 300 m de haut, appelées « dunes chantantes » pour le son qu’elles produisent sous le vent."],
    "n-bayanzag": ["Bayanzag (Falaises flamboyantes)", "Falaises de grès rouge orangé où une expédition américaine découvrit les premiers œufs de dinosaures dans les années 1920."],
    "n-tsagaansuvarga": ["Tsagaan Suvarga", "Parois abruptes blanches, rouges et roses d’anciens sédiments marins — spectaculaires au coucher du soleil."],
    "n-ikhgazar": ["Ikh Gazriin Chuluu", "Ensemble de collines granitiques dans la steppe du Gobi, avec art rupestre, argalis, Hiboux grands-ducs et oiseaux rupestres."],
    "n-shiliinbogd": ["Mont Shiliin Bogd", "Volcan éteint de 1 778 m et montagne sacrée de Dariganga, célèbre pour le lever du soleil depuis son sommet."],
    "n-khuiten": ["Pic Khüiten", "Point culminant de la Mongolie (4 374 m), dans le massif du Tavan Bogd, au-dessus du glacier Potanine."],
    "l-murun": ["Mörön", "Chef-lieu de la province de Khövsgöl, avec aéroport. La plus grande ville avant le lac Khövsgöl."],
    "l-erdenet": ["Erdenet", "Troisième ville de Mongolie. Pratique pour une nuit et le ravitaillement lors des voyages vers le nord."],
    "l-bulgan": ["Bulgan", "Chef-lieu de la province de Bulgan, en steppe boisée ; étape vers Uran Togoo et le Khövsgöl."],
    "l-amarbayasgalant": ["Camps d’Amarbayasgalant", "Camps de yourtes et séjours chez des familles nomades dans la vallée de l’Iven, près du monastère. Idéal pour les oiseaux forestiers."],
    "l-darkhan": ["Darkhan", "Deuxième ville de Mongolie, sur la route Oulan-Bator–Selenge. Étape vers le nord."],
    "l-arvaikheer": ["Arvaikheer", "Chef-lieu de l’Övörkhangai ; étape au retour du Gobi et de la vallée des Lacs."],
    "l-altai": ["Altaï (ville)", "Chef-lieu du Govi-Altaï ; base pour l’Altaï du Gobi, Sharga et le Gobi de Biger."],
    "l-uliastai": ["Uliastai", "Chef-lieu du Zavkhan, avec aéroport. Principale base pour le mont Otgontenger."],
    "c-choijin": ["Temple-musée de Choijin Lama", "Ensemble de temples construit en 1904–1908 : masques de danse Tsam, divinités et trésors de l’art bouddhique."],
    "c-zanabazar": ["Musée des beaux-arts Zanabazar", "Divinités en bronze fondues par Zanabazar et chefs-d’œuvre de la peinture mongole."],
    "c-tuvkhun": ["Monastère de Tövkhön", "Ermitage perché fondé par Zanabazar au milieu du XVIIe siècle, où il méditait et créait ses œuvres. Fait partie du site de la vallée de l’Orkhon (UNESCO) ; accès par un sentier forestier."],
    "c-kharbalgas": ["Khar Balgas", "Ruines d’Ordu-Baliq, capitale du khaganat ouïghour (VIIIe–IXe siècle), dans la vallée de l’Orkhon."],
    "c-ongi": ["Ruines du monastère d’Ongi", "Ruines d’un grand monastère sur les deux rives de l’Ongi (détruit dans les années 1930), petit musée. Bonne étape sur la route du Gobi."],
    "c-baldan": ["Monastère de Baldan Bereeven", "Ancien monastère, jadis parmi les plus grands de Mongolie, entouré des collines boisées du Khentii, avec des sculptures rupestres."],
    "n-yolyn": ["Yolyn Am", "Gorge profonde et étroite du massif Gobi Gurvan Saikhan où la glace persiste jusqu’au début de l’été ; gypaète, argali et bouquetin."],
    "n-hustai": ["Hustai Nuruu", "Berceau du cheval de Przewalski réintroduit, mosaïque de steppe boisée et de steppe. Marmottes, cerfs et rapaces abondent."],
    "n-urantogoo": ["Volcan Uran Togoo", "Cratère volcanique éteint, monument naturel. Courte montée jusqu’au bord ; oiseaux de la steppe boisée."],
    "n-khyargas": ["Lac Khyargas", "Grand lac salé de la dépression des Grands Lacs, parc national. Colonies d’oiseaux d’eau sur les rives rocheuses ; nombreux canards et mouettes en migration."],
    "n-tsambagarav": ["Mont Tsambagarav", "Sommet enneigé de l’Altaï mongol (plus de 4 000 m), parc national. Panthère des neiges, argali et oiseaux de haute montagne."],
    "n-khermentsav": ["Khermen Tsav", "Dédale de canyons rouge orangé, célèbre pour ses fossiles de dinosaures. Isolé — partez avec un chauffeur expérimenté."]
  };

  // ---- application ----
  for (const k in REGIONS_FR) Object.assign(REGIONS[k], REGIONS_FR[k]);
  for (const k in HOTSPOTS_FR) HOTSPOTS[k].name = HOTSPOTS_FR[k];
  Object.assign(GROUPS, GROUPS_FR); Object.assign(COLOR_NAMES, COLOR_FR); Object.assign(SIZE_NAMES, SIZE_FR);
  Object.assign(HABITAT_NAMES, HABITAT_FR); Object.assign(BEAK_NAMES, BEAK_FR); Object.assign(BEHAVIOR_NAMES, BEHAVIOR_FR);
  Object.assign(SEASON_NAMES, SEASON_FR); Object.assign(VOICE_TYPES, VOICE_FR);
  ROUTES.forEach(r => {
    const e = ROUTES_FR[r.id]; if (!e) return;
    const { stops, ...rest } = e; Object.assign(r, rest);
    if (stops) r.stops.forEach((s, i) => { if (stops[i]) Object.assign(s, stops[i]); });
  });
  for (const k in PROGRAMS_FR) PROGRAMS[k].forEach((d, i) => { if (PROGRAMS_FR[k][i]) Object.assign(d, PROGRAMS_FR[k][i]); });
  for (const k in KINDS_FR) PLACE_KINDS[k].name = KINDS_FR[k];
  Object.assign(LODGING_TYPES, LODGING_FR);
  // p.aimag est déjà en anglais (data_en.js) : on retrouve la clé mongole via AIMAG_EN inverse n’est pas nécessaire — on remappe depuis les noms anglais
  const AIMAG_EN2FR = { "Ulaanbaatar": "Oulan-Bator", "Tuv": "Töv", "Uvurkhangai": "Övörkhangai", "Arkhangai": "Arkhangai", "Khuvsgul": "Khövsgöl", "Umnugovi": "Ömnögovi", "Dundgovi": "Dundgovi", "Dornogovi": "Dornogovi", "Khentii": "Khentii", "Dornod": "Dornod", "Sukhbaatar": "Sükhbaatar", "Bayan-Ulgii": "Bayan-Ölgii", "Uvs": "Uvs", "Khovd": "Khovd", "Bayankhongor": "Bayankhongor", "Selenge": "Selenge", "Zavkhan": "Zavkhan", "Bulgan / Uvurkhangai": "Bulgan / Övörkhangai" };
  PLACES.forEach(p => { const e = PLACES_FR[p.id]; if (e) { p.name = e[0]; p.desc = e[1]; } p.aimag = AIMAG_FR[p.aimag] || AIMAG_EN2FR[p.aimag] || p.aimag; });
  if (typeof BIRDS_FR !== "undefined") BIRDS.forEach(b => { const e = BIRDS_FR[b.id]; if (e) { b.nameEn = b.name; Object.assign(b, e); } });
  // virgule décimale à la française (4.7 kg → 4,7 kg)
  BIRDS.forEach(b => ["length", "wingspan", "weight"].forEach(k => { if (typeof b[k] === "string") b[k] = b[k].replace(/(\d)\.(\d)/g, "$1,$2"); }));
})();
