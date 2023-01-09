import React, { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import { Card } from 'react-bootstrap'

import { getDayPosts } from '../store/day_post/day_postSlice'

import Layout from '../components/Layout/Layout'
const DayPostPage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { dayPosts, isLoadingPosts } = useSelector((state) => state.dayPosts)

  useEffect(() => {
    dispatch(getDayPosts(user._id))
  }, [])

  console.log(dayPosts)

  return (
    <Layout>
      <h1>day posts page</h1>
      {isLoadingPosts ? (
        <span>loading</span>
      ) : (
        dayPosts.map((day) => (
          <Card className='text-dark'>
            <Card.Body>
              <div className='d-flex flex-column'>
                {day.content.map((item) => (
                  <div className=''>
                    <span>{item.status}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
                <span>{day.date}</span>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Layout>
  )
}

export default DayPostPage
