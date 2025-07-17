import * as React from 'react'
// import Link from 'next/link'

import ThemeToggler from './ThemeToggler'
import NavDrawer from './NavDrawer'

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 navbar bg-base-300 shadow-sm h-18 z-50">
      <div className="flex items-center w-full max-w-150 m-auto">
        <div className="navbar-start">
          <NavDrawer />
        </div>

        <div className="navbar-center">
          <a className="btn btn-ghost text-xl">RadioMap</a>
        </div>
        <div className="navbar-end">
          <ThemeToggler />
        </div>
      </div>
    </div>
  )
}
