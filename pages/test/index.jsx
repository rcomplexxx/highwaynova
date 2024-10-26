import React from 'react'
import styles from './teststyles.module.css'

export default function index() {
  return (
    <div>{Array.from({ length: 10000 }, (_, index) => (
        <div className={styles.myDiv} key={index + 1}>
          Item {index + 1}
        </div>
      ))}</div>
  )
}