/**
 * TEMPLATE LAYER — shared across every event site. NOT client-specific.
 *
 * "How we work", "What we do", section headings and stock art live here, so a
 * new event inherits them for free. Strings may use {tokens}, filled at render
 * time from the active event config (see lib/copy.ts):
 *
 *   {brand} {fullName} {descriptor} {tagline}
 *   {city} {district} {region} {area} {address} {phone} {hours}
 *   {areas}  -> service areas joined with " · "
 *   {rating} {reviews}
 *
 * Anything here can be overridden per event via `overrides` in events/<slug>.config.ts.
 */

import type { EventVariant, MenuCategory, MenuPreset } from "@/config/event-schema";

export interface TemplateService {
  id: string;
  title: string;
  blurb: string;
  bullets: string[];
  /** Stock art shipped with the template. Events may override with their own. */
  image: string;
}

export interface TemplateStep {
  n: string;
  title: string;
  text: string;
}

/** WHAT WE DO — the offer. Same three pillars for every catering/event client. */
export const templateServices: TemplateService[] = [
  {
    id: "wedding-catering",
    title: "Wedding Catering",
    blurb:
      "Full buffet spreads for weddings, nikah and receptions — cooked fresh and served hot at any scale.",
    bullets: ["Wedding & reception buffets", "Traditional & multi-cuisine menus", "Trained serving crew"],
    image: "/template/service-1.webp",
  },
  {
    id: "event-management",
    title: "Event Management",
    blurb: "Complete event setup — stage and floral décor, lighting, seating and on-day coordination.",
    bullets: ["Stage & floral décor", "Lighting & seating", "On-day coordination"],
    image: "/template/service-2.webp",
  },
  {
    id: "bulk-catering",
    title: "Function & Bulk Catering",
    blurb: "Large-volume cooking for functions and gatherings, with delivery available across the area.",
    bullets: ["High-volume preparation", "Functions & house events", "Delivery available"],
    image: "/template/service-3.webp",
  },
];

/** HOW WE WORK — the process. Generic to catering + event management. */
export const templateProcess: TemplateStep[] = [
  { n: "01", title: "Understand", text: "We start with your date, guest count, venue and the kind of day you have in mind." },
  { n: "02", title: "Menu & concept", text: "We shape the menu and the look — buffet spread, live counters, stage and floral décor." },
  { n: "03", title: "Plan & coordinate", text: "We lock quantities, timeline, staffing and logistics so nothing is left to the last minute." },
  { n: "04", title: "Cook fresh & set up", text: "Food is cooked fresh on the day while our team sets up counters, seating and décor." },
  { n: "05", title: "Serve & manage", text: "Trained crew serve hot and keep the day running — so you get to enjoy the occasion." },
];

/**
 * KERALA WEDDING MENU — the quote builder's dish list. Shared across events;
 * a client with a different spread sets `overrides.menu`. No prices: the
 * visitor picks dishes + guest count and asks for a quote on WhatsApp.
 */
