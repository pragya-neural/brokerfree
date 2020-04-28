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

    function  fatch_single_row_data(field,tbl_name,where,cb){
        var query='select '+field+' from '+tbl_name+' where '+where+'';
        conn.query(query, function (err, results, fields) { 
            if (err) throw err;
            Object.keys(results).forEach(function(key) {
				var myJSON = JSON.stringify(results[key]);
				var row = JSON.parse(myJSON);
                cb(row);
              });
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

    function  update_data(table,data,where,cb){
        var fields='';
        for(var key in data) {
            fields += key+"='"+data[key]+"',";
          } 
          fields = fields.replace(/,\s*$/, "");
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

    function bulkInsert(table, objectArray, cb) {
        let keys = Object.keys(objectArray[0]);
        let values = objectArray.map( obj => keys.map( key => obj[key]));
        let sql = 'INSERT INTO ' + table + ' (' + keys.join(',') + ') VALUES ?';
        conn.query(sql, [values], function (error, results, fields) {
          if (error) cb(error);
          cb(results);
        });
    }

    function execute_query(query_str,cb){
        conn.query(query_str, function (err, results, fields) { 
            if (err) throw err;
              cb(results);
         });  
    }
module.exports.data_insert_return_id=data_insert_return_id;
module.exports.all_data_select=all_data_select;
module.exports.num_rows=num_rows;
module.exports.delete_rows=delete_rows;
module.exports.update_data=update_data;
module.exports.all_data_select_limit=all_data_select_limit;
module.exports.fatch_single_row_data=fatch_single_row_data;
module.exports.bulkInsert=bulkInsert;
module.exports.execute_query=execute_query;