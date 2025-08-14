const products = [
  { id: 1, name: 'Acoustic Guitar A1', price: 2500000, img: 'assets/img/guitar.svg' },
  { id: 2, name: 'Digital Piano P45', price: 6500000, img: 'assets/img/piano.svg' },
  { id: 3, name: 'Drum Kit DK-5', price: 5200000, img: 'assets/img/drums.svg' },
  { id: 4, name: 'Violin V100', price: 1800000, img: 'assets/img/violin.svg' },
  { id: 5, name: 'Studio Mic M1', price: 950000, img: 'assets/img/mic.svg' },
];

const formatIDR = n => n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

// Render products
const grid = document.getElementById('productsGrid');
grid.innerHTML = products.map(p => `
  <article class="product-card">
    <img src="${p.img}" alt="${p.name}" />
    <div class="product-body">
      <h3>${p.name}</h3>
      <div class="price">${formatIDR(p.price)}</div>
      <div class="btn-row">
        <button class="btn-outline" onclick="viewItem(${p.id})">Detail</button>
        <button class="btn-primary" onclick="addToCart(${p.id})">Tambah</button>
      </div>
    </div>
  </article>
`).join('');

// Slider
const slider = document.getElementById('slider');
const dots = document.getElementById('sliderDots');
let slideIndex = 0;
const slides = slider.children;
for(let i=0;i<slides.length;i++){
  const b = document.createElement('button');
  b.addEventListener('click', () => goToSlide(i));
  dots.appendChild(b);
}
function goToSlide(i){
  slideIndex = i;
  slider.style.transform = `translateX(-${i * 100}%)`;
  [...dots.children].forEach((d, idx) => d.classList.toggle('active', idx===i));
}
function autoSlide(){
  slideIndex = (slideIndex + 1) % slides.length;
  goToSlide(slideIndex);
}
goToSlide(0);
setInterval(autoSlide, 4500);

// Cart state
let cart = [];
const cartDrawer = document.getElementById('cartDrawer');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutTotal = document.getElementById('checkoutTotal');

function addToCart(id){
  const item = products.find(p => p.id===id);
  const existing = cart.find(c => c.id===id);
  if(existing){ existing.qty++; }
  else { cart.push({ ...item, qty: 1 }); }
  renderCart();
  openCart();
  animateCartBump();
}

function changeQty(id, delta){
  const item = cart.find(c => c.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){
    cart = cart.filter(c => c.id!==id);
  }
  renderCart();
}

function removeItem(id){
  cart = cart.filter(c => c.id!==id);
  renderCart();
}

function renderCart(){
  cartItems.innerHTML = cart.map(c => `
    <div class="cart-item">
      <img src="${c.img}" alt="${c.name}"/>
      <div>
        <div><strong>${c.name}</strong></div>
        <div class="row">
          <div class="qty">
            <button onclick="changeQty(${c.id}, -1)">-</button>
            <span>${c.qty}</span>
            <button onclick="changeQty(${c.id}, +1)">+</button>
          </div>
          <button onclick="removeItem(${c.id})" style="margin-left:8px;border:none;background:#fff;cursor:pointer">Hapus</button>
        </div>
      </div>
      <div><strong>${formatIDR(c.price * c.qty)}</strong></div>
    </div>
  `).join('') || '<p>Keranjang masih kosong.</p>';
  const subtotal = cart.reduce((a,b)=>a+b.price*b.qty,0);
  cartSubtotal.textContent = formatIDR(subtotal);
  checkoutTotal.textContent = formatIDR(subtotal);
  cartCount.textContent = cart.reduce((a,b)=>a+b.qty,0);
}

function openCart(){ cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); }
function closeCart(){ cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); }

document.getElementById('openCart').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
checkoutBtn.addEventListener('click', () => {
  checkoutModal.classList.add('open');
  checkoutModal.setAttribute('aria-hidden','false');
});
document.getElementById('closeCheckout').addEventListener('click', () => {
  checkoutModal.classList.remove('open');
  checkoutModal.setAttribute('aria-hidden','true');
});

// Simple details alert
function viewItem(id){
  const p = products.find(x=>x.id===id);
  alert(`${p.name}\nHarga: ${formatIDR(p.price)}\n\nDeskripsi singkat: Produk berkualitas untuk musisi pemula hingga pro.`);
}

// Fake checkout handler
function handleCheckout(e){
  e.preventDefault();
  const total = cart.reduce((a,b)=>a+b.price*b.qty,0);
  if(total<=0){ alert('Keranjang masih kosong.'); return; }
  alert('Terima kasih! Pesanan Anda sedang diproses.\nNomor Order: VM-' + Math.floor(Math.random()*99999).toString().padStart(5, '0'));
  cart = [];
  renderCart();
  closeCart();
  checkoutModal.classList.remove('open');
  checkoutModal.setAttribute('aria-hidden','true');
}

// Backsound controls (not autoplay to respect browser policy)
const audio = document.getElementById('bgm');
const audioToggle = document.getElementById('audioToggle');
let playing = false;
audio.volume = 0.25;

audioToggle.addEventListener('click', async () => {
  if(!playing){
    try{
      await audio.play();
      playing = true;
      audioToggle.textContent = '⏸️ Backsound';
    }catch(e){
      alert('Klik lagi untuk memulai audio.');
    }
  }else{
    audio.pause();
    playing = false;
    audioToggle.textContent = '▶️ Backsound';
  }
});

// Little micro animation on cart count
function animateCartBump(){
  const btn = document.getElementById('openCart');
  btn.style.transform = 'scale(1.05)';
  btn.style.transition = 'transform .15s ease';
  setTimeout(()=> btn.style.transform = 'scale(1)', 150);
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();