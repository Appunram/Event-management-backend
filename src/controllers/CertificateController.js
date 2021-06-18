const moment = require("moment");
const PDFDocument = require("pdfkit");

module.exports = {
    async generatecertificate(req, res) {
        try {
            const doc = new PDFDocument({
                layout: "landscape",
                size: "A4",
            });
            var stream = doc.pipe(blobStream());
            const name = req.body.name;
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment;filename=${name}.pdf`);
            doc.pipe(res);
            doc.image("images/certificate.png", 0, 0, { width: 842 });
            doc.fontSize(60).text(name, 20, 265, {
                align: "center"
            });
            doc.fontSize(17).text(moment().format("MMMM Do YYYY"), -275, 430, {
                align: "center"
            });
            doc.end();
            stream.on('finish', function () {
                iframe.src = stream.toBlobURL('application/pdf');
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json(error)
        }
    }
}