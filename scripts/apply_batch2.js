const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'product-translations-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

const batch2 = {
    "guy-fawkes-day-bonfire-night": {
        nl: { title: "Guy Fawkes Day & Bonfire Night", description: "Ontdek Britse tradities. Inclusief geschiedenis, flashcards en creatieve opdrachten." },
        sv: { title: "Guy Fawkes Day & Bonfire Night", description: "Upptäck brittiska traditioner. Inkluderar historia, bildkort och kreativa uppgifter." },
        fi: { title: "Guy Fawkes Day & Bonfire Night", description: "Tutustu brittiläisiin perinteisiin. Sisältää historiaa, kuvakortteja ja luovia tehtäviä." },
        no: { title: "Guy Fawkes Day & Bonfire Night", description: "Oppdag britiske tradisjoner. Inkluderer historie, bildekort og kreative oppgaver." },
        da: { title: "Guy Fawkes Day & Bonfire Night", description: "Oplev britiske traditioner. Indeholder historie, billedkort og kreative opgaver." }
    },
    "day-of-languages-dekoracja-i-gra": {
        nl: { title: "Dag van de Talen: Decoratie en Spel", description: "Vier de taalkundige diversiteit in de klas. Slingers, spelletjes en posters." },
        sv: { title: "Språkens dag: Dekoration och Spel", description: "Fira den språkliga mångfalden i klassrummet. Girlanger, lekar och affischer." },
        fi: { title: "Kielten Päivä: Koristelu ja Peli", description: "Juhlista kielellistä monimuotoisuutta luokassa. Viirejä, pelejä ja julisteita." },
        no: { title: "Språkdagen: Dekorasjon og Lek", description: "Feir det språklige mangfoldet i klasserommet. Girlangere, leker og plakater." },
        da: { title: "Sprogenes Dag: Dekoration og Leg", description: "Fejr den sproglige mangfoldighed i klassen. Guirlander, lege og plakater." }
    },
    "kulturowa-lekcja-pokazowa-london-tour": {
        nl: { title: "Cultuurles: London Tour", description: "Virtuele reis door Londen. Bezienswaardigheden, quizzen en interessante weetjes." },
        sv: { title: "Kulturlektion: London Tour", description: "Virtuell resa genom London. Sevärdheter, quiz och intressanta fakta." },
        fi: { title: "Kulttuuritunti: London Tour", description: "Virtuaalinen matka Lontoon halki. Nähtävyyksiä, tietovisoja ja mielenkiintoisia faktoja." },
        no: { title: "Kulturleksjon: London Tour", description: "Virtuell reise gjennom London. Severdigheter, quiz og interessante fakta." },
        da: { title: "Kulturlektion: London Tour", description: "Virtuel rejse gennem London. Seværdigheder, quizzer og interessante fakta." }
    },
    "christmas-fun": {
        nl: { title: "Brieven aan de Kerstman Toneelstuk", description: "Een schattig kersttoneelstuk voor jonge leerlingen. Inclusief script en rollen." },
        sv: { title: "Brev till Tomten Teaterpjäs", description: "En söt julpjäs för yngre elever. Inkluderar manus och roller." },
        fi: { title: "Kirjeitä Joulupukille -Näytelmä", description: "Söpö joulunäytelmä nuorille oppilaille. Sisältää käsikirjoituksen ja roolit." },
        no: { title: "Brev til Julenissen Skuespill", description: "Et søtt juleskuespill for yngre elever. Inkluderer manus og roller." },
        da: { title: "Breve til Julemanden Skuespil", description: "Et sødt juleskuespil til yngre elever. Indeholder manuskript og roller." }
    },
    "pizza-day": {
        nl: { title: "Speciale Les: Pizza Dag", description: "Leren koken en tellen in het Engels. Inclusief pizza-receptkaarten." },
        sv: { title: "Speciallektion: Pizzadagen", description: "Lär dig laga mat och räkna på engelska. Inkluderar pizza-receptkort." },
        fi: { title: "Erikoistunti: Pizzapäivä", description: "Opi kokkaamaan ja laskemaan englanniksi. Sisältää pitsareseptikortteja." },
        no: { title: "Spesialleksjon: Pizzadagen", description: "Lær å lage mat og telle på engelsk. Inkluderer pizzareseptkort." },
        da: { title: "Speciallektion: Pizzadag", description: "Lær at lave mad og tælle på engelsk. Indeholder pizzareceptkort." }
    },
    "grandparents-day-playscript": {
        nl: { title: "Opa en Oma Dag Toneelstuk", description: "Een speciaal script om grootouders te eren. Makkelijk te onthouden teksten." },
        sv: { title: "Mormors och morfars dag Teaterpjäs", description: "Ett speciellt manus för att hedra mor- och farföräldrar. Enkla texter." },
        fi: { title: "Isovanhempien Päivä -Näytelmä", description: "Erityinen käsikirjoitus isovanhempien kunniaksi. Helposti muistettavat tekstit." },
        no: { title: "Besteforeldredagen Skuespill", description: "Et spesielt manus for å ære besteforeldre. Enkle tekster." },
        da: { title: "Bedsteforældredag Skuespil", description: "Et særligt manuskript til at ære bedsteforældre. Nemme tekster." }
    },
    "thanksgiving-fun": {
        nl: { title: "Speciale Les: Thanksgiving", description: "Ontdek de Amerikaanse traditie van dankbaarheid. Kleurplaten en woordenschat." },
        sv: { title: "Speciallektion: Thanksgiving", description: "Upptäck den amerikanska traditionen av tacksamhet. Målarbilder och ordförråd." },
        fi: { title: "Erikoistunti: Kiitospäivä", description: "Tutustu amerikkalaiseen kiitospäivän perinteeseen. Värityskuvia ja sanastoa." },
        no: { title: "Spesialleksjon: Thanksgiving", description: "Oppdag den amerikanske tradisjonen med takknemlighet. Fargelegging og ordforråd." },
        da: { title: "Speciallektion: Thanksgiving", description: "Oplev den amerikanske tradition for taknemmelighed. Farvelægningssider og ordforråd." }
    },
    "english-zoo-playscript": {
        nl: { title: "English Zoo Toneelstuk", description: "Interactief toneelstuk over wilde dieren. Perfect voor een eindvoorstelling." },
        sv: { title: "English Zoo Teaterpjäs", description: "Interaktiv pjäs om vilda djur. Perfekt för en avslutningsföreställning." },
        fi: { title: "English Zoo -Näytelmä", description: "Interaktiivinen näytelmä villieläimistä. Täydellinen loppuesitykseen." },
        no: { title: "English Zoo Skuespill", description: "Interaktivt skuespill om ville dyr. Perfekt for en avslutningsforestilling." },
        da: { title: "English Zoo Skuespil", description: "Interaktivt skuespil om vilde dyr. Perfekt til en afslutningsforestilling." }
    },
    "under-the-sea-gotowe-zajecia": {
        nl: { title: "Speciale Les: Onder de Zee", description: "Ontdek de onderwaterwereld. Flashcards van zeedieren en experimenten." },
        sv: { title: "Speciallektion: Under havet", description: "Upptäck undervattensvärlden. Bildkort med havsdjur och experiment." },
        fi: { title: "Erikoistunti: Meren Alla", description: "Tutustu vedenalaiseen maailmaan. Merieläinten kuvakortteja ja kokeita." },
        no: { title: "Spesialleksjon: Under havet", description: "Oppdag undervannsverdenen. Bildekort med sjødyr og eksperimenter." },
        da: { title: "Speciallektion: Under Havet", description: "Oplev undervandsverdenen. Billedkort med havdyr og eksperimenter." }
    },
    "st-patricks-day": {
        nl: { title: "Speciale Les: Saint Patrick's Day", description: "Ierse tradities, klavertjes en regenbogen. Inclusief interactieve quiz." },
        sv: { title: "Speciallektion: S:t Patricks dag", description: "Irländska traditioner, klöver och regnbågar. Inkluderar interaktiv quiz." },
        fi: { title: "Erikoistunti: Pyhän Patrikin Päivä", description: "Irlantilaisia perinteitä, apiloita ja sateenkaaria. Sisältää tietovisan." },
        no: { title: "Spesialleksjon: St. Patricks dag", description: "Irske tradisjoner, kløver og regnbuer. Inkluderer interaktiv quiz." },
        da: { title: "Speciallektion: Skt. Patricks Dag", description: "Irske traditioner, kløvere og regnbuer. Indeholder interaktiv quiz." }
    },
    "powakacyjna-powtorka-klasy-1-3": {
        nl: { title: "Speciale Les: September Fun", description: "Herhaling na de zomervakantie. Spelletjes om weer in de Engelse sfeer te komen." },
        sv: { title: "Speciallektion: September Fun", description: "Repetition efter sommarlovet. Lekar för att komma igång med engelskan igen." },
        fi: { title: "Erikoistunti: Syyskuun Hauskaa", description: "Kertausta kesäloman jälkeen. Pelejä englannin kielen pariin palaamiseen." },
        no: { title: "Spesialleksjon: September Fun", description: "Repetisjon etter sommerferien. Leker for å komme i gang med engelsken igjen." },
        da: { title: "Speciallektion: September Fun", description: "Gentagelse efter sommerferien. Lege til at komme i gang med engelsk igen." }
    },
    "dzien-jezykow": {
        nl: { title: "Speciale Les: Dag van de Talen", description: "Ontdek talen over de hele wereld. Inclusief paspoort voor leerlingen." },
        sv: { title: "Speciallektion: Språkens dag", description: "Upptäck språk från hela världen. Inkluderar pass för eleverna." },
        fi: { title: "Erikoistunti: Kielten Päivä", description: "Tutustu kieliin ympäri maailmaa. Sisältää passit oppilaille." },
        no: { title: "Spesialleksjon: Språkdagen", description: "Oppdag språk fra hele verden. Inkluderar pass for elevene." },
        da: { title: "Speciallektion: Sprogenes Dag", description: "Oplev sprog fra hele verden. Indeholder pas til eleverne." }
    },
    "dzien-zwierzat": {
        nl: { title: "Speciale Les: Dierendag", description: "Zorg voor je huisdieren en leer hun namen in het Engels." },
        sv: { title: "Speciallektion: Djurens dag", description: "Ta hand om dina husdjur och lär dig deras namn på engelska." },
        fi: { title: "Erikoistunti: Eläinten Päivä", description: "Huolehdi lemmikeistäsi ja opi niiden nimet englanniksi." },
        no: { title: "Spesialleksjon: Dyrenes dag", description: "Ta vare på kjæledyrene dine og lær navnene deres på engelsk." },
        da: { title: "Speciallektion: Dyrenes Dag", description: "Pas på dine kæledyr og lær deres navne på engelsk." }
    },
    "easter": {
        nl: { title: "Speciale Les: Pasen", description: "Paaseieren zoeken, konijntjes en lentetradities." },
        sv: { title: "Speciallektion: Påsk", description: "Påskäggsjakt, kaniner och vårtraditioner." },
        fi: { title: "Erikoistunti: Pääsiäinen", description: "Pääsiäismunajahtia, pupuja ja kevään perinteitä." },
        no: { title: "Spesialleksjon: Påske", description: "Påskeeggjakt, kaniner og vårtradisjoner." },
        da: { title: "Speciallektion: Påske", description: "Påskeægkejagt, kaniner og forårstraditioner." }
    },
    "dzien-australii": {
        nl: { title: "Speciale Les: Australia Day", description: "Ontdek het land van kangoeroes en de Outback." },
        sv: { title: "Speciallektion: Australia Day", description: "Upptäck kängururnas land och the Outback." },
        fi: { title: "Erikoistunti: Australia-päivä", description: "Tutustu kenguruiden maahan ja Outbackiin." },
        no: { title: "Spesialleksjon: Australia Day", description: "Oppdag känguruens land og Outback." },
        da: { title: "Speciallektion: Australia-dag", description: "Oplev kænguruernes land og the Outback." }
    }
};

for (const productId in batch2) {
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
        const translationsStr = Object.entries(batch2[productId]).map(([lang, data]) => {
            return `        ${lang}: { title: "${data.title}", description: "${data.description}" }`;
        }).join(',\n');

        content = content.slice(0, blockEnd) + ',\n' + translationsStr + '\n    ' + content.slice(blockEnd);
    }
}

fs.writeFileSync(filePath, content);
console.log("Applied Batch 2 translations.");
