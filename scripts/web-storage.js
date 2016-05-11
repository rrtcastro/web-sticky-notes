if(!localStorage.getItem('stickyNotes')){
  localStorage.setItem('stickyNotes', JSON.stringify([[], [], [], []]))
  var stickyNotes = [[], [], [], []]
}
else{
  stickyNotes = JSON.parse(localStorage.getItem('stickyNotes'))
}

var stickyNoteFrontTemplate = '<article class="sticky-note"> \
  <input type="hidden" value="0"> \
  <div class="sticky-note-content">'
var stickyNoteBackTemplate = '</div> \
  <div class="delete-triangle"></div></article>'

function addDeleteHandler(e){
  var columnIndex = e.parent().siblings("input").val()
  var noteIndex = e.siblings("input").val()
  var col = e.parent().parent()

  stickyNotes[columnIndex].splice(noteIndex, 1)
  localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes))
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
      var colIndex = e.parent().siblings("input").val()
      var noteIndex = e.siblings("input").val()
      stickyNotes[colIndex][noteIndex] = [newValue, 0]
      localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes))

      e.html(newValue).show()
      e.prev().remove()
    }
  })

  e.hide()
  e.prev().focus()
}
function addStrikeThrough(event, element){
  if(event.which == 2){
    var colIndex = element.parent().siblings("input").val()
    var noteIndex = element.siblings("input").val()
    stickyNotes[colIndex][noteIndex][1] = !stickyNotes[colIndex][noteIndex][1]
    localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes))
    element.toggleClass("text-linethrough")
  }
}
function addFunction(e){
  e.children(".delete-triangle").on('click', function(){addDeleteHandler($(this))})
  e.children(".sticky-note-content").on('dblclick', function(){addEditHandler($(this))})
  e.children(".sticky-note-content").on('mousedown', function(e){addStrikeThrough(e, $(this))})
}

$(document).ready(function(){

  stickyNotes.forEach(function(col, colIndex){
    if(col.length == 0){
      $(".col-content").eq(colIndex).children(".add-end-col").hide()
    }
    else{
      var bottom = $(".col-content").eq(colIndex).children(".add-end-col")
      $(".col-content").eq(colIndex).children(".add-col").hide()
      stickyNotes[colIndex].forEach(function(note, noteIndex){
        bottom.before(stickyNoteFrontTemplate + note[0] + stickyNoteBackTemplate)
        bottom.prev().children("input").val(noteIndex)
        addFunction(bottom.prev())

        if(note[1])
          bottom.prev().children(".sticky-note-content").addClass("text-linethrough")

      }, bottom)
    }
  })

  $(".add-col").click(function(){
    var columnIndex = $(this).siblings("input").val()
    var note = prompt("What's on your mind")
    stickyNotes[columnIndex].push([note, false])
    localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes))

    $(this).after(stickyNoteFrontTemplate + note + stickyNoteBackTemplate)
    addFunction($(this).next())

    $(this).siblings(".add-end-col").css("display","block")
    $(this).hide()
  })

  $(".add-end-col").click(function(){
    var columnIndex = $(this).siblings("input").val()
    var note = prompt("What's on your mind")
    stickyNotes[columnIndex].push([note, false])
    localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes))


    $(this).before(stickyNoteFrontTemplate + note + stickyNoteBackTemplate)
    $(this).prev().children("input").val(stickyNotes[columnIndex].length - 1)
    addFunction($(this).prev())

  })

})
