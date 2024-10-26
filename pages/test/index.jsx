import React from 'react'
import styles from './teststyles.module.css'

export default function index() {
  return (
    <div className={styles.mainDiv}>{Array.from({ length: 10000 }, (_, index) => (
        <div key={index + 1}>
          Item {index + 1}
        </div>
      ))}</div>
  )
}
