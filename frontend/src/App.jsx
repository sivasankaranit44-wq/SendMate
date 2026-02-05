import { useState } from 'react'
import axios from 'axios'
import * as XLSX from "xlsx"
import './App.css'

function App() {
 const [msg, setMsg] = useState("")
 const [status, setstatus] = useState("")
 const [emailList, setEmailList] = useState("")

 function handleMsg(e){
  setMsg(e.target.value)
 }

  function handleFile(event)
  {
    const file = event.target.files[0]
  console.log(file)

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: 'binary' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})
    const totalemail = emailList.map(function(item){return item.A})
    console.log(totalemail)
    setEmailList(totalemail)
    
  }

  reader.readAsBinaryString(file);
  }
    function send()
  {
    setstatus(true)
    axios.post("http://localhost:5000/sendmails",{msg:msg,emailList:emailList})
    .then(function(response)
    {
      if(response.data.success=== true)
      {
        alert("Email Sent Successfully")
        setstatus(false)
      }
      else{
        alert("Failed")
        setstatus(false)
      }
    })
  }

  return (
    <>
   
      <div className="min-h-screen bg-slate-100">
      <div className="bg-slate-800 text-white text-center py-4">
        <h1 className="text-3xl font-bold tracking-wide">SendMate</h1>
      </div>

      <div className="bg-slate-700 text-gray-200 text-center py-2">
        <p className="text-sm tracking-wide">Built on consent, not spam.</p>
      </div>

      <div className="text-center mt-6">
        <p className="text-lg font-semibold text-slate-700">
          Drag & Drop your Excel file
        </p>
      </div>

      <div className="bg-slate-200 text-black text-center py-6 mt-4">
        <textarea
          onChange={handleMsg}
          value={msg}
          className="w-[80%] max-w-3xl h-32 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-600"
          placeholder="Enter email message here..."
        />

        <div className="mt-4">
          <input
            type="file"
            onChange={handleFile}
            className="border-2 border-dashed border-slate-400 rounded-xl py-4 px-6 cursor-pointer hover:bg-slate-100"
          />
        </div>

        <p className="mt-3 text-sm text-slate-600">
          Total Emails Loaded: {emailList.length}
        </p>

        <button
          onClick={send}
          className="mt-4 bg-slate-800 text-white px-8 py-2 rounded-xl hover:bg-slate-900 transition cursor-pointer"
          disabled={status}
        >
          {status ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
      
    </>
  )
}

export default App