export const templateMenu: MenuCategory[] = [
  {
    id: "welcome",
    title: "Welcome Drinks",
    ml: "സ്വാഗത പാനീയം",
    items: [
      { id: "lime-soda", name: "Fresh Lime Soda", ml: "നാരങ്ങ സോഡ", note: "Sweet, salted or mint", veg: true },
      { id: "nannari", name: "Nannari Sarbath", ml: "നന്നാരി സർബത്ത്", note: "Sarsaparilla syrup, lime and ice", veg: true },
      { id: "tender-coconut", name: "Tender Coconut Water", ml: "ഇളനീർ", note: "Chilled, served in glass", veg: true },
      { id: "watermelon", name: "Watermelon Juice", ml: "തണ്ണിമത്തൻ ജ്യൂസ്", note: "Fresh-pressed with mint", veg: true },
      { id: "passion-fruit", name: "Passion Fruit Juice", ml: "പാഷൻ ഫ്രൂട്ട് ജ്യൂസ്", note: "Tangy, bright and cold", veg: true },
    ],
  },
  {
    id: "starters",
    title: "Starters",
    ml: "സ്റ്റാർട്ടേഴ്സ്",
    items: [
      { id: "veg-cutlet", name: "Vegetable Cutlet", ml: "വെജിറ്റബിൾ കട്ലറ്റ്", note: "Crumbed, with tomato sauce", veg: true },
      { id: "beef-cutlet", name: "Beef Cutlet", ml: "ബീഫ് കട്ലറ്റ്", note: "The Kottayam wedding classic", veg: false },
      { id: "chicken-lollipop", name: "Chicken Lollipop", ml: "ചിക്കൻ ലോലിപോപ്പ്", note: "Crisp, spiced, finger food", veg: false },
      { id: "fish-fingers", name: "Fish Fingers", ml: "ഫിഷ് ഫിംഗർ", note: "Seer fish, golden fried", veg: false },
      { id: "paneer-tikka", name: "Paneer Tikka", ml: "പനീർ ടിക്ക", note: "Charred in a spiced marinade", veg: true },
    ],
  },
  {
    id: "sadya",
    title: "Kerala Sadya",
    ml: "സദ്യ",
    items: [
      { id: "avial", name: "Avial", ml: "അവിയൽ", note: "Mixed vegetables in coconut and curd", veg: true },
      { id: "thoran", name: "Thoran", ml: "തോരൻ", note: "Stir-fried vegetables with grated coconut", veg: true },
      { id: "olan", name: "Olan", ml: "ഓലൻ", note: "Ash gourd and cowpeas in coconut milk", veg: true },
      { id: "kaalan", name: "Kaalan", ml: "കാളൻ", note: "Yam and raw banana in thick curd", veg: true },
      { id: "erissery", name: "Erissery", ml: "എരിശ്ശേരി", note: "Pumpkin and red beans, roasted coconut", veg: true },
      { id: "sambar", name: "Sambar", ml: "സാമ്പാർ", note: "Lentils and vegetables, tamarind base", veg: true },
      { id: "parippu", name: "Parippu & Ghee", ml: "പരിപ്പും നെയ്യും", note: "Moong dal served with ghee", veg: true },
      { id: "pulissery", name: "Pulissery", ml: "പുളിശ്ശേരി", note: "Spiced buttermilk curry", veg: true },
      { id: "inji-puli", name: "Inji Puli", ml: "ഇഞ്ചിപ്പുളി", note: "Sweet-sour ginger and tamarind", veg: true },
      { id: "pachadi-kichadi", name: "Pachadi & Kichadi", ml: "പച്ചടി, കിച്ചടി", note: "Pineapple pachadi, cucumber kichadi", veg: true },
      { id: "pappadam-upperi", name: "Pappadam & Upperi", ml: "പപ്പടം, ഉപ്പേരി", note: "With banana chips and sharkara varatti", veg: true },
    ],
  },
  {
    id: "breads-rice",
    title: "Appam, Breads & Rice",
    ml: "അപ്പം, ചോറ്",
    items: [
      { id: "palappam", name: "Palappam", ml: "പാലപ്പം", note: "Lacy-edged, soft centre", veg: true },
      { id: "idiyappam", name: "Idiyappam", ml: "ഇടിയപ്പം", note: "Steamed string hoppers", veg: true },
      { id: "porotta", name: "Kerala Porotta", ml: "പൊറോട്ട", note: "Flaky, layered, hand-beaten", veg: true },
      { id: "ghee-rice", name: "Ghee Rice", ml: "നെയ്ച്ചോറ്", note: "With cashews and fried onion", veg: true },
      { id: "chicken-biriyani", name: "Chicken Biriyani", ml: "ചിക്കൻ ബിരിയാണി", note: "Kaima rice, dum-cooked", veg: false },
      { id: "matta-rice", name: "Kerala Matta Rice", ml: "കുത്തരി ചോറ്", note: "Red parboiled rice", veg: true },
    ],
  },
  {
    id: "non-veg",
    title: "Wedding Specials",
    ml: "നോൺ-വെജ്",
    items: [
      { id: "chicken-stew", name: "Chicken Stew", ml: "ചിക്കൻ സ്റ്റൂ", note: "Coconut milk, whole spices — with appam", veg: false },
      { id: "mutton-stew", name: "Mutton Stew", ml: "മട്ടൻ സ്റ്റൂ", note: "Slow-cooked, mild and creamy", veg: false },
      { id: "chicken-roast", name: "Nadan Chicken Roast", ml: "നാടൻ ചിക്കൻ റോസ്റ്റ്", note: "Onion-pepper masala, dry roasted", veg: false },
      { id: "beef-ularthiyathu", name: "Beef Ularthiyathu", ml: "ബീഫ് ഉലർത്തിയത്", note: "Coconut slivers, curry leaves, black pepper", veg: false },
      { id: "duck-roast", name: "Duck Roast", ml: "താറാവ് റോസ്റ്റ്", note: "Kuttanad-style, rich and peppery", veg: false },
      { id: "fish-curry", name: "Kottayam Fish Curry", ml: "കോട്ടയം മീൻ കറി", note: "Red curry soured with kudampuli", veg: false },
      { id: "fish-moilee", name: "Fish Moilee", ml: "മീൻ മോളി", note: "Mild coconut milk curry", veg: false },
      { id: "karimeen", name: "Karimeen Pollichathu", ml: "കരിമീൻ പൊള്ളിച്ചത്", note: "Pearl spot, masala-wrapped in banana leaf", veg: false },
      { id: "pork-ularthiyathu", name: "Pork Ularthiyathu", ml: "പോർക്ക് ഉലർത്തിയത്", note: "Dry-roasted, central Travancore style", veg: false },
    ],
  },
  {
    id: "veg-mains",
    title: "Vegetarian Mains",
    ml: "വെജിറ്റേറിയൻ",
    items: [
      { id: "veg-stew", name: "Vegetable Stew", ml: "വെജിറ്റബിൾ സ്റ്റൂ", note: "Coconut milk, mild spices", veg: true },
      { id: "kadala-curry", name: "Kadala Curry", ml: "കടല കറി", note: "Black chickpeas, roasted coconut", veg: true },
      { id: "paneer-butter-masala", name: "Paneer Butter Masala", ml: "പനീർ ബട്ടർ മസാല", note: "Silky tomato and cashew gravy", veg: true },
      { id: "mushroom-pepper", name: "Mushroom Pepper Fry", ml: "കൂൺ കുരുമുളക് ഫ്രൈ", note: "Tossed with crushed pepper", veg: true },
    ],
  },
  {
    id: "desserts",
    title: "Payasam & Desserts",
    ml: "പായസം",
    items: [
      { id: "ada-pradhaman", name: "Ada Pradhaman", ml: "അട പ്രഥമൻ", note: "Rice ada, jaggery and coconut milk", veg: true },
      { id: "palada", name: "Palada Payasam", ml: "പാലട പായസം", note: "Pink, creamy, slow-reduced milk", veg: true },
      { id: "parippu-pradhaman", name: "Parippu Pradhaman", ml: "പരിപ്പ് പ്രഥമൻ", note: "Moong dal and jaggery", veg: true },
      { id: "semiya", name: "Semiya Payasam", ml: "സേമിയ പായസം", note: "Vermicelli, milk and cardamom", veg: true },
      { id: "caramel-pudding", name: "Caramel Pudding", ml: "കാരമൽ പുഡ്ഡിംഗ്", note: "The wedding-table favourite", veg: true },
      { id: "fruit-salad", name: "Fruit Salad & Ice Cream", ml: "ഫ്രൂട്ട് സാലഡ്", note: "Fresh-cut fruit, vanilla scoop", veg: true },
      { id: "gulab-jamun", name: "Gulab Jamun", ml: "ഗുലാബ് ജാമുൻ", note: "Warm, in rose-cardamom syrup", veg: true },
    ],
  },
  {
    id: "live",
    title: "Live Counters",
    ml: "ലൈവ് കൗണ്ടർ",
    items: [
      { id: "live-appam", name: "Live Appam & Stew", ml: "അപ്പം ലൈവ്", note: "Appams off the pan, stew alongside", veg: false },
      { id: "kappa-meen", name: "Kappa & Meen Curry", ml: "കപ്പയും മീൻ കറിയും", note: "Tapioca with red fish curry", veg: false },
      { id: "live-dosa", name: "Live Dosa Counter", ml: "ദോശ ലൈവ്", note: "Ghee roast, masala and plain", veg: true },
      { id: "chaat", name: "Chaat Counter", ml: "ചാട്ട്", note: "Pani puri, bhel and dahi puri", veg: true },
      { id: "ice-cream", name: "Ice Cream Station", ml: "ഐസ്ക്രീം", note: "Scoops with toppings", veg: true },
      { id: "chaya", name: "Chaya & Palaharam", ml: "ചായയും പലഹാരവും", note: "Kerala tea with evening snacks", veg: true },
    ],
  },
];

