var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var shareDataSchema = new Schema({
	// uploader: {type: ObjectId, ref: 'Users'},
	image: String,
	title: String,
	href: String,
    qrCode: String,
    describe: String,
    from: String,
    meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}  
})

shareDataSchema.pre('save', function(next){
	var user = this;
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else {
		this.meta.updateAt = Date.now();
	}
	next();

})

shareDataSchema.statics = {
	fetch: function (cb) {
		return this
			.find({})
			.sort({'meta.updateAt':-1})
			.exec(cb)
	},
	firstPage: function (much,cb) {
		return this
			.find({})
			.sort({'meta.updateAt':-1})
			.limit(much)
			.exec(cb)
	},
	paging: function (pn,much,cb) {
		// var fp = 6;
		return this
			.find({})
			.sort({'meta.updateAt':-1})
			.skip(much*pn)
			// .skip(fp+much*pn)
			.limit(much)
			.exec(cb)
	},
	findById: function (id, cb){
		return this
		    .findOne({_id: id})
		    .exec(cb)
	}
}

module.exports = shareDataSchema;