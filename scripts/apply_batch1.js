const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'product-translations-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

const batch1 = {
    "pakiet-scenariuszy-luty-marzec-kwiecien-maj-czerwiec": {
        nl: { title: "Lesplannen Pakket (Feb-Jun)", description: "Pakket lesplannen voor de maanden februari tot juni. Inclusief alle materialen en activiteiten voor kleuters." },
        sv: { title: "Lektionsplanspaket (Feb-Jun)", description: "Lektionsplanspaket för månaderna februari till juni. Inkluderar allt material och aktiviteter för förskolebarn." },
        fi: { title: "Tuntisuunnitelmapaketti (Helmi-Kesä)", description: "Tuntisuunnitelmapaketti helmi-kesäkuulle. Sisältää kaikki materiaalit ja aktiviteetit esikoululaisille." },
        no: { title: "Leksjonsplanpakke (Feb-Jun)", description: "Leksjonsplanpakke for månedene februar til juni. Inkluderer alt materiell og aktiviteter for barnehagebarn." },
        da: { title: "Lektionsplanpakke (Feb-Jun)", description: "Lektionsplanpakke for månederne februar til juni. Inkluderer alt materiale og aktiviteter for børnehavebørn." }
    },
    "pakiet-scenariuszy-wrzesien-styczen": {
        nl: { title: "Lesplannen Pakket (Sep-Jan)", description: "Pakket lesplannen voor de maanden september tot januari. De perfecte start van het schooljaar." },
        sv: { title: "Lektionsplanspaket (Sep-Jan)", description: "Lektionsplanspaket för månaderna september till januari. Den perfekta starten på läsåret." },
        fi: { title: "Tuntisuunnitelmapaketti (Syys-Tammi)", description: "Tuntisuunnitelmapaketti syys-tammikuulle. Täydellinen aloitus kouluvuodelle." },
        no: { title: "Leksjonsplanpakke (Sep-Jan)", description: "Leksjonsplanpakke for månedene september til januar. Den perfekte starten på skoleåret." },
        da: { title: "Lektionsplanpakke (Sep-Jan)", description: "Lektionsplanpakke for månederne september til januar. Den perfekte start på skoleåret." }
    },
    "pakiet-stories-e-booki-na-4-pory-roku": {
        nl: { title: "Verhalenpakket: 4 Seizoenen", description: "Een set e-books en flashcards voor elk van de vier seizoenen. Ideaal voor het leren van thematische woordenschat." },
        sv: { title: "Berättelsepaket: 4 Årstider", description: "En uppsättning e-böcker och bildkort för var och en av de fyra årstiderna. Perfekt för att lära sig tematiskt ordförråd." },
        fi: { title: "Tarinapaketti: 4 Vuodenaikaa", description: "Setti e-kirjoja ja kuvakortteja jokaiselle neljälle vuodenajalle. Ihanteellinen teemasanaston oppimiseen." },
        no: { title: "Fortellingpakke: 4 Årstider", description: "Et sett med e-bøker og bildekort for hver av de fire årstidene. Ideell for å lære tematisk ordforråd." },
        da: { title: "Historiepakke: 4 Årstider", description: "Et sæt e-bøger og billedkort til hver af de fire årstider. Ideel til at lære tematisk ordforråd." }
    },
    "angielski-w-zlobku-autumn-pack": {
        nl: { title: "Engels bij de Kinderopvang: Herfstpakket", description: "Creatieve materialen voor de allerkleinsten met een herfstthema. Inclusief foto's en liedjes." },
        sv: { title: "Engelska i Förskolan: Höstpaket", description: "Kreativt material för de minsta med hösttema. Inkluderar foton och sånger." },
        fi: { title: "Englanti Lastenseimessä: Syyspaketti", description: "Luovaa materiaalia pienimmille syysteemaan. Sisältää valokuvia ja lauluja." },
        no: { title: "Engelsk i Barneparken: Høstpakke", description: "Kreativt materiell for de minste med høsttema. Inkluderer bilder og sanger." },
        da: { title: "Engelsk i Vuggestuen: Efterårspakke", description: "Kreativt materiale til de mindste med efterårstema. Indeholder fotos og sange." }
    },
    "angielski-przez-teatr-dla-zerowki-i-klas-1-3": {
        nl: { title: "Engels via Theater (Groep 1-5)", description: "Toneelstukken en drama-activiteiten voor jonge leerlingen. Ontwikkel spreekvaardigheid door spel." },
        sv: { title: "Engelska genom Teater (Årskurs 0-3)", description: "Pjäser och dramaaktiviteter för yngre elever. Utveckla talförmåga genom lek." },
        fi: { title: "Englanti Teatterin Kautta (0-3 Luokat)", description: "Näytelmiä ja draamatoimintaa nuorille oppilaille. Kehitä puhetaitoja leikin avulla." },
        no: { title: "Engelsk gjennom Teater (0-3. trinn)", description: "Skuespill og dramaaktiviteter for yngre elever. Utvikle taleevne gjennom lek." },
        da: { title: "Engelsk gennem Teater (0.-3. klasse)", description: "Skuespil og dramaaktiviteter til yngre elever. Udvikl taleevner gennem leg." }
    },
    "merry-christmas-pack": {
        nl: { title: "Vrolijk Kerstfeest Pakket", description: "Alles wat je nodig hebt voor gezellige kerstlessen. Flashcards, spelletjes en werkbladen." },
        sv: { title: "God Jul-Paket", description: "Allt du behöver för mysiga jullektioner. Bildkort, lekar och arbetsblad." },
        fi: { title: "Hyvää Joulua -Paketti", description: "Kaikki mitä tarvitset mukaviin joulutunteihin. Kuvakortteja, pelejä ja työlomakkeita." },
        no: { title: "God Jul-Pakke", description: "Alt du trenger for koselige juleundervisning. Bildekort, leker og arbeidsark." },
        da: { title: "Glædelig Jul-Pakke", description: "Alt hvad du har brug for til hyggelige julelektioner. Billedkort, lege og arbejdsark." }
    },
    "przedszkole-pakiet-materialow-na-jesien": {
        nl: { title: "Kleuterschool: Herfstpakket", description: "Thematische PDF-materialen voor de herfstperiode. Klaar om te printen." },
        sv: { title: "Förskola: Höstpaket", description: "Tematiskt PDF-material för höstperioden. Redo att skrivas ut." },
        fi: { title: "Eskari: Syyspaketti", description: "Teemallisia PDF-materiaaleja syyskaudelle. Valmiina tulostettavaksi." },
        no: { title: "Barnehage: Høstpakke", description: "Tematisk PDF-materiell for høstperioden. Klart til utskrift." },
        da: { title: "Børnehave: Efterårspakke", description: "Tematisk PDF-materiale til efterårsperioden. Klar til print." }
    },
    "przedszkole-pakiet-materialow-na-zime": {
        nl: { title: "Kleuterschool: Winterpakket", description: "Thematische PDF-materialen voor de winterperiode. Sneeuw, kerst en kou." },
        sv: { title: "Förskola: Vinterpaket", description: "Tematiskt PDF-material för vinterperioden. Snö, jul och kyla." },
        fi: { title: "Eskari: Talvipaketti", description: "Teemallisia PDF-materiaaleja talvikaudelle. Lunta, joulua ja pakkasta." },
        no: { title: "Barnehage: Vinterpakke", description: "Tematisk PDF-materiell for vinterperioden. Snø, jul og kulde." },
        da: { title: "Børnehave: Vinterpakke", description: "Tematisk PDF-materiale til vinterperioden. Sne, jul og kulde." }
    },
    "przedszkole-pakiet-materialow-na-wszystkie-na-wiosne": {
        nl: { title: "Kleuterschool: Lentepakket", description: "Thematische PDF-materialen voor de lente. Pasen, bloemen en dieren." },
        sv: { title: "Förskola: Vårpaket", description: "Tematiskt PDF-material för våren. Påsk, blommor och djur." },
        fi: { title: "Eskari: Kevätpaketti", description: "Teemallisia PDF-materiaaleja keväälle. Pääsiäinen, kukkia ja eläimiä." },
        no: { title: "Barnehage: Vårpakke", description: "Tematisk PDF-materiell for våren. Påske, blomster og dyr." },
        da: { title: "Børnehave: Forårspakke", description: "Tematisk PDF-materiale til foråret. Påske, blomster og dyr." }
    },
    "przedszkole-zestaw-materialow-na-lato": {
        nl: { title: "Kleuterschool: Zomerpakket", description: "Thematische PDF-materialen voor de zomer. Vakantie, zee en zon." },
        sv: { title: "Förskola: Sommarpaket", description: "Tematiskt PDF-material för sommaren. Semester, hav och sol." },
        fi: { title: "Eskari: Kesäpaketti", description: "Teemallisia PDF-materiaaleja kesälle. Loma, meri ja aurinko." },
        no: { title: "Barnehage: Sommerpakke", description: "Tematisk PDF-materiell for sommeren. Ferie, hav og sol." },
        da: { title: "Børnehave: Sommerpakke", description: "Tematisk PDF-materiale til sommeren. Ferie, hav og sol." }
    },
    "angielski-w-zlobku-zestaw-february": {
        nl: { title: "Engels bij de Kinderopvang: Februari Set", description: "Materialen voor februari: carnaval en emoties." },
        sv: { title: "Engelska i Förskolan: Februari-set", description: "Material för februari: karneval och känslor." },
        fi: { title: "Englanti Lastenseimessä: Helmikuu-setti", description: "Materiaaleja helmikuulle: karnevaali ja tunteet." },
        no: { title: "Engelsk i Barneparken: Februar-sett", description: "Materiell for februar: karneval og følelser." },
        da: { title: "Engelsk i Vuggestuen: Februar-sæt", description: "Materialer til februar: karneval og følelser." }
    },
    "plany-zajec-czerwiec": {
        nl: { title: "Lesplannen – Juni", description: "Thema's: zomer, vakantie en vaderdag." },
        sv: { title: "Lektionsplaner – Juni", description: "Teman: sommar, semester och mors dag." },
        fi: { title: "Tuntisuunnitelmat – Kesäkuu", description: "Teemat: kesä, loma ja isänpäivä." },
        no: { title: "Leksjonsplaner – Juni", description: "Temaer: sommer, ferie og farsdag." },
        da: { title: "Lektionsplaner – Juni", description: "Temaer: sommer, ferie og fars dag." }
    },
    "plany-zajec-luty": {
        nl: { title: "Lesplannen – Februari", description: "Thema's: kleding, carnaval en dinosaurussen." },
        sv: { title: "Lektionsplaner – Februari", description: "Teman: kläder, karneval och dinosaurier." },
        fi: { title: "Tuntisuunnitelmat – Helmikuu", description: "Teemat: vaatteet, karnevaali ja dinosaurukset." },
        no: { title: "Leksjonsplaner – Februar", description: "Temaer: klær, karneval og dinosaurer." },
        da: { title: "Lektionsplaner – Februar", description: "Temaer: tøj, karneval og dinosaurer." }
    },
    "plany-zajec-listopad": {
        nl: { title: "Lesplannen – November", description: "Thema's: herfst, bos en dieren." },
        sv: { title: "Lektionsplaner – November", description: "Teman: höst, skog och djur." },
        fi: { title: "Tuntisuunnitelmat – Marraskuu", description: "Teemat: syksy, metsä ja eläimet." },
        no: { title: "Leksjonsplaner – November", description: "Temaer: høst, skog og dyr." },
        da: { title: "Lektionsplaner – November", description: "Temaer: efterår, skov og dyr." }
    },
    "pumpking-day": {
        nl: { title: "Pompoendag: Decoratie en Spel", description: "Maak van Halloween een educatief feestje." },
        sv: { title: "Pumpadagen: Dekoration och Lek", description: "Gör Halloween till en pedagogisk fest." },
        fi: { title: "Kurpitsapäivä: Koristelu ja Peli", description: "Tee Halloweenista opetuksellinen juhla." },
        no: { title: "Gresskardagen: Dekorasjon og Lek", description: "Gjør Halloween til en pedagogisk fest." },
        da: { title: "Græskardag: Dekoration og Leg", description: "Gør Halloween til en pædagogisk fest." }
    }
};

for (const productId in batch1) {
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
        const translationsStr = Object.entries(batch1[productId]).map(([lang, data]) => {
            return `        ${lang}: { title: "${data.title}", description: "${data.description}" }`;
        }).join(',\n');

        content = content.slice(0, blockEnd) + ',\n' + translationsStr + '\n    ' + content.slice(blockEnd);
    }
}

fs.writeFileSync(filePath, content);
console.log("Applied Batch 1 translations.");
