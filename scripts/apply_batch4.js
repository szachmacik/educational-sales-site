const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'product-translations-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

const batch4 = {
    "speakbook-my-pumpkin-day": {
        nl: { title: "Speakbook: Mijn Pompoendag", description: "Woordenschat rond herfst en pompoenen." },
        sv: { title: "Speakbook: Min pumpadag", description: "Ordförråd kring höst och pumpor." },
        fi: { title: "Speakbook: Kurpitsapäiväni", description: "Sanastoa syksystä ja kurpitsoista." },
        no: { title: "Speakbook: Min gresskardag", description: "Ordforråd rundt høst og gresskar." },
        da: { title: "Speakbook: Min Græskardag", description: "Ordforråd omkring efterår og græskar." }
    },
    "classroom-language": {
        nl: { title: "Klaslokaal Engels", description: "Handige zinnen en posters voor dagelijks gebruik in de les." },
        sv: { title: "Engelska i klassrummet", description: "Användbara fraser och affischer för dagligt bruk i undervisningen." },
        fi: { title: "Luokkahuonekieli", description: "Hyödyllisiä lauseita ja julisteita päivittäiseen käyttöön tunneilla." },
        no: { title: "Klasseromsspråk", description: "Nyttige fraser og plakater for daglig bruk i undervisningen." },
        da: { title: "Klasseværelsessprog", description: "Nyttige sætninger og plakater til daglig brug i undervisningen." }
    },
    "project-stories-colours-of-the-forest": {
        nl: { title: "Kleuren van het Bos Verhaal", description: "Een prachtig verhaal om kleuren en natuur te leren." },
        sv: { title: "Skogens färger Berättelse", description: "En vacker berättelse för att lära sig färger och natur." },
        fi: { title: "Mettsän Värit -Tarina", description: "Kaunis tarina värien ja luonnon oppimiseen." },
        no: { title: "Skogens farger Fortelling", description: "En vakker fortelling for å lære farger og natur." },
        da: { title: "Skovens Farver Historie", description: "En smuk historie til at lære farver og natur." }
    },
    "mothers-day": {
        nl: { title: "Moederdag Pakket", description: "Kaarten maken en gedichtjes leren voor mama." },
        sv: { title: "Mors dag-paket", description: "Skapa kort och lär dig dikter till mamma." },
        fi: { title: "Äitienpäivä-paketti", description: "Korttien tekemistä ja runojen opettelua äidille." },
        no: { title: "Morsdag-pakke", description: "Lag kort og lær dikt til mamma." },
        da: { title: "Mors Dag-pakke", description: "Lav kort og lær digte til mor." }
    },
    "childrens-day": {
        nl: { title: "Kinderdag Pakket", description: "Spelletjes en activiteiten om de kindertijd te vieren." },
        sv: { title: "Barnens dag-paket", description: "Lekar och aktiviteter för att fira barndomen." },
        fi: { title: "Lastenpäivä-paketti", description: "Pelejä ja toimintaa lapsuuden juhlistamiseen." },
        no: { title: "Barnas dag-pakke", description: "Leker og aktiviteter for å feire barndommen." },
        da: { title: "Børnenes Dag-pakke", description: "Lege og aktiviteter til at fejre barndommen." }
    },
    "oceans-day": {
        nl: { title: "Dag van de Oceanen Pakket", description: "Leer over milieubescherming en zeedieren." },
        sv: { title: "Havens dag-paket", description: "Lär dig om miljöskydd och havsdjur." },
        fi: { title: "Valtamerien Päivä -paketti", description: "Opi ympäristönsuojelusta ja merieläimistä." },
        no: { title: "Havenes dag-pakke", description: "Lær om miljøvern og sjødyr." },
        da: { title: "Havenes Dag-pakke", description: "Lær om miljøbeskyttelse og havdyr." }
    },
    "flashcards-stories-zimia": {
        nl: { title: "Flashcards – Winterverhalen", description: "Visuele ondersteuning bij de winterverhalen." },
        sv: { title: "Bildkort – Vinterberättelser", description: "Visuellt stöd till vinterberättelserna." },
        fi: { title: "Kuvakortit – Talvitarinat", description: "Visuaalinen tuki talvitarinoille." },
        no: { title: "Bildekort – Vinterfortellinger", description: "Visuell støtte til vinterfortellingene." },
        da: { title: "Billedkort – Vinterhistorier", description: "Visuel støtte til vinterhistorierne." }
    },
    "flashcards-project-stories-jesien": {
        nl: { title: "Flashcards – Herfstverhalen", description: "Visuele ondersteuning bij de herfstverhalen." },
        sv: { title: "Bildkort – Höstberättelser", description: "Visuellt stöd till höstberättelserna." },
        fi: { title: "Kuvakortit – Syystarinat", description: "Visuaalinen tuki syystarinoille." },
        no: { title: "Bildekort – Høstfortellinger", description: "Visuell støtte til høstfortellingene." },
        da: { title: "Billedkort – Efterårshistorier", description: "Visuel støtte til efterårshistorierne." }
    },
    "culture-posters": {
        nl: { title: "Cultuur Posters", description: "Mooie posters van verschillende landen en hun tradities." },
        sv: { title: "Kulturaffischer", description: "Vackra affischer från olika länder och deras traditioner." },
        fi: { title: "Kulttuurijulisteet", description: "Kauniita julisteita eri maista ja niiden perinteistä." },
        no: { title: "Kulturplakater", description: "Vakre plakater fra ulike land og deres tradisjoner." },
        da: { title: "Kulturplakater", description: "Smukke plakater fra forskellige lande og deres traditioner." }
    },
    "napisy-do-dekoracji-sali": {
        nl: { title: "Decoratie 4 Seizoenen", description: "Labels en titels voor klasversiering." },
        sv: { title: "Dekoration 4 årstider", description: "Etiketter och titlar för klassrumsdekoration." },
        fi: { title: "Koristeet 4 Vuodenaikaa", description: "Nimikkeitä ja otsikoita luokan koristeluun." },
        no: { title: "Dekorasjon 4 årstider", description: "Etiketter og titler for klasseromsdekorasjon." },
        da: { title: "Dekoration 4 Årstider", description: "Mærkater og titler til klasseværelsesdekoration." }
    },
    "spring-summer-english-learning-challenge": {
        nl: { title: "Lente & Zomer Uitdaging", description: "Interactieve uitdaging om Engels te blijven oefenen." },
        sv: { title: "Vår- och sommarutmaning", description: "Interaktiv utmaning för att fortsätta öva engelska." },
        fi: { title: "Kevät- ja kesähaaste", description: "Vuorovaikutteinen haaste englannin harjoittelun jatkamiseksi." },
        no: { title: "Vår- og sommerutfordring", description: "Interaktiv utfordring for å fortsette å øve på engelsk." },
        da: { title: "Forår- & Sommerudfordring", description: "Interaktiv udfordring til at fortsætte med at øve engelsk." }
    },
    "stories-na-zime-audio-2": {
        nl: { title: "Winterverhalen Audio", description: "Luisterversies van alle winterverhalen." },
        sv: { title: "Vinterberättelser Ljud", description: "Ljudversioner av alla vinterberättelser." },
        fi: { title: "Talvitarinat Ääni", description: "Ääniversiot kaikista talvitarinoista." },
        no: { title: "Vinterfortellinger Lyd", description: "Lydversjoner av alle vinterfortellingene." },
        da: { title: "Vinterhistorier Lyd", description: "Lydversioner af alle vinterhistorier." }
    },
    "dyplomy-na-zakonczenie-roku": {
        nl: { title: "Eindcertificaten", description: "Certificaten voor leerlingen aan het einde van de cursus." },
        sv: { title: "Diplom för kursavslutning", description: "Diplom för elever vid kursens slut." },
        fi: { title: "Päätöstodistukset", description: "Todistukset oppilaille kurssin päättyessä." },
        no: { title: "Kursbevis", description: "Kursbevis for elever ved slutten av kurset." },
        da: { title: "Afslutningsdiplomer", description: "Diplomer til elever ved kursets afslutning." }
    },
    "stories-na-lato-audio": {
        nl: { title: "Zomerverhalen Audio", description: "Luister naar zonnige verhalen in het Engels." },
        sv: { title: "Sommarberättelser Ljud", description: "Lyssna på soliga berättelser på engelska." },
        fi: { title: "Kesätarinat Ääni", description: "Kuuntele aurinkoisia tarinoita englanniksi." },
        no: { title: "Sommerfortellinger Lyd", description: "Lytt til solrike fortellinger på engelsk." },
        da: { title: "Sommerhistorier Lyd", description: "Lyt til solrige historier på engelsk." }
    },
    "stories-na-jesien-audio": {
        nl: { title: "Herfstverhalen Audio", description: "Audio-opnames van alle herfstverhalen." },
        sv: { title: "Höstberättelser Ljud", description: "Ljudinspelningar av alla höstberättelser." },
        fi: { title: "Syystarinat Ääni", description: "Äänitallenteet kaikista syystarinoista." },
        no: { title: "Høstfortellinger Lyd", description: "Lydopptak av alle høstfortellingene." },
        da: { title: "Efterårshistorier Lyd", description: "Lydoptagelser af alle efterårshistorier." }
    },
    "holiday-photos-warm-up": {
        nl: { title: "Vakantiefoto Warm-up", description: "Leuke activiteit om de les te beginnen met vakantieherinneringen." },
        sv: { title: "Semesterbildsuppvärmning", description: "Rolig aktivitet för att starta lektionen med semesterminnen." },
        fi: { title: "Lomakuva-alkulämmittely", description: "Hauska tapa aloittaa tunti lomamuistoilla." },
        no: { title: "Feriebildeoppvarming", description: "Morsom aktivitet for å starte timen med ferieminner." },
        da: { title: "Feriebilled-opvarmning", description: "Sjov aktivitet til at starte timen med ferieminder." }
    },
    "autumn-i-spy": {
        nl: { title: "Herfst Zoekspel", description: "Interactief zoek-en-vind spel met herfstthema." },
        sv: { title: "Höstsöklek", description: "Interaktiv sök-och-finn-lek med hösttema." },
        fi: { title: "Syksyn Etsi-leikki", description: "Vuorovaikutteinen etsi ja löydä -peli syysteemaan." },
        no: { title: "Høstsøkelek", description: "Interaktiv søk-og-finn-lek med høsttema." },
        da: { title: "Efterårs-søgeleg", description: "Interaktiv søg-og-find-leg med efterårstema." }
    },
    "winter-i-spy": {
        nl: { title: "Winter Zoekspel", description: "Zoek alle winterse objecten op de plaat." },
        sv: { title: "Vintersöklek", description: "Sök efter alla vintriga objekt på bilden." },
        fi: { title: "Talven Etsi-leikki", description: "Etsi kaikki talviset esineet kuvasta." },
        no: { title: "Vintersøkelek", description: "Søk etter alle vinterlige objekter i bildet." },
        da: { title: "Vinter-søgeleg", description: "Søg efter alle vinteragtige genstande på billedet." }
    },
    "dzien-kropki-dot-day": {
        nl: { title: "Internationale Dag van de Stip", description: "Vier creativiteit en moed in de klas." },
        sv: { title: "Internationella punktdagen", description: "Fira kreativitet och mod i klassrummet." },
        fi: { title: "Kansainvälinen Pistedapäivä", description: "Juhlista luovuutta ja rohkeutta luokassa." },
        no: { title: "Internasjonal prikkdag", description: "Feir kreativitet og mot i klasserommet." },
        da: { title: "International Prikdag", description: "Fejr kreativitet og mod i klassen." }
    },
    "harry-potter": {
        nl: { title: "Harry Potter: Interactieve Quiz", description: "Test je kennis over de magische wereld van Hogwarts." },
        sv: { title: "Harry Potter: Interaktiv quiz", description: "Testa dina kunskaper om den magiska världen på Hogwarts." },
        fi: { title: "Harry Potter: Interaktiivinen tietovisa", description: "Testaa tietosi Tylypahkan taikamaailmasta." },
        no: { title: "Harry Potter: Interaktiv quiz", description: "Test dine kunnskaper om den magiske verdenen på Galtvort." },
        da: { title: "Harry Potter: Interaktiv Quiz", description: "Test din viden om den magiske verden på Hogwarts." }
    }
};

for (const productId in batch4) {
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
        const translationsStr = Object.entries(batch4[productId]).map(([lang, data]) => {
            return `        ${lang}: { title: "${data.title}", description: "${data.description}" }`;
        }).join(',\n');

        content = content.slice(0, blockEnd) + ',\n' + translationsStr + '\n    ' + content.slice(blockEnd);
    }
}

fs.writeFileSync(filePath, content);
console.log("Applied Batch 4 translations.");
