import React from 'react'
import styles from './dismisslistbutton.module.css'

export default function DismissListButton({setSubscribers}) {
  return (
    <button className={styles.dismissSubscribersButton} onClick={()=>{setSubscribers([])}}>
      Dismiss subscriber list
    </button>
  )
}
