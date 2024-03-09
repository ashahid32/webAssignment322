/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: ___Jianzhong Ding___________________ Student ID: ____102212230__________ Date: ____Mar 2, 2024____________
*
*  Online (Cyclic) Link: https://uptight-ant-pantsuit.cyclic.app/
*
********************************************************************************/
const unCountryData = require("./modules/unCountries");
const path = require("path");

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public')); 
app.set('view engine', 'ejs');
app.use((req,res,next)=>{
  app.locals.currentRoute = req.path;
  next();
});

app.get('/', (req, res) => {
    // res.send('Assignment 2:  Student Name - Student Id');
    res.render("home");
});

app.get('/about', (req, res) => {
  res.render('about');
});

//to be deleted
app.get('/countries', (req, res) => {
  res.render('countries');
});

//to be deleted
app.get('/country', (req, res) => {
  res.render('country');
});

app.get("/un/countries", async (req,res)=>{
  // let countries = await unCountryData.getAllCountries();
  // res.send(countries);
  try{
    if(req.query.region){
      let countries = await unCountryData.getCountriesByRegion(req.query.region);
      let {region} = req.query;
      region = region.charAt(0).toUpperCase() + region.slice(1);
      if(countries.length)res.render("countries", {region, countries});
      else throw new Error("No Countries found for a matching region!!")
      //else res.status(404).render("404", {message: "No Countries found for a matching region!"}) //alternate solution
  
    }else{
      let countries = await unCountryData.getAllCountries();
      //res.json(countries);
      let region = req.query.region;
      res.render("countries", { region: "All ", countries});
    }
  }catch(err){
    res.status(404).render("404", {message:err});
  }

});

app.get("/un/countries/:code", async (req,res)=>{
  try{
    let country = await unCountryData.getCountryByCode(req.params.code);
    res.render("country", {country});
   
  }catch(err){
    res.render("404", {message: err});
  }
});

// app.get("/un/countries/region-demo", async (req,res)=>{
//   try{
//     let countries = await unCountryData.getCountriesByRegion("Oceania");
//     res.send(countries);
//   }catch(err){
//     res.send(err);
//   }
// });

app.use((req, res, next) => {
  //res.status(404).render('404');
  res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});

unCountryData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});

