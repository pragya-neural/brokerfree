var conn = require('./connection');

   function  data_insert_return_id(table,data,cb){	   function  data_insert_return_id(table,data,cb){
        conn.query('INSERT INTO '+table+' SET ?',data, function (err, results, fields) { 	        conn.query('INSERT INTO '+table+' SET ?',data, function (err, results, fields) { 
            if (err) throw err;	            if (err) throw err;
            var insert_id = results['insertId'];	            var insert_id = results['insertId'];
            cb(insert_id);	            cb(insert_id);
        });  	        });  
    }	    }

    function  all_data_select(field,tbl_name,where,orderby,cb){	    function  all_data_select(field,tbl_name,where,orderby,cb){
        var query='select '+field+' from '+tbl_name+' where '+where+' order by '+orderby+'';	        var query='select '+field+' from '+tbl_name+' where '+where+' order by '+orderby+'';
        conn.query(query, function (err, results, fields) { 	        conn.query(query, function (err, results, fields) { 
            if (err) throw err;	            if (err) throw err;
            Object.keys(results).forEach(function(key) {	              cb(results);
                var row = results[key];	         });  
                cb(row);	    }
              });	
         });  	    function  num_rows(tbl_name,where,cb){
    }	        var query='select count(*) as total from '+tbl_name+' where '+where+'';
        conn.query(query, function (err, results, fields) { 
    function  num_rows(tbl_name,where,cb){	            if (err) throw err;
        var query='select count(*) as total from '+tbl_name+' where '+where+'';	               cb(results[0].total); 
        conn.query(query, function (err, results, fields) { 	         });  
            if (err) throw err;	    }
               cb(results[0].total); 	
         });  	    function  delete_rows(tbl_name,where,cb){
    }	        var query='delete from '+tbl_name+' where '+where+'';
        conn.query(query, function (err, results, fields) { 
    function  delete_rows(tbl_name,where,cb){	            if (err) throw err;
        var query='delete from '+tbl_name+' where '+where+'';	               cb(results.affectedRows); 
        conn.query(query, function (err, results, fields) { 	         });  
            if (err) throw err;	    }
               cb(results.affectedRows); 	
         });  	    function  update_data(table,fields,where,cb){
    }	        var query = "UPDATE "+table+" SET "+fields +" WHERE "+where+"";
        conn.query(query, function (err, results, fields) { 
    function  update_data(table,fields,where,cb){	            if (err) throw err;
        var query = "UPDATE "+table+" SET "+fields +" WHERE "+where+"";	            cb(results.affectedRows);
        conn.query(query, function (err, results, fields) { 	        });  
            if (err) throw err;	    }
            cb(results.affectedRows);	
        });  	    function  all_data_select_limit(field,tbl_name,where,orderby,limit,cb){
    }	        var query='select '+field+' from '+tbl_name+' where '+where+' order by '+orderby+' LIMIT '+limit+'';
        conn.query(query, function (err, results, fields) { 
    function  all_data_select_limit(field,tbl_name,where,orderby,limit,cb){	            if (err) throw err;
        var query='select '+field+' from '+tbl_name+' where '+where+' order by '+orderby+' LIMIT '+limit+'';	            Object.keys(results).forEach(function(key) {
        conn.query(query, function (err, results, fields) { 	                var row = results[key];
            if (err) throw err;	                cb(row);
            Object.keys(results).forEach(function(key) {	              });
                var row = results[key];	         });  
                cb(row);	    }
              });	module.exports.data_insert_return_id=data_insert_return_id;
         });  	module.exports.all_data_select=all_data_select;
    }	module.exports.num_rows=num_rows;
module.exports.data_insert_return_id=data_insert_return_id;	module.exports.delete_rows=delete_rows;
module.exports.all_data_select=all_data_select;	module.exports.update_data=update_data;
module.exports.num_rows=num_rows;	
module.exports.delete_rows=delete_rows;	
module.exports.update_data=update_data;	
module.exports.all_data_select_limit=all_data_select_limit; 	module.exports.all_data_select_limit=all_data_select_limit; 
