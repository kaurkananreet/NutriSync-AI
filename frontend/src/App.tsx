import { useRef, useState, useEffect, type ReactNode } from 'react'
import { generateInsight } from './services/aiServices.ts'
import {
  checkBackendConnection,
  addMeal,
  getMeals,
  deleteMeal,
  type Meal as MealRecord,
} from './api'
type Page =
  | 'home'
  | 'nutrition'
  | 'scanner'
  | 'health'
  | 'period'
  | 'insights'
  | 'recommendations'
  | 'assistant'
  | 'community'
  | 'reports'
  | 'profile'

type IconName =
  | 'home'
  | 'nutrition'
  | 'scan'
  | 'health'
  | 'period'
  | 'insights'
  | 'sparkles'
  | 'chat'
  | 'community'
  | 'report'
  | 'profile'
  | 'bell'
  | 'plus'
  | 'arrow'
  | 'water'
  | 'moon'
  | 'fire'
  | 'heart'
  | 'shield'
  | 'camera'
  | 'check'
  | 'chevron'
  | 'send'
  | 'download'
  | 'lock'
  | 'settings'
  | 'calendar'
  | 'clock'

const iconPaths: Record<IconName, ReactNode> = {
  home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-7h6v7"/></>,
  nutrition: <><path d="M12 21c4-3 7-7 7-12-4 0-7 1-9 4"/><path d="M12 21C7 19 4 15 5 9c4 0 7 2 8 5M12 21V10"/></>,
  scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><circle cx="12" cy="12" r="3"/></>,
  health: <><path d="M3 12h4l2-5 4 10 2-5h6"/><path d="M20.8 5.7a5.5 5.5 0 0 0-7.8 0L12 6.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z" opacity=".25"/></>,
  period: <><path d="M12 3c3.5 4.4 6 7.2 6 11a6 6 0 0 1-12 0c0-3.8 2.5-6.6 6-11Z"/><path d="M9 15a3 3 0 0 0 3 3"/></>,
  insights: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/><path d="m4 8 6-4 6 7 5-5"/></>,
  sparkles: <><path d="m12 3 1.2 3.3L16.5 8l-3.3 1.3L12 13l-1.2-3.7L7.5 8l3.3-1.7L12 3ZM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14ZM19 13l.8 2.2L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13Z"/></>,
  chat: <><path d="M21 14a4 4 0 0 1-4 4H8l-5 3 1.6-4A6 6 0 0 1 3 13V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v6Z"/><path d="M8 10h8M8 13h5"/></>,
  community: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M15 15a5 5 0 0 1 6 5"/></>,
  report: <><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></>,
  profile: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  arrow: <path d="m9 18 6-6-6-6"/>,
  water: <path d="M12 3c3.5 4.4 6 7.2 6 11a6 6 0 0 1-12 0c0-3.8 2.5-6.6 6-11Z"/>,
  moon: <path d="M21 13a8 8 0 1 1-10-10 6.5 6.5 0 0 0 10 10Z"/>,
  fire: <path d="M13 2s1 4-2 6c-2-3-5-2-5-2s-3 5 0 10a7 7 0 0 0 12 0c3-6-2-10-2-10 0 3-2 4-3 4 1-5 0-8 0-8Z"/>,
  heart: <path d="M20.8 5.7a5.5 5.5 0 0 0-7.8 0L12 6.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z"/>,
  shield: <><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
  camera: <><path d="M4 7h4l1.5-2h5L16 7h4v12H4z"/><circle cx="12" cy="13" r="3"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
  download: <><path d="M12 3v12m-4-4 4 4 4-4"/><path d="M4 20h16"/></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l2-1.5-2-3.5-2.5 1a8 8 0 0 0-2.5-1.5L13.5 2h-4L9 5a8 8 0 0 0-2.5 1.5L4 5.5 2 9l2 1.5v3L2 15l2 3.5 2.5-1A8 8 0 0 0 9 19l.5 3h4l.5-3a8 8 0 0 0 2.5-1.5l2.5 1 2-3.5-2-1.5Z"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
}

