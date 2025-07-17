'use client'

import { Theme } from '@/context/AppContext.types'
import { simpleStationDiscription } from '@/utils/radioStations'
import { Station } from 'radio-browser-api'
import React, { useState } from 'react'
import { externalLinkClass } from './ExternalLink'

interface ShareButtonProps {
  station: Station
  theme: Theme
}

const ShareButton: React.FC<ShareButtonProps> = ({ station, theme }) => {
  // State to manage the message displayed to the user (e.g., "Copied!", "Failed to copy.")
  const [message, setMessage] = useState<string>('')
  // State to manage the type of message (success or error) for styling
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const stationPageToShare = `#/station/${station.id}`
  /**
   * Copies the provided URL to the user's clipboard.
   * Uses a fallback method as `navigator.clipboard.writeText` might be restricted in some environments (like iframes).
   */
  const copyToClipboard = () => {
    try {
      // Create a temporary textarea element to hold the URL
      const el = document.createElement('textarea')
      el.value = stationPageToShare
      // Make the textarea invisible and append it to the document body
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      // Select the text in the textarea
      el.select()
      // Execute the copy command
      document.execCommand('copy')
      // Remove the temporary textarea
      document.body.removeChild(el)

      // Set success message
      setMessage('URL copied to clipboard!')
      setMessageType('success')
    } catch (err) {
      // Log and set error message if copy fails
      console.error('Failed to copy URL:', err)
      setMessage('Failed to copy URL.')
      setMessageType('error')
    } finally {
      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage('')
        setMessageType('')
      }, 3000)
    }
  }

  /**
   * Handles the share action.
   * Tries to use the Web Share API first. If not available or if it fails,
   * it falls back to copying the URL to the clipboard.
   */
  const handleShare = async () => {
    // Check if the Web Share API is supported by the browser
    if (navigator.share) {
      try {
        // Attempt to share using the Web Share API
        await navigator.share({
          title: station.name,
          text: simpleStationDiscription(station),
          url: stationPageToShare,
        })
        // Set success message if sharing is successful
        setMessage('Shared successfully!')
        setMessageType('success')
      } catch (error) {
        // Handle user cancelling the share operation
        // if (error.name === 'AbortError') {
        //   setMessage('Share cancelled.')
        //   setMessageType('') // Not an error, not a success
        // } else {
        //   // Log other errors and fall back to clipboard copy
        //   console.error('Error sharing:', error)
        //   setMessage('Failed to share. Copying to clipboard instead.')
        //   setMessageType('error')
        console.error('error sharing:', error)
        copyToClipboard() // Fallback
        // }
      } finally {
        // Clear the message after 3 seconds
        setTimeout(() => {
          setMessage('')
          setMessageType('')
        }, 3000)
      }
    } else {
      // If Web Share API is not supported, directly copy to clipboard
      copyToClipboard()
    }
  }

  return (
    <>
      <a onClick={handleShare} className={externalLinkClass(theme)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
          />
        </svg>{' '}
        Share
      </a>

      {/* Message display area */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm font-medium ${
            messageType === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          } shadow-md`}
        >
          {message}
        </div>
      )}
    </>
  )
}

export default ShareButton
