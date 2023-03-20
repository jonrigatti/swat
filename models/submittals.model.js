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
        ],
        stakeholders: [
            {
                name: String,
                organization: String,
                reviewType: String,
                requestedDate: Date,
                completedDate: Date
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

SubmittalSchema.virtual('peerReviewNeeded').get(function() {
    const peerReviewNeeeded = !(this.stakeholders.some((el) => el.reviewType === 'Peer'));
    return peerReviewNeeeded;
}).set(function(v) {
    this.set({ v });
});

SubmittalSchema.virtual('nrInformed').get(function() {
    const nrInformed = (this.stakeholders.some((el) => el.organization === 'NR'));
    return nrInformed;
}).set(function(v) {
    this.set({ v });
});

SubmittalSchema.virtual('open').get(function() {
    const open = this.dispositionDate === null ? true : false;
    return open;
}).set(function(v) {
    this.set({ v });
});

module.exports = mongoose => {
    const Submittal = mongoose.model(
        'submittal',
        mongoose.Schema(SubmittalSchema
        )
    );

    return Submittal;
}