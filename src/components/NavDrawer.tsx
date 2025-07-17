'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { FlagIcon, HeartIcon, MapIcon, SearchIcon, StarIcon } from './Icons'
import ThemeToggler from './ThemeToggler'

const NavDrawer = () => {
  // Create a ref for the drawer checkbox input
  const drawerRef = useRef<HTMLInputElement>(null)

  const closeDrawer = () => {
    // If the ref exists and the drawer is checked (open), uncheck it to close
    if (drawerRef.current && drawerRef.current.checked) {
      drawerRef.current.checked = false
    }
  }

  return (
    <div className="drawer">
      {/* this input controls whether the drawer is open or closed: */}
      <input
        id="nav-drawer"
        type="checkbox"
        className="drawer-toggle"
        ref={drawerRef}
      />
      <div className="drawer-content">
        {/* Page content here */}
        <label
          htmlFor="nav-drawer"
          className="btn btn-ghost btn-circle drawer-button"
        >
          {/* Open drawer */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="nav-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li>
            <Link className="link link-hover" href="/" onClick={closeDrawer}>
              <MapIcon /> Map
            </Link>
          </li>
          <li>
            <Link
              className="link link-hover"
              href="/popular"
              onClick={closeDrawer}
            >
              <StarIcon /> Popular
            </Link>
          </li>
          <li>
            <Link
              className="link link-hover"
              href="/places"
              onClick={closeDrawer}
            >
              <FlagIcon /> Places
            </Link>
          </li>
          <li>
            <Link className="link link-hover" href="/" onClick={closeDrawer}>
              <SearchIcon /> Search
            </Link>
          </li>
          <li>
            <Link
              className="link link-hover"
              href="/favorites"
              onClick={closeDrawer}
            >
              <HeartIcon /> Favorites
            </Link>
          </li>
        </ul>

        <div className="absolute bottom-2 p-6">
          <ThemeToggler />
        </div>
      </div>
    </div>
  )
}

export default NavDrawer
