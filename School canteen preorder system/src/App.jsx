import { useState, useEffect, useRef } from 'react'
import './App.css'

/* ── DATA ── */
const FEATURES = [
  { icon: "⚡", title: "Express Pickup Counters", desc: "Skip long lunch queues entirely. Walk up to a dedicated pre-order counter and grab your pre-packed lunch in seconds." },
  { icon: "💳", title: "Smart Balance & Wallet", desc: "Fast contactless payments. Top up the student account, set daily spending limits, and track all school lunch purchases." },
  { icon: "🌱", title: "Dietary & Allergen Filters", desc: "Eat safely. Instantly filter today's specials by allergens (nuts, dairy, gluten) or dietary regimes (vegetarian, vegan)." },
  { icon: "📅", title: "Weekly Meal Planner", desc: "Plan ahead with ease. Browse the school menu for the upcoming week and pre-order your favorite lunches in advance." },
  { icon: "🍔", title: "Portion & Combo Customizer", desc: "Make it yours. Customize toppings, choose healthy fruit or veggie sides, and pair your meal with natural juices." },
  { icon: "📈", title: "Nutritional Analytics", desc: "Stay healthy. Access comprehensive calorie counts, macronutrient breakdowns, and nutritional stats for every dish." },
  { icon: "🍎", title: "Freshly Sourced Ingredients", desc: "Quality guaranteed. All canteen ingredients are sourced from local farms and prepared fresh in the school kitchen." },
  { icon: "📱", title: "Real-time Prep Updates", desc: "Know when it's ready. Get active notifications on order progress and queue lengths directly on your device." },
  { icon: "👨‍👩‍👦", title: "Parent Control Portal", desc: "Parental peace of mind. Easily review food choices, set nutritional goals, and top up account balances securely." },
]

const MENU_ITEMS = [
  { code: "MB-882", name: "Crispy Chicken & Avocado Wrap", category: "Non-Veg", price: "$5.50", keyInfo: "High Protein", status: "sellingfast" },
  { code: "MB-341", name: "Garden Veggie Pesto Pasta", category: "Vegetarian", price: "$4.75", keyInfo: "High Fiber", status: "instock" },
  { code: "MB-590", name: "Classic Cheeseburger", category: "Non-Veg", price: "$6.00", keyInfo: "Energy Rich", status: "sellingfast" },
  { code: "MB-204", name: "Avocado & Poached Egg Salad", category: "Vegetarian", price: "$5.25", keyInfo: "Healthy Fats", status: "limited" },
  { code: "MB-116", name: "Deluxe Fresh Fruit Bowl", category: "Vegan", price: "$3.50", keyInfo: "Vitamins Rich", status: "soldout" },
]

const TECH_CHIPS = [
  "React 19", "Vite 8", "Vanilla CSS3", "State Hook", "Ref Hook", "Effect Hook", "Contactless Payments", "Modular Grid Layouts", "Responsive Design", "Intersection Observer", "Glassmorphic Elements", "High Performance UI"
]

const STATUS_LABELS = {
  instock: "In Stock",
  sellingfast: "Selling Fast",
  limited: "Limited Stock",
  soldout: "Sold Out"
}

/* ── HOOKS ── */
function useScrollReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('reveal--visible')
          obs.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function useNavScroll() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return scrolled
}

