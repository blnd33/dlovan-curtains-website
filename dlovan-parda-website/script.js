/* ════════════════════════════════
   DLOVAN PARDA — main script
════════════════════════════════ */

/* ════════════════════════════════
   ADMIN CONTENT LOADER
   Reads saved content from admin panel (localStorage) and applies it
════════════════════════════════ */
function applyAdminContent() {
  const raw = localStorage.getItem('dp-content');
  if (!raw) return;
  let c;
  try { c = JSON.parse(raw); } catch { return; }

  const lang = localStorage.getItem('dp-lang') || 'en';
  const ar   = lang === 'ar';

  // Hero background
  if (c.hero?.bg) {
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) heroBg.style.backgroundImage = `url('${c.hero.bg}')`;
  }

  // About image
  if (c.about?.img) {
    const aboutImg = document.querySelector('.about-img-wrap img');
    if (aboutImg) aboutImg.src = c.about.img;
  }

  // CTA background
  if (c.cta?.bg) {
    const ctaBg = document.querySelector('.cta-bg');
    if (ctaBg) ctaBg.style.backgroundImage = `url('${c.cta.bg}')`;
  }

  // Product card images
  if (c.products) {
    document.querySelectorAll('.product-card img').forEach((img, i) => {
      if (c.products[i]?.img) img.src = c.products[i].img;
    });
  }

  // Gallery images
  if (c.gallery) {
    document.querySelectorAll('.gallery-item img').forEach((img, i) => {
      if (c.gallery[i]) img.src = c.gallery[i];
    });
  }

  // Contact: phone, email, WhatsApp
  if (c.contact) {
    if (c.contact.phone) {
      document.querySelectorAll('.contact-item-text span').forEach(el => {
        if (el.textContent.includes('+964') || el.textContent.includes('٩٦٤')) {
          el.textContent = c.contact.phone;
        }
      });
    }
    if (c.contact.email) {
      document.querySelectorAll('.contact-item-text span').forEach(el => {
        if (el.textContent.includes('@')) el.textContent = c.contact.email;
      });
      const emailLink = document.querySelector('a[href^="mailto"]');
      if (emailLink) emailLink.href = 'mailto:' + c.contact.email;
    }
    if (c.contact.wa) {
      const waBtn = document.querySelector('.wa-btn');
      if (waBtn) waBtn.href = 'https://wa.me/' + c.contact.wa;
    }
  }

  // Social links
  if (c.footer) {
    const socials = document.querySelectorAll('.social-row a, .footer-social a');
    const links = [c.footer.instagram, c.footer.facebook, c.footer.tiktok, c.footer.youtube];
    // Map by icon class
    document.querySelectorAll('.social-row a, .footer-social a').forEach(a => {
      const i = a.querySelector('i');
      if (!i) return;
      if (i.classList.contains('fa-instagram') && c.footer.instagram) a.href = c.footer.instagram;
      if (i.classList.contains('fa-facebook-f') && c.footer.facebook)  a.href = c.footer.facebook;
      if (i.classList.contains('fa-tiktok') && c.footer.tiktok)        a.href = c.footer.tiktok;
      if (i.classList.contains('fa-youtube') && c.footer.youtube)       a.href = c.footer.youtube;
    });
  }

  // Merge admin text overrides into translations so applyLang() picks them up
  if (c.hero) {
    if (c.hero.badge_en)  translations.en['hero-badge']  = c.hero.badge_en;
    if (c.hero.title_en)  translations.en['hero-title']  = c.hero.title_en + '<br>';
    if (c.hero.sub_en)    translations.en['hero-sub']    = c.hero.sub_en;
    if (c.hero.btn1_en)   translations.en['hero-btn-1']  = c.hero.btn1_en;
    if (c.hero.btn2_en)   translations.en['hero-btn-2']  = c.hero.btn2_en;
    if (c.hero.scroll_en) translations.en['hero-scroll'] = c.hero.scroll_en;
    if (c.hero.badge_ar)  translations.ar['hero-badge']  = c.hero.badge_ar;
    if (c.hero.title_ar)  translations.ar['hero-title']  = c.hero.title_ar + '<br>';
    if (c.hero.sub_ar)    translations.ar['hero-sub']    = c.hero.sub_ar;
    if (c.hero.btn1_ar)   translations.ar['hero-btn-1']  = c.hero.btn1_ar;
    if (c.hero.btn2_ar)   translations.ar['hero-btn-2']  = c.hero.btn2_ar;
    if (c.hero.scroll_ar) translations.ar['hero-scroll'] = c.hero.scroll_ar;
  }
  if (c.about) {
    if (c.about.p1_en)    translations.en['about-p1']    = c.about.p1_en;
    if (c.about.p2_en)    translations.en['about-p2']    = c.about.p2_en;
    if (c.about.stat1_en) translations.en['about-stat-1']= c.about.stat1_en;
    if (c.about.stat2_en) translations.en['about-stat-2']= c.about.stat2_en;
    if (c.about.stat3_en) translations.en['about-stat-3']= c.about.stat3_en;
    if (c.about.p1_ar)    translations.ar['about-p1']    = c.about.p1_ar;
    if (c.about.p2_ar)    translations.ar['about-p2']    = c.about.p2_ar;
    if (c.about.stat1_ar) translations.ar['about-stat-1']= c.about.stat1_ar;
    if (c.about.stat2_ar) translations.ar['about-stat-2']= c.about.stat2_ar;
    if (c.about.stat3_ar) translations.ar['about-stat-3']= c.about.stat3_ar;
  }
  if (c.products) {
    c.products.forEach((p, i) => {
      const n = i + 1;
      if (p.tag_en)   translations.en[`card-tag-${n}`]   = p.tag_en;
      if (p.title_en) translations.en[`card-title-${n}`] = p.title_en;
      if (p.tag_ar)   translations.ar[`card-tag-${n}`]   = p.tag_ar;
      if (p.title_ar) translations.ar[`card-title-${n}`] = p.title_ar;
    });
  }
  if (c.why) {
    c.why.forEach((w, i) => {
      const n = i + 1;
      if (w.title_en) translations.en[`why-${n}-title`] = w.title_en;
      if (w.desc_en)  translations.en[`why-${n}-desc`]  = w.desc_en;
      if (w.title_ar) translations.ar[`why-${n}-title`] = w.title_ar;
      if (w.desc_ar)  translations.ar[`why-${n}-desc`]  = w.desc_ar;
    });
  }
  if (c.cta) {
    if (c.cta.label_en) translations.en['cta-label'] = c.cta.label_en;
    if (c.cta.title_en) translations.en['cta-title'] = c.cta.title_en;
    if (c.cta.p_en)     translations.en['cta-p']     = c.cta.p_en;
    if (c.cta.btn_en)   translations.en['cta-btn']   = c.cta.btn_en;
    if (c.cta.label_ar) translations.ar['cta-label'] = c.cta.label_ar;
    if (c.cta.title_ar) translations.ar['cta-title'] = c.cta.title_ar;
    if (c.cta.p_ar)     translations.ar['cta-p']     = c.cta.p_ar;
    if (c.cta.btn_ar)   translations.ar['cta-btn']   = c.cta.btn_ar;
  }
  if (c.contact) {
    if (c.contact.addr_en)  translations.en['contact-addr']  = c.contact.addr_en;
    if (c.contact.hours_en) translations.en['contact-hours'] = c.contact.hours_en;
    if (c.contact.addr_ar)  translations.ar['contact-addr']  = c.contact.addr_ar;
    if (c.contact.hours_ar) translations.ar['contact-hours'] = c.contact.hours_ar;
  }
  if (c.footer) {
    if (c.footer.about_en) translations.en['footer-about'] = c.footer.about_en;
    if (c.footer.about_ar) translations.ar['footer-about'] = c.footer.about_ar;
  }
}

