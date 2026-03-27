window.addEventListener('DOMContentLoaded', () => {
    startPlaceholderAnimation();
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.forEach(task => 
        createTaskElement(task)
    )
})

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

   

    if(taskText === "") return;

    const tasks = {
        id:Date.now(),
        text:taskText,
        complete:false,
        category:false,
        priority:"Low",
        state:"pending"
    }
  saveTask(tasks);
  createTaskElement(tasks);
  taskInput.value = "";

}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTaskElement(tasks) {
    const list = document.getElementById("list");

    const li = document.createElement("li");
    li.style.textAlign = 'left';
    li.classList.add("li");
    
    const div = document.createElement("div");
    div.setAttribute("class", "taskdetails");
    div.classList.add("selectstyle");


    
    const span = document.createElement("span");
    span.textContent = tasks.text;
    span.classList.add("span");
    
    
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = tasks.complete;
    checkBox.style.marginTop = "5px";
    checkBox.style.cursor ="pointer";

   if(tasks.complete) {
    span.style.textDecoration = "line-through";
    span.style.textDecorationColor = "#e36414";
   }    

    checkBox.addEventListener("change", () => {
        const isChecked = checkBox.checked;

        span.style.textDecoration = isChecked ? "line-through" : "none";
            span.style.textDecorationColor = "#e36414";
        updateCheckBox(tasks.id, isChecked);
    })

    span.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = span.textContent;
        input.classList.add("input");

        li.replaceChild(input, span);
        input.focus();

        input.addEventListener('keydown', (e) => {
            if(e.key === "Enter") {
                const newText = input.value.trim();
                if(newText === "") return;

                if(tasks.text !== newText) {
                    tasks.complete = false;
                    checkBox.checked = false;
                    span.style.textDecoration = "none";
                }
                tasks.text = newText;
               
                span.textContent = newText;
                li.replaceChild(span, input);

            updateTask(tasks.id, newText);
            }
        })
    })


         const forCategory = document.createElement("select");
          forCategory.classList.add("category");
        
         ["work", "personal","family","exercise","study"].forEach(cat => {
            const categoryOptions = document.createElement("option");
              categoryOptions.value = cat;
            categoryOptions.textContent = cat;
           

            if(tasks.category === cat) {
                categoryOptions.selected = true;
            }

            forCategory.appendChild(categoryOptions);
         })
         forCategory.addEventListener('change' ,() => {
            updateCategory(tasks.id, forCategory.value);
         })

         const forPriority = document.createElement("select");
         forPriority.classList.add("priority");

         ["Low", "Medium","Important"].forEach(pri => {
            const priorityOpt = document.createElement("option");
            priorityOpt.value = pri;
            priorityOpt.textContent = pri;

            if(tasks.priority === pri) {
                priorityOpt.selected = true;
            }
            forPriority.appendChild(priorityOpt);
         })

         forPriority.addEventListener('change',() => {
            updatePriority(tasks.id, forPriority.value);
         })
         
         const forStatus = document.createElement("select");
         forStatus.classList.add("status");

         ["pending", "In-progress", "complete"].forEach(state => {
            const stateOption = document.createElement("option");
            stateOption.value = state;
            stateOption.textContent = state;

            if(tasks.state === state) {
                stateOption.selected = true;
            }
            forStatus.appendChild(stateOption);
         })
         forStatus.addEventListener('change', () => {
            updateTask(tasks);
            updateStatus(tasks.id, forStatus.value);
            updateStyle(li, tasks.state);
         })
      updateStyle(li, tasks.state);

      const btnDiv = document.createElement("button");
      btnDiv.setAttribute("class", "delBtnStyle");
      

      const delBtn = document.createElement("button");
      delBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
      delBtn.classList.add("delBtnStyle");

      delBtn.onclick = () => {
        li.remove();

        updateDelBtn(tasks.id); 
      }
   
   
    li.appendChild(checkBox);
    li.appendChild(span);
    li.appendChild(forCategory);  
    li.appendChild(forPriority);
    li.appendChild(forStatus);
    list.appendChild(li);
  li.appendChild(div);
    div.append(forCategory, forPriority, forStatus);
    li.append(btnDiv);
    btnDiv.appendChild(delBtn);


}
function updateDelBtn(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.filter(task => 
        task.id !== id 
    )
    localStorage.setItem("tasks", JSON.stringify(tasks));

}
function updateStyle(li, state) {
    if(state === "pending") {
      li.style.backgroundColor = "#e63946";
    } else if(state === "In-progress") {
        li.style.backgroundColor = "#a2d2ff";
    } else if(state === "complete") {
        li.style.backgroundColor = "#80ed99";
    }

}

function updateStatus(id, newStatus) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(task => 
        task.id === id ? {...task, state:newStatus} : task
    )
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updatePriority(id, newPriority) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.map(task => 
        task.id === id ? {...task, priority: newPriority} : task
    )
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCategory(id, newCategory) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(task => 
        task.id === id ? {...task, category: newCategory} : task
    )
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTask(id, newText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(task => {
        if(task.id === id) {
            return {
                ...task,
                text:newText,
                complete:false,
                category:"work",
                priority:"Low",
                state:"pending"
            }
           
        }
        return task;
    })
       

    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTask();
}

function renderTask() {
    const taskList = document.getElementById("list");
    taskList.innerHTML = "";

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => 
        createTaskElement(task)
  )

}

function updateCheckBox(id, complete) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.map(task => 
        task.id === id ? {...task, complete: complete} : task
    )
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.querySelector("#addTask").addEventListener("click", addTask);



function typeEffect(input, text, speed=50) {
    let i = 0;
    input.placeholder = "";
const typing = () => {
    if( i < text.length) {
        input.placeholder += text.charAt(i);
        i++;
        setTimeout(typing, speed);
    }
}
typing();

}
function startPlaceholderAnimation() {
    
const input = document.getElementById("taskInput");
    const message = [
        "Enter task here...",
        "click on task to edit...",
        "set priority...",
        "set status...", 
        "set category...",
        "stay organise..."
    ]
    let index = 0;

  function runAnimation() {
    
    typeEffect(input, message[index]); 

    index = (index + 1) % message.length;

    setTimeout(runAnimation, 2500);
  }
  runAnimation();
}