function Icon({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>
}

const pageMeta: Record<Page, { title: string; subtitle: string }> = {
  home: { title: 'Good morning, Maya', subtitle: 'Here’s how your body is doing today.' },
  nutrition: { title: 'Nutrition tracker', subtitle: 'Build awareness, one meal at a time.' },
  scanner: { title: 'AI food scanner', subtitle: 'Snap, review, and add nutrition estimates.' },
  health: { title: 'Health tracker', subtitle: 'Notice patterns in how you feel each day.' },
  period: { title: 'Menstrual cycle', subtitle: 'Understand your cycle, patterns, and daily wellbeing.' },
  insights: { title: 'Your insights', subtitle: 'Connections from your recent health and nutrition logs.' },
  recommendations: { title: 'For you', subtitle: 'Small, practical steps based on your preferences.' },
  assistant: { title: 'AI health assistant', subtitle: 'General nutrition and wellness support, whenever you need it.' },
  community: { title: 'Health community', subtitle: 'Share experiences, encouragement, and everyday wellness ideas.' },
  reports: { title: 'Health reports', subtitle: 'A clear summary to support conversations with your care team.' },
  profile: { title: 'Profile & privacy', subtitle: 'Manage your experience and health-data preferences.' },
}

const navItems: { page: Page; label: string; icon: IconName }[] = [
  { page: 'home', label: 'Home', icon: 'home' },
  { page: 'nutrition', label: 'Nutrition', icon: 'nutrition' },
  { page: 'scanner', label: 'Food scanner', icon: 'scan' },
  { page: 'health', label: 'Health', icon: 'health' },
  { page: 'period', label: 'Menstrual cycle', icon: 'period' },
  { page: 'insights', label: 'Insights', icon: 'insights' },
  { page: 'recommendations', label: 'For you', icon: 'sparkles' },
  { page: 'assistant', label: 'AI assistant', icon: 'chat' },
  { page: 'community', label: 'Health community', icon: 'community' },
  { page: 'reports', label: 'Reports', icon: 'report' },
  { page: 'profile', label: 'Profile', icon: 'profile' },
]

const Button = ({ children, onClick, variant = 'primary', icon }: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost'; icon?: IconName }) => (
  <button className={`button ${variant}`} onClick={onClick}>{icon && <Icon name={icon} size={18}/>}<span>{children}</span></button>
)

function Ring({ value, color = '#78A994', children }: { value: number; color?: string; children: ReactNode }) {
  return <div className="ring" style={{ background: `conic-gradient(${color} ${value}%, #E7EEE9 ${value}% 100%)` }}><div>{children}</div></div>
}

function Header({ page }: { page: Page }) {
  return <header className="topbar">
    <div><p className="eyebrow">{page === 'home' ? 'MONDAY, MAY 26' : 'NUTRISYNC AI'}</p><h1>{pageMeta[page].title}</h1><p className="subtitle">{pageMeta[page].subtitle}</p></div>
    <div className="header-actions"><button className="icon-button" aria-label="Notifications"><Icon name="bell"/></button><div className="avatar">MJ</div></div>
  </header>
}

function Home({ go }: { go: (page: Page) => void }) {
  return <div className="page-stack">
    <section className="hero-summary">
      <div>
        <span className="status-pill"><span/> ON TRACK TODAY</span>
        <h2>Your health is finding<br/>its rhythm.</h2>
        <p>You've logged 2 balanced meals and are close to your hydration goal. Keep going, Maya.</p>
        <Button onClick={() => go('nutrition')} icon="plus">Log a meal</Button>
      </div>
      <div className="hero-score"><Ring value={82} color="#fff"><strong>82</strong><small>Daily score</small></Ring><p>Great balance</p></div>
    </section>

    <section className="section-block">
      <div className="section-heading"><div><h2>Today at a glance</h2><p>Your key wellness metrics</p></div><button onClick={() => go('health')} className="text-link">View health <Icon name="arrow" size={16}/></button></div>
      <div className="metric-grid">
        <MetricCard icon="fire" tone="peach" value="1,460" unit="/ 2,050 kcal" label="Nutrition" progress={71}/>
        <MetricCard icon="water" tone="blue" value="6" unit="/ 8 glasses" label="Water" progress={75}/>
        <MetricCard icon="moon" tone="purple" value="7h 42m" unit="of sleep" label="Last night" progress={84}/>
        <MetricCard icon="heart" tone="rose" value="Good" unit="steady energy" label="How you feel" progress={78}/>
      </div>
    </section>

    <div className="two-column">
      <section className="card nutrition-card">
        <div className="section-heading compact"><div><span className="card-kicker">TODAY'S NUTRITION</span><h2>Balanced and colorful</h2></div><button className="round-arrow" onClick={() => go('nutrition')}><Icon name="arrow"/></button></div>
        <div className="nutrition-overview">
          <Ring value={71}><strong>1,460</strong><small>kcal logged</small></Ring>
          <div className="macro-list">
            <Macro label="Protein" value="74g" percent={68} color="#174F46"/>
            <Macro label="Carbs" value="168g" percent={72} color="#E7A86E"/>
            <Macro label="Fats" value="49g" percent={61} color="#8B80B6"/>
            <Macro label="Fiber" value="23g" percent={82} color="#78A994"/>
          </div>
        </div>
      </section>
      <section className="card insight-teaser">
        <div className="insight-icon"><Icon name="sparkles"/></div>
        <span className="card-kicker">AI INSIGHT · THIS WEEK</span>
        <h2>Your energy is more stable on higher-protein mornings.</h2>
        <p>On days you eat 20g+ of protein at breakfast, you report 18% fewer afternoon energy dips.</p>
        <button className="text-link" onClick={() => go('insights')}>Explore the connection <Icon name="arrow" size={16}/></button>
        <small className="ai-note">AI-generated pattern, not a medical diagnosis.</small>
      </section>
    </div>

    <section className="section-block">
      <div className="section-heading"><div><h2>Quick actions</h2><p>What would you like to do?</p></div></div>
      <div className="quick-grid">
        {[
          ['scan','Scan a meal','Get an AI estimate','scanner'],
          ['health','Check in','Log mood & symptoms','health'],
          ['chat','Ask Nutri','Wellness questions','assistant'],
          ['report','Create report','Share with your doctor','reports'],
        ].map(([icon, title, desc, page]) => <button className="quick-card" key={title} onClick={() => go(page as Page)}><span><Icon name={icon as IconName}/></span><div><strong>{title}</strong><small>{desc}</small></div><Icon name="arrow" size={18}/></button>)}
      </div>
    </section>
  </div>
}

function MetricCard({ icon, tone, value, unit, label, progress }: { icon: IconName; tone: string; value: string; unit: string; label: string; progress: number }) {
  return <article className="metric-card">
    <div className={`metric-icon ${tone}`}><Icon name={icon}/></div>
    <div className="metric-label">{label}</div><div className="metric-value">{value} <small>{unit}</small></div>
    <div className="progress"><i style={{width: `${progress}%`}}/></div>
  </article>
}

function Macro({ label, value, percent, color }: { label: string; value: string; percent: number; color: string }) {
  return <div className="macro"><div><span>{label}</span><strong>{value}</strong></div><div className="progress"><i style={{width: `${percent}%`, background: color}}/></div></div>
}


function Nutrition({ go }: { go: (page: Page) => void }) {
  const [meals, setMeals] = useState<MealRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    meal_name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    meal_type: 'Breakfast',
  })

  async function loadMeals() {
    try {
      setLoading(true)
      setError('')
      const data = await getMeals()
      setMeals(data)
    } catch (err) {
      console.error(err)
      setError('Could not load meals. Please check your backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMeals()
  }, [])

  async function handleAddMeal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      await addMeal({
        meal_name: form.meal_name.trim(),
        calories: Number(form.calories),
        protein: Number(form.protein),
        carbs: Number(form.carbs),
        fats: Number(form.fats),
        meal_type: form.meal_type,
      })

      setForm({
        meal_name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        meal_type: 'Breakfast',
      })

      setShowForm(false)
      setSuccess('Your meal was saved successfully!')
      await loadMeals()
    } catch (err) {
      console.error(err)
      setError('Unable to save meal. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteMeal(id: string) {
    try {
      setError('')
      await deleteMeal(id)
      setMeals(previous => previous.filter(meal => meal._id !== id))
      setSuccess('Meal deleted successfully.')
    } catch (err) {
      console.error(err)
      setError('Could not delete this meal.')
    }
  }

  const totalCalories = meals.reduce(
    (sum, meal) => sum + meal.calories, 0
  )

  const totalProtein = meals.reduce(
    (sum, meal) => sum + meal.protein, 0
  )

  const totalCarbs = meals.reduce(
    (sum, meal) => sum + meal.carbs, 0
  )

  const totalFats = meals.reduce(
    (sum, meal) => sum + meal.fats, 0
  )

  return (
    <div className="page-stack">

      <div className="feature-actions">
        <Button
          icon="plus"
          onClick={() => {
            setShowForm(!showForm)
            setSuccess('')
            setError('')
          }}
        >
          {showForm ? 'Close form' : 'Log meal manually'}
        </Button>

        <Button
          variant="secondary"
          icon="camera"
          onClick={() => go('scanner')}
        >
          Scan with AI
        </Button>
      </div>

      {error && (
        <div className="success-banner">
          {error}
        </div>
      )}

      {success && (
        <div className="success-banner">
          <Icon name="check" />
          <strong>{success}</strong>
        </div>
      )}

      {showForm && (
        <section className="card">
          <div className="section-heading compact">
            <div>
              <h2>Add a meal</h2>
              <p>Enter the nutritional information below.</p>
            </div>
          </div>

          <form onSubmit={handleAddMeal} className="page-stack">

            <label>
              Meal name
              <input
                required
                value={form.meal_name}
                onChange={e =>
                  setForm({ ...form, meal_name: e.target.value })
                }
                placeholder="e.g. Paneer rice bowl"
              />
            </label>

            <label>
              Meal type
              <select
                value={form.meal_type}
                onChange={e =>
                  setForm({ ...form, meal_type: e.target.value })
                }
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Snacks</option>
                <option>Dinner</option>
              </select>
            </label>

            <div className="macro-grid">
              <label>
                Calories (kcal)
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={form.calories}
                  onChange={e =>
                    setForm({ ...form, calories: e.target.value })
                  }
                />
              </label>

              <label>
                Protein (g)
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={form.protein}
                  onChange={e =>
                    setForm({ ...form, protein: e.target.value })
                  }
                />
              </label>

              <label>
                Carbs (g)
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={form.carbs}
                  onChange={e =>
                    setForm({ ...form, carbs: e.target.value })
                  }
                />
              </label>

              <label>
                Fats (g)
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={form.fats}
                  onChange={e =>
                    setForm({ ...form, fats: e.target.value })
                  }
                />
              </label>
            </div>

            <Button>
              {saving ? 'Saving...' : 'Save meal'}
            </Button>

            <button
              type="button"
              className="text-link"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </form>
        </section>
      )}

      <section className="card calorie-card">
        <div>
          <span className="card-kicker">TOTAL LOGGED CALORIES</span>
          <h2>{Math.round(totalCalories)} <small>kcal</small></h2>
          <p>From your saved meals</p>
        </div>

        <Ring value={Math.min(totalCalories / 2050 * 100, 100)}>
          <strong>
            {Math.round(totalCalories / 2050 * 100)}%
          </strong>
          <small>of demo goal</small>
        </Ring>
      </section>

      <section className="card">
        <div className="section-heading compact">
          <div>
            <h2>Macronutrients</h2>
            <p>Total from saved meals</p>
          </div>
        </div>

        <div className="macro-grid">
          <MacroStat
            label="Protein"
            value={`${totalProtein}g`}
            goal="—"
            percent={0}
            color="#174F46"
          />
          <MacroStat
            label="Carbohydrates"
            value={`${totalCarbs}g`}
            goal="—"
            percent={0}
            color="#D89156"
          />
          <MacroStat
            label="Fats"
            value={`${totalFats}g`}
            goal="—"
            percent={0}
            color="#8678AD"
          />
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <h2>Your saved meals</h2>
            <p>Retrieved from your NutriSync database</p>
          </div>
        </div>

        <div className="meal-list">
          {loading ? (
            <p>Loading your meals...</p>
          ) : meals.length === 0 ? (
            <div className="card">
              <h3>No meals saved yet</h3>
              <p>Use Log meal manually to add your first meal.</p>
            </div>
          ) : (
            meals.map(meal => (
              <article className="meal-card" key={meal._id}>
                <div
                  className="meal-thumb"
                  style={{ background: '#E7F1E9' }}
                >
                  <Icon name="nutrition" />
                </div>

                <div className="meal-info">
                  <small>{meal.meal_type || 'Meal'}</small>
                  <strong>{meal.meal_name}</strong>
                  <span>
                    Protein: {meal.protein}g ·
                    Carbs: {meal.carbs}g ·
                    Fats: {meal.fats}g
                  </span>
                </div>

                <div className="meal-cal">
                  <strong>{meal.calories} kcal</strong>
                </div>

                <button
                  type="button"
                  aria-label={`Delete ${meal.meal_name}`}
                  onClick={() => handleDeleteMeal(meal._id)}
                >
                  ×
                </button>
              </article>
            ))
          )}
        </div>
      </section>

    </div>
  )
}


