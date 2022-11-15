## Axios

For fetching from the api.

```sh

npm install axios
```

## GET DATA FROM THE BACKEND TO THE FRONT-END

CORS PROBLEM:

Set url http://127.0.0.1:8000/api/

```sh
pip install django-cors-headers
```

Add 'corsheaders' to INSTALLED_APPS.

Set CORS_ALLOWED_ORIGINS later. Now CORS_ALLOW_ALL_ORIGINS= True

Add 'corsheaders.middleware.CorsMiddleware' to MIDDLEWARE.

And in the front-end side:

```js
import axios from 'axios'
  let [backendNotes, setBackendNotes] = useState([])

  useEffect(() => {
    fetchNotes()
  }, [])

  let fetchNotes = async () => {
    const { data } = await axios.get('http://127.0.0.1:8000/api/notes/')
    setBackendNotes(data)
  }
[...]
 <>
            {backendNotes.map((note, index) => (
              <li key={index}>{note.body}</li>
            ))}
          </>
```

To make axios calls simpler, add this into package.json:

```js
"proxy": "http://127.0.0.1:8000/",
```

React will use that port as proxy.

## GETTING INDIVIDUAL NOTES:

Created pages/notes/[id.js]:

```js
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
```
