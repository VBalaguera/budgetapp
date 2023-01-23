import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { useParams } from 'react-router-dom'

import Layout from '../../components/Layout/Layout'

const SingleNote = () => {
  const pathname = useParams()

  // notes from backend
  let [backendNote, setBackendNote] = useState([])

  useEffect(() => {
    fetchNote()
  }, [])

  let fetchNote = async () => {
    const { data } = await axios.get(`/api/notes/${pathname.id}`)
    setBackendNote(data)
    // console.log(data)
  }
  return (
    <Layout>
      <div>SingleNote here: {backendNote.title}</div>
    </Layout>
  )
}

export default SingleNote
