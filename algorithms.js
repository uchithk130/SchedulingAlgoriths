    var algorithmSelect = document.getElementById("algorithm");
    algorithmSelect.addEventListener("change", function() {
      var quantumDiv = document.getElementById("quantumDiv");
      if (algorithmSelect.value === "RR") {
        quantumDiv.style.display = "block";
      } else {
        quantumDiv.style.display = "none";
      }
    });

function createTable() { 
  var number = parseInt(document.getElementById("processNumber").value);
  var table = document.getElementById("processTable");
  table.innerHTML = ""; // Clear previous table if any

  var header = table.createTHead();
  var row = header.insertRow(0);
  row.innerHTML = "<th>Process</th><th>Arrival Time</th><th>Burst Time</th><th>Priority</th>";

  for (var i = 0; i < number; i++) {
    var row = table.insertRow(i + 1);
    row.innerHTML = "<td><input type='text' class='form-control' id='process" + i + "'></td>"
      + "<td><input type='text' class='form-control' id='arrival" + i + "'></td>"
      + "<td><input type='text' class='form-control' id='burst" + i + "'></td>"
      + "<td><input type='text' class='form-control' id='priority" + i + "'></td>";
  }
}

function runAlgorithm() {
  var number = parseInt(document.getElementById("processNumber").value);
  var processes = [];

  for (var i = 0; i < number; i++) {
    var p = document.getElementById("process" + i).value;
    var arrival = parseInt(document.getElementById("arrival" + i).value);
    var burst = parseInt(document.getElementById("burst" + i).value);
    var priority = parseInt(document.getElementById("priority" + i).value);
    processes.push({ p: p, arrival: arrival, burst: burst, priority: priority, remain: burst });
  }

  // Call the appropriate algorithm method based on the selected option
  var option = document.getElementById("algorithm").value;
  switch (option) {
    case "FCFS":
      runFCFS(processes);
      break;
    case "SJF":
      runSJF(processes);
      break;
    case "SJRF":
        runSJRF(processes);
        break;
    case "RR":
        runRR(processes);
        break;
    case "PP":
        runPreemptivePriority(processes);
        break;
    case "NPP":
        runNonPreemptivePriority(processes);
        break;
    
    // Add more cases for other algorithms
  }
}


function runFCFS(processes) {
  // Sort the processes based on arrival time
  var executionLog = "";
  processes.sort((a, b) => a.arrival - b.arrival);

  var completionTime = processes[0].arrival;
  var turnaroundTimes = [];
  var waitingTimes = [];
  var completedTimes=[];
  var time = processes[0].arrival;

  for (var i = 0; i < processes.length; i++) {
    // Calculate the completion time for the current process
    executionLog += processes[i].p + " executing at time " + time + "<br>";
    if (completionTime < processes[i].arrival)
      completionTime = processes[i].arrival;
    completionTime += processes[i].burst;
    time += processes[i].burst;

    // Calculate the turnaround time and waiting time for the current process
    var turnaroundTime = completionTime - processes[i].arrival;
    var waitingTime = turnaroundTime - processes[i].burst;
    
    completedTimes.push(completionTime);
    turnaroundTimes.push(turnaroundTime);
    waitingTimes.push(waitingTime);

  }

  // Display the output in a table or any other desired format
  executionLog += " execution completes at time " + time + "<br>"; // Append execution log
  displayExecutionLog(executionLog);
  displayOutput(processes, completedTimes, turnaroundTimes, waitingTimes);
}

function runSJF(processes) {
        var executionLog = "";
    // Sort the processes based on arrival time and burst time
    processes.sort((a, b) => {
    if (a.arrival === b.arrival) {
        return a.burst - b.burst;
    } else {
     return a.arrival - b.arrival;
    }
    });
    var completionTime = processes[0].arrival;
    var turnaroundTimes = [];
    var waitingTimes = [];
    var completedTimes = [];
    var time = processes[0].arrival; 
    var processes2=[];// Initialize the time variable

    while (processes.length > 0) {
        var shortestIndex = 0;

        for (var i = 1; i < processes.length; i++) {
            if (processes[i].arrival <= time && processes[i].burst < processes[shortestIndex].burst) {
                shortestIndex = i;
            }
        }

            var shortestJob = processes[shortestIndex];
            executionLog += processes[shortestIndex].p + " executing at time " + time + "<br>";
            time += shortestJob.burst;
            completionTime += shortestJob.burst;
            var turnaroundTime = completionTime - shortestJob.arrival;
            var waitingTime = turnaroundTime - shortestJob.burst;

            completedTimes.push(completionTime);
            turnaroundTimes.push(turnaroundTime);
            waitingTimes.push(waitingTime);
            processes2.push(processes[shortestIndex]);
            processes.splice(shortestIndex, 1);
    }
    executionLog += " execution completes at time " + time + "<br>"; // Append execution log
    displayExecutionLog(executionLog);
    displayOutput(processes2, completedTimes, turnaroundTimes, waitingTimes);
}

