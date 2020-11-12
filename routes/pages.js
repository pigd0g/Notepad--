const express = require('express');
const router = express.Router();
const collections  = require('../config/mongo').collections
const _ = require('lodash');

const projectNameGenerator = require("project-name-generator")

router.get('/', (req, res) => {

  res.redirect('/' + projectNameGenerator().dashed)
    
})

router.get('/delete/:projectname', async (req, res) => {

	await collections.notes.deleteOne({projectname: req.params.projectname})

	let onenote = await collections.notes.findOne({})

	if (onenote) {
  	return res.redirect('/' + onenote.projectname)
	}

  res.redirect('/' + projectNameGenerator().dashed)
    
})

router.get('/:projectname', async (req, res) => {

	let notes = await collections.notes.find({}).toArray()

	//console.log(notes)

  res.render('index.ejs', {
    projectname: req.params.projectname,
    notes: notes
  })
    
})

router.post('/note/:projectname', async (req, res) => {

  collections.notes.findOneAndUpdate(
    {projectname: req.params.projectname},
    { $set: {
    	content: req.body.content,
    	updated: Date.now()
    } },
    { upsert: true }, 
    function (err, noteupdate) {
      if (err) {
        console.log(err)
      	res.json({status:"error", msg:"failed updating"})  
        return;
      }
      var msg = ''
      if (!noteupdate.lastErrorObject.updatedExisting) {
        console.log("Added Note", req.params.projectname )
        msg = 'new'
      } else {
        console.log("Updated Note", req.params.projectname )
        msg = 'update'
      }
			res.json({status:"ok", msg: msg})
      
    }
  );
    
})

router.get('/note/:projectname', async (req, res) => {

	var note = await collections.notes.findOne({projectname: req.params.projectname})

	res.json({status:"ok", msg:"", content: (note) ? note.content : ''})
    
})

module.exports = router;