function MacroStat({ label, value, goal, percent, color }: { label: string; value: string; goal: string; percent: number; color: string }) {
  return <div className="macro-stat"><Ring value={percent} color={color}><strong>{percent}%</strong></Ring><div><span>{label}</span><strong>{value}</strong><small> of {goal}</small></div></div>
}

function Meal({ time, name, details, calories, color }: { time: string; name: string; details: string; calories: string; color: string }) {
  return <article className="meal-card"><div className="meal-thumb" style={{background: color}}><Icon name="nutrition"/></div><div className="meal-info"><small>{time}</small><strong>{name}</strong><span>{details}</span></div><div className="meal-cal"><strong>{calories}</strong><span className="ai-badge">Estimated</span></div><button aria-label="Meal details"><Icon name="chevron"/></button></article>
}

function Nutrient({ name, value }: { name: string; value: string }) {
  return <div><span>{name}</span><strong>{value}</strong><div className="progress"><i style={{width: value}}/></div></div>
}

function Scanner() {
  const [scanned, setScanned] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  return <div className="page-stack scanner-layout">
    <section className={`upload-zone ${scanned ? 'scanned' : ''}`}>
      {!scanned ? <><div className="upload-icon"><Icon name="camera" size={32}/></div><h2>Show us what’s on your plate</h2><p>Upload a clear, well-lit photo and NutriSync AI will estimate the ingredients and nutrition.</p><Button onClick={() => inputRef.current?.click()} icon="camera">Choose a photo</Button><input ref={inputRef} type="file" accept="image/*" hidden onChange={() => setScanned(true)}/><small>JPG, PNG or HEIC · Your image stays private</small></> :
      <><div className="food-preview"><div className="plate"><Icon name="nutrition" size={68}/><i/><b/><em/></div><span className="scan-line"/></div><span className="status-pill"><span/> ANALYSIS COMPLETE</span></>}
    </section>
    {!scanned ? <div className="scanner-tips">
      <h2>For the best estimate</h2>
      <div><span>01</span><p><strong>Use natural light</strong>Keep the full plate visible.</p></div>
      <div><span>02</span><p><strong>Photograph from above</strong>A top-down view helps identify portions.</p></div>
      <div><span>03</span><p><strong>Review before saving</strong>You’re always in control of the result.</p></div>
    </div> : <section className="card scan-results">
      <div className="section-heading compact"><div><span className="ai-badge">AI ESTIMATE</span><h2>Mediterranean quinoa bowl</h2><p>92% match confidence</p></div><Icon name="sparkles" size={28}/></div>
      <div className="estimate-cal"><strong>610</strong><span>estimated<br/>calories</span></div>
      <div className="scan-macros"><div><span>Protein</span><strong>24g</strong></div><div><span>Carbs</span><strong>76g</strong></div><div><span>Fats</span><strong>22g</strong></div><div><span>Fiber</span><strong>14g</strong></div></div>
      <div className="detected"><strong>Detected ingredients</strong><p>Quinoa, chickpeas, cucumber, cherry tomatoes, feta cheese, olives, tahini dressing</p></div>
      <p className="disclaimer">AI estimates can vary based on portion size and preparation. Review and adjust before saving.</p>
      {confirmed ? <div className="success-banner"><Icon name="check"/><strong>Meal confirmed and added to today</strong></div> : <div className="feature-actions"><Button icon="check" onClick={() => setConfirmed(true)}>Confirm & add meal</Button><Button variant="secondary">Edit estimate</Button></div>}
    </section>}
  </div>
}

