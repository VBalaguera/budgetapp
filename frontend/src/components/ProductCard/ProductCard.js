import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import {
  increaseItem,
  decreaseItem,
  removeItem,
} from '../../features/cart/cartSlice'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()

  console.log(product)

  return (
    <div>
      <div>
        <span>{product.name}</span>

        {product.countInStock > 0 && (
          <>
            <button
              className='amount-btn'
              onClick={() => {
                dispatch(increaseItem(product._id, '2'))
              }}
            >
              +
            </button>
            <span>{product.amount}</span>
            <button
              className='amount-btn'
              onClick={() => {
                if (product.amount === 1) {
                  dispatch(removeItem(product._id))
                  return
                }
                dispatch(decreaseItem(product._id))
              }}
            >
              -
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ProductCard
