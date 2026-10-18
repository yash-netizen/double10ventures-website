/* Shared site script: header, footer, quote cart, catalogue helpers, animations. */
(function(){
  var D10 = window.D10 = {};
  var reduce = D10.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LOGO = 'assets/logo.png';   // transparent background, so it sits cleanly on any colour
  // product text is typed by the owner in /admin, so it is escaped wherever it goes into the page
  var esc = D10.esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
  var U = D10.img = function(id, w){ if(!id) return 'assets/img/no-photo.svg'; return id.indexOf('/') >= 0 ? id : 'https://unsplash.com/photos/' + id + '/download?w=' + (w || 700); };

  // Stock photos can occasionally fail to load: retry quietly (twice) before giving up.
  document.addEventListener('error', function(e){
    var im = e.target; if(!im || im.tagName !== 'IMG' || im.src.indexOf('unsplash.com') < 0) return;
    var n = +im.dataset.retry || 0; if(n >= 2) return; im.dataset.retry = n + 1;
    setTimeout(function(){ im.src = im.src.split('&r=')[0] + '&r=' + Math.random().toString(36).slice(2); }, 1200 * (n + 1));
  }, true);

  // ---------- catalogue ----------
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
  // Products come from assets/catalogue.js: live from the database when deployed, a bundled copy otherwise.
  D10.products = window.D10_PRODUCTS || [];
  D10.catBySlug = function(s){ return D10.categories.find(function(c){ return c.slug === s; }); };
  D10.bySku = function(s){ return D10.products.find(function(p){ return p.sku === s; }); };

  var bag = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
  D10.card = function(p){
    return '<a class="prod" href="product.html?sku=' + encodeURIComponent(p.sku) + '"><span class="pimg"><img loading="lazy" src="' + esc(U(p.img)) + '" alt="' + esc(p.name) + '"><span class="sku">' + esc(p.sku) + '</span></span>' +
      '<div class="pb"><h3>' + esc(p.name) + '</h3><span>' + D10.catBySlug(p.cat).name + (p.mat ? ' · ' + esc(p.mat) : '') + '</span>' +
      '<button class="add" data-sku="' + esc(p.sku) + '">' + bag + 'Add to Quote</button></div></a>';
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
      return '<div class="item"><img src="' + esc(U(p.img, 200)) + '" alt=""><div><b>' + esc(p.name) + '</b><small>' + esc(p.sku) + '</small></div>' +
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

  // ---------- WhatsApp: opens a chat with the owner, message pre-filled ----------
  var WA_NUMBER = '919910290493';   // +91 99102 90493, the number in the footer
  D10.waLink = function(text){ return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text); };
  D10.waProduct = function(p){
    return D10.waLink('Hello Double 10 Ventures, I am interested in the ' + p.name + ' (' + p.sku + '). Could you share pricing, available sizes and the minimum order quantity?\n' + location.href);
  };

  // ---------- shared chrome ----------
  var page = document.body.dataset.page || '';
  function waGreeting(){
    if(page === 'consulting') return 'Hello Double 10 Ventures, I would like to discuss a restaurant consulting project.';
    if(page === 'supplies' || page === 'products') return 'Hello Double 10 Ventures, I would like to enquire about restaurant supplies.';
    return 'Hello Double 10 Ventures, I would like to know more about your services.';
  }
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
      '<div><h4>Contact</h4><p>anmoll@double10ventures.com<br>+91 99102 90493</p><p class="based">Based in Delhi NCR, India<br>Serving clients worldwide</p></div>' +
    '</div><div class="copy">© 2026 Double 10 Ventures. All rights reserved. · <a href="#">Privacy Policy</a> · <a href="#">Terms &amp; Conditions</a> · <a href="#">Shipping, Returns &amp; Export Policy</a></div></div></footer>' +
    '<a class="wa" href="' + D10.waLink(waGreeting()) + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg><span class="tip">Chat with us on WhatsApp</span></a>' +
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
