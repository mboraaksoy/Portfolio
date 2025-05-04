const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const comments = [
    {
        username: 'Kidd',
        comment: 'Hey, let\'s post a comment!'
    },
    {
        username: 'Murray',
        comment: 'This new website looks so cool!'
    },
    {
        username: 'CluelessDude',
        comment: 'Where are we?'
    },
    {
        username: 'MuscleMan',
        comment: 'You know who else looks cool? MY MOM!'
    }
]

for (let i = 0; i < comments.length; i++ ){
    comments[i]['id'] = i + 1; 
}


app.get('/', (req, res) => { // Homepage render
    res.render('homepage.ejs');
})

app.get('/comments', (req, res) => { // All comments render
    res.render('allcomments.ejs', {comments});
})

app.get('/comments/new', (req, res) => { // Create a new comment form
    res.render('createcommentform.ejs');
})

app.post('/comments', (req, res) => { // Submit a comment
    const {username, comment} = req.body;
    req.body.id = comments.length + 1;
    comments.push({username, comment, id: req.body.id});
    res.redirect('/comments');
})

app.get('/comments/:id', (req, res) => { // A single comment render
    const {id} = req.params;
    const comment = comments.find((c) => c.id == id);
    res.render('details.ejs', {username: comment.username, comment: comment.comment, id: comment.id});
})

app.get('/comments/:id/edit', (req, res) => {
    const {id} = req.params;
    const comment = comments.find((c) => c.id == id);
    res.render('editCommentForm.ejs', {username: comment.username, comment: comment.comment, id: comment.id});
})

app.patch('/comments/:id', (req, res) => { // Update a comment
    const {id} = req.params;
    const foundComment = comments.find((c) => c.id === parseInt(id));
    const newComment = req.body.comment;
    foundComment.comment = newComment;
    res.redirect(`/comments/${id}`);
})

app.delete('/comments/:id', (req, res) => {
    const {id} = req.params;
    comments.splice(comments.findIndex(comment => comment.id === parseInt(id)), 1);
    res.redirect('/comments');
})

app.listen(8080, () => {
    console.log('Connecting to localhost:8080...');
})