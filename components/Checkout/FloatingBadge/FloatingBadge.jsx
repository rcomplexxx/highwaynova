


import { useRef, useState } from "react";
import styles from "./floatingbadge.module.css";

import { LockIcon } from "@/public/images/svgs/svgImages";

export default function FloatingBadge({makeLockBadge, message}) {

  const [allowDialog, setAllowDialog] = useState(true);
  const blockNextMobileClick = useRef(true);

  

  
  

  
    

  

  return (
    <div  className={styles.badgeWrapper} >
    {makeLockBadge?<LockIcon styleClassName={styles.floatingBadge}/>
    :<>

    
    <div className={`${styles.floatingBadge} ${styles.floatingDiv}`} 


    
  
     onMouseLeave={()=>{blockNextMobileClick.current=true; setAllowDialog(true) }}

     onClick={()=>{ 
      if(!window.matchMedia('(pointer: fine)').matches && blockNextMobileClick.current)blockNextMobileClick.current=false;
       else  setAllowDialog(!allowDialog)}}

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
