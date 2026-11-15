// Databáze popisků pro jednotlivé houpačky (Zde si můžeš upravit texty podle libosti!)
const productDescriptions = {
    "Aura Sand": "Designové křeslo Aura Sand přináší do vašeho prostoru teplé, zemité tóny pouštního písku. Je utkáno z nejjemnější organické bavlny, která se perfektně přizpůsobí křivkám těla. Ideální kousek pro skandinávsky laděné interiéry a prosvětlené zimní zahrady, kde vytvoří oázu klidu pro každodenní ranní kávu nebo čtení knih.",
    "Aura Moss": "Odstín Aura Moss oslavuje hluboké tóny lesního mechu a divoké přírody. Tkanina vyniká vysokou gramáží a specifickou texturou příjemnou na dotek. Tato varianta perfektně doplní místnosti s živými rostlinami, dřevěným masivem a minimalistickým nábytkem. Navrženo pro dokonalé splynutí s okolní zahradou.",
    "Aura Earth": "Aura Earth s sebou nese stabilitu a klidnou sílu přírodní hnědé hlíny. Robustní ruční prošití zajišťuje dlouhou životnost i při intenzivním používání. Skvěle se hodí na kryté terasy, balkony nebo do rustikálních obývacích pokojů vedle krbových kamen.",
    "Aura Sky": "Svěží a vzdušný model Aura Sky v barvě letního nebe opticky odlehčí a projasní jakýkoliv prostor. Je velmi oblíbený do moderních dětských pokojů nebo k bazénům díky svému pozitivnímu, relaxačnímu působení.",
    "Aura Stone": "Elegantní šedá klasika Aura Stone je vrcholem nadčasového urbanistického minimalismu. Neutrální tón dává plně vyniknout struktuře dubové rozpěrné tyče. Skvělá volba do industriálních loftů nebo moderních novostaveb.",
    "Aura Night": "Exkluzivní hluboký antracitový odstín Aura Night vyzařuje eleganci a styl. Speciálně upravená vlákna odrážejí světlo tak, že látka působí velmi luxusním dojmem. Skvěle maskuje drobné nečistoty a stane se dominantou interiéru."
};

function navigateTo(pageId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => section.classList.remove('active'));
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => link.classList.remove('active'));
    const activeSection = document.getElementById('page-' + pageId);
    if(activeSection) activeSection.classList.add('active');
    const activeLink = document.getElementById('nav-' + pageId);
    if(activeLink) activeLink.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

    
// Funkce pro otevření celostránkového detailu produktu
function openProductModal(cardElement) {
    const fullTitle = cardElement.querySelector('h3').innerText; // Např. "Aura Sand (Béžová)"
    const price = cardElement.querySelector('.product-price').innerText;
    
    // Získání čistého názvu pro vyhledání v databázi popisků (vytáhne text před závorkou)
    const shortTitle = fullTitle.split('(')[0].trim(); 
    
    // Načtení popisku z naší databáze (pokud neexistuje, dá univerzální text)
    const descriptionText = productDescriptions[shortTitle] || `Luxusní závěsná houpačka řady ${fullTitle}. Ručně vyrobená s maximálním důrazem na detail a ergonomii sezení. Skvělý společník pro vaše chvíle odpočinku.`;

    // Podpora získání fotky z img i z pozadí (pro exteriér)
    const imgNode = cardElement.querySelector('.product-image-bg img');
    const imgSrc = imgNode ? imgNode.src : window.getComputedStyle(cardElement.querySelector('.product-image-bg')).backgroundImage.slice(5, -2);
    
    // Určení kategorie podle nadpisu gridu
    const isExterior = cardElement.closest('.products-grid').previousElementSibling.innerText.includes('Exteriér');
    const categoryText = isExterior ? "Kolekce Exteriér" : "Kolekce Interiér";
    const materialText = isExterior ? "Zátěžová hydrofobní látka (Cordura)" : "100% Organická bavlna (GOTS)";

    // Vložení dat do celostránkového zobrazení
    document.getElementById('modal-title').innerText = fullTitle;
    document.getElementById('modal-price').innerText = price;
    document.getElementById('modal-image').src = imgSrc;
    document.getElementById('modal-category').innerText = categoryText;
    document.getElementById('modal-material').innerText = materialText;
    document.getElementById('modal-description').innerText = descriptionText;

    

    // Automaticky rozsvítí správné barevné kolečko podle toho, na jakou kartu se kliklo
    setupActiveColorDot(imgSrc);

    // Plynulé zobrazení celostránkového režimu
    document.getElementById('product-modal').classList.add('open');
    document.body.style.overflow = 'hidden'; // Zamezí skrolování původního webu na pozadí
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('open');
    document.body.style.overflow = 'auto'; // Vrátí původnímu webu možnost skrolovat
}

// Automatické navázání prokliků na všechny karty
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('buy-button')) return;
            openProductModal(card);
        });
    });
});

// Interaktivní přepínání barev uvnitř celostránkového detailu
document.addEventListener("DOMContentLoaded", () => {
    const colorDots = document.querySelectorAll('#modal-color-dots .color-dot');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            // 1. Aktivuje vizuálně kliknuté kolečko
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');

            // 2. Vytáhne nová data z kolečka
            const newImgSrc = dot.getAttribute('data-img');
            const newColorName = dot.getAttribute('data-color');

            // 3. Efekt plynulého prolnutí při změně fotky
            modalImage.style.opacity = '0.3';
            modalImage.style.transition = 'opacity 0.2s ease';

            setTimeout(() => {
                // Vymění zdroj obrázku a texty
                modalImage.src = newImgSrc;
                
                // Dynamicky upraví název v hlavní textu (např. Aura Sand (Zelená))
                const currentTitleBase = modalTitle.innerText.split('(')[0].trim();
                modalTitle.innerText = `${currentTitleBase} (${newColorName})`;
                
                modalImage.style.opacity = '1';
            }, 200);
        });
    });
});

