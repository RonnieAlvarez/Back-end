const form = document.getElementById('registerForm');

form.addEventListener('submit',async e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    try {
        const response = await fetch('/api/sessions/register',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(obj)
    })
     if (response.ok) {
        console.log(data)
      window.location.replace('/');
      //window.location.replace('/users/profile');
    } else {
      throw new Error('Unable to log in');
    }
  } catch (error) {
    console.error(error);
  }

})