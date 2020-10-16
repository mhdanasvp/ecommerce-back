function listSearch (filters,args){
    for (let key in filters){
        if(filters[key].length > 0){
            if(key==='price'){
                args[key]={
                    $gte:filters[key][0],
                    $lte:filters[key][1],
                }
                
                
            }else{
                args[key]=filters[key]
                 
            }
            
        }
        
    }
 }
module.exports=listSearch