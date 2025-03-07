import React, { useState } from 'react';
import styles from './instructionswrapper.module.css'

export default function InstructionsWrapper({instructionButtonText='instructions', wrapperCssClassModifier="", children}) {

      const [revealInstructions, setRevealInstructions] = useState(false);


  return (
    <div className={`${styles.instructionsWrapper} ${wrapperCssClassModifier}`}>

<button 
          onClick={()=>{setRevealInstructions(!revealInstructions)}}
          className={styles.revealInstructionsButton}>
            {`${revealInstructions?"Hide":"Show"} ${instructionButtonText}`}
            </button>

            {revealInstructions && <div className={styles.instructionsDiv}> {children} </div> }

  </div>


  )
}
