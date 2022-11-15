import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { useParams } from 'react-router-dom'

const SingleNote = () => {
  const pathname = useParams()
  console.log(pathname)
  // notes from backend
  let [backendNote, setBackendNote] = useState([])

  useEffect(() => {
    fetchNote()
  }, [])

  let fetchNote = async () => {
    const { data } = await axios.get(`/api/notes/${pathname.id}`)
    setBackendNote(data)
  }
  return <div>SingleNote here: {backendNote.title}</div>
}

export default SingleNote