function runRR(processes){
    var quantum = parseInt(document.getElementById("quantum").value);
    var executionLog = "";
    processes.sort((a, b) => {a.arrival - b.arrival;});

        var completionTime = 0;
        var turnaroundTimes = [];
        var waitingTimes = [];
        var completedTimes = [];
        var queue=[];
        var time = 0; 
        var processes2=[];// Initialize the time variable
        
    while (processes.length > 0 || queue.length > 0) {
        for (var i = 0; i < processes.length; i++) {
          var p = processes[i];
          if (p.arrival <= time) {
            queue.push(p);
            processes.splice(i, 1);
            i--;
          }
        }

        if (queue.length > 0) {
          var l = queue.shift();
          if (l.remain <= quantum) {
                
                executionLog += l.p + " executing at time " + time + "<br>"; // Append execution log
                time += l.remain;
                processes2.push(l);
                completionTime=time;
                var turnaroundTime =completionTime-l.arrival;
                var waitingTime = turnaroundTime-l.burst;
                completedTimes.push(completionTime);
                turnaroundTimes.push(turnaroundTime);
                waitingTimes.push(waitingTime);
                l.remain = 0;
            } else {
                
                executionLog += l.p + " executing at time " + time + "<br>"; // Append execution log
                time += quantum;
                l.remain -= quantum;
                queue.push(l);
            }
        } else {
          time++;
        }
    }
        executionLog += " execution completes at time " + time + "<br>"; // Append execution log
        displayExecutionLog(executionLog);
        displayOutput(processes2, completedTimes, turnaroundTimes, waitingTimes);
 }


function runSJRF(processes) {
    var executionLog = "";
    processes.sort((a, b) => a.arrival - b.arrival);
  
    var completionTime = processes[0].arrival;
    var turnaroundTimes = [];
    var waitingTimes = [];
    var completedTimes = [];
    var time = 0;
    var processes2 = [];
  
    while (processes.length > 0) {
      var availableProcesses = processes.filter(p => p.arrival <= time);
  
      if (availableProcesses.length === 0) {
        time++;
        continue;
      }
  
      availableProcesses.sort((a, b) => a.remain - b.remain);
      var shortestJob = availableProcesses[0];
  
      executionLog += shortestJob.p + " executing at time " + (time) + "<br>";
      time++;
     
      shortestJob.remain--;
  
      if (shortestJob.remain === 0) {
        processes2.push(shortestJob);
        var index = processes.indexOf(shortestJob);
        processes.splice(index, 1);
        completionTime=time;
        var turnaroundTime = completionTime - shortestJob.arrival;
        var waitingTime = turnaroundTime - shortestJob.burst;
        completedTimes.push(completionTime);
        turnaroundTimes.push(turnaroundTime);
        waitingTimes.push(waitingTime);
      }

    }
  
    executionLog += "Execution completes at time " + time + "<br>";
    displayExecutionLog(executionLog);
    displayOutput(processes2, completedTimes, turnaroundTimes, waitingTimes);
  }
  

  function runPreemptivePriority(processes) {
    var executionLog = "";
  
    // Sort the processes based on arrival time and priority
    processes.sort((a, b) => {
      if (a.arrival === b.arrival) {
        return a.priority - b.priority;
      } else {
        return a.arrival - b.arrival;
      }
    });
  
    var completionTime = 0;
    var turnaroundTimes = [];
    var waitingTimes = [];
    var completedTimes = [];
    var time = processes[0].arrival;
    var processes2 = []; // Initialize the time variable
    var remainingTime = [];
  
    for (var i = 0; i < processes.length; i++) {
      remainingTime[i] = processes[i].burst;
    }
  
    var totalProcesses = processes.length;
    var executed = 0;
    var currentProcessIndex = -1;
  
    while (executed < totalProcesses) {
      var highestPriority = Infinity;
      var nextProcessIndex = -1;
  
      for (var i = 0; i < processes.length; i++) {
        if (processes[i].arrival <= time && remainingTime[i] > 0 && processes[i].priority < highestPriority) {
          highestPriority = processes[i].priority;
          nextProcessIndex = i;
        }
      }
  
      if (nextProcessIndex === -1) {
        time++;
        continue;
      }
  
      if (nextProcessIndex !== currentProcessIndex) {
        if (currentProcessIndex !== -1) {
          executionLog += processes[currentProcessIndex].p + " executing at time " + time + "<br>";
        }
        currentProcessIndex = nextProcessIndex;
      }
  
      executionLog += processes[currentProcessIndex].p + " executing at time " + time + "<br>";
      remainingTime[currentProcessIndex]--;
      time++;
      completionTime++;
  
      if (remainingTime[currentProcessIndex] === 0) {
        executed++;
        var turnaroundTime = completionTime - processes[currentProcessIndex].arrival;
        var waitingTime = turnaroundTime - processes[currentProcessIndex].burst;
  
        completedTimes.push(completionTime);
        turnaroundTimes.push(turnaroundTime);
        waitingTimes.push(waitingTime);
      }
    }
  
    executionLog += "Execution completes at time " + time + "<br>"; // Append execution log
    displayExecutionLog(executionLog);
    displayOutput(processes, completedTimes, turnaroundTimes, waitingTimes);
  }
  
