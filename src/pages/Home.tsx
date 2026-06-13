import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="page page-home">
      <p className="eyebrow">React + Vite + PrimeReact + Router</p>
      <h1>Starter boilerplate ready</h1>
      <p className="intro">
        You now have routing, PrimeReact theme styling, and a clean structure to
        scale pages and shared components.
      </p>

      <div className="feature-grid">
        <Card title="Routing" subTitle="BrowserRouter + Routes">
          <p>
            Route definitions live in App.tsx with a shared layout and a 404
            fallback.
          </p>
        </Card>
        <Card title="UI Library" subTitle="PrimeReact wired">
          <p>
            PrimeReact theme and icons are imported in the main entry with a
            sample component setup.
          </p>
        </Card>
      </div>

      <div className="cta-row">
        <Link to="/playground" className="link-reset">
          <Button label="Open playground" icon="pi pi-arrow-right" iconPos="right" />
        </Link>
      </div>
    </section>
  )
}

export default Home
