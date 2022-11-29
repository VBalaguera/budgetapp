import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  clearCart,
  addToCart,
  increaseItem,
  decreaseItem,
  removeItem,
  calculateTotals,
} from '../features/cart/cartSlice'

import Layout from '../components/Layout/Layout'

import ProductCard from '../components/ProductCard/ProductCard'

const CartPage = () => {
  const dispatch = useDispatch()
  const { cartItems, amount, total } = useSelector((state) => state.cart)
  useEffect(() => {
    dispatch(calculateTotals())
  }, [dispatch, cartItems])
  return (
    <Layout>
      {' '}
      <div>
        <div>
          {cartItems.map((product, index) => (
            <ProductCard product={product} />
          ))}
        </div>
        <strong>total: ${total.toFixed(2)}</strong>
        <button onClick={() => dispatch(clearCart())}>clear cart</button>
      </div>
    </Layout>
  )
}

export default CartPage

/* 

Today she and her brother reached the neighbors about the humidity stain.
A plumber, sent by the insurance company, has spoken with the neighbors. 
*/