/** Starting points for the quote builder — tap one, then add or remove dishes. */
export const templateMenuPresets: MenuPreset[] = [
  {
    title: "Traditional Sadya",
    note: "On banana leaf, with two payasams",
    items: [
      "matta-rice", "parippu", "sambar", "avial", "thoran", "olan", "kaalan", "erissery", "pulissery",
      "inji-puli", "pachadi-kichadi", "pappadam-upperi", "ada-pradhaman", "palada",
    ],
  },
  {
    title: "Christian Wedding Feast",
    note: "Appam, stew, roasts and pudding",
    items: [
      "lime-soda", "beef-cutlet", "palappam", "chicken-stew", "beef-ularthiyathu", "duck-roast",
      "fish-curry", "ghee-rice", "veg-stew", "caramel-pudding", "fruit-salad",
    ],
  },
  {
    title: "Reception Buffet",
    note: "Starters, biriyani and live counters",
    items: [
      "passion-fruit", "chicken-lollipop", "paneer-tikka", "porotta", "chicken-biriyani", "chicken-roast",
      "paneer-butter-masala", "live-dosa", "gulab-jamun", "ice-cream",
    ],
  },
];

/** Every string the sections render. Tokens are filled from the event config. */
export const templateCopy = {
  nav: [
    { label: "Our story", href: "#stories" },
    { label: "Services", href: "#services" },
    { label: "Our work", href: "#gallery" },
    { label: "Reviews", href: "#testimonials" },
    { label: "Menu", href: "#menu" },
    { label: "Contact", href: "#contact" },
  ],

  cta: {
    primary: "Get a quote",
    /** Where the header + hero quote buttons lead (the menu quote builder). */
    primaryHref: "#menu",
    whatsapp: "Chat on WhatsApp",
    secondary: "Build your menu",
    /** Prefilled WhatsApp enquiry used by the header, hero and the floating button. */
    waMessage: "Hi {brand}, I found your website and would like to enquire.",
    waQuoteIntro: "Hi {brand}, I'd like a quote for my event.",
  },

  hero: {
    eyebrow: "{city} · {district}",
    body: "Weddings, receptions and functions across {district} — cooked fresh, styled beautifully, and run end to end.",
    posterAlt: "A celebration catered and staged by {brand}",
    scroll: "Scroll",
  },

  trustBar: {
    /** Extra pills after the rating/review ones. */
    items: ["{hours}", "Delivery available", "{city}, {region}"],
    /** Dropped from items/points when the event sets `location.delivery: false`. */
    deliveryLabel: "Delivery available",
  },

  quickServices: {
    eyebrow: "At a glance",
    heading: "A quick look at what we offer",
  },

  services: {
    eyebrow: "What we do",
    heading: "Catering & complete event management",
    tapHint: "Tap to see more",
    closeHint: "Tap to close",
  },

  gallery: {
    eyebrow: "Our work",
    heading: "Imagine your event like this",
    body: "Real weddings and functions we've catered and styled across {district} — the spreads, the stage and the crowd on the day.",
    photoQuote: "Every plate, petal and place setting — styled by hand.",
    showAll: "Show all {count} photos",
    showLess: "Show fewer",
    reelLabel: "On the night",
  },

  process: {
    eyebrow: "How we work",
    heading: "One team, from the first message to the last plate.",
    body: "Catering and event management handled together, by one team — so the food, the décor and the day all run as one.",
  },

  about: {
    eyebrow: "About us",
    headingLead: "Feasts and functions, handled with",
    headingAccent: "care.",
    body:
      "{fullName} is based in {place}. From weddings and receptions to house functions and inaugurations, we handle the whole day — fresh food and buffets, live counters, floral and stage décor, and on-ground coordination. Cooked fresh, served hot, and managed so you can enjoy the occasion.",
    points: ["{hours}", "Delivery available", "{serving}"],
    reviewsLink: "Read our {reviews} reviews on Google",
  },

  testimonials: {
    eyebrow: "Reviews",
    heading: "What our customers say",
    ratingLink: "Rated {rating} from {reviews} reviews on Google",
    sourceLabel: "Google review",
    swipeHint: "Swipe for more reviews →",
  },

  menu: {
    eyebrow: "The menu",
    heading: "Design your feast, course by course.",
    body: "Choose from our Kerala wedding favourites, tell us how many guests and what you have in mind — and get a quote made for your day.",
    steps: ["Pick your dishes", "Set your guests", "Get your quote"],
    skipHint: "Not sure yet?",
    skipCta: "Just WhatsApp us",
    moreDetails: "Add date & special requests",
    courseLabel: "Course",
    of: "of",
    addAll: "Add all",
    removeAll: "Remove all",
    prev: "Previous",
    next: "Next course",
    done: "Review & get quote",
    picked: "added",
    presetsLabel: "Start from a classic",
    add: "Add",
    remove: "Remove",
    veg: "Veg",
    nonVeg: "Non-veg",
    listTitle: "Your menu card",
    listEmpty: "Your menu card is empty — tap + beside any dish to start.",
    coverage: "Courses covered",
    nameLabel: "Name on the menu",
    namePlaceholder: "e.g. Anu & Joel",
    notesLabel: "Anything special?",
    notesPlaceholder: "Less spice, more vegetarian, an extra live counter, a theme…",
    clear: "Clear",
    guestsLabel: "Number of guests",
    guestsUnit: "guests",
    eventLabel: "Occasion",
    eventTypes: ["Wedding", "Engagement", "Reception", "Baptism", "House function", "Corporate"],
    dateLabel: "Event date",
    dateOptional: "optional",
    submit: "Ask for a quote",
    submitNote: "Free and no obligation — opens WhatsApp with your menu ready to send.",
    toastAdded: "added to your menu",
    mobileBarCta: "Get quote",
    waName: "Name",
    waNotes: "Special requests",
    waGuests: "Guests",
    waEvent: "Occasion",
    waDate: "Date",
    waMenu: "My menu",
    waOutro: "Please share a quote and your availability. Thank you!",
    /** Opening line of the WhatsApp quote; empty uses cta.waQuoteIntro. */
    waIntro: "",
    dish: "dish",
    dishes: "dishes",
    suggestMenu: "Menu to suggest",
    suggestPlease: "please suggest one.",
    fewerGuests: "Fewer guests",
    moreGuests: "More guests",
    coursesLabel: "Menu courses",
  },

  visit: {
    eyebrow: "Visit us",
    heading: "Let's make it unforgettable.",
    body: "Call, WhatsApp or drop by — we'll walk you through menus, décor and dates.",
    directions: "Get directions",
  },

  footer: {
    areasLabel: "Service areas",
    note: "Cooked fresh. Served with care.",
  },

  seo: {
    /** Title + descriptions. Tokens filled from the event config. */
    title: "{fullName} — {city}, {region}",
    titleTemplate: "%s · {brand}, {city}",
    description:
      "{fullName} in {city}, {district} — wedding catering, buffets, live counters and complete event management across {region}. Rated {rating} on Google. {hours}. Call {phone} or enquire on WhatsApp.",
    ogDescription:
      "Wedding catering, buffets and complete event management across {city} & {district}. Rated {rating} on Google. {hours}.",
    category: "Catering & Event Management",
    /** Generated keyword patterns — {city}/{district}/{region} filled per event. */
    keywords: [
      "catering {city}",
      "wedding catering {district}",
      "event management {city}",
      "wedding buffet {region}",
      "catering service {city}",
      "wedding caterers {district}",
      "function catering {region}",
      "buffet catering {city}",
    ],
    cuisines: ["Indian", "Kerala", "Multi-cuisine"],
    priceRange: "₹₹",
    currency: "INR",
    payment: "Cash, UPI",
    locale: "en_IN",
    lang: "en-IN",
    manifestCategories: ["food", "business", "events"],
  },

  /** Motion knobs for the Our work section. */
  gallerySettings: {
    /** Photo card crossfade transition (seconds). */
    photoTransitionSeconds: 0.8,
    /** Photo card crossfade interval (ms). */
    photoIntervalMs: 3200,
    /** About image crossfade interval (ms). */
    aboutIntervalMs: 3800,
  },

  theme: {
    themeColor: "#241C15",
    backgroundColor: "#FDFAF3",
  },
} as const;

