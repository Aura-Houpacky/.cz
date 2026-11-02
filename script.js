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
            const newPrice = dot.getAttribute('data-price');
            const newColorName = dot.getAttribute('data-color');

            // 3. Efekt plynulého prolnutí při změně fotky
            modalImage.style.opacity = '0.3';
            modalImage.style.transition = 'opacity 0.2s ease';

            setTimeout(() => {
                // Vymění zdroj obrázku a texty
                modalImage.src = newImgSrc;
                modalPrice.innerText = newPrice;
                
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

// HLAVNÍ LOGIKA NÁKUPNÍHO KOŠÍKU
// HLAVNÍ LOGIKA NÁKUPNÍHO KOŠÍKU S PODPOROU KUSŮ
let cart = []; 

// Pomocná funkce pro měnění kusů v detailu produktu (+ / -)
function changeModalQty(amount) {
    const input = document.getElementById('modal-quantity-input');
    let currentVal = parseInt(input.value);
    currentVal += amount;
    if (currentVal < 1) currentVal = 1;
    input.value = currentVal;
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
}

// Upravená funkce: nyní přijímá i parametr quantity (počet kusů)
function addToCart(title, price, imgSrc, quantity = 1) {
    const numericPrice = parseInt(price.replace(/[^0-9]/g, ''));

    // Zkontrolujeme, zda už přesně tato houpačka v košíku není
    const existingItem = cart.find(item => item.title === title);

    if (existingItem) {
        // Pokud v košíku už je, jen přičteme nové kusy
        existingItem.quantity += quantity;
    } else {
        // Pokud je nová, vložíme ji s daným počtem kusů
        cart.push({
            title: title,
            price: numericPrice,
            img: imgSrc,
            quantity: quantity
        });
    }

    updateCartUI();
}

// Funkce pro přímou změnu kusů uvnitř vysunutého košíku
function changeCartItemQty(index, amount) {
    cart[index].quantity += amount;
    if (cart[index].quantity < 1) {
        removeFromCart(index);
        return;
    }
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Překreslení košíku se započítáním kusů
function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total-price');
    const badgeElement = document.getElementById('cart-badge');
    
    // Spočítáme celkový počet kusů pro červenou ikonu v menu
    const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    badgeElement.innerText = totalItemsCount;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-text">Váš košík je zatím prázdný.</p>';
        totalElement.innerText = '0 Kč';
        return;
    }

    container.innerHTML = '';
    let totalSum = 0;

    cart.forEach((item, index) => {
        // Cena za položku se násobí počtem jejích kusů
        const itemTotal = item.price * item.quantity;
        totalSum += itemTotal;
        
        container.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-img">
                    <img src="${item.img}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <div class="cart-item-price">${itemTotal.toLocaleString('cs-CZ')} Kč</div>
                    
                    <!-- Ovládání kusů přímo uvnitř košíku -->
                    <div class="cart-item-qty-controls">
                        <button onclick="changeCartItemQty(${index}, -1)" style="padding:0 5px; cursor:pointer;">-</button>
                        <span>${item.quantity} ks</span>
                        <button onclick="changeCartItemQty(${index}, 1)" style="padding:0 5px; cursor:pointer;">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">Odstranit</button>
            </div>
        `;
    });

    totalElement.innerText = totalSum.toLocaleString('cs-CZ') + ' Kč';
}

function checkoutOrder() {
    if(cart.length === 0) {
        alert('Košík je prázdný. Přidejte nejdříve nějakou houpačku.');
        return;
    }
    alert('Děkujeme za objednávku! Nyní byste byl přesměrován na platební bránu.');
    cart = [];
    updateCartUI();
    toggleCart();
}

// AUTOMATICKÉ NAVÁZÁNÍ PROKLIKŮ NA VŠECHNY TVÉ KARTY
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        
        // 1. Proklik při kliknutí kamkoliv na plochu karty
        card.addEventListener('click', (e) => {
            openProductModal(card);
        });

        // 2. POJISTKA: Najde tvé tlačítko uvnitř karty a přikáže mu udělat to samé
        const infoBtn = card.querySelector('.buy-button');
        if (infoBtn) {
            infoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Zabrání tomu, aby se kliknutí "zaseklo" v prohlížeči
                openProductModal(card); // Otevře ten samý detail produktu
            });
        }
    });

    // 3. Přidání z celostránkového detailu do košíku (potichu na pozadí)
    const modalBuyBtn = document.querySelector('.modal-buy-btn');
    if (modalBuyBtn) {
        modalBuyBtn.addEventListener('click', () => {
            const title = document.getElementById('modal-title').innerText;
            const price = document.getElementById('modal-price').innerText;
            const imgSrc = document.getElementById('modal-image').src;
            
            // Načte počet kusů z voliče
            const qtyInput = document.getElementById('modal-quantity-input');
            const chosenQty = parseInt(qtyInput.value) || 1;
            
            // Přidá do košíku
            addToCart(title, price, imgSrc, chosenQty);
            
            // Vrátí volič na 1 kus pro příště
            qtyInput.value = "1";
            
            // Zavře detail a nechá uživatele na webu, košík se potichu aktualizuje
            closeProductModal(); 
        });
    }
});



/* ==========================================================================
   FUNKCE PRO ŘAZENÍ PRODUKTŮ (OD NEJLEVNĚJŠÍHO / NEJDRAŽŠÍHO)
   ========================================================================== */
function sortProducts(selectElement) {
    let order = selectElement.value;
    if (order === 'default') return;
    
    // Najde mřížku produktů, která následuje hned za tímto panelem
    let grid = selectElement.closest('.filter-sort-bar').nextElementSibling;
    if (!grid || !grid.classList.contains('products-grid')) return;
    
    // Vytvoří pole z karet produktů
    let cards = Array.from(grid.querySelectorAll('.product-card'));
    
    // Seřadit pole karet podle schovaného čísla v data-price
    cards.sort((a, b) => {
        let priceA = parseInt(a.getAttribute('data-price')) || 0;
        let priceB = parseInt(b.getAttribute('data-price')) || 0;
        return order === 'asc' ? priceA - priceB : priceB - priceA;
    });
    
    // Fyzicky přerovná karty v HTML kódu
    cards.forEach(card => grid.appendChild(card));
}


// Automaticky vymaže text z kolonek, jakmile se formulář odešle na internet
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', () => {
            setTimeout(() => {
                form.reset(); // Vymaže jméno, e-mail i zprávu
            }, 500); // Počká půl vteřiny, než Formspree data odešle, a pak políčka vyčistí
        });
    }
});