function runNonPreemptivePriority(processes) {
    var executionLog = "";
  
    processes.sort((a, b) => a.arrival - b.arrival);
  
    var completionTime = processes[0].arrival;
    var turnaroundTimes = [];
    var waitingTimes = [];
    var completedTimes = [];
    var time = 0;
    var processes2 = [];
  
    while (processes.length > 0) {
      var availableProcesses = processes.filter(p => p.arrival <= time);
  
      if (availableProcesses.length === 0) {
        time++;
        continue;
      }
  
      availableProcesses.sort((a, b) => a.priority - b.priority);
      var highestPriorityJob = availableProcesses[0];
  
      executionLog += highestPriorityJob.p + " executing at time " + time + "<br>";
      time += highestPriorityJob.burst;
  
      processes2.push(highestPriorityJob);
      var index = processes.indexOf(highestPriorityJob);
      processes.splice(index, 1);
      completionTime += highestPriorityJob.burst;
  
      var turnaroundTime = completionTime - highestPriorityJob.arrival;
      var waitingTime = turnaroundTime - highestPriorityJob.burst;
      completedTimes.push(completionTime);
      turnaroundTimes.push(turnaroundTime);
      waitingTimes.push(waitingTime);
    }
  
    executionLog += "Execution completes at time " + time + "<br>";
    displayExecutionLog(executionLog);
    displayOutput(processes2, completedTimes, turnaroundTimes, waitingTimes);
  }
    
  
// Add more functions for other algorithms

function displayOutput(processes, completedTimes, turnaroundTimes, waitingTimes) {
  var output = document.getElementById("output");
  output.innerHTML = ""; // Clear previous output if any

  var table = document.createElement("table");
  table.classList.add("table");

  var thead = document.createElement("thead");
  var headerRow = document.createElement("tr");
  headerRow.innerHTML = "<th>Process</th><th>Arrival Time</th><th>Burst Time</th><th>Priority</th><th>Completed Time</th><th>Turnaround Time</th><th>Waiting Time</th>";
  thead.appendChild(headerRow);
  var waitAverage=0;
  var turnAroundAverage=0;
  var tbody = document.createElement("tbody");
  for (var i = 0; i < processes.length; i++) {
    var processRow = document.createElement("tr");
    var executed="";
     waitAverage += waitingTimes[i];
     turnAroundAverage +=turnaroundTimes[i];
    processRow.innerHTML = "<td>" + processes[i].p + "</td>"
        + "<td>" + processes[i].arrival + "</td>"
        + "<td>" + processes[i].burst + "</td>"
        + "<td>" + processes[i].priority + "</td>"
        + "<td>" + completedTimes[i] + "</td>"
        + "<td>" + turnaroundTimes[i] + "</td>"
        + "<td>" + waitingTimes[i] + "</td>";
    tbody.appendChild(processRow);
  }
  executed += "Average Waiting Time " + (waitAverage/processes.length) + "<br>";
  executed += "Average Turnaround Time " + (turnAroundAverage/processes.length) + "<br>";
  displayExecuted(executed);
  table.appendChild(thead);
  table.appendChild(tbody);
  output.appendChild(table);
}
function displayExecutionLog(log) {
    var executionLogElement = document.getElementById("executionLog");
    executionLogElement.innerHTML = log;
  }
  function displayExecuted(executed) {
    var executionLogElement = document.getElementById("Averages");
    executionLogElement.innerHTML = executed;
  }
  