/**
 * Per-variant copy overrides, applied one level deep on top of templateCopy
 * (see config/site.ts). Neutral wording only — no factual claims, since this
 * is shared template copy, not a client's real data. Leaving a key out of a
 * variant falls back to the base templateCopy above, so "catering" (the
 * original/default copy) needs no entries at all.
 */
type Widen<T> = { [K in keyof T]: T[K] extends readonly string[] ? readonly string[] : string };

export const variantCopy: Record<
  EventVariant,
  {
    hero?: Partial<Widen<(typeof templateCopy)["hero"]>>;
    services?: Partial<Widen<(typeof templateCopy)["services"]>>;
    gallery?: Partial<Widen<(typeof templateCopy)["gallery"]>>;
    process?: Partial<Widen<(typeof templateCopy)["process"]>>;
    about?: Partial<Widen<(typeof templateCopy)["about"]>>;
    menu?: Partial<Widen<(typeof templateCopy)["menu"]>>;
    visit?: Partial<Widen<(typeof templateCopy)["visit"]>>;
    footer?: Partial<Widen<(typeof templateCopy)["footer"]>>;
  }
> = {
  /** Catering — menu/services and food gallery lead. This is the original copy, so no overrides. */
  catering: {},

  /** Events — leads with services, decor and stages rather than food. */
  events: {
    hero: {
      body: "Event setup, décor and complete on-day management across {district} — planned around your date and guest count.",
    },
    services: {
      eyebrow: "What we do",
      heading: "Décor, staging and complete event management",
    },
    gallery: {
      eyebrow: "Our work",
      heading: "Stages and setups we've styled",
      body: "Real décor, staging and event setups across {district} — the look, the lighting and the layout on the day.",
    },
  },

  /** Wedding — leads with the planning process and venues. */
  wedding: {
    hero: {
      body: "Wedding planning across {district} — the process, the venue and the day, planned around you.",
    },
    process: {
      eyebrow: "How we plan",
      heading: "A clear planning process, from the first conversation to the big day.",
    },
    about: {
      headingLead: "Weddings and venues, planned with",
      headingAccent: "care.",
    },
  },

  /** Sadya — pure-vegetarian sadhya on banana leaf, with a traditional (nilavilakku, uruli) stage. */
  sadya: {
    hero: {
      body: "Traditional vegetarian sadhya on banana leaf across {district} — cooked fresh and served the Kerala way.",
    },
    services: {
      eyebrow: "ഞങ്ങൾ ഒരുക്കുന്നത്",
      heading: "സദ്യ, അതിന്റെ തനിമയോടെ",
    },
    gallery: {
      eyebrow: "ആഘോഷങ്ങൾ",
      heading: "നിങ്ങളുടെ സദ്യ വിളമ്പുന്നിടം",
      body: "Weddings, engagements and festivals — the setting changes, the sadhya stays the same: fresh, traditional and served on leaf.",
      photoQuote: "Whatever the occasion, the leaf is always full.",
    },
    process: {
      eyebrow: "ഞങ്ങളുടെ രീതി",
      heading: "ആദ്യ വിളി മുതൽ അവസാന പായസം വരെ",
      body: "",
    },
    about: {
      headingLead: "Pure vegetarian sadhya, served with",
      headingAccent: "tradition.",
    },
    visit: {
      eyebrow: "ബന്ധപ്പെടാം",
      heading: "നിങ്ങളുടെ സദ്യ, ഞങ്ങൾ ഒരുക്കാം",
      body: "Call, WhatsApp or drop by — we will walk you through the menu, the payasams and your date.",
    },
    footer: {
      areasLabel: "സേവന മേഖലകൾ",
    },
    // Malayalam only: every word in the menu section, including buttons and the WhatsApp message.
    menu: {
      eyebrow: "സദ്യ",
      heading: "ഓരോ വിഭവവും തിരഞ്ഞെടുത്ത്, നിങ്ങളുടെ സദ്യ ഒരുക്കാം.",
      body: "മിനി സദ്യയിൽ നിന്നോ വാഴയിലയിലെ സമ്പൂർണ്ണ സദ്യയിൽ നിന്നോ തുടങ്ങാം. പായസങ്ങൾ ചേർക്കാം, അതിഥികളുടെ എണ്ണം പറയാം — നിങ്ങളുടെ ദിവസത്തിനുള്ള നിരക്ക് അറിയാം.",
      steps: ["വിഭവങ്ങൾ തിരഞ്ഞെടുക്കാം", "അതിഥികളുടെ എണ്ണം", "നിരക്ക് അറിയാം"],
      skipHint: "ഉറപ്പില്ലേ?",
      skipCta: "വാട്ട്സ്ആപ്പിൽ ചോദിക്കൂ",
      moreDetails: "തീയതിയും പ്രത്യേക ആവശ്യങ്ങളും ചേർക്കാം",
      courseLabel: "വിഭാഗം",
      of: "/",
      addAll: "എല്ലാം ചേർക്കാം",
      removeAll: "എല്ലാം നീക്കാം",
      prev: "മുമ്പത്തേത്",
      next: "അടുത്ത വിഭാഗം",
      done: "നോക്കി നിരക്ക് അറിയാം",
      picked: "ചേർത്തു",
      presetsLabel: "ഒരു സദ്യയിൽ നിന്ന് തുടങ്ങാം",
      add: "ചേർക്കുക",
      remove: "നീക്കുക",
      veg: "സസ്യാഹാരം",
      nonVeg: "സസ്യേതരം",
      listTitle: "നിങ്ങളുടെ സദ്യയില",
      listEmpty: "ഇല ഒഴിഞ്ഞിരിക്കുന്നു — വിളമ്പാൻ ഏതെങ്കിലും വിഭവത്തിനരികിലെ + അമർത്തൂ.",
      coverage: "ഉൾപ്പെട്ട വിഭാഗങ്ങൾ",
      nameLabel: "മെനുവിലെ പേര്",
      namePlaceholder: "ഉദാ: അനു & അരുൺ",
      notesLabel: "പ്രത്യേകമായി എന്തെങ്കിലും?",
      notesPlaceholder: "എരിവ് കുറച്ച്, ഒരു പായസം കൂടി, കുട്ടികൾക്ക് പ്രത്യേക പന്തി, വിളമ്പേണ്ട സമയം…",
      clear: "മായ്ക്കാം",
      guestsLabel: "അതിഥികളുടെ എണ്ണം",
      guestsUnit: "പേർ",
      eventLabel: "ചടങ്ങ്",
      eventTypes: ["വിവാഹം", "വിവാഹ നിശ്ചയം", "ചോറൂണ്", "ഗൃഹപ്രവേശം", "ഓണം & ഉത്സവങ്ങൾ", "ക്ഷേത്ര ചടങ്ങ്", "പിറന്നാൾ", "ഓഫീസ് ഓണം"],
      dateLabel: "ചടങ്ങിന്റെ തീയതി",
      dateOptional: "നിർബന്ധമില്ല",
      submit: "നിരക്ക് ചോദിക്കാം",
      submitNote: "സൗജന്യം, ഒരു ബാധ്യതയുമില്ല — നിങ്ങളുടെ മെനുവുമായി വാട്ട്സ്ആപ്പ് തുറക്കും.",
      toastAdded: "സദ്യയിലയിൽ ചേർത്തു",
      mobileBarCta: "നിരക്ക് അറിയാം",
      waIntro: "നമസ്കാരം {brand}, ഞങ്ങളുടെ ചടങ്ങിനുള്ള സദ്യയുടെ നിരക്ക് അറിയാൻ ആഗ്രഹിക്കുന്നു.",
      waName: "പേര്",
      waNotes: "പ്രത്യേക ആവശ്യങ്ങൾ",
      waGuests: "അതിഥികൾ",
      waEvent: "ചടങ്ങ്",
      waDate: "തീയതി",
      waMenu: "എന്റെ മെനു",
      waOutro: "ദയവായി നിരക്കും ലഭ്യതയും അറിയിക്കുക. നന്ദി!",
      dish: "വിഭവം",
      dishes: "വിഭവങ്ങൾ",
      suggestMenu: "മെനു നിർദ്ദേശിക്കാം",
      suggestPlease: "ദയവായി ഒരു മെനു നിർദ്ദേശിക്കൂ.",
      fewerGuests: "അതിഥികളെ കുറയ്ക്കുക",
      moreGuests: "അതിഥികളെ കൂട്ടുക",
      coursesLabel: "സദ്യ വിഭാഗങ്ങൾ",
    },
  },
};
