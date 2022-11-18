import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getProducts } from '../features/product/productSlice'
import { getNotes } from '../features/note/noteSlice'

function MainPage() {
  const dispatch = useDispatch()
  const { isLoadingProducts, products } = useSelector((store) => store.products)
  const { isLoadingNotes, notes } = useSelector((store) => store.notes)

  useEffect(() => {
    dispatch(getProducts())
    dispatch(getNotes())
  }, [dispatch])

  return (
    <div>
      <h3>welcome</h3>

      {isLoadingProducts ? (
        <span>loading</span>
      ) : (
        <>
          {products.map((product) => (
            <>
              <span>{product.title}</span>
            </>
          ))}
        </>
      )}
      {isLoadingNotes ? (
        <span>loading</span>
      ) : (
        <>
          {notes.map((note) => (
            <>
              <span>{note.title}</span>
            </>
          ))}
        </>
      )}
    </div>
  )
}

export default MainPage