const ratingOptions = {
  mood: ['Low', 'Okay', 'Good', 'Great'],
  energy: ['Drained', 'Low', 'Steady', 'Energized'],
  digestion: ['Uncomfortable', 'Off', 'Normal', 'Great'],
}

function Health({ go }: { go: (page: Page) => void }) {
  const [ratings, setRatings] = useState<Record<string, string>>({mood:'Good', energy:'Steady', digestion:'Normal'})
  const [saved, setSaved] = useState(false)
  return <div className="page-stack">
    <div className="checkin-grid">
      <section className="card checkin">
        <span className="card-kicker">DAILY CHECK-IN · MAY 26</span><h2>How are you feeling?</h2><p>Take a moment to tune in. There are no wrong answers.</p>
        {Object.entries(ratingOptions).map(([key, options]) => <div className="rating" key={key}><label>{key[0].toUpperCase()+key.slice(1)}</label><div>{options.map((option, i) => <button key={option} className={ratings[key] === option ? 'active' : ''} onClick={() => setRatings({...ratings, [key]: option})}><span>{['○','◔','◕','●'][i]}</span>{option}</button>)}</div></div>)}
        <div className="symptom-field"><label>Symptoms today <small>Optional</small></label><div>{['Headache','Bloating','Cravings','Soreness','None'].map(x => <button key={x}>{x}</button>)}</div></div>
        <Button icon="check" onClick={() => setSaved(true)}>{saved ? 'Check-in saved' : 'Save check-in'}</Button>
      </section>
      <aside className="side-stack">
        <section className="card sleep-card"><div className="card-title-icon"><Icon name="moon"/><div><span>Last night</span><h2>7h 42m</h2></div></div><div className="sleep-bars">{[35,62,48,72,54,68,82,64,73,49,70,55,38].map((n,i) => <i key={i} style={{height:n}}/>)}</div><p><strong>Good recovery</strong> · 84% sleep score</p></section>
        <button className="cycle-promo" onClick={() => go('period')}><div><span>OPTIONAL FEATURE</span><h2>Cycle tracking</h2><p>Private, flexible, and easy to pause anytime.</p></div><Icon name="arrow"/></button>
      </aside>
    </div>
    <section><div className="section-heading"><div><h2>Your 7-day pattern</h2><p>Mood and energy from recent check-ins</p></div></div><div className="card chart-card"><TrendChart/><div className="chart-legend"><span><i className="green"/>Mood</span><span><i className="gold"/>Energy</span></div></div></section>
  </div>
}

function TrendChart() {
  return <svg className="trend-chart" viewBox="0 0 700 190" preserveAspectRatio="none"><g className="grid-lines"><path d="M30 30H680M30 80H680M30 130H680M30 180H680"/></g><path className="area" d="M30 135 C90 120 100 80 140 90 S220 135 250 115 S330 50 360 70 S440 120 470 92 S560 45 580 62 S640 82 680 48 L680 180 L30 180Z"/><path className="line green" d="M30 135 C90 120 100 80 140 90 S220 135 250 115 S330 50 360 70 S440 120 470 92 S560 45 580 62 S640 82 680 48"/><path className="line gold" d="M30 150 C90 145 100 120 140 130 S220 115 250 125 S330 92 360 105 S440 145 470 118 S560 78 580 92 S640 102 680 80"/><g className="labels"><text x="30" y="188">Tue</text><text x="135" y="188">Wed</text><text x="245" y="188">Thu</text><text x="355" y="188">Fri</text><text x="465" y="188">Sat</text><text x="575" y="188">Sun</text><text x="665" y="188">Mon</text></g></svg>
}

