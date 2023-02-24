const mongoose=require('mongoose');
const SHOW=require('../models/show');
const fs=require('fs');
const csv=require('csv-parser');

const getData=(req,res)=>{
   const type=req.query.type?.toLowerCase();
   const name=req.query.name?.toLowerCase();
   const data_added_lte=req.query.data_added_lte;
   const data_added_gte=req.query.data_added_gte;
   const release_year_lte=req.query.release_year_lte;
   const release_year_gte=req.query.release_year_gte;
   const rating=req.query.rating?.toLowerCase();
   const sort_by=req.query.sort_by?.toLowerCase();
   const sort_order=req.query.sort_order?.toLowerCase();

   console.log({ type, name, data_added_lte, data_added_gte, release_year_lte, release_year_gte, rating, sort_by, sort_order });
    let query={};
    if(type==='movie' || type==='tv_show')
    {
        query.type={ $regex : type==='movie'?'movie' : 'tv show' , $options : 'i'}
    }
    if(name)
    {
        query.$or=[
            {title : {$regex : name , $options : 'i'}},
            {cast : {$regex : name , $options : 'i'}},
            {director : {$regex : name , $options : 'i'}}
        ]
    }
    if(rating)
    {
        query.rating = {$regex : rating , $options : 'i'};
    }
    if(data_added_gte)
    {
        query.date_added={$gte:data_added_gte};
    }
    if(data_added_lte)
    {
        query.date_added={$lte:data_added_lte};
    }
    if(data_added_lte && data_added_gte)
    {
        query.date_added={$gte:data_added_gte,$lte:data_added_lte};
    }
    if(release_year_gte)
    {
        query.release_year={$gte:release_year_gte};
    }
    if(release_year_lte)
    {
        query.release_year={$lte:release_year_lte};
    }
    if(release_year_gte && release_year_lte)
    {
        query.release_year={$gte:release_year_gte,$lte:release_year_lte};
    }
    console.log(query);
    SHOW.find(query,(err,data)=>{
        if(err)
        {
            console.log(err);
            return res.status(500).json({err : "INVALID QUERY"});
        }
        if(sort_by==="release_year" || sort_by==="data_added")
        {
             if(sort_order==="desc")
            {
                data.sort((a,b)=>b[sort_by]-a[sort_by]);
            }
            else  data.sort((a,b)=>a[sort_by]-b[sort_by]); 
        }
        return res.status(200).json(data);

    })
}

const resetData=(req,res)=>{
    SHOW.countDocuments({},(err,count)=>
    {
        if(count===0)
        {
            return res.status(422).json({err : "No Data"})
        }
        SHOW.deleteMany({},(err,result)=>
        {
            if(err)return res.status(500).json({err : err});
            return res.status(200).json({msg : "Data reseted successfully"});
        })
    });
}

const seedData=(req,res)=>{
    SHOW.countDocuments({},(err,count)=>{
        if(count)
        {
            return res.status(422).json({err : "Data already seeded"});
        }
        const data=[];
        fs.createReadStream('netflix_titles.csv')
        .pipe(csv())
        .on('data',(row)=>
        {
        const {show_id,type,title,director,cast,country,date_added,release_year,rating,duration,listed_in,description}=row;
        const show=new SHOW({
            show_id,
            type,
            title,
            director: director.split(','),
            cast: cast.split(','),
            country:country.split(','),
            date_added ,
            release_year,
            rating,
            duration,
            listed_in:listed_in.split(','),
            description
        });
        data.push(show);
        })
        .on('end',()=>{
            SHOW.insertMany(data,(err,result)=>{
                if(err)
                {
                    console.log(err);
                    return res.status(500).json({err : "Error seeding data"});
                }
                return res.status(200).json({msg : "Data seeded successfully"});
            }) 
        })
     });
}

module.exports = {getData, seedData, resetData};