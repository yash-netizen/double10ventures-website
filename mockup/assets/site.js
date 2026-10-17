/* Shared mockup script: header, footer, quote cart, sample catalogue, animations. */
(function(){
  var D10 = window.D10 = {};
  var reduce = D10.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LOGO = 'assets/logo.jpg';
  var U = D10.img = function(id, w){ return id.indexOf('assets/') === 0 ? id : 'https://unsplash.com/photos/' + id + '/download?w=' + (w || 700); };

  // Stock photos can occasionally fail to load: retry quietly (twice) before giving up.
  document.addEventListener('error', function(e){
    var im = e.target; if(!im || im.tagName !== 'IMG' || im.src.indexOf('unsplash.com') < 0) return;
    var n = +im.dataset.retry || 0; if(n >= 2) return; im.dataset.retry = n + 1;
    setTimeout(function(){ im.src = im.src.split('&r=')[0] + '&r=' + Math.random().toString(36).slice(2); }, 1200 * (n + 1));
  }, true);

  // ---------- sample catalogue (placeholder data and stock photos) ----------
  D10.categories = [
    {name:'Buffetware',   slug:'buffetware', img:'assets/img/buffetware-clean.webp', pos:'76% 50%',
     blurb:'Serving trays, lidded dishes, service tongs and presentation baskets',
     items:['Fuel-heated chafing dishes','Electric chafing dishes & buffet equipment','Fuel holders, compatible fuel & accessories','Buffet presentation & service accessories']},
    {name:'Tableware',    slug:'tableware',  img:'assets/img/tableware-clean.webp', pos:'66% 50%',
     blurb:'Thali sets, serving handis, katoris and pitchers in brass and bronze',
     items:['Ceramic','Brass','Aluminium','EPNS (electroplated nickel silver)']},
    {name:'Food Packaging', slug:'packaging', img:'assets/img/packaging-clean.webp', pos:'68% 50%',
     blurb:'Takeaway, delivery and catering packaging for restaurants',
     items:['Biryani & rice packaging','Curry, korma & gravy containers','Meal & combo packaging','Food boxes, trays, cups, lids & carry bags']},
    {name:'Pots & Pans',  slug:'potspans',   img:'assets/img/potspans.webp', pos:'64% 50%',
     blurb:'Copper and brass serving pans and karahis, from kitchen to table',
     items:['Biryani lagans','Heavy-duty stainless-steel pots','Stainless-steel kadhai & cooking vessels','Other selected heavy-duty cookware']}
  ];
  D10.products = [
    // Buffetware, Tableware and Pots & Pans: selected from the client-supplied metalware catalogue (specs as listed there)
    {sku:'BUF-0001', name:'Oval Serving Tray with Brass Handles', cat:'buffetware', mat:'Stainless steel', img:'assets/img/products/buf-1-oval-serving-tray-brass-handles.webp', featured:1,
     finish:'Mirror-polished steel with antique-brass handles and rim', size:'To be confirmed', variants:'Multiple sizes available',
     desc:'An oval stainless-steel tray with a mirror-polished bed, framed by an antique-brass rim and scrolled side handles. Built for buffet counters, canapé service and banquet presentation, it combines everyday durability with a classic, upscale look.'},
    {sku:'BUF-0002', name:'Octagonal Beaded Serving Tray', cat:'buffetware', mat:'Stainless steel', img:'assets/img/products/buf-2-octagonal-beaded-tray.webp',
     finish:'Mirror polish with beaded border', size:'To be confirmed', variants:'Square-octagonal and rectangular-octagonal, in several sizes',
     desc:'A stainless-steel serving tray with cut corners and a fine beaded border. The flat, polished bed works for platters on a buffet line, for dessert and mithai displays, and for passing drinks during banquet service.'},
    {sku:'BUF-0003', name:'Stainless-Steel Lidded Serving Dish', cat:'buffetware', mat:'Stainless steel', img:'assets/img/products/buf-3-lidded-serving-dish.webp',
     finish:'Satin polish', size:'To be confirmed', variants:'To be confirmed',
     desc:'A round serving dish with a close-fitting domed lid and knob handle. It keeps curries, rice and sides covered and warm between the kitchen and the table, and suits buffet counters, family-style service and room service.'},
    {sku:'BUF-0004', name:'Buffet Serving Tongs', cat:'buffetware', mat:'Stainless steel', img:'assets/img/products/buf-4-16-serving-tongs-steel-rose-gold-gold.webp', featured:1,
     finish:'Steel, rose gold and gold', size:'12" and 16" lengths', variants:'12" steel, 16" steel, 16" rose gold, 16" gold',
     desc:'Long-handled serving tongs with scalloped grips for clean, controlled service of breads, kebabs, salads and pastries. Choose classic steel, or rose gold and gold finishes to match premium buffet setups.'},
    {sku:'BUF-0005', name:'Mini Fry Serving Basket', cat:'buffetware', mat:'Stainless steel', img:'assets/img/products/buf-5-mini-fry-serving-basket.webp',
     finish:'Fine stainless-steel wire mesh', size:'To be confirmed', variants:'Square, rectangular and round mini serving and snack baskets',
     desc:'A miniature fry basket with a long angled handle, made for serving fries, pakoras, onion rings and other snacks. A popular presentation piece for cafés, bars and live-counter buffets.'},
    {sku:'TBL-0001', name:'Brass Sovereign Thali Set (8 pcs)', cat:'tableware', mat:'Brass', img:'assets/img/products/tbl-1-brass-sovereign-thali-set.webp', featured:1,
     finish:'Satin brass', size:'Thali 32.5 × 32.5 × 4 cm', variants:'Thali (1), Sovereign katori 100 ml (3), Sovereign rice bowl 200 ml (1), Amrapali glass 300 ml (1), dessert spoon (1)',
     desc:'A complete brass thali for traditional Indian dining: a wide rimmed thali with three katoris, a rice bowl, a tall Amrapali glass and a dessert spoon. Ideal for signature thali menus, heritage restaurants and wedding banquets.'},
    {sku:'TBL-0002', name:'Bronze Sagan Big Thali Set (10 pcs)', cat:'tableware', mat:'Bronze', img:'assets/img/products/tbl-2-bronze-sagan-big-thali-set.webp',
     finish:'Satin bronze (kansa)', size:'Thali 31.5 × 31.5 × 3 cm · approx. 1.9 kg', variants:'Sagan big thali (1), big katori 200 ml (5), glass 400 ml (1), chutney katori 100 ml (1), halwa plate 200 ml (1), dessert spoon (1). Also available as an 8-piece medium set.',
     desc:'A 10-piece bronze (kansa) thali set in the Sagan design, with five katoris, a chutney katori, a halwa plate, a glass and a dessert spoon. Its soft satin finish gives a refined, heritage feel to fine-dining and festive thali service.'},
    {sku:'TBL-0003', name:'Brass Serving Handi', cat:'tableware', mat:'Brass', img:'assets/img/products/tbl-3-brass-serving-handi.webp',
     finish:'Satin brass', size:'400 ml (12 × 12 × 6 cm) · 600 ml (15 × 15 × 6.5 cm) · 900 ml (17 × 17 × 6 cm)', variants:'400 ml, 600 ml, 900 ml · matching brass lids available',
     desc:'A classic serving handi with a rounded belly, rolled rim and twin side handles, for bringing dals, curries and biryani to the table. Available in three sizes, with matching lids for covered service.'},
    {sku:'TBL-0004', name:'Sagan Brass Katoris', cat:'tableware', mat:'Brass', img:'assets/img/products/tbl-4-sagan-brass-katoris.webp',
     finish:'Satin brass', size:'200 ml · 150 ml · 100 ml', variants:'Big 200 ml, small 150 ml, chutney 100 ml',
     desc:'Rounded brass katoris in the Sagan design, in three sizes for dals, raita, sabzi, chutneys and desserts. Use them on their own or to build out thali service.'},
    {sku:'TBL-0005', name:'Brass Dolphin Pitcher with Lid', cat:'tableware', mat:'Brass', img:'assets/img/products/tbl-5-brass-dolphin-pitcher-with-lid.webp',
     finish:'Satin brass with decorative lid knob', size:'1600 ml · 9 × 9 × 22.5 cm', variants:'1600 ml',
     desc:'A tall brass water pitcher with a sculpted spout, curved handle and fitted lid. It holds 1.6 litres, making it practical for table water service and a striking piece on the dining room floor.'},
    {sku:'PKG-0001', name:'Biryani & Rice Box',                cat:'packaging',  mat:'',         img:'xT-OoC3Zg_c', featured:1},
    {sku:'PKG-0002', name:'Curry & Gravy Container',           cat:'packaging',  mat:'',         img:'sLj-ATkFsW4'},
    {sku:'PKG-0003', name:'Meal & Combo Box',                  cat:'packaging',  mat:'',         img:'xmibn7mzXV0'},
    {sku:'PKG-0004', name:'Food Boxes & Trays',                cat:'packaging',  mat:'',         img:'OVVsdKrjkEY'},
    {sku:'PKG-0005', name:'Carry & Delivery Bags',             cat:'packaging',  mat:'',         img:'adCT4qOQeY4'},
    {sku:'PKG-0006', name:'Takeaway Trays & Dip Containers',   cat:'packaging',  mat:'',         img:'dN0yJejNxHg'},
    {sku:'PNP-0001', name:'Copper Sauce Pan with Brass Handle', cat:'potspans', mat:'Copper', img:'assets/img/products/pnp-1-copper-sauce-pan-brass-handle.webp', featured:1,
     finish:'Hammered copper exterior, polished stainless-steel interior, brass handle', size:'350 ml (11.5 × 11.5 × 5 cm) · 550 ml (13.5 × 13.5 × 6 cm) · 800 ml (15.5 × 15.5 × 6 cm)', variants:'350 ml, 550 ml, 800 ml',
     desc:'A table-service sauce pan with a hammered copper exterior, a stainless-steel lining and a cast brass handle. Good for serving dals, curries and sauces straight to the table, adding warmth and theatre to Indian and continental menus.'},
    {sku:'PNP-0002', name:'Copper Wok Pan with Brass Handle', cat:'potspans', mat:'Copper', img:'assets/img/products/pnp-2-copper-wok-pan-brass-handle.webp',
     finish:'Hammered copper exterior, polished stainless-steel interior, brass handle', size:'From 13 × 13 × 6.5 cm (300 ml) to 21 × 21 × 10.5 cm (1400 ml)', variants:'300 ml, 450 ml, 600 ml, 800 ml, 1400 ml',
     desc:'A wok-style serving pan with a hammered copper body, stainless-steel lining and long brass handle. Available in five sizes, from single portions to sharing dishes, for stir-fries, Indo-Chinese plates and dry preparations.'},
    {sku:'PNP-0003', name:'Copper Gravy Bucket Pan', cat:'potspans', mat:'Copper', img:'assets/img/products/pnp-3-copper-gravy-bucket-pan.webp',
     finish:'Hammered copper exterior, polished stainless-steel interior, brass handle', size:'350 ml (10 × 10 × 10 cm) · 450 ml (11 × 11 × 11.5 cm) · 800 ml (13 × 13 × 16 cm)', variants:'350 ml, 450 ml, 800 ml',
     desc:'A tall, footed bucket-style server with a long brass handle, designed for gravies, curries, dals and soups. The hammered copper finish makes it a distinctive piece for table service and buffet counters.'},
    {sku:'PNP-0004', name:'Copper Belly Pan with Brass Handle', cat:'potspans', mat:'Copper', img:'assets/img/products/pnp-4-copper-belly-pan-brass-handle.webp',
     finish:'Hammered copper exterior, polished stainless-steel interior, brass handle', size:'From 12 × 12 × 5 cm (450 ml) to 18.5 × 18.5 × 7 cm (1450 ml)', variants:'450 ml, 650 ml, 1000 ml, 1450 ml · mini belly pan 300 ml and mini belly bowl 150 ml also available',
     desc:'A round-bellied serving pan with a hammered copper body, stainless-steel lining and brass handle. Comes in four sizes for curries, sizzling sides and sharing portions, giving a rustic, premium look to the table.'},
    {sku:'PNP-0005', name:'Brass Serving Karahi', cat:'potspans', mat:'Brass', img:'assets/img/products/pnp-5-brass-serving-karahi.webp',
     finish:'Satin brass', size:'400 ml (13 × 13 × 4.5 cm) · 500 ml (14 × 14 × 4.5 cm) · 600 ml (16 × 16 × 5 cm)', variants:'400 ml, 500 ml, 600 ml · matching brass lids available',
     desc:'A traditional twin-handled karahi in brass, sized for table service of karahi dishes, paneer and sabzi. Shallow and wide for an attractive presentation, with matching lids available.'}
  ];
  D10.catBySlug = function(s){ return D10.categories.find(function(c){ return c.slug === s; }); };
  D10.bySku = function(s){ return D10.products.find(function(p){ return p.sku === s; }); };

  var bag = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
  D10.card = function(p){
    return '<a class="prod" href="product.html?sku=' + p.sku + '"><span class="pimg"><img loading="lazy" src="' + U(p.img) + '" alt="' + p.name + '"><span class="sku">' + p.sku + '</span></span>' +
      '<div class="pb"><h3>' + p.name + '</h3><span>' + D10.catBySlug(p.cat).name + (p.mat ? ' · ' + p.mat : '') + '</span>' +
      '<button class="add" data-sku="' + p.sku + '">' + bag + 'Add to Quote</button></div></a>';
  };

  // ---------- quote cart (kept in this browser only) ----------
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem('d10cart') || '{}') || {}; } catch(e){ cart = {}; }
  Object.keys(cart).forEach(function(k){ if(!D10.bySku(k)) delete cart[k]; });
  function save(){ try { localStorage.setItem('d10cart', JSON.stringify(cart)); } catch(e){} }
  D10.cart = cart;
  D10.cartCount = function(){ var n = 0; for (var k in cart) n += cart[k]; return n; };
  D10.setQty = function(sku, q){ if(q <= 0) delete cart[sku]; else cart[sku] = q; save(); D10.renderCart(); };
  D10.add = function(sku, q, fromEl){
    cart[sku] = (cart[sku] || 0) + (q || 1); save();
    if(fromEl && !reduce) fly(fromEl); else bump();
    D10.renderCart();
  };
  D10.clearCart = function(){ for (var k in cart) delete cart[k]; save(); D10.renderCart(); };

  function bump(){ var c = document.getElementById('count'); if(!c) return; c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
  function fly(el){
    var c = document.getElementById('count'), s = el.getBoundingClientRect(), t = c.getBoundingClientRect();
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;z-index:70;width:18px;height:18px;border-radius:50%;pointer-events:none;background:radial-gradient(circle at 35% 30%,#F5D88A,#B8860B);box-shadow:0 4px 14px rgba(184,134,11,.6);left:' + (s.left + s.width/2 - 9) + 'px;top:' + (s.top + s.height/2 - 9) + 'px';
    document.body.appendChild(d);
    var dx = (t.left + t.width/2) - (s.left + s.width/2), dy = (t.top + t.height/2) - (s.top + s.height/2);
    d.animate([{transform:'translate(0,0) scale(1)'},{transform:'translate(' + dx*.5 + 'px,' + (dy*.5 - 80) + 'px) scale(1.2)'},{transform:'translate(' + dx + 'px,' + dy + 'px) scale(.4)'}],
      {duration:800, easing:'cubic-bezier(.5,0,.2,1)'}).onfinish = function(){ d.remove(); bump(); };
  }

  D10.renderCart = function(){
    var c = document.getElementById('count'); if(c) c.textContent = D10.cartCount();
    var box = document.getElementById('items'); if(!box) return;
    var keys = Object.keys(cart);
    box.innerHTML = keys.length ? keys.map(function(k){
      var p = D10.bySku(k); if(!p) return '';
      return '<div class="item"><img src="' + U(p.img, 200) + '" alt=""><div><b>' + p.name + '</b><small>' + p.sku + '</small></div>' +
        '<div class="qty"><button data-q="-1" data-k="' + k + '">−</button><span>' + cart[k] + '</span><button data-q="1" data-k="' + k + '">+</button></div></div>';
    }).join('') : '<div class="empty">Your quote cart is empty.<br>Add products to request a quote.</div>';
    document.querySelectorAll('.add[data-sku]').forEach(function(b){
      var on = !!cart[b.dataset.sku];
      b.classList.toggle('done', on);
      b.innerHTML = on ? '✓ In Quote Cart' : bag + 'Add to Quote';
    });
    document.dispatchEvent(new Event('cartchange'));
  };
  D10.openCart = function(){ document.body.classList.add('open'); };
  D10.closeCart = function(){ document.body.classList.remove('open'); };

  // ---------- shared chrome ----------
  var page = document.body.dataset.page || '';
  // the logo is the way home. Supplies is a single entry: click for the Supplies page, hover for every category and the full
  // catalogue.
  var nav = [['consulting.html','Consulting','consulting'],['supplies.html','Supplies','supplies'],['projects.html','Projects','projects'],['about.html','About','about'],['contact.html','Contact','contact']];
  if(page === 'products') page = 'supplies';
  var count = function(slug){ return D10.products.filter(function(p){ return p.cat === slug; }).length; };
  var chev = '<svg class="chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
  var mega = '<div class="mega" role="menu"><div class="mega-in">' +
    D10.categories.map(function(c){
      return '<a class="mc" role="menuitem" href="products.html?cat=' + c.slug + '"><span class="mi"><img src="' + U(c.img, 400) + '" alt=""' + (c.pos ? ' style="object-position:' + c.pos + '"' : '') + '></span><b>' + c.name + '</b><small>' + count(c.slug) + ' products</small></a>';
    }).join('') +
    '<a class="mall" role="menuitem" href="products.html"><span>Full catalogue</span><b>All products</b><small>' + D10.products.length + ' products · request a quote on any</small><i>Browse all →</i></a>' +
  '</div></div>';
  var cls = function(n){ return n[2] === page ? ' class="active"' : ''; };
  var navHtml = nav.map(function(n){
    if(n[2] === 'supplies') return '<div class="dd"><a href="' + n[0] + '"' + cls(n) + ' aria-haspopup="true">' + n[1] + chev + '</a>' + mega + '</div>';
    return '<a href="' + n[0] + '"' + cls(n) + '>' + n[1] + '</a>';
  }).join('');
  var mnavHtml = '<a href="index.html"' + (page === 'home' ? ' class="active"' : '') + '>Home</a>' + nav.map(function(n){
    var a = '<a href="' + n[0] + '"' + cls(n) + '>' + n[1] + '</a>';
    if(n[2] !== 'supplies') return a;
    return a + '<div class="msub"><a href="products.html">All products<small>' + D10.products.length + '</small></a>' + D10.categories.map(function(c){ return '<a href="products.html?cat=' + c.slug + '">' + c.name + '<small>' + count(c.slug) + '</small></a>'; }).join('') + '</div>';
  }).join('');

  document.body.insertAdjacentHTML('afterbegin',
    '<header class="site"><div class="wrap nav">' +
      '<a class="logo" href="index.html"><img src="' + LOGO + '" alt="Double 10 Ventures"></a>' +
      '<nav class="links">' + navHtml + '</nav>' +
      '<form class="search" action="products.html"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="search" name="q" placeholder="Search products…"></form>' +
      '<button class="burger" id="burger" aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
      '<button class="cart-btn" id="openCart"><svg viewBox="0 0 24 24"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20.5" r="1.3"/><circle cx="17" cy="20.5" r="1.3"/></svg>Quote Cart <b id="count">0</b></button>' +
    '</div></header><nav class="mnav">' + mnavHtml + '</nav>');

  document.body.insertAdjacentHTML('beforeend',
    '<footer class="site"><div class="wrap"><div class="fgrid">' +
      '<div><img src="' + LOGO + '" alt="Double 10 Ventures"><p><b style="font-family:\'Playfair Display\',serif;font-size:1.05rem;color:var(--brown)">Your Partner in Hospitality Growth.</b></p></div>' +
      '<div><h4>Explore</h4><ul><li><a href="consulting.html">Consulting &amp; Projects</a></li><li><a href="supplies.html">Supplies &amp; Sourcing</a></li><li><a href="projects.html">Projects</a></li><li><a href="about.html">About Us</a></li><li><a href="contact.html">Contact</a></li></ul></div>' +
      '<div><h4>Products</h4><ul><li><a href="products.html">All products</a></li>' + D10.categories.map(function(c){ return '<li><a href="products.html?cat=' + c.slug + '">' + c.name + '</a></li>'; }).join('') + '<li><a href="quote.html">Request a Quote</a></li></ul></div>' +
      '<div><h4>Contact</h4><p>anmoll@double10ventures.com<br>+91 99102 90493<br>T-1-1401, Vipul Greens, Sector-48, Sohna Road, Gurugram, Haryana 122018, India</p></div>' +
    '</div><div class="copy">© 2026 Double 10 Ventures. All rights reserved. · <a href="#">Privacy Policy</a> · <a href="#">Terms &amp; Conditions</a> · <a href="#">Shipping, Returns &amp; Export Policy</a></div></div></footer>' +
    '<a class="wa" href="#" aria-label="Chat on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg><span class="tip">Chat with us on WhatsApp</span></a>' +
    '<div class="scrim" id="scrim"></div>' +
    '<aside class="drawer" aria-label="Quote cart"><div class="dh"><h3>Your Quote Cart</h3><button class="x" id="closeCart" aria-label="Close">×</button></div>' +
      '<div class="items" id="items"></div>' +
      '<div class="df"><p>No payment needed. We\'ll reply with a quote.</p>' +
      '<a class="btn btn-gold" href="quote.html">Request a Quote →</a></div></aside>');

  document.getElementById('openCart').onclick = D10.openCart;
  document.getElementById('closeCart').onclick = D10.closeCart;
  document.getElementById('scrim').onclick = D10.closeCart;
  document.getElementById('burger').onclick = function(){ document.body.classList.toggle('menu'); };
  addEventListener('keydown', function(e){ if(e.key === 'Escape'){ D10.closeCart(); document.body.classList.remove('menu'); } });

  document.addEventListener('click', function(e){
    var b = e.target.closest('.add[data-sku]'); if(!b) return;
    e.preventDefault(); e.stopPropagation();
    if(cart[b.dataset.sku]) return D10.openCart();
    D10.add(b.dataset.sku, 1, b);
  });
  document.getElementById('items').addEventListener('click', function(e){
    var b = e.target.closest('button[data-q]'); if(!b) return;
    D10.setQty(b.dataset.k, (cart[b.dataset.k] || 0) + (+b.dataset.q)); bump();
  });

  var hdr = document.querySelector('header.site');
  addEventListener('scroll', function(){ hdr.classList.toggle('scrolled', scrollY > 10); }, {passive:true});

  // ---------- animation helpers ----------
  D10.splitWords = function(el, base){
    var i = 0;
    (function walk(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(n){
        if(n.nodeType === 3){
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function(t){
            if(!t) return;
            if(/^\s+$/.test(t)){ frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var s = document.createElement('span'); s.textContent = t;
            s.style.transitionDelay = (base + i++ * 0.07) + 's';
            w.appendChild(s); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else walk(n);
      });
    })(el);
  };

  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.12});
  D10.reveal = function(root){
    root = root || document;
    ['.head', '.grid2 > *', '.grid3 > *', '.grid4 > *', '.tgrid > *', '.cat', '.pgrid > .prod', '.split > *', '.pt', '.cta-band', '.fgrid > *', '.exp', '.vert', '[data-rv]'].forEach(function(sel){
      root.querySelectorAll(sel).forEach(function(el, i){
        if(el.dataset.rvDone) return; el.dataset.rvDone = 1;
        el.classList.add('rv'); el.style.setProperty('--d', ((i % 4) * .1) + 's'); io.observe(el);
      });
    });
    root.querySelectorAll('.steps .grid3').forEach(function(g){ io.observe(g); });
  };

  // count-up numbers: <span data-count="29">
  D10.countUp = function(){
    var co = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return; co.unobserve(e.target);
        var el = e.target, end = +el.dataset.count, t0 = null;
        if(reduce){ el.textContent = end; return; }
        (function step(t){ t0 = t0 || t; var p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if(p < 1) requestAnimationFrame(step); })(performance.now());
      });
    }, {threshold:.4});
    document.querySelectorAll('[data-count]').forEach(function(el){ el.textContent = '0'; co.observe(el); });
  };

  addEventListener('scroll', function(){
    if(reduce) return;
    document.querySelectorAll('.cta-band>img').forEach(function(img){
      var r = img.parentElement.getBoundingClientRect();
      if(r.top < innerHeight && r.bottom > 0) img.style.transform = 'translateY(' + (-(r.top / innerHeight) * 60 - 30) + 'px)';
    });
  }, {passive:true});

  D10.pageHero = function(){
    var h = document.querySelector('.page-hero h1');
    if(h) D10.splitWords(h, .25);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ document.body.classList.add('ready'); }); });
  };

  D10.renderCart();
})();
