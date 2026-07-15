let post_url  =`https://jsonplaceholder.typicode.com/posts` ;

const spinner= document.getElementById('spinner');

const addPost= document.getElementById('addPost');
const updatePost= document.getElementById('updatePost');

const bodyControl= document.getElementById('body');
const titleControl= document.getElementById('title');

const postContainer= document.getElementById('postContainer');
const postForm= document.getElementById('postForm'); 




let postArr =[]


function tooltip(){ 
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
        })  
} 


function snackbar(msg,icon){
         swal.fire({ 
             title:msg,
             icon:icon,
             timer:3000
         })
} 


async function fetchPost(){ 
            spinner.classList.add('d-none');
             
         try{ 
             let response = await fetch(post_url,{ 
                      method:'GET',
                      headers:{ 
                        'content-type':"application/json",
                        Auth:'Get token from'
                      }
             })  
                let data= await response.json(); 
                   postArr = data;
                     createCards(data);      
             
            }  
         catch(err){  
                 snackbar(err,'error');

         }  
         finally{ 
                spinner.classList.add('d-none');
         }
}
fetchPost(); 



function createCards(arr){ 
           let res ="" ;
           arr.forEach((ele)=>{ 
              res +=`<div class="col-md-4 mb-4" id=${ele.id}>
                     <div class="card h-100">
                       <div class="card-header bg-dark">
                             <h3>${ele.title}</h3>
                       </div>
                       <div class="card-body">
                            <h4>Content</h4>
                             <p>${ele.body}</p>
                       </div>
                           
                       <div class="card-footer d-flex justify-content-between ">
                           <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-info">Edit</button>
                           <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>
                       </div>
                    </div>
                   </div>`
           }); 

           postContainer.innerHTML= res;
}




async function onSubmit(eve){ 
            eve.preventDefault();

           let newObj= { 
               title:titleControl.value ,
               body:bodyControl.value ,
              } 
                 postArr.push(newObj)
        try{ 
             let response = await fetch(post_url,{ 
                         method:'POST',
                         header:{
                             'content-type':"application/json",
                             Auth:'Get token from'
                          },
                          body:JSON.stringify(newObj)
             }) 

             let data = await response.json();
               createSingleCard(data);
        }
        catch(err){ 
               snackbar(err,'error');
        }
        finally{ 
             spinner.classList.add('d-none');
        }
}


function createSingleCard(newObj){ 
            let div= document.createElement('div');
             div.id =newObj.id ;
             div.className =`col-md-4 mb-4`;
             div.innerHTML =`<div class="card h-100">
                                <div class="card-header bg-dark">
                                        <h3>${newObj.title}</h3>
                                </div>
                                <div class="card-body">
                                        <h4>Content</h4>
                                        <p>${newObj.body}</p>
                                </div>
                                    
                                <div class="card-footer d-flex justify-content-between ">
                                    <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-info">Edit</button>
                                    <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>
                                </div>
                                </div>
                            </div>`
        postContainer.prepend(div); 
        postForm.reset();           
}




async function onRemove(ele){ 
        let removeId = ele.closest('.col-md-4').id; 
        let removeUrl =`${post_url}/${removeId}`;

  try{
      let response = await fetch(removeUrl,{ 
                    method:'DELETE',
                    headers:{ 
                         'content-type':"application/json",
                           Auth:'Get token from'
                     } 
                 })
      
    //   if(!response.ok){ 
    //           throw new Error();
    //        }else{ 
    //           return  response.json();
    //        }

     let result =  await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
         })
            
            if (result.isConfirmed){ 
                  document.getElementById(removeId).remove();
                  snackbar('delete successfully','success');
                }
           

  } catch{ 
            
        snackbar('deletetion failed', 'error');
    }
    finally{ 
          spinner.classList.add('d-none');
    }

}



async function onEdit(ele){ 
            let editId =ele.closest('.col-md-4').id  ;
        
            localStorage.setItem('editId',editId) ;
        
            spinner.classList.remove('d-none');                                           
           
            let editObj = postArr.find((post)=>post.id===editId);
            
            titleControl.value= editObj.title; 
            bodyControl.value= editObj.body; 
          
            addPost.classList.add('d-none');
            updatePost.classList.remove('d-none');
              
            window.scrollTo({top:0,behavior:'smooth'});
            spinner.classList.add('d-none');                                           
             
}



async function onUpdate(){
      
     spinner.classList.remove('d-none');                                           
     
    let updateId= localStorage.getItem('editId');
     let updateUrl =`${post_url}/${updateId}`;
     
     let updateObj ={ 
               title:titleControl.value ,
               body:bodyControl.value ,

         }

     try{ 
        let response = await fetch(updateUrl,{  
                  method:'PATCH',
                  headers:{ 
                      'content-type':"application/json",
                      Auth:'Get token from'
                  } ,
                  body:JSON.stringify(updateObj)
 
             })
             
           if(!response.ok){ 
                      throw new Error(response);
            } 
              await response.json();
            
            let div = document.createElement('div');
                 div.innerHTML = `<div class="card h-100">
                                <div class="card-header bg-dark">
                                        <h3>${updateObj.title}</h3>
                                </div>
                                <div class="card-body">
                                        <h4>Content</h4>
                                        <p>${updateObj.body}</p>
                                </div>
                                    
                                <div class="card-footer d-flex justify-content-between ">
                                    <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-info">Edit</button>
                                    <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>
                                </div>
                                </div>
                            </div>`

             addPost.classList.remove('d-none');
             updatePost.classList.add('d-none');
                                                                                           
            div.scrollIntoView({block:'center', behavior:"smooth"}); 

    }catch{
         snackbar('failed to update','error');
       }
     finally{
         spinner.classList.add('d-none');
     } 

} 






postForm.addEventListener('submit', onSubmit);
updatePost.addEventListener('click', onUpdate);