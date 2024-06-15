


import { useEffect, useState } from "react";
import styles from "./floatingbadge.module.css";

import { LockIcon } from "@/public/images/svgs/svgImages";

export default function FloatingBadge({makeLockBadge, message}) {

  const [allowDialog, setAllowDialog] = useState(true);

  

  
  

  useEffect(()=>{console.log('heyo!', allowDialog)},[allowDialog])
    

  

  return (
    <div  className={styles.badgeWrapper} >
    {makeLockBadge?<LockIcon styleClassName={styles.floatingBadge}/>
    :<>

    
    <div className={`${styles.floatingBadge} ${styles.floatingDiv}`} 
    
  
     onMouseLeave={()=>{ setAllowDialog(window.matchMedia('(pointer: fine)').matches) }}

     onClick={(event)=>{  setAllowDialog(!allowDialog)}}

     >?</div> 


        
    <div className={`${styles.explainWrapper} ${allowDialog &&  styles.activateExplain}`}>
     <div className={`${styles.explain}`}>{message}</div>
    <div className={`${styles.explainTriangle}`}/>
    </div>
     </>
}
</div>
  
  );
}
