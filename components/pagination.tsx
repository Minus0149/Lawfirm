'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const [inputPage, setInputPage] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params.toString()
  }

  const handlePageChange = (page: number) => {
    window.scrollTo(0, 0)
    router.push(`${basePath}?${createQueryString('page', page.toString())}`)
  }

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const page = parseInt(inputPage)
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page)
      setInputPage('')
    }
  }

  const maxVisiblePages = 5
  const pageNumbers: (number | string)[] = []

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 3; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push('...')
      pageNumbers.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1)
      pageNumbers.push('...')
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)
      pageNumbers.push('...')
      pageNumbers.push(currentPage - 1)
      pageNumbers.push(currentPage)
      pageNumbers.push(currentPage + 1)
      pageNumbers.push('...')
      pageNumbers.push(totalPages)
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
      <Button 
        variant="outline" 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      {pageNumbers.map((number, index) => (
        <React.Fragment key={index}>
          {typeof number === 'number' ? (
            <Button
              variant={number === currentPage ? "default" : "outline"}
              onClick={() => handlePageChange(number)}
              disabled={number === currentPage}
            >
              {number}
            </Button>
          ) : (
            <span className="px-2">...</span>
          )}
        </React.Fragment>
      ))}
      <Button 
        variant="outline" 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
      <form onSubmit={handleInputSubmit} className="flex items-center gap-2">
        <Input
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          placeholder="Go to page"
          className="w-20"
        />
        <Button type="submit" variant="outline">Go</Button>
      </form>
    </div>
  )
}