/* ── TRANSLATIONS ─────────────────── */
const translations = {
  en: {
    'curtain-sub':      'Luxury Curtain Specialists',
    'nav-home':         'Home',
    'nav-products':     'Products',
    'nav-curtains':     'Curtains',
    'nav-accessories':  'Accessories',
    'nav-gallery':      'Gallery',
    'nav-about':        'About Us',
    'nav-contact':      'Contact',
    'nav-why':          'Why Us',
    'nav-cta':          'Get a Free Consultation',
    'mobile-cta':       'Free Consultation',
    'hero-badge':       'Premium Curtain Showroom',
    'hero-title':       'Elegant Curtains<br>for <em>Modern Homes</em>',
    'hero-sub':         'Premium curtains, accessories, and custom designs to transform your space into a sanctuary of style.',
    'hero-btn-1':       'Explore Collection',
    'hero-btn-2':       'Contact Us',
    'hero-scroll':      'Scroll',
    'products-label':   'Our Collection',
    'products-title':   'Curated for <em>Every Style</em>',
    'card-tag-1':       'Collection',
    'card-title-1':     'Luxury Curtains',
    'card-tag-2':       'Sleep Better',
    'card-title-2':     'Blackout Curtains',
    'card-tag-3':       'Soft Light',
    'card-title-3':     'Sheer Curtains',
    'card-tag-4':       'Hardware',
    'card-title-4':     'Curtain Rods',
    'card-tag-5':       'Details',
    'card-title-5':     'Curtain Accessories',
    'card-tag-6':       'Bespoke',
    'card-title-6':     'Custom Designs',
    'card-explore':     'Explore',
    'about-label':      'Our Story',
    'about-title':      'Crafting Spaces with <em>Elegance</em>',
    'about-p1':         'At Dlovan Parda, we believe that the right curtain can transform an ordinary room into an extraordinary experience. For over 15 years, we have been curating premium curtain solutions for homeowners, designers, and architects who demand nothing but the finest.',
    'about-p2':         'From our showroom, we offer personalised consultations, exact custom measurements, and professional installation — ensuring every project reflects your vision with uncompromising quality.',
    'about-stat-1':     'Happy Clients',
    'about-stat-2':     'Fabric Choices',
    'about-stat-3':     'Custom Fit',
    'about-badge-label':'Years of<br>Excellence',
    'about-btn':        'Book a Showroom Visit',
    'gallery-label':    'Inspiration',
    'gallery-title':    'Our <em>Portfolio</em>',
    'why-label':        'Why Dlovan Parda',
    'why-title':        'The Dlovan <em>Difference</em>',
    'why-1-title':      'Premium Quality Fabrics',
    'why-1-desc':       'We source only the finest fabrics from trusted European and regional mills, ensuring lasting beauty and durability in every curtain.',
    'why-2-title':      'Custom Measurements',
    'why-2-desc':       'Our specialists visit your home to take precise measurements, guaranteeing a perfect fit for every window and doorway.',
    'why-3-title':      'Professional Installation',
    'why-3-desc':       'Our trained installation team ensures clean, secure fitting with zero damage to your walls — fully guaranteed.',
    'why-4-title':      'Modern & Classic Styles',
    'why-4-desc':       'From contemporary minimalism to timeless classical designs, our collection covers every aesthetic and interior vision.',
    'why-5-title':      'Affordable Luxury',
    'why-5-desc':       'We believe everyone deserves beautiful interiors. Our competitive pricing makes premium quality accessible without compromise.',
    'why-6-title':      'Friendly Expert Service',
    'why-6-desc':       'From the first consultation to the final installation, our dedicated team guides you with warmth, expertise, and genuine care.',
    'cta-label':        'Transform Your Space',
    'cta-title':        'Ready to Transform <em>Your Home?</em>',
    'cta-p':            'Schedule a free, no-obligation consultation with our design experts and discover your perfect curtain solution.',
    'cta-btn':          'Book a Consultation',
    'contact-label':    'Get In Touch',
    'contact-title':    'Visit Our <em>Showroom</em>',
    'contact-p':        "We'd love to meet you in person. Come see our full collection, touch the fabrics, and speak with our design specialists.",
    'contact-addr-label':'Showroom Address',
    'contact-addr':     '123 Luxury Avenue, Erbil,<br>Kurdistan Region, Iraq',
    'contact-phone-label':'Phone',
    'contact-hours-label':'Opening Hours',
    'contact-hours':    'Saturday – Thursday: 9:00 AM – 8:00 PM',
    'contact-email-label':'Email',
    'contact-wa':       'Chat on WhatsApp',
    'form-title':       'Send Us a Message',
    'form-p':           "Fill out the form and we'll get back to you within 24 hours.",
    'form-fname':       'First Name',
    'form-lname':       'Last Name',
    'form-phone':       'Phone Number',
    'form-service':     'Service Interested In',
    'form-service-opt0':'Select a service…',
    'form-service-opt1':'Luxury Curtains',
    'form-service-opt2':'Blackout Curtains',
    'form-service-opt3':'Sheer Curtains',
    'form-service-opt4':'Curtain Rods & Accessories',
    'form-service-opt5':'Custom Design & Installation',
    'form-service-opt6':'Blinds',
    'form-message':     'Message',
    'form-submit':      'Send Message',
    'form-ph-fname':    'Ahmad',
    'form-ph-lname':    'Hassan',
    'form-ph-message':  'Tell us about your project, room size, preferred style…',
    'footer-about':     "Erbil's premier destination for luxury curtains, custom blinds, and professional curtain solutions. Bringing elegance to every window since 2009.",
    'footer-quick-links':'Quick Links',
    'footer-products-title':'Products',
    'footer-why':       'Why Choose Us',
    'footer-blinds':    'Blinds',
    'footer-hours':     'Sat – Thu: 9 AM – 8 PM',
    'footer-copy':      '© 2025 <span>Dlovan Parda</span>. All rights reserved.',
    'coda-by':          'Powered & Developed by',
    'marquee':          ['Luxury Curtains','Custom Measurements','Professional Installation','Blackout Blinds','Premium Fabrics','Curtain Rods','Sheer Curtains','Velvet Curtains'],
    'toast-sent':       "Thank you! We'll get back to you within 24 hours.",
    'form-sending':     'Sending…',
    'form-sent-btn':    'Message Sent ✓',
  },
  ar: {
    'curtain-sub':      'متخصصون في الستائر الفاخرة',
    'nav-home':         'الرئيسية',
    'nav-products':     'المنتجات',
    'nav-curtains':     'الستائر',
    'nav-accessories':  'الإكسسوارات',
    'nav-gallery':      'المعرض',
    'nav-about':        'من نحن',
    'nav-contact':      'تواصل معنا',
    'nav-why':          'لماذا نحن',
    'nav-cta':          'احصل على استشارة مجانية',
    'mobile-cta':       'استشارة مجانية',
    'hero-badge':       'معرض الستائر الفاخرة',
    'hero-title':       'ستائر أنيقة<br>للمنازل <em>العصرية</em>',
    'hero-sub':         'ستائر فاخرة وإكسسوارات وتصاميم مخصصة لتحويل مساحتك إلى ملاذ من الأناقة.',
    'hero-btn-1':       'استكشف المجموعة',
    'hero-btn-2':       'تواصل معنا',
    'hero-scroll':      'انتقل',
    'products-label':   'مجموعتنا',
    'products-title':   'مختارة لكل <em>أسلوب</em>',
    'card-tag-1':       'مجموعة',
    'card-title-1':     'ستائر فاخرة',
    'card-tag-2':       'نوم أفضل',
    'card-title-2':     'ستائر معتمة',
    'card-tag-3':       'ضوء ناعم',
    'card-title-3':     'ستائر شفافة',
    'card-tag-4':       'إكسسوارات',
    'card-title-4':     'قضبان الستائر',
    'card-tag-5':       'تفاصيل',
    'card-title-5':     'إكسسوارات الستائر',
    'card-tag-6':       'حسب الطلب',
    'card-title-6':     'تصاميم مخصصة',
    'card-explore':     'استكشف',
    'about-label':      'قصتنا',
    'about-title':      'نصنع مساحات <em>بأناقة</em>',
    'about-p1':         'في دلوفان باردا، نؤمن بأن الستارة المناسبة تحوّل الغرفة العادية إلى تجربة استثنائية. لأكثر من 15 عاماً، نقدم حلول ستائر فاخرة لأصحاب المنازل والمصممين والمعماريين الذين لا يقبلون بأقل من الأفضل.',
    'about-p2':         'من معرضنا، نقدم استشارات شخصية وقياسات مخصصة دقيقة وتركيباً احترافياً — لضمان أن كل مشروع يعكس رؤيتك بجودة لا تقبل المساومة.',
    'about-stat-1':     'عميل سعيد',
    'about-stat-2':     'خيار قماش',
    'about-stat-3':     'مقاس مخصص',
    'about-badge-label':'عاماً من<br>التميز',
    'about-btn':        'احجز زيارة للمعرض',
    'gallery-label':    'إلهام',
    'gallery-title':    'معرض <em>أعمالنا</em>',
    'why-label':        'لماذا دلوفان باردا',
    'why-title':        'الفرق مع <em>دلوفان</em>',
    'why-1-title':      'أقمشة فاخرة عالية الجودة',
    'why-1-desc':       'نختار أجود الأقمشة من المصانع الأوروبية والإقليمية الموثوقة، لضمان الجمال الدائم والمتانة في كل ستارة.',
    'why-2-title':      'قياسات مخصصة',
    'why-2-desc':       'يزور متخصصونا منزلك لأخذ قياسات دقيقة، لضمان ملاءمة مثالية لكل نافذة وباب.',
    'why-3-title':      'تركيب احترافي',
    'why-3-desc':       'يضمن فريق التركيب لدينا تثبيتاً نظيفاً وآمناً دون أي ضرر لجدرانك — مع ضمان كامل.',
    'why-4-title':      'أساليب عصرية وكلاسيكية',
    'why-4-desc':       'من البساطة العصرية إلى التصاميم الكلاسيكية الخالدة، تغطي مجموعتنا كل ذوق ورؤية داخلية.',
    'why-5-title':      'فخامة بأسعار مناسبة',
    'why-5-desc':       'نؤمن بأن الجميع يستحق ديكوراً جميلاً. أسعارنا التنافسية تجعل الجودة الفاخرة في متناول الجميع.',
    'why-6-title':      'خدمة احترافية ودودة',
    'why-6-desc':       'من الاستشارة الأولى حتى التركيب النهائي، يرافقك فريقنا بحفاوة وخبرة واهتمام حقيقي.',
    'cta-label':        'حوّل مساحتك',
    'cta-title':        'هل أنت مستعد لتحويل <em>منزلك؟</em>',
    'cta-p':            'احجز استشارة مجانية بدون التزام مع خبراء التصميم لدينا واكتشف حل الستائر المثالي لك.',
    'cta-btn':          'احجز استشارة',
    'contact-label':    'تواصل معنا',
    'contact-title':    'زيارة <em>معرضنا</em>',
    'contact-p':        'يسعدنا لقاؤك شخصياً. تعال وشاهد مجموعتنا الكاملة، ولمس الأقمشة، والتحدث مع متخصصي التصميم.',
    'contact-addr-label':'عنوان المعرض',
    'contact-addr':     'شارع الفخامة 123، أربيل،<br>إقليم كردستان، العراق',
    'contact-phone-label':'الهاتف',
    'contact-hours-label':'ساعات العمل',
    'contact-hours':    'السبت – الخميس: 9:00 صباحاً – 8:00 مساءً',
    'contact-email-label':'البريد الإلكتروني',
    'contact-wa':       'تواصل عبر واتساب',
    'form-title':       'أرسل لنا رسالة',
    'form-p':           'املأ النموذج وسنرد عليك خلال 24 ساعة.',
    'form-fname':       'الاسم الأول',
    'form-lname':       'اسم العائلة',
    'form-phone':       'رقم الهاتف',
    'form-service':     'الخدمة المطلوبة',
    'form-service-opt0':'اختر خدمة...',
    'form-service-opt1':'ستائر فاخرة',
    'form-service-opt2':'ستائر معتمة',
    'form-service-opt3':'ستائر شفافة',
    'form-service-opt4':'قضبان وإكسسوارات',
    'form-service-opt5':'تصميم وتركيب مخصص',
    'form-service-opt6':'بلايند',
    'form-message':     'الرسالة',
    'form-submit':      'إرسال الرسالة',
    'form-ph-fname':    'أحمد',
    'form-ph-lname':    'حسن',
    'form-ph-message':  'أخبرنا عن مشروعك وحجم الغرفة وأسلوبك المفضل...',
    'footer-about':     'وجهتك المفضلة في أربيل للستائر الفاخرة والبلايند المخصص والحلول الاحترافية للستائر. نُضفي الأناقة على كل نافذة منذ عام 2009.',
    'footer-quick-links':'روابط سريعة',
    'footer-products-title':'المنتجات',
    'footer-why':       'لماذا تختارنا',
    'footer-blinds':    'بلايند',
    'footer-hours':     'السبت – الخميس: 9 ص – 8 م',
    'footer-copy':      '© 2025 <span>دلوفان باردا</span>. جميع الحقوق محفوظة.',
    'coda-by':          'مدعوم ومطوّر بواسطة',
    'marquee':          ['ستائر فاخرة','قياسات مخصصة','تركيب احترافي','ستائر معتمة','أقمشة فاخرة','قضبان الستائر','ستائر شفافة','ستائر مخملية'],
    'toast-sent':       'شكراً لك! سنرد عليك خلال 24 ساعة.',
    'form-sending':     'جارٍ الإرسال…',
    'form-sent-btn':    'تم الإرسال ✓',
  }
};

