'use client'

import * as React from 'react'
import Link from 'next/link'

type ButtonListItem = {
  id: string | number
  name: string
  buttonSizeClassName?: string
}

interface ButtonListProps {
  items: ButtonListItem[]
  baseHref: string
  title?: string
}

const ButtonList: React.FC<ButtonListProps> = ({ items, baseHref, title }) => {
  const [filterString, setFilterString] = React.useState<string>('')

  const filteredItems = filterString
    ? items.filter((item) =>
        item.name.toLowerCase().includes(filterString.toLowerCase()),
      )
    : items

  return (
    <div className="flex flex-col items-center pb-50">
      <div className="w-full max-w-200 p-2">
        {!!title && <h3 className="font-bold text-lg mt-6 pl-2">{title}</h3>}
        <input
          type="text"
          placeholder={`Filter ${title}...`}
          className="input m-2"
          value={filterString}
          onChange={(e) => setFilterString(e.target.value)}
        />
        <br />

        {filteredItems.map((item, index) => {
          return (
            <Link
              className={`btn ${item.buttonSizeClassName || ''} btn-outline btn-primary m-2`}
              key={`${item.id}-${index}`}
              href={`${baseHref}/${item.id}`}
            >
              {item.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default ButtonList
