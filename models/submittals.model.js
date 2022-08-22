const { Schema } = require("mongoose");

const SubmittalSchema = new Schema(
    {
        submittalID: String,
        description: String,
        needDate: Date,
        dispositionDate: Date,
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
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }

)

SubmittalSchema.virtual('contract').get(function() {
    const splitID = this.submittalID.split('-');
    const contract = splitID[1];
    return contract;
}).set(function(v) {
    this.set({ v });
});

module.exports = mongoose => {
    const Submittal = mongoose.model(
        "submittal",
        mongoose.Schema(SubmittalSchema
        )
    );

    return Submittal;
}