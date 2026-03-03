const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'public', 'locales');

// common.json gaps
const commonGaps = {
    cs: { certificates: { verifiedTitle: "Ověřený certifikát" } },
    hu: { certificates: { verifiedTitle: "Ellenőrzött tanúsítvány" } },
    ro: { certificates: { verifiedTitle: "Certificat verificat" } }
};

// landing.json gaps
const landingGaps = {
    cs: {
        trustBar: {
            socialCommunity: {
                header: "Připojte se k naší komunitě",
                desc: "Více než 12 000 učitelů angličtiny sdílí nápady a názory v naší skupině. Sledujte novinky a darmové materiály!",
                cta: "Sledujte nás na Facebooku",
                followers: "Sledujících",
                stats: "Stažených materiálů"
            }
        }
    },
    ro: {
        trustBar: {
            socialCommunity: {
                header: "Alătură-te comunității noastre",
                desc: "Peste 12.000 de profesori de limba engleză împărtășesc idei și opinii în grupul nostru. Fiți la curent cu noutățile și materialele gratuite!",
                cta: "Urmărește-ne pe Facebook",
                followers: "Urmăritori",
                stats: "Materiale descărcate"
            }
        }
    },
    sk: {
        trustBar: {
            socialCommunity: {
                header: "Pridajte sa k našej komunite",
                desc: "Viac ako 12 000 učiteľov angličtiny zdieľa nápady a názory v našej skupine. Sledujte novinky a darmové materiály!",
                cta: "Sledujte nás na Facebooku",
                followers: "Sledujúcich",
                stats: "Stiahnutých materiálov"
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

// Apply common gaps
for (const lang in commonGaps) {
    const p = path.join(localesDir, lang, 'common.json');
    if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        deepAssign(data, commonGaps[lang]);
        fs.writeFileSync(p, JSON.stringify(data, null, 2));
        console.log(`[${lang}] Updated common.json`);
    }
}

// Apply landing gaps
for (const lang in landingGaps) {
    const p = path.join(localesDir, lang, 'landing.json');
    if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        deepAssign(data, landingGaps[lang]);
        fs.writeFileSync(p, JSON.stringify(data, null, 2));
        console.log(`[${lang}] Updated landing.json`);
    }
}
