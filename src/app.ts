const form = document.getElementById("form") as HTMLFormElement;
const titleInput =document.getElementById("title") as HTMLInputElement;
const tagsInput =document.getElementById("tags") as HTMLInputElement;
const ratingInput =document.getElementById("rating") as HTMLInputElement;
const sakuhinList=document.getElementById("sakuhin-list")as HTMLDListElement;
const searchInput=document.getElementById("search") as HTMLInputElement;

type sakuhinType={
    id:number,
    title:string,
    tags:string[],
    rating:number,
    isFavorite:boolean,
}
let Sakuhins :sakuhinType[]=[];
let editID:null|number=null;
form.addEventListener("submit",(event)=>{
    event.preventDefault();
if(editID!==null){
   Sakuhins=Sakuhins.map((sakuhin)=>{
    if(editID===sakuhin.id){
        return{
            ...sakuhin,
        title:titleInput.value,
        tags:tagsInput.value.split(",").map(tag=>{
            return tag.trim();}),
        rating:Number(ratingInput.value),
 
        }

    }else{return sakuhin;}
  
});
    editID=null;
    renderSakuhins();
    saveSakuhins();
}else{
    const newSakuhin={
        id:Date.now(), 
        title:titleInput.value,
        tags:tagsInput.value.split(",").map((tag)=>{return tag.trim()}) ,
        rating:Number(ratingInput.value), 
        isFavorite:false,
     };
   
    tagsInput.value="";
    titleInput.value="";
    ratingInput.value="";        
    Sakuhins.push(newSakuhin);
    Sakuhins.sort((a,b)=>{
        return b.rating-a.rating;
    });
    renderSakuhins();
    saveSakuhins();
}
})

function saveSakuhins(){
localStorage.setItem("Sakuhins",
    JSON.stringify(Sakuhins));
}
const savedSakuhins=
localStorage.getItem("Sakuhins");
if(savedSakuhins){
    Sakuhins=JSON.parse(savedSakuhins)
}
function renderSakuhins(displaySakuhins:sakuhinType[]=Sakuhins){
    sakuhinList.innerHTML="";
    displaySakuhins.forEach((sakuhin)=>{
       
        const div=document.createElement("div");
         sakuhinList.appendChild(div);
        div.innerHTML=`
        <h3>${sakuhin.title}</h3>
        <p>${sakuhin.rating}</p>`;

        sakuhin.tags.forEach((tag)=>{
             const tagsSpan=document.createElement("span");
             div.appendChild(tagsSpan);
             tagsSpan.textContent=`#${tag}`
             tagsSpan.className="tag"
             tagsSpan.addEventListener("click",()=>{
                const tagsFilter=Sakuhins.filter((sakuhin)=>{
                return sakuhin.tags.includes(tag);
                })
                 renderSakuhins(tagsFilter);
             })
            })
            
       

        
        const deleteButton=document.createElement("button");
        deleteButton.textContent="削除";
        deleteButton.addEventListener("click",()=>{
            Sakuhins=Sakuhins.filter((item)=>{
                return sakuhin.id!==item.id;});
                renderSakuhins();
                saveSakuhins();
        });
        div.appendChild(deleteButton);

        const editButton=document.createElement("button");
        editButton.textContent="編集";
        editButton.addEventListener("click",()=>{
           editID=sakuhin.id;
           titleInput.value=sakuhin.title;
           tagsInput.value=sakuhin.tags.join(",");
           ratingInput.value=sakuhin.rating.toString();
        });
        div.appendChild(editButton);

        const isFavoriteButton=document.createElement("button");
        div.appendChild(isFavoriteButton);
        if(sakuhin.isFavorite){
            isFavoriteButton.textContent="☆お気に入り"
        }else{
            isFavoriteButton.textContent="★お気に入り"
        }
        isFavoriteButton.addEventListener("click",()=>{
            sakuhin.isFavorite=!sakuhin.isFavorite;
        renderSakuhins();
        saveSakuhins();
        });
    });
}

        searchInput.addEventListener("input",()=>{
        const searchFilter=Sakuhins.filter((sakuhin)=>{
            return sakuhin.title.includes(searchInput.value);
     });
        renderSakuhins(searchFilter);
    });

    renderSakuhins();
