import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { useParams } from 'react-router-dom'

import Layout from '../../components/Layout/Layout'

const SingleProduct = () => {
  const pathname = useParams()
  console.log(pathname)
  // notes from backend
  let [backendProduct, setBackendProduct] = useState([])

  useEffect(() => {
    fetchProduct()
  }, [])

  let fetchProduct = async () => {
    const { data } = await axios.get(`/api/products/${pathname.id}`)
    setBackendProduct(data)
    // console.log(data)
  }
  return (
    <Layout>
      <div>SingleProduct here: {backendProduct.name}</div>
    </Layout>
  )
}

export default SingleProduct
