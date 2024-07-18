
import formidable from "formidable";
const path = require('path');
import {promises as fs} from 'fs'

import RateLimiter from "@/utils/rateLimiter.js";
import { verifyToken } from "../../utils/auth.js"; 




const limiterPerHour = new RateLimiter({
    apiNumberArg: 8, //
    tokenNumberArg: 50,//
    expireDurationArg: 3600, //secs
  });


  export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  export default async function uploadFile(req, res) {
    


    try {

    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (!(await limiterPerHour.rateLimiterGate(clientIp)))
      return res.status(429).json({ error: "Too many requests." });

    const { token } = req.cookies;

    const userIsAdmin = verifyToken(token);

    


    if(!userIsAdmin) return  res.status(400).json({ successfulLogin: false,
        error: "You do not have access to this sector. Get lost noob." });

            const form = formidable({multiples: false});

           console.log('curr form', form)

            const [fields, files] = await form.parse(req);


            const myFile = files.file[0];


        
               

         


            if(!myFile || !myFile.filepath){
                return res.status(400).json({ error: "No image file uploaded." });
            }

            const uploadDir = path.join(`${process.cwd()}/public/images/email_images/`);

            if(fs.access(`${uploadDir}/${myFile.originalFilename}`)) return res.status(200).json({ success: true, 
              fileUrl:  `${req.protocol}://${req.headers.host}/images/email_images/${myFile.originalFilename}` });


           

            const additionalExtension =path.extname(myFile.originalFilename).length !== 0?"":".png";
       
              

            const newFileName = Date.now() + '_'+ myFile.originalFilename+additionalExtension;

            const newFilePath = `${uploadDir}/${newFileName}${additionalExtension}`;

            console.log('dir', uploadDir)


             await fs.mkdir(uploadDir, {recursive: true});

             await fs.rename(myFile.filepath, newFilePath);

             res.status(200).json({ success: true, 
                fileUrl: `${req.protocol}://${req.headers.host}/images/email_images/${newFileName}${additionalExtension}` });


             } catch(error){
                res.status(500).json({ success: false, error: 'Uploading server error' });
             }
            
           
               
  }