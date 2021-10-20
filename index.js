// parent element to store cards
const taskContainer = document.querySelector(".task_container");

//Global store
let globalStore = [];


console.log(taskContainer);
const newCard = ({ id, imageUrl, taskTitle, taskDescription, taskType }) =>
    `<div class="col-md-6 col-lg-4 py-3" id=${id}>
    <div class="card">
    <div class="card-header d-flex justify-content-end gap-2">
    <button type="button" id=${id} class="btn btn-outline-success" onclick= "editCard.apply(this,arguments)" ><i
    class="fas fa-pencil-alt"  id=${id} onclick= "editCard.apply(this,arguments)"></i></button>
    <button type="button" id=${id} class="btn btn-outline-danger" onclick= "deleteCard.apply(this,arguments)" ><i
     class="far fa-trash-alt" id=${id} onclick= "deleteCard.apply(this,arguments)" ></i></button>
    </div>
    <div class="img-container" ">
    <img src=${imageUrl}
    class="card-img-top  rounded-lg" alt="...">
    </div>
   
    <div class="card-body rounded">
        <h5 class="card-title d-flex justify-content-start border border-4">${taskTitle}</h5>
        <p class="card-text d-flex justify-content-start text-center">${taskDescription}
        </p>
        <span class="badge bg-primary d-flex justify-content-start ">${taskType}</span>
    </div>
    <div class="card-footer text-muted  d-flex justify-content-end">
        <button type="button" id=${id} onclick= "yourTask.apply(this,arguments)" class="btn btn-outline-primary float-end" data-bs-toggle="modal"  data-bs-target="#exampleModal1">Open Task
</button>
    </div>
</div>
</div>
<!-- Button trigger modal -->


<!-- Modal -->
<div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Your Task</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div class="img-container" ">
      <img src=${imageUrl}
      class="card-img-top  rounded-lg" alt="...">
      </div>
     
      <div class="card-body rounded">
          <h5 class="card-title d-flex justify-content-center ">${taskTitle}</h5>
          <p class="card-text d-flex justify-content-center text-center ">${taskDescription}
          </p>
          <span class="badge bg-primary d-flex justify-content-center  ">${taskType}</span>
      </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>


</div>
`;


const loadInitialTaskCard = () => {

    //access localstorage
    const getInitialData = localStorage.tasky;
    if (!getInitialData) return;


    //convert sringified object to object
    const { cards } = JSON.parse(getInitialData);


    // map around the array to generate HTML card and inject it to DOM
    cards.map((cardObject) => {
        const createNewCard = newCard(cardObject);
        taskContainer.insertAdjacentHTML("beforeend", createNewCard);
        globalStore.push(cardObject);
    });
};

const updateLocalStorage = () =>
    localStorage.setItem("tasky", JSON.stringify({ cards: globalStore }));


const saveChanges = () => {
    const taskData = {
        id: `${Date.now()}`, // unique number for card id
        imageUrl: document.getElementById("imageurl").value,
        taskTitle: document.getElementById("tasktitle").value,
        taskType: document.getElementById("tasktype").value,
        taskDescription: document.getElementById("taskdescription").value,
    };

    //HTML Code
    const createNewCard = newCard(taskData);
    taskContainer.insertAdjacentHTML("beforeend", createNewCard);
    globalStore.push(taskData);


    // Add localStorage
    updateLocalStorage();
};
const yourTask =(event)=>{
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;
    globalStore = globalStore.map((task) => {
        if (task.id === targetID) {
            return {
                id: task.id,
                imageUrl: task.imageUrl,
                taskTitle: task.taskTitle,
                taskType: task.taskType,
                taskDescription: task.taskDescription,
            };
            
        }
        return task;
       
    });

};


const deleteCard = (event) => {
    //  id of the card
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName; //BUTTON

    //search the globalstorage and than remove the object which matches with id
    const newUpdateArray = globalStore.filter((cardObject) => cardObject.id !== targetID);
    globalStore = newUpdateArray;
    updateLocalStorage();
    // loop over the new globalstore and inject update cards to DOM

    if (tagname === "BUTTON") {
        //task_container
        return event.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            event.target.parentNode.parentNode.parentNode // col-lg-4
        );
    }
    //task_container
    return event.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        event.target.parentNode.parentNode.parentNode.parentNode // col-lg-4
    );
};

// content-edittable

const editCard = (event) => {

    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;
    

    let parentElement;

    if (tagname === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];
    let submitButton = parentElement.childNodes[7].childNodes[1];

    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    submitButton.setAttribute("onclick", "saveEditChanges.apply(this,arguments)");
    submitButton.innerHTML = "Save Changes";
};

const saveEditChanges = (event) => {
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    let parentElement;

    if (tagname === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];
    let submitButton = parentElement.childNodes[7].childNodes[1];

    const updatedData = {
        taskTitle: taskTitle.innerHTML,
        taskType: taskType.innerHTML,
        taskDescription: taskDescription.innerHTML,
    };

    globalStore = globalStore.map((task) => {
        if (task.id === targetID) {
            return {
                id: task.id,
                imageUrl: task.imageUrl,
                taskTitle: updatedData.taskTitle,
                taskType: updatedData.taskType,
                taskDescription: updatedData.taskDescription,
            };
        }
        return task;
    });
    updateLocalStorage();

    //  used after edited the card do not edit again the card 
    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
    submitButton.removeAttribute("onclick");
    submitButton.innerHTML = "Open Task";
};


//searching