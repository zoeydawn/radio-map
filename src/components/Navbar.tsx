import * as React from 'react'
import Link from 'next/link'
import NavDrawer from './NavDrawer'
import { HeartIcon } from './Icons'

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
        <div className="navbar-end pr-2.5">
          <Link className="link link-hover" href="/favorites">
            <HeartIcon fill="currentColor" />
          </Link>
        </div>
      </div>
    </div>
  )
}
