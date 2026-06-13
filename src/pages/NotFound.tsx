import { Button } from 'primereact/button'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="page page-not-found">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p className="intro">The route you requested does not exist in this boilerplate.</p>
      <Link to="/" className="link-reset">
        <Button label="Back to home" icon="pi pi-home" />
      </Link>
    </section>
  )
}

export default NotFound
