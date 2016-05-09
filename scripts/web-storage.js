var stickyNoteFrontTemplate = '<article class="sticky-note"> \
  <div class="add-new"><p>+</p></div> \
  <div class="sticky-note-content">'
var stickyNoteBackTemplate = '</div></article>'
var stickyNotes = [[], [], [], []]

$(document).ready(function(){
  $(".col-content").each(function(index){
    if($(this).children().length == 1){
      $(this).append("<div class='add-col'><p>+</p></div>")
    }
  })

  $(".add-col").click(function(){
    var columnIndex = $(this).siblings("input").val() - 1
    stickyNotes[columnIndex].push("Hello World")

    $(this).parent().append(stickyNoteFrontTemplate + "Hello World" + stickyNoteBackTemplate)
    $(this).parent().append("<div class='add-end-col'><p>+</p></div>")
    $(this).remove()
  })

  $(".add-end-col").click(function(){
    var columnIndex = $(this).siblings("input").val() - 1
    stickyNotes[columnIndex].push("Hello World")

    $(this).before(stickyNoteFrontTemplate + "Hello World" + stickyNoteBackTemplate)
  })

  $(".add-new").click(function(event){
    columnIndex = $(this).parent().siblings("input").val() - 1
    stickyNotes[columnIndex].push("Hello World")

    element = $(this).parent().clone(true)
    element.children(".sticky-note-content").html("Hello World")
    $(this).parent().before(element)
  })

})
