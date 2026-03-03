const fs = require('fs');
const path = require('path');

const localesPath = 'public/locales';
const sourceLocale = 'pl';
const targetLocales = ['lt', 'lv', 'et', 'hr', 'sr'];

const translations = {
    "lt": {
        "adminSettings": {
            "tabs": {
                "ai": "AI modeliai",
                "marketing": "Marketingas ir analitika",
                "seo": "SEO ir meta duomenys",
                "economy": "Ekonomika ir piniginė",
                "gamification": "Žaidybinimas ir ženkleliai",
                "market": "Rinkos ir programų analizė",
                "insights": "AI auditas ir pasiūlymai",
                "channels": "Pardavimo kanalai",
                "integrations": "Integracijos ir API",
                "interactive": "Žaidimai ir interakcijos",
                "workshop": "AI studija ir Canva",
                "automation": "Agentai ir automatizavimas",
                "emails": "El. pašto pranešimai",
                "google": "Google Cloud",
                "abandoned": "Palikti krepšeliai",
                "guardian": "AI Guardian",
                "affiliate": "Partnerių programa",
                "pricing": "Kainos ir valiutos (PPP)",
                "taxes": "Sąskaitos ir mokesčiai"
            },
            "sections": {
                "shopping": "Pirkimai ir finansai",
                "ai": "AI ir interakcijos",
                "growth": "Augimas ir prekės ženklas",
                "system": "Sistemos nustatymai"
            },
            "economy": {
                "title": "Taškų ir piniginės sistema",
                "description": "Valdykite virtualią valiutą, prenumeratas ir klientų lojalumą",
                "wallet": {
                    "title": "Virtuali piniginė",
                    "enable_wallet": "Įjungti vartotojo piniginę",
                    "allow_topup": "Leisti papildymus",
                    "recurring_topup": "Automatiniai periodiniai papildymai",
                    "conversion_rate": "Papildymo kursas (1 EUR = X taškų)"
                },
                "loyalty": {
                    "title": "Lojalumo taškai",
                    "enable_loyalty": "Įjungti taškų rinkimą",
                    "points_per_eur": "Taškai už kiekvieną išleistą 1 EUR",
                    "min_redeem": "Minimalus taškų kiekis naudojimui"
                }
            },
            "gamification": {
                "title": "Žaidybinimas",
                "description": "Motyvuokite mokinius lygiais, ženkleliais ir apdovanojimais.",
                "levels": {
                    "silver": "Sidabrinis lygis",
                    "gold": "Auksinis lygis",
                    "diamond": "Deimantinis VIP"
                },
                "badges_title": "Studentų ženkleliai"
            }
        },
        "adminPanel": {
            "sidebar": {
                "title": "AdminPanel",
                "subtitle": "Kūrybinė studija",
                "menu": {
                    "dashboard": "Skydelis",
                    "products": "Produktai",
                    "orders": "Užsakymai",
                    "materials": "Medžiagos",
                    "blog": "Tinklaraštis",
                    "settings": "Nustatymai"
                }
            }
        }
    },
    "lv": {
        "adminSettings": {
            "tabs": {
                "ai": "AI modeļi",
                "marketing": "Mārketings un analītika",
                "seo": "SEO un meta dati",
                "economy": "Ekonomika un maks",
                "gamification": "Spēļošana un nozīmītes",
                "market": "Tirgus un mācību programmu analīze",
                "insights": "AI audits un ieteikumi",
                "channels": "Pārdošanas kanāli",
                "integrations": "Integrācijas un API",
                "interactive": "Spēles un interakcijas",
                "workshop": "AI studija un Canva",
                "automation": "Aģenti un automatizācija",
                "emails": "E-pasta paziņojumi",
                "google": "Google Cloud",
                "abandoned": "Pamestie grozi",
                "guardian": "AI Guardian",
                "affiliate": "Partnerprogramma",
                "pricing": "Cenas un valūtas (PPP)",
                "taxes": "Rēķini un nodokļi"
            },
            "economy": {
                "title": "Punktu un maka sistēma",
                "description": "Pārvaldiet virtuālo valūtu, abonementus un klientu lojalitāti",
                "wallet": {
                    "title": "Virtuālais maks",
                    "enable_wallet": "Iespējot lietotāja maku",
                    "allow_topup": "Atļaut papildināšanu",
                    "recurring_topup": "Automātiska regulāra papildināšana",
                    "conversion_rate": "Papildināšanas kurss (1 EUR = X punkti)"
                }
            },
            "sections": {
                "shopping": "Pirkumi un finanses",
                "ai": "AI un interakcijas",
                "growth": "Izaugsme un zīmols",
                "system": "Sistēmas iestatījumi"
            }
        },
        "adminPanel": {
            "sidebar": {
                "menu": {
                    "dashboard": "Informācijas panelis",
                    "products": "Produkti",
                    "orders": "Pasūtījumi",
                    "materials": "Materiāli",
                    "blog": "Blogs",
                    "settings": "Iestatījumi"
                }
            }
        }
    },
    "et": {
        "adminSettings": {
            "tabs": {
                "ai": "AI mudelid",
                "marketing": "Turundus ja analüütika",
                "seo": "SEO ja metaandmed",
                "economy": "Majandus ja rahakott",
                "gamification": "Mängustamine ja märgid",
                "market": "Turu ja õppekava analüüs",
                "insights": "AI audit ja ettepanekud",
                "channels": "Müügikanalid",
                "integrations": "Integratsioonid ja API",
                "interactive": "Mängud ja interaktsioonid",
                "workshop": "AI stuudio ja Canva",
                "automation": "Agendid ja automatiseerimine",
                "emails": "E-posti teavitused",
                "google": "Google Cloud",
                "abandoned": "Hülatud ostukorvid",
                "guardian": "AI Guardian",
                "affiliate": "Partnerprogramm",
                "pricing": "Hinnad ja valuutad (PPP)",
                "taxes": "Arved ja maksud"
            },
            "economy": {
                "title": "Punktide ja rahakoti süsteem",
                "description": "Hallake virtuaalset valuutat, tellimusi ja kliendilojaalsust",
                "wallet": {
                    "title": "Virtuaalne rahakott",
                    "enable_wallet": "Luba kasutaja rahakott",
                    "allow_topup": "Luba täiendamine",
                    "recurring_topup": "Automaatne korduv täiendamine",
                    "conversion_rate": "Täienduskurss (1 EUR = X punkti)"
                }
            }
        },
        "adminPanel": {
            "sidebar": {
                "menu": {
                    "dashboard": "Töölaud",
                    "products": "Tooted",
                    "orders": "Tellimused",
                    "materials": "Materjalid",
                    "blog": "Blogi",
                    "settings": "Seaded"
                }
            }
        }
    },
    "hr": {
        "adminSettings": {
            "tabs": {
                "ai": "AI modeli",
                "marketing": "Marketing i analitika",
                "seo": "SEO i meta podaci",
                "economy": "Ekonomija i novčanik",
                "gamification": "Gamifikacija i bedževi",
                "market": "Analiza tržišta i kurikuluma",
                "insights": "AI revizija i prijedlozi",
                "channels": "Prodajni kanali",
                "integrations": "Integracije i API",
                "interactive": "Igre i interakcije",
                "workshop": "AI studio i Canva",
                "automation": "Agenti i automatizacija",
                "emails": "E-mail obavijesti",
                "google": "Google Cloud",
                "abandoned": "Napuštene košarice",
                "guardian": "AI Guardian",
                "affiliate": "Partnerski program",
                "pricing": "Cijene i valute (PPP)",
                "taxes": "Računi i porezi"
            },
            "economy": {
                "title": "Sustav bodova i novčanika",
                "description": "Upravljajte virtualnom valutom, pretplatama i lojalnošću kupaca",
                "wallet": {
                    "title": "Virtualni novčanik",
                    "enable_wallet": "Omogući korisnički novčanik",
                    "allow_topup": "Dopusti nadopunu",
                    "recurring_topup": "Automatska ponavljajuća nadopuna",
                    "conversion_rate": "Tečaj nadopune (1 EUR = X bodova)"
                }
            }
        },
        "adminPanel": {
            "sidebar": {
                "menu": {
                    "dashboard": "Nadzorna ploča",
                    "products": "Proizvodi",
                    "orders": "Narudžbe",
                    "materials": "Materijali",
                    "blog": "Blog",
                    "settings": "Postavke"
                }
            }
        }
    },
    "sr": {
        "adminSettings": {
            "tabs": {
                "ai": "AI modeli",
                "marketing": "Marketing i analitika",
                "seo": "SEO i meta podaci",
                "economy": "Ekonomija i novčanik",
                "gamification": "Gamifikacija i bedževi",
                "market": "Analiza tržišta i kurikuluma",
                "insights": "AI revizija i predlozi",
                "channels": "Prodajni kanali",
                "integrations": "Integracije i API",
                "interactive": "Igre i interakcije",
                "workshop": "AI studio i Canva",
                "automation": "Agenti i automatizacija",
                "emails": "E-mail obaveštenja",
                "google": "Google Cloud",
                "abandoned": "Napuštene korpe",
                "guardian": "AI Guardian",
                "affiliate": "Partnerski program",
                "pricing": "Cene i valute (PPP)",
                "taxes": "Računi i porezi"
            },
            "economy": {
                "title": "Sistem bodova i novčanika",
                "description": "Upravljajte virtualnom valutom, pretplatama i lojalnošću kupaca",
                "wallet": {
                    "title": "Virtualni novčanik",
                    "enable_wallet": "Omogući korisnički novčanik",
                    "allow_topup": "Dozvoli dopunu",
                    "recurring_topup": "Automatska ponavljajuća dopuna",
                    "conversion_rate": "Kurs dopune (1 EUR = X bodova)"
                }
            }
        },
        "adminPanel": {
            "sidebar": {
                "menu": {
                    "dashboard": "Kontrolna tabla",
                    "products": "Proizvodi",
                    "orders": "Porudžbine",
                    "materials": "Materijali",
                    "blog": "Blog",
                    "settings": "Postavke"
                }
            }
        }
    }
};

function deepMerge(target, source) {
    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            deepMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

targetLocales.forEach(locale => {
    const filePath = path.join(localesPath, locale, 'admin.json');
    if (fs.existsSync(filePath)) {
        try {
            let content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (translations[locale]) {
                deepMerge(content, translations[locale]);
                fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
                console.log(`Updated ${locale} admin.json`);
            }
        } catch (e) {
            console.error(`Error processing ${locale}: ${e.message}`);
        }
    }
});
