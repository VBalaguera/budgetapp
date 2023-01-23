import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getProducts } from '../store/product/productSlice'
import { getNotes } from '../store/note/noteSlice'
import { getDayPosts } from '../store/day_post/day_postSlice'
import { Link } from 'react-router-dom'

import {
  addToCart,
  increaseItem,
  decreaseItem,
  removeItem,
} from '../store/cart/cartSlice'

import Layout from '../components/Layout/Layout'

// in the meantime, this route is /test
function MainPage() {
  const [quantity, setQuantity] = useState(1)

  const dispatch = useDispatch()
  const { isLoadingProducts, products } = useSelector((store) => store.products)
  const { isLoadingNotes, notes } = useSelector((store) => store.notes)
  const { isLoadingDayPosts, dayPosts } = useSelector((store) => store.dayPosts)

  console.log('dayPosts', dayPosts)

  useEffect(() => {
    // dispatch(getProducts())
    // dispatch(getNotes())
    dispatch(getDayPosts())
  }, [dispatch, getDayPosts])

  return (
    <Layout>
      <h3>welcome</h3>
      {/* 
      <>
        {isLoadingProducts ? (
          <span>loading</span>
        ) : (
          <>
            <div className='d-flex flex-column w-100'>
              <h1>products</h1>
              {products.map((product) => (
                <>
                  <span>{product.name}</span>
                  <Link to={`/products/${product._id}`}>see more</Link>
                  {product.countInStock > 0 ? (
                    <>
                      <button
                        onClick={() => dispatch(addToCart(product, quantity))}
                      >
                        add to cart
                      </button>
                    </>
                  ) : (
                    <span>sold out</span>
                  )}
                  {/* TODO: make this work */}
      {/* {product.countInStock > 0 && (
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                )} 
                </>
              ))}
            </div>
          </>
        )}
      </> */}

      {/* {isLoadingNotes ? (
        <span>loading</span>
      ) : (
        <>
          <div className='d-flex flex-column w-100 '>
            <h1>notes</h1>{' '}
            {notes.map((note) => (
              <>
                <div className='card my-2 p-3'>
                  <span>{note.title}</span>
                  <Link to={`/notes/${note.id}`}>see more</Link>
                  <img
                    src={note.image}
                    alt={note.title}
                    style={{ height: 'auto', width: '200px' }}
                  />
                </div>
              </>
            ))}
          </div>
        </>
      )} */}
    </Layout>
  )
}

export default MainPage
