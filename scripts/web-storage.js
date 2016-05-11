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

  col.children("article").each(function(index){
    $(this).children("input").val(index)
  })
  calculateHeight(col.children(".add-col"))

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

function stickyNoteModalPrompt(columnIndex){
  $('#insert-sticky-modal').modal('show')
  $('#target-col').val(columnIndex)
}
function calculateHeight(element){
  var colHeight = 0
  var numberOfNotes = 0;
  element.siblings(".sticky-note").each(function(){
    colHeight += $(this).height()
    numberOfNotes++;
  })
  console.log(colHeight)
  console.log(element.parent().height())
  if(element.parent().height() - colHeight > 100){
    element.css("height", window.innerHeight - colHeight - 6 - numberOfNotes + "px")
  }
  else {
    element.css("height", "100px")
  }

}

$(document).ready(function(){

  stickyNotes.forEach(function(col, colIndex){
    var bottom = $(".col-content").eq(colIndex).children(".add-col")
    stickyNotes[colIndex].forEach(function(note, noteIndex){
      bottom.before(stickyNoteFrontTemplate + note[0] + stickyNoteBackTemplate)
      bottom.prev().children("input").val(noteIndex)
      addFunction(bottom.prev())

      if(note[1])
        bottom.prev().children(".sticky-note-content").addClass("text-linethrough")

    }, bottom)

    calculateHeight(bottom)

  })

  $(".add-col").click(function(){
    var columnIndex = $(this).siblings("input").val()
    stickyNoteModalPrompt(columnIndex)
  })

  $(".modal-footer button").click(function(){

    var note = $("#message-text").val()
    var columnIndex = $("#target-col").val()

    stickyNotes[columnIndex].push([note, false])
    localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes))

    $(".add-col").eq(columnIndex).before(stickyNoteFrontTemplate + note + stickyNoteBackTemplate)
    $(".add-col").eq(columnIndex).prev().children("input").val(stickyNotes[columnIndex].length - 1)
    addFunction($(".add-col").eq(columnIndex).prev())

    $('#insert-sticky-modal').modal('hide')
    calculateHeight($(".add-col").eq(columnIndex))

  })

})
