function addDeleteHandler(){

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


  //addFunction(bottom.prev())
  //newNodeDeleteButton.addEventListener('click', function(){addDeleteHandler(this)}, false)
  //newNodeContent.addEventListener('dblclick', function(){addEditHandler(this)}, false)
  //newNodeContent.addEventListener('mousedown', function(){addStrikeThrough(this)}, false)

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
    addNodeInput.addEventListener('keydown', function(event){
      const keyName = event.key;
      if(!event.shiftKey && keyName === 'Enter'){
        var newNode = createNewArticle(this.value,i)
        parent.insertBefore(newNode, element[i])
        parent.removeChild(addNode)
      }
    }, false)

    addNode.appendChild(addNodeInput)
    parent.insertBefore(addNode, element[i])

  }, false)

}
//End of main function
