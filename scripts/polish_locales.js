const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'public', 'locales');

const missingKeysData = {
    cs: {
        adminSettings: {
            automation: {
                scrapers: {
                    card_title: "Úkoly prohlížeče",
                    item1: "Najít odkazy na hry v mém profilu Genially",
                    item2: "Zkontrolovat dostupnost nových šablon Canva",
                    item3: "Stáhnout kódy pro sdílení z Wordwallu"
                }
            }
        }
    },
    hr: {
        adminPanel: {
            products: {
                toasts: {
                    linkCopied: "Link za brzu blagajnu je kopiran:\n{link}",
                    deleteConfirm: "Jeste li sigurni da želite obrisati ovaj proizvod?"
                }
            },
            blog: {
                categories: {
                    recenzje: "Recenzije"
                }
            }
        }
    },
    hu: {
        adminSettings: {
            automation: {
                scrapers: {
                    card_title: "Böngésző feladatok"
                }
            }
        },
        adminPanel: {
            dashboard: {
                recentOrders: {
                    status: {
                        processing: "Feldolgozás alatt"
                    }
                }
            }
        }
    },
    lt: {
        adminPanel: {
            blog: {
                categories: {
                    inspiracje: "Inspiracijos ir idėjos"
                }
            }
        }
    },
    lv: {
        adminPanel: {
            integrations: {
                agent: {
                    mockAnalysis: {
                        optimizedTitleSuffix: "Visaptverošs mācību materiāls skolotājiem",
                        suggestedPrice: "12,99 €",
                        subject: "Angļu valodas māksla",
                        seoTags: "mājmācība, darba lapas, vārdnīca, zibatmiņas kartītes, skolotāju resursi"
                    }
                }
            }
        }
    },
    sk: {
        adminPanel: {
            orders: {
                table: {
                    products: "Produkty"
                }
            },
            materials: {
                dialog: {
                    selectLabel: "Vybrať produkt",
                    placeholder: "Vyberte produkt zo zoznamu..."
                }
            }
        }
    }
};

function deepAssign(target, source) {
    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            deepAssign(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
}

for (const lang in missingKeysData) {
    const p = path.join(localesDir, lang, 'admin.json');
    if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        deepAssign(data, missingKeysData[lang]);
        fs.writeFileSync(p, JSON.stringify(data, null, 2));
        console.log(`[${lang}] Polished admin.json`);
    }
}
