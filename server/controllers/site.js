exports.index = function(req, res) {

   console.log( req.user );

   res.render('index', { title: 'Router Separation Example' });
};
