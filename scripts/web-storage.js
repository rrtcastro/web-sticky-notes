myStorage = localStorage;

var stickyNoteFrontTemplate = '<article class="sticky-note"> \
  <input type="hidden" value="0"> \
  <div class="sticky-note-content">'
var stickyNoteBackTemplate = '</div> \
  <div class="delete-triangle"></div></article>'
var stickyNotes = [[], [], [], []]

function addDeleteHandler(e){
  var columnIndex = e.parent().siblings("input").val() - 1
  var noteIndex = e.siblings("input").val()
  var col = e.parent().parent()

  stickyNotes[columnIndex].splice(noteIndex, 1)
  e.parent().remove()

  if(col.children().length > 3){
    col.children("article").each(function(index){
      $(this).children("input").val(index)
    })
  }
  else{
    col.children(".add-col").show()
    col.children(".add-end-col").hide()
  }
}
function addEditHandler(e){
  var value = e.html()
  e.before("<textarea class='edit-form'>" + value + "</textarea>")
  e.prev().keypress(function (event) {
    var code = (event.keyCode ? event.keyCode : event.which)
    if (!event.shiftKey && code == 13) {
      var newValue = e.prev().val()
      e.html(newValue).show()
      e.prev().remove()
    }
  })

  e.hide()
  e.prev().focus()
}
function addStrikeThrough(event, element){
  if(event.which == 2){
    element.toggleClass("text-linethrough")
  }
}
function addFunction(e){
  e.children(".delete-triangle").on('click', function(){addDeleteHandler($(this))})
  e.children(".sticky-note-content").on('dblclick', function(){addEditHandler($(this))})
  e.children(".sticky-note-content").on('mousedown', function(e){addStrikeThrough(e, $(this))})
}

$(document).ready(function(){
  $(".col-content").each(function(index){
    if($(this).children().length == 3){
      $(this).children(".add-end-col").hide()
    }
    else{
      $(this).children(".add-col").hide()
    }
  })

  $(".add-col").click(function(){
    var columnIndex = $(this).siblings("input").val() - 1
    var note = prompt("What's on your mind")
    stickyNotes[columnIndex].push(note)

    $(this).after(stickyNoteFrontTemplate + note + stickyNoteBackTemplate)
    addFunction($(this).next())

    $(this).siblings(".add-end-col").css("display","block")
    $(this).hide()
  })

  $(".add-end-col").click(function(){
    var columnIndex = $(this).siblings("input").val() - 1
    var note = prompt("What's on your mind")
    stickyNotes[columnIndex].push(note)

    $(this).before(stickyNoteFrontTemplate + note + stickyNoteBackTemplate)
    $(this).prev().children("input").val(stickyNotes[columnIndex].length - 1)
    addFunction($(this).prev())

  })

})
