const { Schema } = require("mongoose");

module.exports = mongoose => {
    const Project = mongoose.model(
        "project",
        mongoose.Schema(
            {
                name: String,
                contracts: [
                    {
                        contractID: String
                    }
                ],
                prioritySubmittals: [
                    { type: Schema.Types.ObjectId, ref: 'submittal' }
                ],
                unrankedSubmittals: [
                    { type: Schema.Types.ObjectId, ref: 'submittal' }
                ]
            },
            { timestamps: true }
        )
    );

    return Project;
}