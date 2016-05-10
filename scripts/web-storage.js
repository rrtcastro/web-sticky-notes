var stickyNoteFrontTemplate = '<article class="sticky-note"> \
  <input type="hidden" value="0"> \
  <div class="add-new"><p>+</p></div> \
  <div class="sticky-note-content">'
var stickyNoteBackTemplate = '</div> \
  <div class="delete-triangle"></div></article>'
var stickyNotes = [[], [], [], []]

function addClickHandler(e){
  var columnIndex = e.parent().siblings("input").val() - 1
  var note = prompt("What's on your mind")
  stickyNotes[columnIndex].push(note)

  var element = e.parent().clone(true)
  element.children(".sticky-note-content").html(note)
  e.parent().before(element)
}
function addDeleteHandler(e){
  var columnIndex = e.parent().siblings("input").val() - 1

  //TEMPORARY ONLY: TO DO A LEGIT DELETE FROM ARRAY
  stickyNotes[columnIndex].pop()

  e.parent().remove()
}

$(document).ready(function(){
  $(".col-content").each(function(index){
    if($(this).children().length == 2){
      $(this).children(".add-end-col").css("display","none")
      $(this).children(".add-end-col").before("<div class='add-col'><p>+</p></div>")
    }
  })

  $(".add-col").click(function(){
    var columnIndex = $(this).siblings("input").val() - 1
    var note = prompt("What's on your mind")
    stickyNotes[columnIndex].push(note)

    $(this).after(stickyNoteFrontTemplate + note + stickyNoteBackTemplate)

    var e = $(this).next().children(".add-new")
    e.on('click',function(){addClickHandler(e)})

    e = $(this).next().children(".delete-triangle")
    e.on('click', function(){addDeleteHandler(e)})

    $(this).siblings(".add-end-col").css("display","block")

    $(this).remove()
  })

  $(".add-end-col").click(function(){
    var columnIndex = $(this).siblings("input").val() - 1
    var note = prompt("What's on your mind")
    stickyNotes[columnIndex].push(note)

    $(this).before(stickyNoteFrontTemplate + note + stickyNoteBackTemplate)

    var e = $(this).prev().children(".add-new")
    e.on('click',function(){addClickHandler(e)})

    e = $(this).prev().children(".delete-triangle")
    e.on('click', function(){addDeleteHandler(e)})

  })

  $(".add-new").click(function(event){
    columnIndex = $(this).parent().siblings("input").val() - 1
    var note = prompt("What's on your mind")
    stickyNotes[columnIndex].push(note)

    element = $(this).parent().clone(true)
    element.children(".sticky-note-content").html(note)
    $(this).parent().before(element)
  })

})
