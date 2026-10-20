const initialStudents = [
  {id:1,name:"Aarav Sharma",email:"aarav.sharma@demo.edu",className:"BCA 3",score:96,attendance:98,color:"lavender"},
  {id:2,name:"Aisha Khan",email:"aisha.khan@demo.edu",className:"BCA 2",score:93,attendance:96,color:"peach"},
  {id:3,name:"Rohan Verma",email:"rohan.verma@demo.edu",className:"BCA 3",score:89,attendance:94,color:"mint"},
  {id:4,name:"Priya Singh",email:"priya.singh@demo.edu",className:"BCA 1",score:88,attendance:97,color:"pink"},
  {id:5,name:"Kabir Gupta",email:"kabir.gupta@demo.edu",className:"BCA 2",score:86,attendance:91,color:"sky"},
  {id:6,name:"Meera Patel",email:"meera.patel@demo.edu",className:"BCA 1",score:84,attendance:93,color:"mint"},
  {id:7,name:"Arjun Mishra",email:"arjun.mishra@demo.edu",className:"BCA 3",score:82,attendance:89,color:"peach"},
  {id:8,name:"Sana Ali",email:"sana.ali@demo.edu",className:"BCA 2",score:80,attendance:92,color:"pink"},
  {id:9,name:"Dev Malhotra",email:"dev.malhotra@demo.edu",className:"BCA 1",score:76,attendance:88,color:"sky"},
  {id:10,name:"Ishita Rao",email:"ishita.rao@demo.edu",className:"BCA 3",score:72,attendance:86,color:"lavender"},
  {id:11,name:"Rehan Ahmed",email:"rehan.ahmed@demo.edu",className:"BCA 2",score:67,attendance:79,color:"mint"},
  {id:12,name:"Tanya Das",email:"tanya.das@demo.edu",className:"BCA 1",score:61,attendance:74,color:"peach"}
];
const colors = {lavender:"#eeeaff;color:#7165c9",peach:"#fff0e4;color:#c47b45",mint:"#e4f7ef;color:#319b76",pink:"#ffeaf0;color:#c55e82",sky:"#e5f2ff;color:#4d8ac2"};
let students = loadStudents();
let sortState = {key:"score",direction:"desc"};
let previousTerm = false;
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
function loadStudents(){try{const saved=localStorage.getItem("classwise-students");return saved?JSON.parse(saved):initialStudents.map(s=>({...s}));}catch{return initialStudents.map(s=>({...s}));}}
function saveStudents(){try{localStorage.setItem("classwise-students",JSON.stringify(students));}catch{showToast("Browser storage is unavailable. Changes may not persist.");}}
function grade(score){return score>=85?"A":score>=75?"B":score>=60?"C":"D";}
function initials(name){return name.trim().split(/\s+/).slice(0,2).map(part=>part[0]).join("").toUpperCase();}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function average(items,key){return items.length?items.reduce((sum,item)=>sum+Number(item[key]||0),0)/items.length:0;}
function updateStats(){
  $("#totalStudents").textContent=students.length;
  $("#navStudentCount").textContent=students.length;
  $("#averageScore").textContent=average(students,"score").toFixed(1);
  $("#averageAttendance").textContent=average(students,"attendance").toFixed(1);
  $("#needsAttention").textContent=students.filter(s=>s.score<70||s.attendance<80).length;
  $("#gradeTotal").textContent=students.length;
}
function renderChart(){
  const subjects = previousTerm
    ? [{name:"UI/UX",score:79},{name:"Python",score:76},{name:"DBMS",score:82},{name:"Web Dev",score:86},{name:"Maths",score:73},{name:"English",score:88}]
    : [{name:"UI/UX",score:88},{name:"Python",score:82},{name:"DBMS",score:91},{name:"Web Dev",score:86},{name:"Maths",score:76},{name:"English",score:90}];
  $("#subjectChart").innerHTML=subjects.map(subject=>`<div class="bar-group" title="${subject.name}: ${subject.score}%"><div class="bar-track"><div class="bar-fill" style="height:${subject.score}%"><span class="bar-value">${subject.score}</span></div></div><span class="bar-label">${subject.name}</span></div>`).join("");
}
function renderGrades(){
  const counts={A:0,B:0,C:0,D:0};
  students.forEach(s=>counts[grade(s.score)]++);
  const total=students.length||1;
  const colorsByGrade={A:"#6269e7",B:"#9a83ed",C:"#f2b85d",D:"#dce1eb"};
  let cursor=0;
  const segments=["A","B","C","D"].map(key=>{const start=cursor;cursor+=counts[key]/total*100;return `${colorsByGrade[key]} ${start}% ${cursor}%`;});
  $("#gradeDonut").style.background=`conic-gradient(${segments.join(",")})`;
  $("#gradeLegend").innerHTML=["A","B","C","D"].map(key=>`<div class="grade-item"><i class="grade-${key.toLowerCase()}"></i><span>Grade ${key}</span><strong>${counts[key]}</strong></div>`).join("");
  const top=["A","B","C","D"].sort((a,b)=>counts[b]-counts[a])[0];
  $("#topGradeText").textContent=students.length?`Grade ${top} is the largest group (${counts[top]} student${counts[top]===1?"":"s"})`:"No students yet";
}
function renderAttendance(){
  const classes=["BCA 1","BCA 2","BCA 3"];
  $("#attendanceRows").innerHTML=classes.map(className=>{
    const list=students.filter(s=>s.className===className), value=average(list,"attendance");
    return `<div><div class="attendance-row-head"><span>${className} <span style="color:#a1a8b7">· ${list.length} students</span></span><strong>${list.length?value.toFixed(1):"0.0"}%</strong></div><div class="attendance-track"><div class="attendance-fill" style="width:${list.length?value:0}%"></div></div></div>`;
  }).join("");
}
function getFilteredStudents(){
  const query=$("#searchInput").value.trim().toLowerCase(), className=$("#classFilter").value, gradeValue=$("#gradeFilter").value;
  return students.filter(s=>(s.name.toLowerCase().includes(query)||s.email.toLowerCase().includes(query))&&(className==="all"||s.className===className)&&(gradeValue==="all"||grade(s.score)===gradeValue))
    .sort((a,b)=>{const av=a[sortState.key],bv=b[sortState.key];const result=typeof av==="string"?av.localeCompare(bv):av-bv;return result*sortState.direction;});
}
function renderTable(){
  const filtered=getFilteredStudents();
  $("#studentTableBody").innerHTML=filtered.map(s=>{
    const g=grade(s.score), support=s.score<70||s.attendance<80;
    return `<tr>
      <td><div class="student-cell"><div class="student-avatar" style="background:${(colors[s.color]||colors.lavender).split(";")[0]};${(colors[s.color]||colors.lavender).split(";")[1]}">${escapeHTML(initials(s.name))}</div><div><div class="student-name">${escapeHTML(s.name)}</div><div class="student-email">${escapeHTML(s.email)}</div></div></div></td>
      <td><span class="class-chip">${escapeHTML(s.className)}</span></td>
      <td><div class="score-cell"><span class="score-number">${s.score}%</span><span class="tiny-progress"><i style="width:${s.score}%"></i></span></div></td>
      <td><span class="attendance-number ${s.attendance<80?"low":""}">${s.attendance}%</span></td>
      <td><span class="grade-pill grade-${g}">${g}</span></td>
      <td><span class="status-pill ${support?"status-review":"status-on-track"}">${support?"Needs support":"On track"}</span></td>
      <td><button class="row-menu" data-student-menu="${s.id}" aria-label="Delete ${escapeHTML(s.name)}" title="Delete student">•••</button></td>
    </tr>`;
  }).join("");
  $("#emptyState").classList.toggle("hidden",filtered.length!==0);
  $("#tableCount").textContent=`Showing ${filtered.length} of ${students.length} student${students.length===1?"":"s"}`;
}
function renderAll(){updateStats();renderChart();renderGrades();renderAttendance();renderTable();}
let toastTimer;
function showToast(message){const toast=$("#toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);}
function openModal(){$("#studentModal").classList.remove("hidden");$("#studentForm").elements.name.focus();}
function closeModal(){$("#studentModal").classList.add("hidden");$("#studentForm").reset();}
function exportCSV(){
  const headers=["Name","Email","Class","Average Score","Attendance","Grade","Status"];
  const rows=students.map(s=>[s.name,s.email,s.className,s.score,s.attendance,grade(s.score),(s.score<70||s.attendance<80)?"Needs support":"On track"]);
  const csv=[headers,...rows].map(row=>row.map(value=>`"${String(value).replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="classwise-student-report.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);showToast("Student report exported as CSV.");
}
$("#searchInput").addEventListener("input",renderTable);
$("#classFilter").addEventListener("change",renderTable);
$("#gradeFilter").addEventListener("change",renderTable);
$("#chartPeriod").addEventListener("change",event=>{previousTerm=event.target.value==="previous";renderChart();});
$("#addStudentBtn").addEventListener("click",openModal);
$("#closeModalBtn").addEventListener("click",closeModal);
$("#cancelModalBtn").addEventListener("click",closeModal);
$("#studentModal").addEventListener("click",event=>{if(event.target===$("#studentModal"))closeModal();});
document.addEventListener("keydown",event=>{if(event.key==="Escape"){closeModal();$("#sidebar").classList.remove("open");}});
$("#studentForm").addEventListener("submit",event=>{
  event.preventDefault();
  const form=new FormData(event.currentTarget),name=String(form.get("name")).trim(),score=Number(form.get("score")),attendance=Number(form.get("attendance"));
  if(!name||!Number.isFinite(score)||!Number.isFinite(attendance)||score<0||score>100||attendance<0||attendance>100){showToast("Enter a name and valid percentages from 0 to 100.");return;}
  const id=students.length?Math.max(...students.map(s=>s.id))+1:1;
  students.unshift({id,name,email:`${name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,".").replace(/^\.+|\.+$/g,"")}@demo.edu`,className:form.get("className"),score,attendance,color:["lavender","peach","mint","pink","sky"][id%5]});
  saveStudents();renderAll();closeModal();$("#searchInput").value="";$("#classFilter").value="all";$("#gradeFilter").value="all";renderTable();showToast(`${name} added successfully.`);
});
$("#exportBtn").addEventListener("click",exportCSV);
$("#clearFiltersBtn").addEventListener("click",()=>{$("#searchInput").value="";$("#classFilter").value="all";$("#gradeFilter").value="all";renderTable();showToast("Filters reset.");});
$$("[data-sort]").forEach(button=>button.addEventListener("click",()=>{
  const key=button.dataset.sort;
  sortState={key,direction:sortState.key===key?-sortState.direction:(key==="name"?1:-1)};
  renderTable();
}));
$("#studentTableBody").addEventListener("click",event=>{
  const button=event.target.closest("[data-student-menu]");if(!button)return;
  const student=students.find(s=>s.id===Number(button.dataset.studentMenu));if(!student)return;
  if(confirm(`Remove ${student.name} from this demo dashboard?`)){students=students.filter(s=>s.id!==student.id);saveStudents();renderAll();showToast("Student removed.");}
});
$("#showSupportBtn").addEventListener("click",()=>{
  $("#searchInput").value="";$("#classFilter").value="all";$("#gradeFilter").value="all";renderTable();
  const needs=students.filter(s=>s.score<70||s.attendance<80);
  if(!needs.length){showToast("No students currently need extra support.");return;}
  $("#gradeFilter").value="all";
  const supportIds=new Set(needs.map(s=>s.id));
  $("#studentTableBody").innerHTML=needs.sort((a,b)=>a.score-b.score).map(s=>{
    const g=grade(s.score),support=true;
    return `<tr><td><div class="student-cell"><div class="student-avatar" style="background:${(colors[s.color]||colors.lavender).split(";")[0]};${(colors[s.color]||colors.lavender).split(";")[1]}">${escapeHTML(initials(s.name))}</div><div><div class="student-name">${escapeHTML(s.name)}</div><div class="student-email">${escapeHTML(s.email)}</div></div></div></td><td><span class="class-chip">${escapeHTML(s.className)}</span></td><td><div class="score-cell"><span class="score-number">${s.score}%</span><span class="tiny-progress"><i style="width:${s.score}%"></i></span></div></td><td><span class="attendance-number low">${s.attendance}%</span></td><td><span class="grade-pill grade-${g}">${g}</span></td><td><span class="status-pill status-review">Needs support</span></td><td><button class="row-menu" data-student-menu="${s.id}" aria-label="Delete ${escapeHTML(s.name)}">•••</button></td></tr>`;
  }).join("");
  $("#emptyState").classList.add("hidden");$("#tableCount").textContent=`Showing ${needs.length} students needing support`;$("#students").scrollIntoView({behavior:"smooth"});showToast(`${needs.length} student${needs.length===1?"":"s"} flagged for support.`);
});
$("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$$(".nav-item").forEach(link=>link.addEventListener("click",()=>$("#sidebar").classList.remove("open")));
renderAll();
