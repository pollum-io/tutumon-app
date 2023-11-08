// pages/api/getSession.js
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getToken({ req });
    
    
    if (session) {
        res.status(200).json(session);
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
}
