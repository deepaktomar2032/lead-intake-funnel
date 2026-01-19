import { Link } from 'react-router'

import { formStyles, layoutStyles } from '../styles/formStyles'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Vamo Energy - Heat Pump Application' },
    { name: 'description', content: 'Apply for your heat pump installation' },
  ]
}

export default function Home() {
  return (
    <div className={layoutStyles.page}>
      <div className={layoutStyles.header.wrapper}>
        <h1 className={layoutStyles.header.title}>Vamo Energy</h1>
        <p className={layoutStyles.header.subtitle}>Heat Pump Application Portal</p>
      </div>

      <div className={layoutStyles.content}>
        <div className={layoutStyles.card}>
          <div className={formStyles.formSection}>
            <div>
              <h2 className={formStyles.headingXL}>Ready to switch to a heat pump?</h2>
              <p className={formStyles.text}>
                Our guided application process will help us understand your needs and provide you
                with a customized heat pump solution.
              </p>
            </div>

            <div className={formStyles.divider}>
              <h3 className={formStyles.headingLG}>What to expect:</h3>
              <ul className={layoutStyles.list.container}>
                <li className={layoutStyles.list.item}>
                  <span className={layoutStyles.list.number}>1.</span>
                  <span>Contact information and basic details</span>
                </li>
                <li className={layoutStyles.list.item}>
                  <span className={layoutStyles.list.number}>2.</span>
                  <span>Property qualification and heating system details</span>
                </li>
                <li className={layoutStyles.list.item}>
                  <span className={layoutStyles.list.number}>3.</span>
                  <span>Technical discovery and assessment</span>
                </li>
                <li className={layoutStyles.list.item}>
                  <span className={layoutStyles.list.number}>4.</span>
                  <span>Photo documentation for final quote</span>
                </li>
              </ul>
            </div>

            <Link to="/leads" className={formStyles.buttonLink}>
              Start Your Application
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
