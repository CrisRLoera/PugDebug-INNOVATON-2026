import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { useState } from 'react'

function Playground() {
  const [name, setName] = useState('')

  return (
    <section className="page page-playground">
      <h1>Playground</h1>
      <p className="intro">Use this page to test PrimeReact components quickly.</p>

      <div className="playground-card">
        <label htmlFor="name">Your name</label>
        <InputText
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Type here"
        />
        <Button
          label={name ? `Hello, ${name}` : 'Say hello'}
          icon="pi pi-send"
          severity="secondary"
          outlined
        />
      </div>
    </section>
  )
}

export default Playground