// Malé vylepšení: Při otevření okna automaticky aktivuje správné barevné kolečko podle karty
function setupActiveColorDot(currentImgSrc) {
    const dots = document.querySelectorAll('#modal-color-dots .color-dot');
    dots.forEach(dot => {
        dot.classList.remove('active');
        // Pokud se fotka kolečka shoduje s fotkou z karty, označí ho jako aktivní
        if(currentImgSrc.includes(dot.getAttribute('data-img'))) {
            dot.classList.add('active');
        }
    });
}

// Uprav začátek tvé stávající funkce openProductModal, aby volala setupActiveColorDot:
// Stačí dovnitř openProductModal na úplný konec před otevírací třídu přidat:
// setupActiveColorDot(imgSrc);

// ==========================================================================
// ODESLÁNÍ PŘEDOBJEDNÁVKY NA ÚNOR PŘES FORMSPREE
// ==========================================================================
const ORDER_FORM_URL = 'https://formspree.io';

function isValidAddress(address) {
    if (address.length < 8) return false;
    if (!/\d/.test(address)) return false;
    if (!/[a-zA-ZÀ-ž]{3,}/.test(address)) return false;
    if (/(.)\1{3,}/i.test(address)) return false;
    const letters = address.toLowerCase().replace(/[^a-zà-ž]/g, '');
    if (new Set(letters).size < 4) return false;
    if (!/[aeiouyáéěíóúůý]/i.test(letters)) return false;
    return true;
}

function isValidPhone(phone) {
    const digits = phone.replace(/[\s\-\/()]/g, '');
    return /^(\+|00)?\d{9,12}$/.test(digits);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// Funkce, která se spustí po kliknutí na tlačítko "Předobjednat na únor"
async function submitPreorder(event) {
    event.preventDefault(); // Zabrání klasickému přesměrování stránky

    const productName = document.getElementById('modal-title').innerText;
    const productPrice = document.getElementById('modal-price').innerText;
    const name = document.getElementById('preorder-name').value.trim();
    const email = document.getElementById('preorder-email').value.trim();
    const phone = document.getElementById('preorder-phone').value.trim();
    const address = document.getElementById('preorder-address').value.trim();

    if (!name || !phone || !address || !email) {
        alert('Vyplňte prosím všechny údaje (jméno, e-mail, telefon i adresu).');
        return;
    }

    if (!isValidAddress(address)) {
        alert('Zadejte prosím skutečnou doručovací adresu, např. „Hlavní 12, 284 01 Kutná Hora“.');
        document.getElementById('preorder-address').focus();
        return;
    }

    if (!isValidPhone(phone)) {
        alert('Zadejte prosím platné telefonní číslo, např. 608 123 456.');
        document.getElementById('preorder-phone').focus();
        return;
    }

    if (!isValidEmail(email)) {
        alert('E-mail nemá správný tvar. Zadejte ho prosím ve tvaru jan.novak@email.cz.');
        document.getElementById('preorder-email').focus();
        return;
    }

    const data = {
        _subject: `Předobjednávka na únor: ${productName} (${name})`,
        Produkt: productName,
        Cena: productPrice,
        Jmeno: name,
        Email: email,
        _replyto: email,
        Telefon: phone,
        Adresa: address
    };

    const btn = document.getElementById('preorder-submit-btn');
    btn.disabled = true;
    btn.innerText = 'Odesílám předobjednávku…';

    try {
        const response = await fetch(ORDER_FORM_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Chyba odeslání');

        alert('Děkujeme za předobjednávku na únor! Brzy se vám ozveme s potvrzením.');
        document.getElementById('preorder-form').reset(); // Vymaže formulář
        closeProductModal(); // Zavře okno produktu
    } catch (err) {
        console.error(err);
        alert('Předobjednávku se nepodařilo odeslat. Zkuste to prosím znovu.');
    } finally {
        btn.disabled = false;
        btn.innerText = 'Předobjednat na únor';
    }
}

// ==========================================================================
// NAVÁZÁNÍ PROKLIKŮ NA KARTY PRODUKTŮ
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => openProductModal(card));

        const infoBtn = card.querySelector('.buy-button');
        if (infoBtn) {
            infoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openProductModal(card);
            });
        }
    });

    // Napojení formuláře předobjednávky
    const preorderForm = document.getElementById('preorder-form');
    if (preorderForm) {
        preorderForm.addEventListener('submit', submitPreorder);
    }

    // Automatické promazání kontaktního formuláře
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            setTimeout(() => contactForm.reset(), 500);
        });
    }
});

// ==========================================================================
// ŘAZENÍ PRODUKTŮ PODLE CENY
// ==========================================================================
function sortProducts(selectElement) {
    let order = selectElement.value;
    if (order === 'default') return;
    
    let grid = selectElement.closest('.filter-sort-bar').nextElementSibling;
    if (!grid || !grid.classList.contains('products-grid')) return;
    
    let cards = Array.from(grid.querySelectorAll('.product-card'));
    cards.sort((a, b) => {
        let priceA = parseInt(a.getAttribute('data-price')) || 0;
        let priceB = parseInt(b.getAttribute('data-price')) || 0;
        return order === 'asc' ? priceA - priceB : priceB - priceA;
    });
    
    cards.forEach(card => grid.appendChild(card));
}