function Period() {
  const [enabled, setEnabled] = useState(true)
  const [month, setMonth] = useState(1)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Fatigue'])
  const [symptomsSaved, setSymptomsSaved] = useState(false)
  const [energyLevel, setEnergyLevel] = useState(() => localStorage.getItem('nutrisync-energy') || 'Good')
  const [periodStartDate, setPeriodStartDate] = useState(() => localStorage.getItem('nutrisync-period-start') || '')
  const [periodDateDraft, setPeriodDateDraft] = useState(() => localStorage.getItem('nutrisync-period-start') || new Date().toLocaleDateString('en-CA'))
  const months = [
    { label: 'April 2025', offset: -1, count: 30, period: [10,11,12,13,14], today: 0 },
    { label: 'May 2025', offset: -2, count: 31, period: [8,9,10,11,12], today: 26 },
    { label: 'June 2025', offset: 1, count: 30, period: [6,7,8,9,10], today: 0 },
  ]
  const activeMonth = months[month]
  const calendarDays = Array.from({length: 35}, (_,i) => i + activeMonth.offset)
  const symptoms = ['Cramps','Mood changes','Fatigue','Low energy','Bloating','Headache','Cravings','Tenderness']
  const toggleSymptom = (symptom: string) => {
    setSymptomsSaved(false)
    setSelectedSymptoms(selectedSymptoms.includes(symptom) ? selectedSymptoms.filter(item => item !== symptom) : [...selectedSymptoms, symptom])
  }
  return <div className="page-stack">
    <div className="privacy-strip"><Icon name="lock"/><div><strong>Your cycle data is private</strong><span>This feature is optional. You can pause it or delete its data at any time.</span></div><button className={`switch ${enabled ? 'on' : ''}`} onClick={() => setEnabled(!enabled)}><i/></button></div>
    {enabled ? <>
      <section>
        <div className="section-heading cycle-heading"><div><span className="card-kicker">CYCLE OVERVIEW</span><h2>Your cycle at a glance</h2></div><span className="cycle-phase-pill">Luteal phase · Day 19</span></div>
        <div className="cycle-overview-grid">
          <article className="cycle-overview-card"><span className="cycle-stat-icon pink"><Icon name="period"/></span><div><small>Last period started</small><strong>{periodStartDate ? new Date(periodStartDate+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : 'Not recorded yet'}</strong><p>{periodStartDate ? (periodStartDate===new Date().toLocaleDateString('en-CA') ? 'Started today' : 'Last recorded start date') : 'Add your period start date below'}</p></div></article>
          <article className="cycle-overview-card"><span className="cycle-stat-icon peach"><Icon name="clock"/></span><div><small>Average cycle</small><strong>29 days</strong><p>Usually 28–30 days</p></div></article>
          <article className="cycle-overview-card"><span className="cycle-stat-icon cream"><Icon name="calendar"/></span><div><small>Estimated next period</small><strong>June 6, 2025</strong><p>In approximately 10 days</p></div></article>
        </div>
      </section>

      <div className="cycle-layout">
        <section className="card calendar-card">
          <div className="section-heading compact"><button className="icon-button" disabled={month === 0} onClick={() => setMonth(Math.max(0,month-1))}><Icon name="chevron" className="flip"/></button><div className="calendar-title"><span className="card-kicker">CYCLE CALENDAR</span><h2>{activeMonth.label}</h2></div><button className="icon-button" disabled={month === 2} onClick={() => setMonth(Math.min(2,month+1))}><Icon name="chevron"/></button></div>
          <div className="weekdays">{['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d=><span key={d}>{d}</span>)}</div>
          <div className="calendar-days">{calendarDays.map((d,i)=>{
            const date = d < 1 ? 30 + d : d > activeMonth.count ? d-activeMonth.count : d
            const outside = d < 1 || d > activeMonth.count
            const fertile = month === 1 && d >= 18 && d <= 23
            return <button key={i} className={`${outside?'muted':''} ${!outside&&activeMonth.period.includes(d)?'period-day':''} ${fertile?'fertile-day':''} ${d===activeMonth.today?'today':''}`}>{date}</button>
          })}</div>
          <div className="calendar-key"><span><i className="period-dot"/>Recorded period</span><span><i className="fertile-dot"/>Estimated fertile window</span><span><i className="today-dot"/>Today</span></div>
        </section>
        <aside className="side-stack">
          <section className="cycle-status"><span>CURRENT CYCLE</span><strong>Day 19</strong><p>Next period estimated in 10 days</p><div className="progress"><i style={{width:'65%'}}/></div><small>Estimate based on your recorded cycle history</small></section>
          <section className="card symptom-tracker">
            <div className="section-heading compact"><div><span className="card-kicker">SYMPTOM TRACKER</span><h2>How do you feel today?</h2></div><span className="date-badge">May 26</span></div>
            <div className="symptom-tags">{symptoms.map(symptom => <button key={symptom} className={selectedSymptoms.includes(symptom) ? 'selected' : ''} onClick={() => toggleSymptom(symptom)}>{selectedSymptoms.includes(symptom) ? <Icon name="check" size={13}/> : <Icon name="plus" size={13}/>} {symptom}</button>)}</div>
            <label className="energy-level"><span>Energy level</span><div>{['Low','Moderate','Good','High'].map(level=><button type="button" key={level} className={energyLevel===level?'active':''} onClick={()=>{setEnergyLevel(level);localStorage.setItem('nutrisync-energy',level);setSymptomsSaved(false)}}>{level}</button>)}</div></label>
            <div className="period-log-control"><label htmlFor="period-start-date">When did your period start?</label><div><input id="period-start-date" type="date" value={periodDateDraft} onChange={e=>setPeriodDateDraft(e.target.value)}/><button type="button" onClick={()=>{if(periodDateDraft){setPeriodStartDate(periodDateDraft);localStorage.setItem('nutrisync-period-start',periodDateDraft)}}}>Save period start</button></div>{periodStartDate&&<small>Period start recorded: {new Date(periodStartDate+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</small>}</div>
            <Button variant="secondary" icon="check" onClick={() => setSymptomsSaved(true)}>{symptomsSaved ? 'Symptoms saved' : 'Save today’s symptoms'}</Button>
          </section>
        </aside>
      </div>

      <section className="card cycle-phases">
        <div className="section-heading compact"><div><span className="card-kicker">CYCLE PHASES</span><h2>Where you are this cycle</h2></div><span className="phase-estimate">Dates are estimates</span></div>
        <div className="phase-track">
          <div className="phase-segment menstrual"><i/><span><strong>Menstrual</strong><small>Days 1–5</small></span></div>
          <div className="phase-segment follicular"><i/><span><strong>Follicular</strong><small>Days 6–13</small></span></div>
          <div className="phase-segment ovulation"><i/><span><strong>Ovulation</strong><small>Day 14</small></span></div>
          <div className="phase-segment luteal active"><i/><span><strong>Luteal</strong><small>Days 15–29 · You are here</small></span></div>
        </div>
        <div className="phase-detail"><span className="cycle-stat-icon peach"><Icon name="sparkles"/></span><div><strong>Luteal phase</strong><p>Energy may naturally shift during this phase. Regular meals, hydration, and gentle movement can support general wellbeing.</p></div></div>
      </section>

      <div className="cycle-bottom-grid">
        <section className="card cycle-history">
          <div className="section-heading compact"><div><span className="card-kicker">CYCLE HISTORY</span><h2>Recent cycles</h2></div><button className="text-link">View all <Icon name="arrow" size={15}/></button></div>
          <div className="history-header"><span>Cycle</span><span>Length</span><span>Period</span><span>Pattern</span></div>
          {[['Apr 10 – May 7','28 days','5 days','Typical'],['Mar 11 – Apr 9','30 days','5 days','Typical'],['Feb 11 – Mar 10','28 days','4 days','Typical']].map(row=><div className="history-row" key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><span>{row[2]}</span><span className="pattern-pill">{row[3]}</span></div>)}
          <div className="cycle-consistency"><div><strong>Cycle consistency</strong><span>Your last 3 cycles varied by 2 days</span></div><strong>Consistent</strong></div>
        </section>
        <section className="cycle-insight-card">
          <div className="insight-icon"><Icon name="sparkles"/></div><span className="card-kicker">GENERAL CYCLE INSIGHT</span><h2>Fatigue appears most often in your late luteal phase.</h2><p>You recorded lower energy in the 3 days before your last two periods. Planning lighter activity may help you respond to how you feel.</p><small>Based on your logs. This is a general observation, not medical advice or a diagnosis.</small>
        </section>
      </div>
    </> : <section className="empty-state card"><Icon name="period" size={36}/><h2>Menstrual cycle tracking is paused</h2><p>No cycle information will be collected or used in your insights.</p><Button onClick={() => setEnabled(true)}>Turn on cycle tracking</Button></section>}
  </div>
}

function Insights({ go }: { go: (page: Page) => void }) {
  const [range, setRange] = useState('Weekly')
  return <div className="page-stack">
    <div className="range-toggle">{['Weekly','Monthly'].map(r=><button className={range===r?'active':''} onClick={()=>setRange(r)} key={r}>{r}</button>)}</div>
    <section className="insight-hero card"><div><span className="ai-badge"><Icon name="sparkles" size={14}/> AI-GENERATED SUMMARY</span><h2>{range === 'Weekly' ? 'A steady week, with one clear opportunity.' : 'Your consistency is building meaningful momentum.'}</h2><p>{range === 'Weekly' ? 'Your nutrition quality and sleep improved. Afternoon energy was strongest after protein-rich breakfasts.' : 'Over the last four weeks, hydration and fiber intake both trended upward while reported bloating decreased.'}</p></div><div className="score-block"><Ring value={86} color="#174F46"><strong>86</strong><small>wellness score</small></Ring><span>+4 from last {range==='Weekly'?'week':'month'}</span></div></section>
    <div className="insight-grid">
      <InsightCard icon="nutrition" label="STRONG CONNECTION" title="Protein & afternoon energy" body="Breakfasts with 20g+ protein were followed by 18% fewer low-energy check-ins." stat="+18%" statLabel="steadier energy"/>
      <InsightCard icon="water" label="EMERGING PATTERN" title="Hydration & headaches" body="Headaches were logged less often on days you reached 7 or more glasses of water." stat="3 of 4" statLabel="headache-free days"/>
      <InsightCard icon="moon" label="POSITIVE TREND" title="Sleep consistency" body="Your average bedtime varied by just 32 minutes, improving your sleep consistency." stat="7h 38m" statLabel="average sleep"/>
    </div>
    <section className="card insight-method"><Icon name="shield"/><div><h3>How to use these insights</h3><p>NutriSync finds possible patterns in your own logs. These are AI-generated observations, not diagnoses or medical advice. Discuss health concerns with a qualified professional.</p></div></section>
    <div className="recommend-banner"><div><span className="card-kicker">NEXT BEST STEP</span><h2>Turn insights into gentle, practical actions.</h2></div><Button onClick={()=>go('recommendations')}>View recommendations</Button></div>
  </div>
}

function InsightCard({icon,label,title,body,stat,statLabel}:{icon:IconName;label:string;title:string;body:string;stat:string;statLabel:string}) {
  return <article className="card insight-card"><div className="insight-card-icon"><Icon name={icon}/></div><span className="card-kicker">{label}</span><h2>{title}</h2><p>{body}</p><div><strong>{stat}</strong><span>{statLabel}</span></div></article>
}

function Recommendations() {
  const [done, setDone] = useState<string[]>([])
  const recs = [
    {icon:'nutrition',tag:'NUTRITION',title:'Add a protein anchor at breakfast',body:'Try Greek yogurt, eggs, tofu, or cottage cheese to reach around 20g.',why:'Supports the steadier energy pattern in your logs.'},
    {icon:'water',tag:'HYDRATION',title:'Make your seventh glass effortless',body:'Keep a filled bottle visible during your afternoon work block.',why:'You tend to log fewer headaches on well-hydrated days.'},
    {icon:'moon',tag:'SLEEP',title:'Protect your consistent bedtime',body:'Start a 20-minute wind-down around 10:15 PM tonight.',why:'Your sleep regularity is already trending positively.'},
  ]
  return <div className="page-stack"><div className="recommend-intro"><div><span className="ai-badge"><Icon name="sparkles" size={14}/> PERSONALIZED WITH AI</span><h2>Three gentle focuses for this week</h2><p>Built from your goals, food preferences, and recent logs.</p></div><div className="goal-chip"><span>Current goal</span><strong>More daily energy</strong></div></div>
    <div className="recommend-list">{recs.map(r=><article className={`card recommendation ${done.includes(r.title)?'completed':''}`} key={r.title}><div className="rec-number"><Icon name={r.icon as IconName}/></div><div><span className="card-kicker">{r.tag}</span><h2>{r.title}</h2><p>{r.body}</p><small><strong>Why this?</strong> {r.why}</small></div><button onClick={()=>setDone(done.includes(r.title)?done.filter(x=>x!==r.title):[...done,r.title])}><Icon name="check"/><span>{done.includes(r.title)?'Done':'Mark done'}</span></button></article>)}</div>
    <p className="disclaimer centered">Recommendations are for general wellness only and do not diagnose, treat, or prescribe. Check with a healthcare professional for individual guidance.</p>
  </div>
}

  
function Assistant() {
  const [messages, setMessages] = useState<{from:'ai'|'user';text:string}[]>([
    {
      from: 'ai',
      text: 'Hi Maya, I’m Nutri. I can help with general nutrition and wellness questions. What’s on your mind?'
    }
  ])

  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async (text = draft) => {
    const prompt = text.trim()

    if (!prompt || loading) return

    setDraft('')
    setMessages(prev => [...prev, {from:'user', text:prompt}])
    setLoading(true)

    try {
      const response = await generateInsight(prompt)

      setMessages(prev => [
        ...prev,
        {from:'ai', text:response}
      ])
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          from:'ai',
          text: error instanceof Error
            ? error.message
            : 'Sorry, something went wrong. Please try again.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="assistant-shell card">
      <div className="chat-top">
        <div className="ai-avatar"><Icon name="sparkles"/></div>
        <div>
          <strong>Nutri</strong>
          <span><i/> AI wellness assistant</span>
        </div>
        <button className="icon-button">
          <Icon name="settings"/>
        </button>
      </div>

      <div className="chat-safety">
        <Icon name="shield"/>
        <span>I provide general wellness information, not diagnosis, treatment, or emergency support.</span>
      </div>

      <div className="messages">
        {messages.map((m,i) => (
          <div className={`message ${m.from}`} key={i}>
            {m.from === 'ai' && (
              <span className="mini-avatar">
                <Icon name="sparkles" size={14}/>
              </span>
            )}
            <p>{m.text}</p>
          </div>
        ))}

        {loading && (
          <div className="message ai">
            <span className="mini-avatar">
              <Icon name="sparkles" size={14}/>
            </span>
            <p>Nutri is thinking...</p>
          </div>
        )}
      </div>

      {messages.length < 3 && (
        <div className="suggestions">
          {[
            'What’s a balanced afternoon snack?',
            'How can I add more fiber?',
            'Help me understand my hydration trend'
          ].map(x => (
            <button key={x} onClick={() => send(x)} disabled={loading}>
              {x}<Icon name="arrow" size={15}/>
            </button>
          ))}
        </div>
      )}

      <div className="chat-input">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask a nutrition or wellness question…"
          disabled={loading}
        />
        <button onClick={() => send()} aria-label="Send" disabled={loading}>
          <Icon name="send"/>
        </button>
      </div>

      <small className="chat-footnote">
        AI responses can make mistakes. For medical concerns, consult a qualified healthcare professional.
      </small>
    </div>
  )
}



function Community() {
  type CommunityPost = { id: number; name: string; initials: string; time: string; category: string; text: string; likes: number; liked: boolean }
  const starterPosts: CommunityPost[] = [
    { id: 1, name: 'Aanya', initials: 'A', time: 'Today · 9:15 AM', category: 'Daily habits', text: 'I started keeping a water bottle near my study desk. It is a small reminder that helps me take regular water breaks. What tiny habit has been helping you lately?', likes: 12, liked: false },
    { id: 2, name: 'Mira', initials: 'M', time: 'Today · 8:40 AM', category: 'Food & nutrition', text: 'Sharing a simple snack idea: fruit with yogurt and a handful of nuts. Easy to put together when the day gets busy!', likes: 8, liked: false },
    { id: 3, name: 'Riya', initials: 'R', time: 'Yesterday · 6:20 PM', category: 'Mindful routines', text: 'A short screen break and a little stretch between tasks made my evening feel more relaxed. Gentle reminders can make a difference.', likes: 16, liked: false },
  ]
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try { const saved = localStorage.getItem('nutrisync-community-posts'); return saved ? JSON.parse(saved) : starterPosts }
    catch { return starterPosts }
  })
  const [draft, setDraft] = useState('')
  const [category, setCategory] = useState('Daily habits')
  const [filter, setFilter] = useState('All topics')
  const [notice, setNotice] = useState('')
  const save = (next: CommunityPost[]) => { setPosts(next); localStorage.setItem('nutrisync-community-posts', JSON.stringify(next)) }
  const publish = () => {
    const text = draft.trim()
    if (!text) { setNotice('Write a little something before sharing.'); return }
    if (text.length > 500) { setNotice('Please keep your post under 500 characters.'); return }
    const next = [{ id: Date.now(), name: 'You', initials: 'Y', time: 'Just now', category, text, likes: 0, liked: false }, ...posts]
    save(next); setDraft(''); setNotice('Your post has been added to the community!')
  }
  const toggleLike = (id: number) => save(posts.map(post => post.id === id ? { ...post, liked: !post.liked, likes: Math.max(0, post.likes + (post.liked ? -1 : 1)) } : post))
  const visible = filter === 'All topics' ? posts : posts.filter(post => post.category === filter)
  return <div className="page-stack community-page">
    <section className="community-hero"><div><span className="community-kicker">A SUPPORTIVE SPACE</span><h2>Better together, one small step at a time.</h2><p>Exchange everyday ideas, celebrate progress, and encourage one another on your wellness journeys.</p></div><div className="community-hero-art"><span>♡</span><small>kindness<br/>counts</small></div></section>
    <div className="community-guidelines"><span>✦ Community guidelines</span><p>Be kind and respectful. Protect your privacy. Share personal experiences, not diagnoses or medical instructions. For health concerns, speak with a qualified professional.</p></div>
    <section className="card community-composer"><div className="community-section-title"><div><span className="card-kicker">YOUR COMMUNITY</span><h2>Start a conversation</h2></div><span className="community-online">● A welcoming space</span></div><textarea value={draft} onChange={e=>{setDraft(e.target.value);setNotice('')}} maxLength={500} placeholder="Share a small win, a routine that helps, or a question for the community…"/><div className="composer-bottom"><select value={category} onChange={e=>setCategory(e.target.value)}><option>Daily habits</option><option>Food & nutrition</option><option>Mindful routines</option><option>Motivation</option></select><span>{draft.length}/500</span><button className="button primary" onClick={publish}>Share post <Icon name="send" size={15}/></button></div>{notice && <small className="community-notice">{notice}</small>}</section>
    <section className="community-feed"><div className="community-feed-head"><div><h2>Community conversations</h2><p>Ideas and encouragement from members</p></div><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All topics</option><option>Daily habits</option><option>Food & nutrition</option><option>Mindful routines</option><option>Motivation</option></select></div>
      {visible.length === 0 ? <div className="card community-empty">No posts in this topic yet. Be the first to share an idea!</div> : visible.map(post=><article className="card community-post" key={post.id}><div className="post-author"><div className="post-avatar">{post.initials}</div><div><strong>{post.name}</strong><small>{post.time}</small></div><span className="post-category">{post.category}</span></div><p className="post-copy">{post.text}</p><div className="post-actions"><button onClick={()=>toggleLike(post.id)} className={post.liked?'liked':''}><span>{post.liked?'♥':'♡'}</span> {post.likes} {post.likes===1?'like':'likes'}</button><span>Be supportive · Keep it kind</span></div></article>)}
    </section>
    <p className="community-disclaimer">Demo community: posts and likes are saved in this browser only. Do not share personal contact details or sensitive health information.</p>
  </div>
}

function Reports() {
  const reportItems = ['Nutrition averages','Symptoms & check-ins','Sleep patterns','Cycle data (optional)','AI-observed patterns','Current preferences']
  const [selected, setSelected] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('nutrisync-report-sections') || '["Nutrition averages","Symptoms & check-ins","Sleep patterns","AI-observed patterns","Current preferences"]') } catch { return reportItems.filter(x => x !== 'Cycle data (optional)') }
  })
  const [generated,setGenerated]=useState(false)
  const [dateRange,setDateRange]=useState('Last 30 days')
  const toggle = (item:string) => {
    setGenerated(false)
    const next = selected.includes(item) ? selected.filter(x=>x!==item) : [...selected,item]
    setSelected(next)
    localStorage.setItem('nutrisync-report-sections', JSON.stringify(next))
  }
  return <div className="page-stack"><div className="report-layout">
    <section className="card report-builder"><span className="card-kicker">CREATE A REPORT</span><h2>Choose what to include</h2><p>Build a concise summary to support a conversation with your healthcare professional.</p>
      <label>Date range<select value={dateRange} onChange={e=>{setDateRange(e.target.value);setGenerated(false)}}><option>Last 30 days</option><option>Last 7 days</option><option>Last 3 months</option></select></label>
      <div className="report-options">{reportItems.map(x=><label key={x}><input type="checkbox" checked={selected.includes(x)} onChange={()=>toggle(x)}/><span className={selected.includes(x)?'checked':''}>{selected.includes(x)&&<Icon name="check" size={14}/>}</span>{x}</label>)}</div>
      <Button icon="report" onClick={()=>setGenerated(true)}>Generate health summary</Button>
    </section>
    <section className="report-preview"><div className="paper">
      <div className="paper-head"><div className="brand-mark small"><Icon name="nutrition" size={17}/></div><div><strong>NutriSync AI</strong><span>Personal health summary</span></div><small>{dateRange.toUpperCase()}</small></div>
      {!generated?<div className="preview-empty"><Icon name="report" size={36}/><p>Your report preview will appear here.</p></div>:<><h2>Personal wellness summary</h2><p className="paper-subtitle">Selected sections · {new Date().toLocaleDateString('en-IN')}</p>
        {selected.length===0?<p>Please select at least one section to include in your report.</p>:selected.map(item=><section className="generated-report-section" key={item}><h3>{item.toUpperCase()}</h3><p>{item==='Nutrition averages'?'Nutrition information will be summarized from your recorded meal logs.':item==='Symptoms & check-ins'?'Your selected symptoms and daily check-in entries will be summarized here.':item==='Sleep patterns'?'Sleep entries from the selected date range will be summarized here.':item==='Cycle data (optional)'?'Cycle dates and entries you chose to record will be included here.':item==='AI-observed patterns'?'Any observed trends will be presented as general information, not medical conclusions.':'Your saved wellness goals and preferences will be listed here.'}</p></section>)}
        <div className="paper-note">This prototype report uses explanatory placeholders until your app is connected to saved health records. It is not a diagnosis or medical advice.</div></>}
      </div></section>
    </div>
  </div>
}

