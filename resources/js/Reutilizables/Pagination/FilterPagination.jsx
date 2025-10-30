import React, { useEffect } from 'react'

const FilterPagination = ({ current, setCurrent, pages }) => {
  const array = new Array(pages || 1)
  array.fill(null)

  const onPrevPageClicked = () => {
    const page = current--
    setCurrent(page < 1 ? 1 : page)
  }

  const onNextPageClicked = () => {
    const page = current--
    setCurrent(page > pages ? pages : page)
  }

  useEffect(() => {
    if (current > pages) setCurrent(pages);
  }, [pages, current])

  return (<>
    <nav aria-label="Page navigation example w-full">
      <ul className="flex flex-wrap items-center gap-2 -space-x-px text-base justify-center">
        <li>
          <button className="cursor-pointer flex items-center justify-center px-4 h-10 w-10 leading-tight text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors" onClick={onPrevPageClicked} type='button'>
            <span className="sr-only">Previous</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </li>
        {
          array.map((x, i) => {
            if ((i + 1) == current - 4 || (i + 1) == current + 4) {
              return <li key={`item-${i}`}>
                <button aria-current="page" className='z-10 flex items-center justify-center px-4 h-10 w-10 leading-tight bg-transparent text-gray-700 hover:text-gray-900 cursor-default' type='button'>···</button>
              </li>
            }
            return <li key={`item-${i}`} className={(i + 1) > current - 4 && (i + 1) < current + 4 ? 'block' : 'hidden'}>
              <button aria-current="page" className={`cursor-pointer z-10 flex items-center justify-center px-4 h-10 w-10 leading-tight rounded-full transition-all duration-300 ${current == i + 1 ? 'bg-gradient-to-r from-hd-cerise to-hd-cerise/90 text-white shadow-lg cursor-default' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'}`} onClick={() => setCurrent(i + 1)} type='button'>{i + 1}</button>
            </li>
          })
        }
        <li>
          <button className="cursor-pointer flex items-center justify-center px-4 h-10 w-10 leading-tight text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors" onClick={onNextPageClicked} type='button'>
            <span className="sr-only">Next</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  </>)
}

export default FilterPagination