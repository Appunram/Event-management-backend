const { generateFile } = require("../utils/generateFile");
const { addJobToQueue } = require("../utils/jobQueue");
const Job = require("../models/Job");

module.exports = {
    async runProgram(req, res) {
        const { language = "cpp", code } = req.body;

        console.log(language, "Length:", code.length);

        if (code === undefined) {
            return res.status(400).json({ success: false, error: "Empty code body!" });
        }
        // need to generate a c++ file with content from the request
        const filepath = await generateFile(language, code);
        // write into DB
        const job = await new Job({ language, filepath }).save();
        const jobId = job["_id"];
        addJobToQueue(jobId);
        res.status(201).json({ jobId });
    },

    async programStatus(req, res) {
        const jobId = req.query.id;

        if (jobId === undefined) {
            return res
                .status(400)
                .json({ success: false, error: "missing id query param" });
        }

        const job = await Job.findById(jobId);

        if (job === undefined) {
            return res.status(400).json({ success: false, error: "couldn't find job" });
        }

        return res.status(200).json({ success: true, job });
    }
}