function Profile() {
  const [sharing,setSharing]=useState(false)
  const [editing,setEditing]=useState(false)
  const [profile,setProfile]=useState(()=>{
    try { return JSON.parse(localStorage.getItem('nutrisync-profile') || '{"name":"Maya Johnson","email":"maya.j@example.com","goal":"Improve daily energy","eatingStyle":"Mediterranean-inspired","dietaryPreferences":"No red meat"}') }
    catch { return {name:'Maya Johnson',email:'maya.j@example.com',goal:'Improve daily energy',eatingStyle:'Mediterranean-inspired',dietaryPreferences:'No red meat'} }
  })
  const [draft,setDraft]=useState(profile)
  const saveProfile=()=>{setProfile(draft);localStorage.setItem('nutrisync-profile',JSON.stringify(draft));setEditing(false)}
  const initials=profile.name.split(' ').filter(Boolean).slice(0,2).map((x:string)=>x[0]).join('').toUpperCase() || 'U'
  return <div className="page-stack profile-layout"><section className="profile-card"><div className="large-avatar">{initials}</div><div><h2>{profile.name}</h2><p>{profile.email}</p><span>Profile details saved on this device</span></div><Button variant="secondary" onClick={()=>{setDraft(profile);setEditing(true)}}>Edit profile</Button></section>
    {editing&&<div className="profile-modal-backdrop"><section className="profile-edit-modal" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title"><div className="section-heading"><h2 id="edit-profile-title">Edit profile</h2><button className="icon-button" onClick={()=>setEditing(false)} aria-label="Close">×</button></div><label>Full name<input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label><label>Email address<input type="email" value={draft.email} onChange={e=>setDraft({...draft,email:e.target.value})}/></label><label>Wellness goal<input value={draft.goal} onChange={e=>setDraft({...draft,goal:e.target.value})}/></label><label>Eating style<input value={draft.eatingStyle} onChange={e=>setDraft({...draft,eatingStyle:e.target.value})}/></label><label>Dietary preferences<input value={draft.dietaryPreferences} onChange={e=>setDraft({...draft,dietaryPreferences:e.target.value})}/></label><div className="profile-edit-actions"><Button variant="secondary" onClick={()=>setEditing(false)}>Cancel</Button><Button onClick={saveProfile}>Save changes</Button></div></section></div>}
    <div className="settings-grid"><section className="card settings-card"><div className="settings-title"><Icon name="profile"/><div><h2>Personal preferences</h2><p>Used to personalize your experience</p></div></div><Setting label="Wellness goal" value={profile.goal}/><Setting label="Eating style" value={profile.eatingStyle}/><Setting label="Dietary preferences" value={profile.dietaryPreferences}/><Setting label="Units" value="Metric"/></section>
      <section className="card settings-card"><div className="settings-title"><Icon name="shield"/><div><h2>Privacy & data</h2><p>You control how your information is used</p></div></div>
        <div className="setting-row"><div><strong>Use logs for AI insights</strong><span>Find patterns across your entries</span></div><button className="switch on"><i/></button></div>
        <div className="setting-row"><div><strong>Healthcare sharing</strong><span>Allow active secure share links</span></div><button className={`switch ${sharing?'on':''}`} onClick={()=>setSharing(!sharing)}><i/></button></div>
        <div className="setting-row"><div><strong>Cycle tracking</strong><span>Optional and independently controlled</span></div><button className="switch on"><i/></button></div>
      </section>
      <section className="card settings-card full"><div className="settings-title"><Icon name="lock"/><div><h2>Your data belongs to you</h2><p>Download or delete your health information at any time.</p></div></div><div className="feature-actions"><Button variant="secondary" icon="download">Download my data</Button><Button variant="ghost">Privacy policy</Button></div></section></div>
  </div>
}

function Setting({label,value}:{label:string;value:string}) {return <button className="setting-row"><div><strong>{label}</strong><span>{value}</span></div><Icon name="chevron"/></button>}

export default function App() {
    useEffect(() => {
    const testConnection = async () => {
      try {
        const result = await checkBackendConnection()
        console.log('Backend connected:', result)
      } catch (error) {
        console.error('Backend connection failed:', error)
      }
    }

    testConnection()
  }, [])
  const [page, setPage] = useState<Page>('home')
  const go = (next: Page) => { setPage(next); window.scrollTo({top:0,behavior:'smooth'}) }
  const content: Record<Page, ReactNode> = {
    home:<Home go={go}/>, nutrition:<Nutrition go={go}/>, scanner:<Scanner/>, health:<Health go={go}/>, period:<Period/>,
    insights:<Insights go={go}/>, recommendations:<Recommendations/>, assistant:<Assistant/>, community:<Community/>, reports:<Reports/>, profile:<Profile/>
  }
  const mobileNav = navItems.filter(x=>['home','nutrition','health','community','profile'].includes(x.page))
  return <div className="app-shell">
    <aside className="sidebar"><button className="brand" onClick={()=>go('home')}><span className="brand-mark"><Icon name="nutrition"/></span><span><strong>NutriSync</strong><small>AI</small></span></button><p className="nav-label">YOUR WELLNESS</p><nav>{navItems.map(item=><button key={item.page} className={page===item.page?'active':''} onClick={()=>go(item.page)}><Icon name={item.icon}/><span>{item.label}</span>{item.page==='assistant'&&<b>AI</b>}</button>)}</nav><div className="sidebar-note"><Icon name="shield"/><div><strong>Your privacy matters</strong><span>Your health data is encrypted and always in your control.</span></div></div><div className="sidebar-user"><div className="avatar">MJ</div><div><strong>Maya Johnson</strong><span>Personal plan</span></div><Icon name="chevron"/></div></aside>
    <main><Header page={page}/><div className="content">{content[page]}</div><footer><strong>NutriSync AI</strong><span>General wellness support, not medical advice.</span><small>© 2025 NutriSync</small></footer></main>
    <nav className="mobile-nav">{mobileNav.map(item=><button key={item.page} className={page===item.page?'active':''} onClick={()=>go(item.page)}><Icon name={item.icon}/><span>{item.label}</span></button>)}</nav>
  </div>
}
