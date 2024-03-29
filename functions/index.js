const functions = require("firebase-functions");
//const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

admin.initializeApp();

const database = admin.database().ref('/articles');

exports.addArticle = functions.https.onRequest((req, res) => {

    if(req.method === 'POST') {

        var author = req.body.author;
        var category = req.body.category;
        var title = req.body.title;
        var image = req.body.image;
        var text = req.body.text;

        if(author && category && title && image && text) {

            database.push({ 
                author: author,
                category: category,
                title: title,
                image: image,
                text: text
            }).then(function(snapshot) {

                var key = snapshot.key;
                
                admin.database().ref(`/articles/${key}`).on('value', (snapshot) => {
                   
                    if(snapshot.val()) {
                        res.status(200).send({
                            [key]: snapshot.val()
                        });
                    }
                    else {
                        res.status(404).send();
                    }
                })

            });
        }
        else {
            res.status(400).send('Missing parameter');
        }
    }
    else {
        res.status(400).send();
    }
});

exports.getArticles = functions.https.onRequest((req, res) => {
    
    if(req.method === 'GET') {
        
        return database.orderByChild('key').on('value', (snapshot) => {
            
            if(snapshot.val()) {

                var articles = [];
                
                snapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key;
                    var body = childSnapshot.val();
                    body["id"] = key;

                    articles.push({
                        body
                        //[key]: childSnapshot
                    })
                    
                });
                res.status(200).send(articles);
            }
            else {
                res.status(404).send();
            }            
        })
    }
    else {
        res.status(400).send();
    }
});

exports.deleteArticle = functions.https.onRequest((req, res) => {

    if(req.method === 'DELETE') {
        
        var key = req.query.key

        if(key) {
            return admin.database().ref(`/articles/${key}`).remove()
        }
        else {
            res.status(400).send('No matches for id');
        }
    }
    else {
        res.status(400).send();
    }
});

exports.getArticleId = functions.https.onRequest((req, res) => {
    
    if(req.method === 'GET') {
        
        var key = req.query.key;
        
        if(key) {
            
            return database.child(key).on('value', (snapshot) => {
                
                if(snapshot.val()) {
                    
                    res.status(200).send({
                        [key]: snapshot.val()
                    });
                }
                else {
                    res.status(404).send();
                }
            })
        }
        else {
            res.status(400).send('No matches for id');
        }
    }
    else {
        res.status(400).send();
    }
});

exports.getArticleCategory = functions.https.onRequest((req, res) => {

    if(req.method === 'GET') {
        
        var category = req.query.category;

        if(category) {

            return database.orderByChild('category').equalTo(category).on('value', (snapshot) => {

                if(snapshot.val()) {

                    var articles = [];

                    snapshot.forEach(function(childSnapshot) {
    
                        var key = childSnapshot.key;
                        
                        articles.push({
                            [key]: childSnapshot
                        });
                    });
                    res.status(200).send(articles);

                }
            })
        }
        else {
            res.status(400).send('Missing category');
        }
    }
    else {
        res.status(400).send();
    }
});

exports.updateArticle = functions.https.onRequest((req, res) => {
    
    if(req.method === 'PUT') {
        
        var key = req.query.key;

        if(key) {

            var text = req.body.text;
            
            if(text) {
            
                return admin.database().ref(`/articles/${key}`).on('value', (snapshot) => {
                    if(snapshot.val()) {
                        snapshot.ref.update({
                            "text": text
                        });

                        return admin.database().ref(`/articles/${key}`).on('value', (snapshot) => {
                            if(snapshot.val()) {
                                var key = snapshot.key;
                                res.status(200).send({
                                    [key]: snapshot.val()
                                });
                            }
                        })
                    }
                })
            }
            else {
                res.status(400).send('Missing text');
            }
        }
        else {
            res.status(400).send('No matches for id');
        }
    }
    else {
        res.status(400).send();
    }
});
