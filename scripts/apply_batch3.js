const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'product-translations-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

const batch3 = {
    "stories-na-jesien": {
        nl: { title: "Herfstverhalen E-book", description: "Sfeervolle Engelse verhalen over de herfst. Inclusief audio en woordenschat." },
        sv: { title: "Höstberättelser E-bok", description: "Stämningsfulla engelska berättelser om hösten. Inkluderar ljud och ordförråd." },
        fi: { title: "Syystarinat E-kirja", description: "Tunnelmallisia englanninkielisiä tarinoita syksystä. Sisältää äänen ja sanaston." },
        no: { title: "Høstfortellinger E-bok", description: "Stemningsfulle engelske fortellinger om høsten. Inkluderer lyd og ordforråd." },
        da: { title: "Efterårshistorier E-bog", description: "Stemningsfulde engelske historier om efteråret. Indeholder lyd og ordforråd." }
    },
    "stories-na-zime-ebook": {
        nl: { title: "Winterverhalen E-book", description: "Magische verhalen over de winter en Kerstmis. Perfect voor de koude dagen." },
        sv: { title: "Vinterberättelser E-bok", description: "Magiska berättelser om vintern och julen. Perfekt för de kalla dagarna." },
        fi: { title: "Talvitarinat E-kirja", description: "Maagisia tarinoita talvesta ja joulusta. Täydellinen kylmiin päiviin." },
        no: { title: "Vinterfortellinger E-bok", description: "Magiske fortellinger om vinteren og julen. Perfekt for de kalde dagene." },
        da: { title: "Vinterhistorier E-bog", description: "Magiske historier om vinteren og julen. Perfekt til de kolde dage." }
    },
    "stories-na-wiosne-ebook": {
        nl: { title: "Lenteverhalen E-book", description: "Vrolijke verhalen over de ontwakende natuur en Pasen." },
        sv: { title: "Vårberättelser E-bok", description: "Glada berättelser om den vaknande naturen och påsken." },
        fi: { title: "Kevättarinat E-kirja", description: "Iloisia tarinoita heräävästä luonnosta ja pääsiäisestä." },
        no: { title: "Vårfortellinger E-bok", description: "Glae fortellinger om naturen som våkner og påsken." },
        da: { title: "Forårshistorier E-bog", description: "Glade historier om den spirende natur og påsken." }
    },
    "stories-na-lato-ebook": {
        nl: { title: "Zomerverhalen E-book", description: "Zonnige avonturen en vakantiethema's in het Engels." },
        sv: { title: "Sommarberättelser E-bok", description: "Soliga äventyr och semesterteman på engelska." },
        fi: { title: "Kesätarinat E-kirja", description: "Aurinkoisia seikkailuja ja lomateemoja englanniksi." },
        no: { title: "Sommerfortellinger E-bok", description: "Solrike eventyr og ferietemaer på engelsk." },
        da: { title: "Sommerhistorier E-bog", description: "Solrige eventyr og ferietemaer på engelsk." }
    },
    "scenariusz-przedstawienia-lato": {
        nl: { title: "Zomertoneelstuk Script", description: "Een vrolijk script voor een zomerse eindpresentatie." },
        sv: { title: "Sommarteater Manus", description: "Ett glatt manus för en somrig avslutningspresentation." },
        fi: { title: "Kesänäytelmä -Käsikirjoitus", description: "Iloinen käsikirjoitus kesäiseen loppuesitykseen." },
        no: { title: "Sommerskuespill Manus", description: "Et glatt manus for en sommerlig avslutningsforestilling." },
        da: { title: "Sommerskuespil Manuskript", description: "Et glad manuskript til en sommerlig afslutningspræsentation." }
    },
    "lets-celebrate": {
        nl: { title: "Laten we Feesten! Speciaal Pakket", description: "Alles over feestdagen en vieringen over de hele wereld." },
        sv: { title: "Låt oss fira! Specialpaket", description: "Allt om högtider och firanden från hela världen." },
        fi: { title: "Juhlitaan! Erikoispaketti", description: "Kaikki juhlapäivistä ja juhlista ympäri maailmaa." },
        no: { title: "La oss feire! Spesialpakke", description: "Alt om høytider og feiringer fra hele verden." },
        da: { title: "Lad os Fejre! Specialpakke", description: "Alt om helligdage og fejringer fra hele verden." }
    },
    "speakbook-my-fairy-tale-character-day": {
        nl: { title: "Speakbook: Mijn Sprookjesdag", description: "Interactieve woordenschat rond bekende sprookjesfiguren." },
        sv: { title: "Speakbook: Min sagodag", description: "Interaktivt ordförråd kring kända sagofigurer." },
        fi: { title: "Speakbook: Satupäiväni", description: "Vuorovaikutteista sanastoa tunnettujen satuhahmojen ympärillä." },
        no: { title: "Speakbook: Min eventyrdag", description: "Interaktivt ordforråd rundt kjente eventyrfigurer." },
        da: { title: "Speakbook: Min Eventyrdag", description: "Interaktivt ordforråd omkring kendte eventyrfigurer." }
    },
    "speakbook-my-winter": {
        nl: { title: "Speakbook: Mijn Winter", description: "Leer praten over sneeuw, kleding en winterpret." },
        sv: { title: "Speakbook: Min vinter", description: "Lär dig prata om snö, kläder och vinternöjen." },
        fi: { title: "Speakbook: Talveni", description: "Opi puhumaan lumesta, vaatteista ja talven iloista." },
        no: { title: "Speakbook: Min vinter", description: "Lær å snakke om snø, klær og vintermoro." },
        da: { title: "Speakbook: Min Vinter", description: "Lær at tale om sne, tøj og vintersjov." }
    },
    "speakbook-my-christmas": {
        nl: { title: "Speakbook: Mijn Kerst", description: "Woordenschat rond tradities, cadeautjes en de boom." },
        sv: { title: "Speakbook: Min jul", description: "Ordförråd kring traditioner, presenter och granen." },
        fi: { title: "Speakbook: Joulu", description: "Sanastoa perinteistä, lahjoista ja joulukuusesta." },
        no: { title: "Speakbook: Min jul", description: "Ordforråd rundt tradisjoner, gaver og juletreet." },
        da: { title: "Speakbook: Min Jul", description: "Ordforråd omkring traditioner, gaver og juletræet." }
    },
    "speakbook-my-grandparents": {
        nl: { title: "Speakbook: Mijn Grootouders", description: "Leren praten over familie en herinneringen." },
        sv: { title: "Speakbook: Mina mor- och farföräldrar", description: "Lär dig prata om familj och minnen." },
        fi: { title: "Speakbook: Isovanhempani", description: "Opi puhumaan perheestä ja muistoista." },
        no: { title: "Speakbook: Mine besteforeldre", description: "Lær å snakke om familie og minner." },
        da: { title: "Speakbook: Mine Bedsteforældre", description: "Lær at tale om familie og minder." }
    },
    "speakbook-my-pizza-day": {
        nl: { title: "Speakbook: Mijn Pizzadag", description: "Woordenschat voor ingrediënten en koken." },
        sv: { title: "Speakbook: Min pizzadag", description: "Ordförråd för ingredienser och matlagning." },
        fi: { title: "Speakbook: Pizzapäiväni", description: "Sanastoa ainesosista ja ruoanlaitosta." },
        no: { title: "Speakbook: Min pizzadag", description: "Ordforråd for ingredienser og matlaging." },
        da: { title: "Speakbook: Min Pizzadag", description: "Ordforråd til ingredienser og madlavning." }
    },
    "speakbook-my-australia-day": {
        nl: { title: "Speakbook: Mijn Australië-dag", description: "Leren over dieren en natuur in Australië." },
        sv: { title: "Speakbook: Min Australiendag", description: "Lär dig om djur och natur i Australien." },
        fi: { title: "Speakbook: Australia-päiväni", description: "Opi Australian eläimistä ja luonnosta." },
        no: { title: "Speakbook: Min Australia-dag", description: "Lær om dyr og natur i Australia." },
        da: { title: "Speakbook: Min Australia-dag", description: "Lær om dyr og natur i Australien." }
    },
    "speakbook-all-about-me": {
        nl: { title: "Speakbook: Alles over Mij", description: "Zichzelf voorstellen, hobby's en favoriete dingen." },
        sv: { title: "Speakbook: Allt om mig", description: "Presentera sig själv, hobbyer och favoritsaker." },
        fi: { title: "Speakbook: Kaikki Minusta", description: "Itsensä esittely, harrastukset ja suosikkiasiat." },
        no: { title: "Speakbook: Alt om meg", description: "Presentere seg selv, hobbyer og favoritting." },
        da: { title: "Speakbook: Alt Om Mig", description: "Præsenter dig selv, hobbier og yndlingsting." }
    },
    "speakbook-my-day-of-european-languages": {
        nl: { title: "Speakbook: Mijn Europese Talendag", description: "Groeten in verschillende talen en vlaggen leren." },
        sv: { title: "Speakbook: Min europeiska språkkväll", description: "Hälsningar på olika språk och lära sig flaggor." },
        fi: { title: "Speakbook: Eurooppalainen Kielipäiväni", description: "Tervehdyksiä eri kielillä ja lippujen opettelua." },
        no: { title: "Speakbook: Min europeiske språkkveld", description: "Hilsener på forskjellige språk og lære flagg." },
        da: { title: "Speakbook: Min Europæiske Sprogdag", description: "Hilsner på forskellige sprog og læring om flag." }
    },
    "speakbook-my-autumn": {
        nl: { title: "Speakbook: Mijn Herfst", description: "Natuur, bladeren en herfstactiviteiten." },
        sv: { title: "Speakbook: Min höst", description: "Natur, löv och höstaktiviteter." },
        fi: { title: "Speakbook: Syksyni", description: "Luonto, lehdet ja syystoiminnat." },
        no: { title: "Speakbook: Min høst", description: "Natur, blader og høstaktiviteter." },
        da: { title: "Speakbook: Min Efterår", description: "Natur, blade og efterårsaktiviteter." }
    }
};

for (const productId in batch3) {
    const searchStr = `"${productId}": {`;
    const startIdx = content.indexOf(searchStr);
    if (startIdx !== -1) {
        let braceCount = 1;
        let pos = startIdx + searchStr.length;
        while (braceCount > 0 && pos < content.length) {
            if (content[pos] === '{') braceCount++;
            if (content[pos] === '}') braceCount--;
            pos++;
        }

        const blockEnd = pos - 1; // At the closing }
        const translationsStr = Object.entries(batch3[productId]).map(([lang, data]) => {
            return `        ${lang}: { title: "${data.title}", description: "${data.description}" }`;
        }).join(',\n');

        content = content.slice(0, blockEnd) + ',\n' + translationsStr + '\n    ' + content.slice(blockEnd);
    }
}

fs.writeFileSync(filePath, content);
console.log("Applied Batch 3 translations.");
