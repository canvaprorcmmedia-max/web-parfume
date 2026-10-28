/* Demo only: products and cart are stored in this browser. Replace sample data before client launch. */
const STORAGE_PRODUCTS = "maisonAromaProducts_v1";
const STORAGE_CART = "maisonAromaCart_v1";
const DEFAULT_PRODUCTS = [
  {id:"ma-001",name:"Noir No. 01",brand:"Maison Aroma",category:"Woody",size:"50 ml",price:189000,description:"Karakter woody yang hangat dengan kesan bersih dan modern. Catatan aroma dalam demo ini bersifat ilustratif dan harus diverifikasi sebelum digunakan untuk produk nyata.",tone:"dark",featured:true,active:true},
  {id:"ma-002",name:"Petal Muse",brand:"Maison Aroma",category:"Floral",size:"50 ml",price:165000,description:"Interpretasi floral yang lembut dan ringan untuk suasana sehari-hari. Deskripsi ini merupakan contoh untuk kebutuhan demo.",tone:"rose",featured:true,active:true},
  {id:"ma-003",name:"Sunday Air",brand:"Maison Aroma",category:"Fresh",size:"30 ml",price:119000,description:"Kesan fresh yang bersih untuk menemani rutinitas harian. Deskripsi aroma perlu disesuaikan dengan informasi produk resmi.",tone:"clear",featured:true,active:true},
  {id:"ma-004",name:"Amber Chapter",brand:"Maison Aroma",category:"Oriental",size:"50 ml",price:199000,description:"Aroma oriental dengan karakter hangat dan elegan. Catatan ini hanya contoh copywriting, bukan klaim produk nyata.",tone:"green",featured:true,active:true},
  {id:"ma-005",name:"Soft Linen",brand:"Maison Aroma",category:"Fresh",size:"30 ml",price:109000,description:"Konsep aroma ringan untuk tampilan minimalis dan keseharian.",tone:"clear",featured:false,active:true},
  {id:"ma-006",name:"Rose Afterglow",brand:"Maison Aroma",category:"Floral",size:"50 ml",price:175000,description:"Konsep floral dengan karakter lembut. Periksa detail dan klaim produk sebelum dipublikasikan.",tone:"rose",featured:false,active:true},
  {id:"ma-007",name:"Cedar Form",brand:"Maison Aroma",category:"Woody",size:"50 ml",price:185000,description:"Konsep woody modern dengan kesan tenang dan dewasa.",tone:"dark",featured:false,active:true},
  {id:"ma-008",name:"Golden Dusk",brand:"Maison Aroma",category:"Oriental",size:"30 ml",price:139000,description:"Konsep aroma hangat untuk momen spesial. Deskripsi dapat diganti sesuai katalog resmi.",tone:"green",featured:false,active:true}
];
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const rupiah = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(n)||0);
function readJSON(key, fallback){try{const x=JSON.parse(localStorage.getItem(key));return x??fallback}catch{return fallback}}
function getProducts(){const p=readJSON(STORAGE_PRODUCTS,null);return Array.isArray(p)?p:DEFAULT_PRODUCTS}
function saveProducts(p){localStorage.setItem(STORAGE_PRODUCTS,JSON.stringify(p))}
function getCart(){return readJSON(STORAGE_CART,[])}
function saveCart(c){localStorage.setItem(STORAGE_CART,JSON.stringify(c))}
let activeCategory="Semua", searchTerm="", sortMode="featured";
const grid=$("#product-grid"), cartDrawer=$("#cart-drawer"), overlay=$("#overlay"), modal=$("#product-modal");
function bottleClass(tone){return ["dark","rose","green","clear"].includes(tone)?tone:""}
function bottleMarkup(p){return `<div class="product-bottle ${bottleClass(p.tone)}"><span>MAISON<br>AROMA</span></div>`}
function renderProducts(){
 let products=getProducts().filter(p=>p.active!==false);
 products=products.filter(p=>(activeCategory==="Semua"||p.category===activeCategory)&&(`${p.name} ${p.category} ${p.brand||""} ${p.description||""}`).toLowerCase().includes(searchTerm.toLowerCase()));
 if(sortMode==="low")products.sort((a,b)=>a.price-b.price); if(sortMode==="high")products.sort((a,b)=>b.price-a.price); if(sortMode==="featured")products.sort((a,b)=>Number(b.featured)-Number(a.featured));
 grid.innerHTML=products.length?products.map(p=>`<article class="product-card" data-id="${escapeHTML(p.id)}" tabindex="0" aria-label="Lihat detail ${escapeHTML(p.name)}">
   <div class="product-image">${p.image?`<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy" onerror="this.remove()">`:bottleMarkup(p)}
    <button class="quick-add" data-add="${escapeHTML(p.id)}">+ Tambah ke tas</button></div>
   <div class="product-info"><div class="product-topline"><h3 class="product-name">${escapeHTML(p.name)}</h3><button class="heart" data-detail="${escapeHTML(p.id)}" aria-label="Lihat detail">↗</button></div><p class="product-category">${escapeHTML(p.category)} · ${escapeHTML(p.size||"Ukuran sesuai info toko")}</p><div class="product-topline"><span class="product-price">${rupiah(p.price)}</span><span class="product-size">Demo</span></div></div>
  </article>`).join(""):`<p>Produk tidak ditemukan. Coba kata kunci lain.</p>`;
}
function escapeHTML(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove("show"),2300)}
function addToCart(id,qty=1){const p=getProducts().find(x=>x.id===id&&x.active!==false);if(!p)return;const c=getCart();const row=c.find(x=>x.id===id);if(row)row.qty+=qty;else c.push({id,qty});saveCart(c);renderCart();showToast(`${p.name} ditambahkan ke tas`)}
function renderCart(){
 const c=getCart(), products=getProducts();let total=0;
 $("#cart-count").textContent=c.reduce((n,x)=>n+x.qty,0);
 $("#cart-items").innerHTML=c.length?c.map(row=>{const p=products.find(x=>x.id===row.id);if(!p)return "";total+=p.price*row.qty;return `<div class="cart-row"><div class="cart-thumb">${bottleMarkup(p)}</div><div><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.size||"")} · ${rupiah(p.price)}</p><div class="qty-controls"><button data-qty="${p.id}" data-delta="-1" aria-label="Kurangi">−</button><span>${row.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Tambah">+</button></div><button class="remove-item" data-remove="${p.id}">Hapus</button></div><div class="cart-row-price">${rupiah(p.price*row.qty)}</div></div>`}).join(""):`<div class="cart-empty">Tas belanja Anda masih kosong.<br>Temukan aroma yang cocok untuk Anda.</div>`;
 $("#cart-subtotal").textContent=rupiah(total);
}
function openCart(){cartDrawer.classList.add("open");cartDrawer.setAttribute("aria-hidden","false");overlay.classList.remove("hidden");document.body.style.overflow="hidden"}
function closeCart(){cartDrawer.classList.remove("open");cartDrawer.setAttribute("aria-hidden","true");overlay.classList.add("hidden");document.body.style.overflow=""}
function openDetail(id){const p=getProducts().find(x=>x.id===id);if(!p)return;$("#modal-content").innerHTML=`<div class="modal-product"><div class="modal-art">${p.image?`<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" style="width:100%;height:100%;object-fit:cover">`:bottleMarkup(p)}</div><div><p class="eyebrow">${escapeHTML(p.category)} · ${escapeHTML(p.size||"")}</p><h2 id="modal-title">${escapeHTML(p.name)}</h2><p>${escapeHTML(p.description||"Silakan hubungi toko untuk informasi produk.")}</p><div class="modal-price">${rupiah(p.price)}</div><label for="detail-qty" class="product-size">Jumlah</label><input id="detail-qty" type="number" min="1" max="99" value="1"><button class="button button-dark" id="modal-add" data-id="${escapeHTML(p.id)}">Tambah ke tas ↗</button><p class="product-size">Produk dan deskripsi merupakan contoh demo.</p></div></div>`;modal.classList.remove("hidden");document.body.style.overflow="hidden"}
function closeModal(){modal.classList.add("hidden");document.body.style.overflow=""}
function getWhatsAppNumber(){return (localStorage.getItem("maisonAromaWhatsApp")||"").replace(/\D/g,"")}
function makeOrderText(){const cart=getCart(),products=getProducts();if(!cart.length){showToast("Tas belanja masih kosong");return null}let lines=["Halo Maison Aroma, saya ingin menanyakan pesanan berikut:",""];let total=0;cart.forEach(row=>{const p=products.find(x=>x.id===row.id);if(!p)return;total+=p.price*row.qty;lines.push(`- ${p.name} (${p.size||"ukuran sesuai info toko"}) x${row.qty} — ${rupiah(p.price*row.qty)}`)});lines.push("",`Subtotal produk: ${rupiah(total)}`,"Mohon konfirmasi stok, ongkir, dan total pembayaran. Terima kasih.");return lines.join("\n")}
function checkoutWhatsApp(){const msg=makeOrderText();if(!msg)return;const number=getWhatsAppNumber();if(!number){showToast("Nomor WhatsApp belum diatur. Buka Demo admin.");return}window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`,"_blank","noopener,noreferrer")}
$("#filter-tabs").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;$$(".filter-tab").forEach(x=>x.classList.toggle("active",x===b));renderProducts()});
$("#sort-select").addEventListener("change",e=>{sortMode=e.target.value;renderProducts()});
grid.addEventListener("click",e=>{const add=e.target.closest("[data-add]");if(add){e.stopPropagation();addToCart(add.dataset.add);return}const detail=e.target.closest("[data-detail]");if(detail){e.stopPropagation();openDetail(detail.dataset.detail);return}const card=e.target.closest("[data-id]");if(card)openDetail(card.dataset.id)});
grid.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches(".product-card"))openDetail(e.target.dataset.id)});
$("#search-toggle").addEventListener("click",()=>{$("#search-panel").classList.toggle("hidden");if(!$("#search-panel").classList.contains("hidden"))$("#search-input").focus()});
$("#search-input").addEventListener("input",e=>{searchTerm=e.target.value;renderProducts()});
$("#open-cart").addEventListener("click",openCart);$("#close-cart").addEventListener("click",closeCart);$("#continue-shopping").addEventListener("click",closeCart);overlay.addEventListener("click",closeCart);
$("#cart-items").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");let c=getCart();if(q){const row=c.find(x=>x.id===q.dataset.qty);if(row)row.qty+=Number(q.dataset.delta);c=c.filter(x=>x.qty>0);saveCart(c);renderCart()}if(r){saveCart(c.filter(x=>x.id!==r.dataset.remove));renderCart()}});
$("#checkout-button").addEventListener("click",checkoutWhatsApp);
$("#close-modal").addEventListener("click",closeModal);modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
$("#modal-content").addEventListener("click",e=>{const b=e.target.closest("#modal-add");if(b){const qty=Math.max(1,Math.min(99,Number($("#detail-qty").value)||1));addToCart(b.dataset.id,qty);closeModal();openCart()}});
$("#menu-toggle").addEventListener("click",()=>$("#mobile-nav").classList.toggle("hidden"));
$("#mobile-nav").addEventListener("click",e=>{if(e.target.closest("a"))$("#mobile-nav").classList.add("hidden")});
function refreshWhatsAppLink(){const n=getWhatsAppNumber();$("#footer-whatsapp").href=n?`https://wa.me/${n}`:"#";$("#footer-whatsapp").textContent=n?`WhatsApp: +${n}`:"WhatsApp: atur nomor admin"}
$("#year").textContent=new Date().getFullYear();renderProducts();renderCart();refreshWhatsAppLink();
