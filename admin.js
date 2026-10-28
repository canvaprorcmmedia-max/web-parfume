/* Local-only demo admin. Do not treat this as secure authentication or production storage. */
const PRODUCTS_KEY="maisonAromaProducts_v1";
const DEFAULTS=[
{id:"ma-001",name:"Noir No. 01",brand:"Maison Aroma",category:"Woody",size:"50 ml",price:189000,description:"Karakter woody yang hangat dengan kesan bersih dan modern. Contoh deskripsi demo.",tone:"dark",featured:true,active:true},
{id:"ma-002",name:"Petal Muse",brand:"Maison Aroma",category:"Floral",size:"50 ml",price:165000,description:"Interpretasi floral yang lembut dan ringan. Contoh deskripsi demo.",tone:"rose",featured:true,active:true},
{id:"ma-003",name:"Sunday Air",brand:"Maison Aroma",category:"Fresh",size:"30 ml",price:119000,description:"Kesan fresh yang bersih untuk rutinitas harian. Contoh deskripsi demo.",tone:"clear",featured:true,active:true},
{id:"ma-004",name:"Amber Chapter",brand:"Maison Aroma",category:"Oriental",size:"50 ml",price:199000,description:"Aroma hangat dan elegan. Contoh deskripsi demo.",tone:"green",featured:true,active:true},
{id:"ma-005",name:"Soft Linen",brand:"Maison Aroma",category:"Fresh",size:"30 ml",price:109000,description:"Konsep aroma ringan untuk keseharian.",tone:"clear",featured:false,active:true},
{id:"ma-006",name:"Rose Afterglow",brand:"Maison Aroma",category:"Floral",size:"50 ml",price:175000,description:"Konsep floral dengan karakter lembut.",tone:"rose",featured:false,active:true},
{id:"ma-007",name:"Cedar Form",brand:"Maison Aroma",category:"Woody",size:"50 ml",price:185000,description:"Konsep woody modern.",tone:"dark",featured:false,active:true},
{id:"ma-008",name:"Golden Dusk",brand:"Maison Aroma",category:"Oriental",size:"30 ml",price:139000,description:"Konsep aroma hangat untuk momen spesial.",tone:"green",featured:false,active:true}
];
const $=s=>document.querySelector(s);
const money=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(n)||0);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function products(){try{const p=JSON.parse(localStorage.getItem(PRODUCTS_KEY));return Array.isArray(p)?p:DEFAULTS}catch{return DEFAULTS}}
function store(p){localStorage.setItem(PRODUCTS_KEY,JSON.stringify(p))}
function toast(msg){const t=$("#admin-toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2200)}
function bottle(p){return `<div class="product-bottle ${esc(p.tone)}"><span>MA.</span></div>`}
function render(){
 const p=products();$("#product-count").textContent=`${p.length} produk`;
 $("#admin-product-rows").innerHTML=p.map(x=>`<tr><td><div class="table-product"><div class="table-thumb">${x.image?`<img src="${esc(x.image)}" alt="" style="width:100%;height:100%;object-fit:cover">`:bottle(x)}</div><div><strong>${esc(x.name)}</strong><small>${esc(x.size||"")} · ${esc(x.id)}</small></div></div></td><td>${esc(x.category)}</td><td>${money(x.price)}</td><td><span class="status-pill ${x.active===false?"off":""}">${x.active===false?"Disembunyikan":"Aktif"}</span></td><td><button class="table-action" data-edit="${esc(x.id)}">Edit</button><button class="table-action" data-toggle="${esc(x.id)}">${x.active===false?"Tampilkan":"Sembunyikan"}</button><button class="table-action" data-delete="${esc(x.id)}">Hapus</button></td></tr>`).join("");
 $("#wa-number").value=localStorage.getItem("maisonAromaWhatsApp")||"";
}
function openForm(p=null){
 $("#product-form").reset();$("#p-id").value=p?.id||"";$("#form-title").textContent=p?"Edit produk":"Tambah produk";
 $("#p-name").value=p?.name||"";$("#p-category").value=p?.category||"Woody";$("#p-size").value=p?.size||"50 ml";$("#p-price").value=p?.price??0;$("#p-tone").value=p?.tone||"dark";$("#p-image").value=p?.image||"";$("#p-description").value=p?.description||"";$("#p-featured").checked=!!p?.featured;$("#p-active").checked=p?.active!==false;$("#edit-modal").classList.remove("hidden");$("#p-name").focus();
}
function closeForm(){$("#edit-modal").classList.add("hidden")}
$("#add-product").addEventListener("click",()=>openForm());
$("#cancel-form").addEventListener("click",closeForm);$("#cancel-form-2").addEventListener("click",closeForm);
$("#edit-modal").addEventListener("click",e=>{if(e.target===$("#edit-modal"))closeForm()});
$("#product-form").addEventListener("submit",e=>{
 e.preventDefault();const p=products(),id=$("#p-id").value||`ma-${Date.now().toString(36)}`;
 const image=$("#p-image").value.trim();if(image&&!/^https?:\/\//i.test(image)){toast("URL gambar harus menggunakan http atau https");return}
 const row={id,name:$("#p-name").value.trim(),brand:"Maison Aroma",category:$("#p-category").value,size:$("#p-size").value.trim(),price:Math.max(0,Number($("#p-price").value)||0),tone:$("#p-tone").value,image,description:$("#p-description").value.trim(),featured:$("#p-featured").checked,active:$("#p-active").checked};
 if(!row.name){toast("Nama produk wajib diisi");return}
 const i=p.findIndex(x=>x.id===id);if(i>=0)p[i]=row;else p.unshift(row);store(p);closeForm();render();toast("Produk disimpan di browser ini");
});
$("#admin-product-rows").addEventListener("click",e=>{
 const edit=e.target.closest("[data-edit]"),toggle=e.target.closest("[data-toggle]"),del=e.target.closest("[data-delete]");
 let p=products();
 if(edit){const item=p.find(x=>x.id===edit.dataset.edit);if(item)openForm(item)}
 if(toggle){p=p.map(x=>x.id===toggle.dataset.toggle?{...x,active:x.active===false}:x);store(p);render();toast("Status katalog diperbarui")}
 if(del&&confirm("Hapus produk ini dari demo?")){store(p.filter(x=>x.id!==del.dataset.delete));render();toast("Produk dihapus dari demo")}
});
$("#save-settings").addEventListener("click",()=>{const n=$("#wa-number").value.replace(/\D/g,"");if(n.length<9||n.length>15){toast("Masukkan nomor WhatsApp dengan kode negara, 9–15 angka");return}localStorage.setItem("maisonAromaWhatsApp",n);toast("Nomor disimpan di browser ini. Muat ulang halaman katalog untuk memperbarui kontak.")});
render();
