import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function updateSession (req: NextApiRequest, res: NextApiResponse) {
    
    const session = await getSession({ req });

    
    
    if (session) {
 
        
      const updatedSession = JSON.parse(req.body.sessionData);
      // Merge the updated fields into the existing session
      Object.assign(session, updatedSession);
      
      // Update this session in your database or other persistent storage
      // ...
  
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  };
  