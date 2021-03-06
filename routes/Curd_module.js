var conn = require('./connection');

   function  data_insert_return_id(table,data,cb){
        conn.query('INSERT INTO '+table+' SET ?',data, function (err, results, fields) { 
            if (err) throw err;
            var insert_id = results['insertId'];
            cb(insert_id);
        });  
    }

    function  all_data_select(field,tbl_name,where,orderby,cb){
        var query='select '+field+' from '+tbl_name+' where '+where+' order by '+orderby+'';
        conn.query(query, function (err, results, fields) { 
            if (err) throw err;
              cb(results);
         });  
    }

    function  num_rows(tbl_name,where,cb){
        var query='select count(*) as total from '+tbl_name+' where '+where+'';
        conn.query(query, function (err, results, fields) { 
            if (err) throw err;
               cb(results[0].total); 
         });  
    }

    function  delete_rows(tbl_name,where,cb){
        var query='delete from '+tbl_name+' where '+where+'';
        conn.query(query, function (err, results, fields) { 
            if (err) throw err;
               cb(results.affectedRows); 
         });  
    }

    function  update_data(table,fields,where,cb){
        var query = "UPDATE "+table+" SET "+fields +" WHERE "+where+"";
        conn.query(query, function (err, results, fields) { 
            if (err) throw err;
            cb(results.affectedRows);
        });  
    }

    function  all_data_select_limit(field,tbl_name,where,orderby,limit,cb){
        var query='select '+field+' from '+tbl_name+' where '+where+' order by '+orderby+' LIMIT '+limit+'';
        conn.query(query, function (err, results, fields) { 
            if (err) throw err;
            Object.keys(results).forEach(function(key) {
                var row = results[key];
                cb(row);
              });
         });  
    }
module.exports.data_insert_return_id=data_insert_return_id;
module.exports.all_data_select=all_data_select;
module.exports.num_rows=num_rows;
module.exports.delete_rows=delete_rows;
module.exports.update_data=update_data;
module.exports.all_data_select_limit=all_data_select_limit;
