var keystone = require('keystone'),
	Types = keystone.Field.Types,
	twitter = require('twitter');

	var twit = new twitter({
		consumer_key: 'k8UNGTEfFCMVwF2SR2IMw',
    consumer_secret: 'ihEanVypO9MGzrcPrYwEHS1UILJQY75OhHeUkOkzaI',
    access_token_key: '73764405-lXVzljdLyN8RbcdcwdVPQsDcPZywrGF0ByY03wfL0',
    access_token_secret: '74izn3BZMC7E15l0vRDNuuXvC7p54W08lgMHyxWvdK5Jc'
	})

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Post.add({
	title: { type: String, required: true },
	slug: { type: String, index: true },
	tweeted: {type: Boolean, default: false}
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true }
});

Post.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Post.schema.post('save', function(post) {
	console.log(post);
	if(post.state === 'published' && !post.tweeted) {
		twit.updateStatus("New blog post: " + post.title + " http://jonahback.com/blog/post/"+post.slug, function(data){console.log(data)});
		post.tweeted = true;
	}

})

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
