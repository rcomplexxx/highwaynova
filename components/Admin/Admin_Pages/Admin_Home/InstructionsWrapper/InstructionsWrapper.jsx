import React, { useEffect, useRef, useState } from 'react';
import styles from './instructionswrapper.module.css'

export default function InstructionsWrapper({instructionButtonText='instructions', wrapperCssClassModifier="", children}) {

      const [revealInstructions, setRevealInstructions] = useState();

      const mountedRef = useRef(false);
      const expendHeightTimeout = useRef();
      const instructionsDivRef = useRef();





       useEffect(()=>{

        if(!mountedRef.current){mountedRef.current=true; return;}

        clearTimeout(expendHeightTimeout.current);


        const instructionsDiv = instructionsDivRef.current;
        if(revealInstructions){

          instructionsDiv.style.maxHeight = `${instructionsDiv.scrollHeight}px`;
          expendHeightTimeout.current=setTimeout(()=>{
       
            instructionsDiv.style.maxHeight=`none`;
           }, 300)

      }

        else {



          instructionsDiv.style.transition=`max-height 0s ease`;
          instructionsDiv.style.maxHeight=`${instructionsDiv.scrollHeight}px`;
          setTimeout(()=>{
            instructionsDiv.style.transition=`max-height 0.3s ease`;
            instructionsDiv.style.maxHeight =0;
           }, 1)



        }



      },[revealInstructions])

    
   
   
    
   
    


  return (
    <div className={`${styles.instructionsWrapper} ${wrapperCssClassModifier}`}>

<button 
          onClick={()=>{setRevealInstructions(!revealInstructions)}}
          className={styles.revealInstructionsButton}>
            {`${revealInstructions?"Hide":"Show"} ${instructionButtonText}`}
            </button>

             <div ref={instructionsDivRef} className={styles.instructionsDiv}> {children} </div> 

  </div>


  )
}
