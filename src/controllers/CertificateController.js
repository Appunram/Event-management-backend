const certificategenerator = require("../utils/CertificateGenerator");

module.exports = {
    async generatecertificate(req,res){
        try {
            const {name} = req.body;
            const certificate = await certificategenerator(name);
            res.status(200).json({ message: "certificate generated successfully"})
        } catch (error) {
            console.log(error)
            return res.status(400).json(error)
        }
    }
}