let currentLang = 'en';

function buildMarquee(lang) {
  const track = document.getElementById('marquee-track');
  if (!track) return;
  const items = translations[lang]['marquee'];
  const doubled = [...items, ...items];
  track.innerHTML = doubled.map(t => `<span class="marquee-item"><span class="dot">✦</span> ${t}</span>`).join('');
}

function applyLang(lang) {
  const t = translations[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';

  // textContent nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // innerHTML nodes (have <em>, <br>, <span> inside)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  buildMarquee(lang);

  // toggle button: show the OTHER language label
  const label = lang === 'ar' ? 'EN' : 'ع';
  document.querySelectorAll('.lang-label').forEach(el => el.textContent = label);
  const ariaLabel = lang === 'ar' ? 'Switch to English' : 'Switch to Arabic';
  document.querySelectorAll('.lang-toggle').forEach(btn => btn.setAttribute('aria-label', ariaLabel));

  currentLang = lang;
  localStorage.setItem('dp-lang', lang);
}

function switchLang() {
  applyLang(currentLang === 'en' ? 'ar' : 'en');
}


/* ════════════════════════════════
   CURTAIN ANIMATION — runs independently, never blocked by lang/content code
════════════════════════════════ */
(function initCurtain() {
  const overlay     = document.getElementById('curtain-overlay');
  const heroContent = document.getElementById('hero-content');
  const hero        = document.getElementById('hero');

  if (hero) {
    hero.style.visibility = 'visible';
    hero.classList.add('loaded');
  }

  function openCurtains() {
    setTimeout(() => {
      document.body.classList.add('curtains-open');

      setTimeout(() => {
        if (overlay) {
          overlay.style.transition = 'opacity 3s ease';
          overlay.style.opacity    = '0';
        }
      }, 3000);

      setTimeout(() => {
        if (heroContent) heroContent.classList.add('visible');
      }, 5500);

      setTimeout(() => {
        if (overlay) overlay.style.display = 'none';
      }, 7500);

    }, 1200);
  }

  if (document.readyState === 'complete') {
    openCurtains();
  } else {
    window.addEventListener('load', openCurtains, { once: true });
  }
})();


/* ════════════════════════════════
   MAIN INIT
════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Language toggles ── */
  document.getElementById('lang-toggle')?.addEventListener('click', switchLang);
  document.getElementById('lang-toggle-mobile')?.addEventListener('click', switchLang);

  /* ── Apply admin content overrides, then language ── */
  try { applyAdminContent(); } catch(e) { console.warn('Admin content error:', e); }

  const saved = localStorage.getItem('dp-lang');
  try { applyLang(saved && saved !== 'en' ? saved : 'en'); } catch(e) { console.warn('Lang error:', e); }


  /* ── 2. NAVBAR SCROLL BEHAVIOUR ── */
  const navbar = document.getElementById('navbar');

  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    const backTop = document.getElementById('back-top');
    if (backTop) backTop.classList.toggle('show', window.scrollY > 400);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ── 3. MOBILE NAV ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');
  const mobileClose= document.getElementById('mobile-close');

  function openMobile() {
    mobileNav.classList.add('open');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMobile);
  if (mobileClose) mobileClose.addEventListener('click', closeMobile);

  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));
    mobileNav.addEventListener('click', (e) => { if (e.target === mobileNav) closeMobile(); });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeMobile(); closeLightbox(); }
  });


  /* ── 4. SCROLL FADE-IN OBSERVER ── */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => io.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }


  /* ── 5. SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 8 : 70;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });


  /* ── 6. GALLERY LIGHTBOX ── */
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lbClose     = document.getElementById('lightbox-close');

  window.openLightbox = function(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });


  /* ── 7. CONTACT FORM ── */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn      = contactForm.querySelector('.form-submit');
      const labelEl  = btn.querySelector('[data-i18n="form-submit"]');
      const t        = translations[currentLang];

      btn.disabled = true;
      if (labelEl) labelEl.textContent = t['form-sending'];

      setTimeout(() => {
        if (labelEl) labelEl.textContent = t['form-sent-btn'];
        btn.style.background = '#4CAF50';
        btn.style.color = '#fff';
        contactForm.reset();
        showToast(t['toast-sent']);

        setTimeout(() => {
          btn.disabled = false;
          if (labelEl) labelEl.textContent = t['form-submit'];
          btn.style.background = '';
          btn.style.color = '';
        }, 4000);
      }, 1400);
    });
  }


  /* ── 8. TOAST HELPER ── */
  function showToast(msg, duration = 4000) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
  }

  window.showToast = showToast;


  /* ── 9. ACTIVE NAV LINK ON SCROLL ── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ── 10. LAZY IMAGE FALLBACK ── */
  if (!('loading' in HTMLImageElement.prototype)) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imgObserver.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[loading="lazy"]').forEach(img => imgObserver.observe(img));
  }

});
