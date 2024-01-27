import { createFilePath, readFile, writeFile } from "../../helpers/file-utils";

export default function handler (req, res) {
    
    if(req.method === "POST") {
        const { email } = req.body;
        
        const filePath = createFilePath(['data', 'newsletter.json']);
        const fileData = readFile(filePath);

        writeFile({
            filePath, fileData, newData: email
        });

        res.status(200).json({res: `Your email ${email} has been sucessfuly signed up to our newsletter!`});
    } else {
        res.status(400).json({res: 'Invalid method!'})
    }
}