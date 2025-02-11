

import { adminCopycat } from '@/utils/utils-client/utils-admin/adminCopycat';
import CustomOptionsCard from '../CustomOptionsCard/CustomOptionsCard'
import styles from './editorhtmlsnippets.module.css'

export default function EditorHtmlSnippets() {
  return (
    <CustomOptionsCard mainButtonName={'Editor Html Snippets'} pushToRightStyle={true}>
    <button className={styles.editorHtmlSnippets}
    
    onClick={()=> {
      adminCopycat(`<div style="\n  width: 100%;\n  text-align: center;\n  padding: 64px 12px;\n  box-sizing: border-box;\n">\n  <h1 style="\n    color: black;\n    line-height: 120%;\n    text-align: center;\n    font-size: 26px;\n    font-weight: 700;\n    border-radius: 16px;\n    padding: 12px;\n    background-color: rgba(178, 163, 108, 0.7);\n  ">\n    Thanks for letting us be a part of your immersive reading ambiance!\n  </h1>\n</div>`)
   
      }
    }

    >Smart heading</button>


<button className={styles.editorHtmlSnippets}
    
    onClick={()=> {

      adminCopycat(`<p style="background-color: #5D0909;color: black;font-size: 24px;font-weight: 700;padding: 4px;text-align:center;">Join 200,000+ happy readers!</p>`)

   
      
      
      }
    }

    >Image ticker</button>

<button className={styles.editorHtmlSnippets}
    
    onClick={()=> {
      adminCopycat(`
<div style="text-align: center;">
<a href="${process.env.NEXT_PUBLIC_WEBSITE_ROOT_URL}" target="_blank" style="width: 100%;box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #ffffff; background-color: #000000; border-radius: 48px;-webkit-border-radius: 48px; -moz-border-radius: 48px; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border: 1px solid #858585; font-size: 22px;font-weight: 700; ">
      <span style="display:block;padding:15px;line-height:100%;"><strong><span style="line-height: 22px;">Use the code now</span></strong></span>
  </a></div>
`);
   


    
      
      }
    }

    >Smart button</button>

    


    </CustomOptionsCard>
  )
}
