import * as React from 'react'
import Link from 'next/link'

import ThemeToggler from './ThemeToggler'

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 navbar bg-base-300 shadow-sm h-18 z-50">
      <div className="flex items-center w-full max-w-150 m-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {' '}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />{' '}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="/">Home</Link>
              </li>
              {/* <li>
              <Link href="/stations">List</Link>
            </li> */}
              <li>
                <Link href="/favorites">Favorites</Link>
              </li>
              <li>
                <a>Search</a>
              </li>
              <li>
                <a>About</a>
              </li>
            </ul>
          </div>
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
