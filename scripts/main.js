function addDeleteHandler(element){
  var parent = element.parentNode
  //var columnIndex = e.parent().siblings("input").val()
  var columnIndex = parent.parentNode.getElementsByTagName('input')[0].value
  //var noteIndex = e.siblings("input").val()
  var noteIndex = parent.getElementsByTagName('input')[0].value
  //var col = e.parent().parent()
  var col = parent.parentNode

  stickyNotes[columnIndex].splice(noteIndex, 1)
  localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes))
  col.removeChild(parent)

  var articles = col.getElementsByTagName('article')
  for(let i = 0; i < articles.length; i++){
    articles[i].getElementsByTagName('input')[0].value = i
  }
  //calculateHeight(col.children(".add-col"))
}
function addEditHandler(element){
  var parent = element.parentNode.parentNode
  var parentID = parent.getElementsByTagName('input')[0].value
  var noteID = element.parentNode.getElementsByTagName('input')[0].value
  var addNode = document.createElement("div")
  addNode.className = "add-node"

  var addNodeInput = document.createElement("textarea")
  //Add event listener for the textarea
  //If shift is not held down while pressing enter, Create a new
  //note using the value of textarea
  addNodeInput.addEventListener('keydown', function(event){
    const keyName = event.key;
    if(!event.shiftKey && keyName === 'Enter'){
      var newNode = createNewArticle(this.value, noteID)

      stickyNotes[parentID][noteID] = [this.value, false]
      localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes))

      parent.insertBefore(newNode, addNode)
      parent.removeChild(addNode)
    }
  }, false)

  addNode.appendChild(addNodeInput)
  parent.insertBefore(addNode, element.parentNode)
  parent.removeChild(element.parentNode)
}
function addStrikeThroughHandler(event, element){
  if(event.which === 2){
    var parent = element.parentNode
    var colIndex = parent.parentNode.getElementsByTagName("input")[0].value
    var noteIndex = parent.getElementsByTagName("input")[0].value
    stickyNotes[colIndex][noteIndex][1] = !stickyNotes[colIndex][noteIndex][1]
    localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes))

    if(element.className.includes('text-linethrough')){
      let index = element.className.indexOf('text-linethrough')
      element.className = element.className.substr(0, index - 1)
    }
    else {
      element.className += ' text-linethrough'
    }
  }
}

function createNewArticle(noteContent, noteIndex){

  var newNode = document.createElement("article")
  newNode.setAttribute("class", "sticky-note")

  var newNodeID = document.createElement("input")
  newNodeID.setAttribute("type", "hidden")
  newNodeID.setAttribute("value", noteIndex)

  var newNodeContent = document.createElement("div")
  var newNodeContentText = document.createTextNode(noteContent)
  newNodeContent.setAttribute("class", "sticky-note-content")
  newNodeContent.appendChild(newNodeContentText)

  var newNodeDeleteButton = document.createElement("div")
  newNodeDeleteButton.setAttribute("class","delete-triangle")

  newNodeDeleteButton.addEventListener('click', function(event){addDeleteHandler(this)}, false)
  newNodeContent.addEventListener('dblclick', function(event){addEditHandler(this)}, false)
  newNodeContent.addEventListener('mousedown', function(event){addStrikeThroughHandler(event, this)}, false)

  newNode.appendChild(newNodeID)
  newNode.appendChild(newNodeContent)
  newNode.appendChild(newNodeDeleteButton)

  return newNode
}


//Start of main function. Add document ready later

//Initialize global variables
if(!localStorage.getItem('stickyNotes')){
  localStorage.setItem('stickyNotes', JSON.stringify([[], [], [], []]))
  var stickyNotes = [[], [], [], []]
}
else{
  var stickyNotes = JSON.parse(localStorage.getItem('stickyNotes'))
}


stickyNotes.forEach(function(col, colIndex){
  //var bottom = $(".col-content").eq(colIndex).children(".add-col")
  var column = document.getElementsByClassName("col-content")[colIndex]
  var bottom = document.getElementsByClassName("add-col")[colIndex]
  col.forEach(function(note, noteIndex){
    //bottom.before(stickyNoteFrontTemplate + note[0] + stickyNoteBackTemplate)
    var newNode = createNewArticle(note[0], noteIndex)
    column.insertBefore(newNode, bottom)

    if(note[1])
      newNode.childNodes[1].className += " text-linethrough"

  }, bottom)

  //calculateHeight(bottom)

})

//Add event listener for add notes beneath every column
var element = document.getElementsByClassName("add-col")
for(let i = 0; i < element.length; i++){
  element[i].addEventListener('click', function(){
    var parent = element[i].parentNode
    var addNode = document.createElement("div")
    addNode.className = "add-node"

    var addNodeInput = document.createElement("textarea")
    //Add event listener for the textarea
    //If shift is not held down while pressing enter, Create a new
    //note using the value of textarea
    addNodeInput.addEventListener('keydown', function(event){
      const keyName = event.key;
      if(!event.shiftKey && keyName === 'Enter'){
        var noteID = parent.getElementsByTagName('article').length
        var newNode = createNewArticle(this.value, noteID)

        stickyNotes[i].push([this.value, false])
        localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes))

        parent.insertBefore(newNode, element[i])
        parent.removeChild(addNode)
      }
    }, false)

    addNode.appendChild(addNodeInput)
    parent.insertBefore(addNode, element[i])

  }, false)

}
//End of main function