/* ── COMPONENTS ── */
function Nav({ scrolled }) {
  const preventClick = (e) => e.preventDefault()
  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`} id="nav">
      <div className="nav__logo">
        <div className="nav__logo-icon">🍔</div>
        <span className="nav__logo-text">Smart<span>Bite</span></span>
      </div>
      <div className="nav__links">
        <a href="#features" className="nav__link" onClick={preventClick}>Features</a>
        <a href="#live-menu" className="nav__link" onClick={preventClick}>Today's Menu</a>
        <a href="#tech" className="nav__link" onClick={preventClick}>Tech Stack</a>
        <a href="#preorder" className="nav__cta" onClick={preventClick}>Pre-Order Now</a>
      </div>
    </nav>
  )
}

function Hero() {
  const preventClick = (e) => e.preventDefault()
  return (
    <section className="hero" id="hero">
      <div className="hero__badge">
        <span className="hero__badge-dot"></span>
        Kitchen Active — Taking Lunch Orders
      </div>
      <h1 className="hero__title">
        Skip the Queue,<br />Pre-Order Your<br /><span className="hero__title-accent">School Lunch</span>
      </h1>
      <p className="hero__subtitle">
        Browse today's hot canteen specials, customize your ingredients, and pre-order in seconds. 
        Grab your food directly from the Express pickup counter and enjoy your break!
      </p>
      <div className="hero__actions">
        <a href="#features" className="btn btn--primary" id="btn-explore" onClick={preventClick}>
          Explore Features <span className="btn__arrow">→</span>
        </a>
        <a href="#live-menu" className="btn btn--ghost" id="btn-board" onClick={preventClick}>View Today's Menu</a>
      </div>

      {/* Floating Pre-Order Card */}
      <div className="hero__order-card">
        <div className="order-card__header">
          <div className="order-card__student">
            <div className="order-card__student-logo">🎒</div>
            <div className="order-card__student-info">
              <span className="order-card__token">Token #B42</span>
              <span className="order-card__student-name">Siddharth (Grade 10-A)</span>
            </div>
          </div>
          <span className="order-card__status order-card__status--ready">Ready for Pickup</span>
        </div>
        <div className="order-card__meals">
          <div className="order-card__meal-item">
            <div className="order-card__meal-title">Double Cheeseburger</div>
            <div className="order-card__meal-desc">Extra Cheddar, Lettuce, Fruit Drink</div>
          </div>
          <div className="order-card__meal-icon">🍔</div>
        </div>
        <div className="order-card__details">
          <div className="order-card__detail">
            <span className="order-card__detail-label">Pickup Time</span>
            <span className="order-card__detail-value">12:30 PM</span>
          </div>
          <div className="order-card__detail">
            <span className="order-card__detail-label">Counter</span>
            <span className="order-card__detail-value">Express 2</span>
          </div>
          <div className="order-card__detail">
            <span className="order-card__detail-label">Price Total</span>
            <span className="order-card__detail-value">$6.50</span>
          </div>
          <div className="order-card__detail">
            <span className="order-card__detail-label">Wallet Balance</span>
            <span className="order-card__detail-value">$24.80</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsBar() {
  return (
    <div className="stats">
      <div className="stat"><span className="stat__number">500<span>+</span></span><span className="stat__label">Daily Orders</span></div>
      <div className="stat"><span className="stat__number">15<span>m</span></span><span className="stat__label">Time Saved Daily</span></div>
      <div className="stat"><span className="stat__number">100<span>%</span></span><span className="stat__label">Fresh Sourced</span></div>
      <div className="stat"><span className="stat__number">4.9<span>★</span></span><span className="stat__label">Student Rating</span></div>
    </div>
  )
}

function FeaturesSection() {
  const hRef = useScrollReveal()
  const gRef = useScrollReveal()
  return (
    <section className="section" id="features">
      <div className="section__header reveal" ref={hRef}>
        <div className="section__label"><span className="section__label-line"></span>System Highlights</div>
        <h2 className="section__title">Nourishing Students, Saving Precious Time</h2>
        <p className="section__desc">A comprehensive pre-order infrastructure designed specifically for school canteens, students, and busy school schedules.</p>
      </div>
      <div className="features-grid reveal" ref={gRef}>
        {FEATURES.map((f, i) => (
          <div className="feature-card" key={i}>
            <div className="feature-card__icon">{f.icon}</div>
            <h3 className="feature-card__title">{f.title}</h3>
            <p className="feature-card__desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function LiveMenuSection() {
  const hRef = useScrollReveal()
  const bRef = useScrollReveal()
  return (
    <section className="section" id="live-menu">
      <div className="section__header reveal" ref={hRef}>
        <div className="section__label"><span className="section__label-line"></span>Live Canteen Board</div>
        <h2 className="section__title">Today's Specials — Hot & Fresh</h2>
        <p className="section__desc">Pre-order these specials before your break to ensure your choice is reserved and freshly prepared.</p>
      </div>
      <div className="board reveal" ref={bRef}>
        <div className="board__header">
          <span className="board__title">Today's Lunch Specials — Canteen Menu</span>
          <span className="board__badge"><span className="board__badge-dot"></span>Live Stock</span>
        </div>
        <table className="board__table">
          <thead>
            <tr><th>Item Code</th><th>Meal Special</th><th>Category</th><th>Price</th><th>Nutritional Tag</th><th>Status</th></tr>
          </thead>
          <tbody>
            {MENU_ITEMS.map((item, i) => (
              <tr key={i}>
                <td><span className="board__meal-code">{item.code}</span></td>
                <td><strong>{item.name}</strong></td>
                <td>{item.category}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '600' }}>{item.price}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{item.keyInfo}</td>
                <td><span className={`board__status board__status--${item.status}`}>{STATUS_LABELS[item.status]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function TechSection() {
  const hRef = useScrollReveal()
  const gRef = useScrollReveal()
  return (
    <section className="section" id="tech">
      <div className="section__header reveal" ref={hRef}>
        <div className="section__label"><span className="section__label-line"></span>Development Stack</div>
        <h2 className="section__title">Built With Premium Web Technologies</h2>
        <p className="section__desc">Engineered using modular standards for modern, responsive layouts and animations.</p>
      </div>
      <div className="tech-grid reveal" ref={gRef}>
        {TECH_CHIPS.map((t, i) => <span className="tech-chip" key={i}>{t}</span>)}
      </div>
    </section>
  )
}

function CTASection() {
  const ref = useScrollReveal()
  const preventClick = (e) => e.preventDefault()
  return (
    <section className="cta" id="cta">
      <div className="cta__inner reveal" ref={ref}>
        <h2 className="cta__title">Ready to Skip the Recess Queue?</h2>
        <p className="cta__desc">Register your student account today, top up your secure smart wallet, and pick up your hot lunch in seconds.</p>
        <a href="#hero" className="btn btn--primary" onClick={preventClick}>Pre-Order Now <span className="btn__arrow">→</span></a>
      </div>
    </section>
  )
}

function Footer() {
  const preventClick = (e) => e.preventDefault()
  return (
    <footer className="footer" id="footer">
      <div className="footer__inner">
        <div>
          <div className="footer__brand">Smart<span>Bite</span></div>
          <div className="footer__copy">© 2026 SmartBite Canteen Pre-Order. Nourishing minds, saving time.</div>
        </div>
        <div className="footer__links">
          <a href="#features" className="footer__link" onClick={preventClick}>Features</a>
          <a href="#live-menu" className="footer__link" onClick={preventClick}>Today's Menu</a>
          <a href="#tech" className="footer__link" onClick={preventClick}>Tech Stack</a>
        </div>
      </div>
    </footer>
  )
}

/* ── APP ── */
function App() {
  const scrolled = useNavScroll()
  return (
    <>
      <Nav scrolled={scrolled} />
      <Hero />
      <StatsBar />
      <FeaturesSection />
      <LiveMenuSection />
      <TechSection />
      <CTASection />
      <Footer />
    </>
  )
}

export default App
