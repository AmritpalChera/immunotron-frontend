"use client";
import Image from "next/image";
import backend from "./axiox";
import { useEffect, useState } from "react";

export default function Home() {

  const [message, setMessage] = useState('Ready!');

  const sendInjectCommand = async () => {
    const data = await backend.post('/injection').then(res => res.data).catch(err => err.response.data);
    console.log('Returned: ', data);
  }

  const getDisplayMessage = (encodedString: string) => {
    let message = "";
    if (encodedString === "idle") {
      message = "Ready!";
    }
    else if (encodedString === "determine_injection_location") {
      message = "Analyzing";
    }
    else if (encodedString === "vaccine_delivery") {
      message = "Injecting Vaccine";
    }
    else if (encodedString === "vaccine_disposal") {
      message = "Disposing Vaccine";
    }
    else if (encodedString === "error") {
      message = "Error";
    }
    else if (encodedString === "vaccine_retreival") {
      message = "Retreiving Vaccine";
    }
    message && setMessage(message);
  }

  const getUpdatedData = async () => {
    const data = await backend.get('/state').then(res => res?.data).catch(err => {});
    data && console.log("data is: ", data);
    if (data?.state) getDisplayMessage(data.state);
  }

  useEffect(() => {
    const intervalId = setInterval(getUpdatedData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const engagePlunger = () => backend.post('/engage_plunger');
  const retractPlunger = () => backend.post('/retract_plunger');
  const engageDisposal = () => backend.post('/engage_disposal');
  const retractDisposal = () => backend.post('/retract_disposal');
  
  const clearError = () => backend.post('/clear_error');
  



  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <b className="text-3xl">Immunotron</b>
        <p className="mt-8 text-green-600 font-bold">{message}</p>
      </div>
      
      <button onClick={sendInjectCommand} className="bg-green-500 px-8 w-64 py-4 rounded">Inject</button>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <button onClick={engagePlunger} className="bg-purple-300 md:w-48 px-8 py-4 rounded">Engage Plunger</button>
          <button onClick={retractPlunger} className="bg-purple-300 md:w-48 px-8 py-4 rounded">Retract Plunger</button>
        </div>
        
        <div className="flex gap-4">
          <button onClick={engageDisposal} className="bg-purple-300 md:w-48 px-8 py-4 rounded">Engage Disposal</button>
          <button onClick={retractDisposal} className="bg-purple-300 md:w-48 px-8 py-4 rounded">Retract Disposal</button>
        </div>
       
      </div>
      <button onClick={clearError} className="bg-red-500 px-8 w-64 py-4 rounded">Clear Error</button>
    </main>
  );
}
