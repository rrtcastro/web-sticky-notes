$(document).ready(function(){
  $(".col-content").each(function(index){
    if($(this).children().length == 0){
      $(this).html("<div class='add-col'><p>+</p></div>")
    }
  })
  
})
