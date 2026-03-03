const fs = require('fs');
const path = require('path');

const localesPath = 'public/locales';
const targetLocales = ['lt', 'lv', 'et', 'hr', 'sr'];

const data = {
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
            "marketing": {
                "ga4": "Google Analytics 4",
                "ga4_placeholder": "G-XXXXXXXXXX",
                "fb_pixel": "Facebook Pixel",
                "fb_pixel_placeholder": "Pikselio ID",
                "meta_verification": "Meta domeno patvirtinimas",
                "meta_placeholder": "Patvirtinimo raktas",
                "gsc": "Google Search Console",
                "gsc_placeholder": "Google patvirtinimo raktas",
                "enabled": "Įjungti sekimą"
            },
            "economy": {
                "subscriptions": {
                    "title": "Planai ir prenumeratos",
                    "description": "Sukurkite periodinės prieigos modelius medžiagai",
                    "status_active": "AKTYVU",
                    "per_month": "/ mėn.",
                    "perks": {
                        "all_pdfs": "Visi PDF be apribojimų",
                        "free_topup": "Nemokamas piniginės papildymas ({amount} kiekvieną mėnesį)"
                    },
                    "add_plan": "Pridėti naują planą"
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
                "perks": {
                    "discount": "Automatinė nuolaida (%)",
                    "auto_discount": "Taikoma automatiškai apmokėjimo metu",
                    "hidden_tier": "Tik rankinis priskyrimas"
                },
                "badges_title": "Studentų ženkleliai",
                "badges": {
                    "early_bird": { "name": "Anstyvasis paukštis", "desc": "Pirkimas per 1 val. nuo paskelbimo" },
                    "collector": { "name": "Kolekcionierius", "desc": "Turi 50+ medžiagų" },
                    "top_reviewer": { "name": "Geriausias apžvalgininkas", "desc": "10 patikimų apžvalgų" }
                }
            },
            "integrations": {
                "title": "Jungtys ir Webhooks",
                "description": "Valdykite išorines jungtis ir automatizavimą",
                "webhooks": {
                    "title": "Webhooks",
                    "description": "Siųsti užsakymų pranešimus į išorines sistemas",
                    "add": "Pridėti Webhook",
                    "url": "Tikslinis URL",
                    "event": "Įvykis",
                    "events": {
                        "order_created": "Užsakymas sukurtas",
                        "order_paid": "Užsakymas apmokėtas",
                        "user_registered": "Vartotojas užsiregistravo"
                    }
                }
            },
            "google": {
                "title": "Integracija su Google Cloud",
                "description": "Prijunkite Google Drive, kad galėtumėte importuoti medžiagą tiesiai į parduotuvę",
                "auth": {
                    "title": "Google autorizacija",
                    "connect": "Prijungti Google Drive",
                    "disconnect": "Atjungti paskyrą",
                    "status_connected": "Prijungta prie: {email}"
                },
                "config": {
                    "client_id": "Google Client ID",
                    "client_secret": "Google Client Secret"
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
            "marketing": {
                "fb_pixel_placeholder": "Pikseļa ID",
                "meta_verification": "Meta domēna verifikācija",
                "enabled": "Iespējot izsekošanu"
            },
            "economy": {
                "subscriptions": {
                    "title": "Plāni un abonementi",
                    "description": "Izveidojiet periodiskas piekļuves modeļus materiāliem",
                    "status_active": "AKTĪVS",
                    "per_month": "/ mēn.",
                    "perks": {
                        "all_pdfs": "Visi PDF bez ierobežojumiem",
                        "free_topup": "Bezmaksas maka papildināšana ({amount} katru mēnesi)"
                    },
                    "add_plan": "Pievienot jaunu plānu"
                }
            },
            "gamification": {
                "title": "Spēļošana",
                "description": "Motivējiet skolēnus ar līmeņiem, nozīmītēm un apbalvojumiem.",
                "levels": {
                    "silver": "Sudraba līmenis",
                    "gold": "Zelta līmenis",
                    "diamond": "Dimanta VIP"
                },
                "badges_title": "Studentu nozīmītes",
                "badges": {
                    "early_bird": { "name": "Agrais putns", "desc": "Pirkums 1 stundas laikā pēc publicēšanas" }
                }
            },
            "integrations": {
                "title": "Savienotāji un Webhooks",
                "description": "Pārvaldiet ārējos savienojumus un automatizāciju",
                "webhooks": {
                    "title": "Webhooks",
                    "description": "Sūtiet pasūtījumu paziņojumus uz ārējām sistēmām",
                    "add": "Pievienot Webhook",
                    "url": "Mērķa URL",
                    "event": "Notikums",
                    "events": {
                        "order_created": "Pasūtījums izveidots",
                        "order_paid": "Pasūtījums apmaksāts",
                        "user_registered": "Lietotājs reģistrēts"
                    }
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
            "marketing": {
                "fb_pixel_placeholder": "Piksli ID",
                "meta_verification": "Meta domeeni kinnitamine",
                "enabled": "Luba jälgimine"
            },
            "economy": {
                "subscriptions": {
                    "title": "Plaanid ja tellimused",
                    "description": "Looge materjalidele korduva juurdepääsu mudelid",
                    "status_active": "AKTIIVNE",
                    "per_month": "/ kuu",
                    "perks": {
                        "all_pdfs": "Kõik PDF-id piiranguteta",
                        "free_topup": "Tasuta rahakoti täiendamine ({amount} iga kuu)"
                    },
                    "add_plan": "Lisa uus plaan"
                }
            },
            "gamification": {
                "title": "Mängustamine",
                "description": "Motiveerige õpilasi tasemete, märkide ja auhindadega.",
                "levels": {
                    "silver": "Hõbetase",
                    "gold": "Kuldne tase",
                    "diamond": "Teemant VIP"
                },
                "badges_title": "Õpilaste märgid"
            },
            "integrations": {
                "title": "Ühendused ja Webhookid",
                "description": "Hallake väliseid ühendusi ja automatiseerimist",
                "webhooks": {
                    "title": "Webhookid",
                    "description": "Saada tellimuse teavitused välistesse süsteemidesse",
                    "events": {
                        "order_created": "Tellimus loodud",
                        "order_paid": "Tellimus makstud",
                        "user_registered": "Kasutaja registreeritud"
                    }
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
            "marketing": {
                "fb_pixel_placeholder": "ID piksela",
                "meta_verification": "Potvrda Meta domene",
                "enabled": "Omogući praćenje"
            },
            "economy": {
                "subscriptions": {
                    "title": "Planovi i pretplate",
                    "description": "Kreirajte modele periodičnog pristupa materijalima",
                    "status_active": "AKTIVNO",
                    "per_month": "/ mjec.",
                    "perks": {
                        "all_pdfs": "Svi PDF-ovi bez ograničenja",
                        "free_topup": "Besplatna nadopuna novčanika ({amount} svakog mjeseca)"
                    },
                    "add_plan": "Dodaj novi plan"
                }
            },
            "gamification": {
                "title": "Gamifikacija",
                "description": "Motivirajte učenike razinama, bedževima i nagradama.",
                "levels": {
                    "silver": "Srebrna razina",
                    "gold": "Zlatna razina",
                    "diamond": "Dijamantni VIP"
                },
                "badges_title": "Bedževi učenika"
            },
            "integrations": {
                "title": "Konektori i Webhookovi",
                "description": "Upravljajte vanjskim vezama i automatizacijom",
                "webhooks": {
                    "title": "Webhookovi",
                    "events": {
                        "order_created": "Narudžba kreirana",
                        "order_paid": "Narudžba plaćena",
                        "user_registered": "Korisnik registriran"
                    }
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
            "marketing": {
                "fb_pixel_placeholder": "ID piksela",
                "meta_verification": "Potvrda Meta domene",
                "enabled": "Omogući praćenje"
            },
            "economy": {
                "subscriptions": {
                    "title": "Planovi i pretplate",
                    "description": "Kreirajte modele periodičnog pristupa materijalima",
                    "status_active": "AKTIVNO",
                    "per_month": "/ mesec",
                    "perks": {
                        "all_pdfs": "Svi PDF-ovi bez ograničenja",
                        "free_topup": "Besplatna dopuna novčanika ({amount} svakog meseca)"
                    },
                    "add_plan": "Dodaj novi plan"
                }
            },
            "gamification": {
                "title": "Gamifikacija",
                "description": "Motivišite učenike nivoima, bedževima i nagradama.",
                "levels": {
                    "silver": "Srebrni nivo",
                    "gold": "Zlatni nivo",
                    "diamond": "Dijamantski VIP"
                },
                "badges_title": "Bedževi učenika"
            },
            "integrations": {
                "title": "Konektori i Webhookovi",
                "description": "Upravljajte spoljnim vezama i automatizacijom",
                "webhooks": {
                    "title": "Webhookovi",
                    "events": {
                        "order_created": "Porudžbina kreirana",
                        "order_paid": "Porudžbina plaćena",
                        "user_registered": "Korisnik registrovan"
                    }
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
            if (data[locale]) {
                deepMerge(content, data[locale]);
                fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
                console.log(`Updated ${locale} admin.json`);
            }
        } catch (e) {
            console.error(`Error processing ${locale}: ${e.message}`);
        }
    }
});
