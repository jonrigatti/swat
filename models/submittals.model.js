const { Schema } = require("mongoose");

module.exports = mongoose => {
    const Submittal = mongoose.model(
        "submittal",
        mongoose.Schema(
            {
                title: String,
                submittalID: String,
                description: String,
                needDate: Date,
                dispositionDate: Date,
                published: Boolean,
                priority: Boolean,
                owner: String,
                violations: [
                    {
                        category: [String],
                        reference: {
                            chapter: String,
                            paragraph: String,
                            drawing: String,
                            coordinates: String,
                            revision: String,
                            date: String
                        },
                        limit: { type: Schema.Types.Mixed },
                        actual: { type: Schema.Types.Mixed },
                        component: {
                            type: { type: String },
                            id: String,
                            feature: String
                        }
                    }
                ]
            },
            { timestamps: true }
        )
    );

    return Submittal;
}