import * as React from "react";
import { A8FormRenderer, getValues } from "a8forms";
import "../node_modules/a8forms/dist/index.css";
import { useState } from "react";
// import "../node_modules/a8forms/src/assets/css/bootstrap.css"

const fieldsJson = "W3siaWQiOiJ0YWItMCIsInR5cGUiOiJUYWJCYXIiLCJuYW1lIjoiVGFiIDEiLCJ0YWJLZXkiOiJud2Jtazl4bXkiLCJ2aXNpYmlsaXR5Ijp0cnVlLCJmaWVsZHMiOlt7InR5cGUiOiJJbnB1dCIsInNpemUiOiJjb2wtbWQtNCIsInN0eWxlIjp7fSwicHJvcGVydGllcyI6eyJjYXRlZ29yeSI6ImVtYWlsIiwibGFiZWwiOiJGaXJzdCBOYW1lIiwicGxhY2Vob2xkZXIiOiJGaXJzdCBOYW1lIn0sImxhYmVsIjoiRW1haWwiLCJpZCI6InRhYi0wI2VtYWlsLTAiLCJlbGVtZW50SWQiOiJvYmhwYXF5cngiLCJiaW5kIjoiZmlyc3RuYW1lIn0seyJ0eXBlIjoiSW5wdXQiLCJzaXplIjoiY29sLW1kLTQiLCJzdHlsZSI6e30sInByb3BlcnRpZXMiOnsiY2F0ZWdvcnkiOiJ0ZXh0IiwibGFiZWwiOiJMYXN0IE5hbWUiLCJwbGFjZWhvbGRlciI6Ikxhc3QgTmFtZSJ9LCJsYWJlbCI6Ik5hbWUiLCJpZCI6InRhYi0wI25hbWUtMiIsImVsZW1lbnRJZCI6InNybzkxNDh0biIsImJpbmQiOiJsYXN0bmFtZSJ9LHsidHlwZSI6IklucHV0Iiwic2l6ZSI6ImNvbC1tZC0xMiIsInN0eWxlIjp7fSwicHJvcGVydGllcyI6eyJjYXRlZ29yeSI6ImVtYWlsIiwibGFiZWwiOiJFbWFpbCIsInBsYWNlaG9sZGVyIjoiRW1haWwifSwibGFiZWwiOiJFbWFpbCIsImlkIjoidGFiLTAjZW1haWwtMSIsImVsZW1lbnRJZCI6IjQ3eGNwaXc3MSIsImJpbmQiOiJlbWFpbCIsInZhbGlkYXRlIjp7ImZ1biI6IihpbnB1dERhdGEpID0+IHtcbiAgICBsZXQgaXNWYWxpZCA9IFwiXCI7XG4gICAgLy95b3UgY2FuIHJldHVybiBlcnJvciBtZXNzYWdlIGlmIHRoZSB2YWxpZGF0aW9uIGZhaWxzLlxuICAgIC8vIFN0YXJ0IG9mIGVkaXRhYmxlIGFyZWFcbiAgICBpZighaW5wdXREYXRhKXtcbiAgICAgICAgaXNWYWxpZCA9ICBcIlJlcXVpcmVkXCI7XG4gICAgfWVsc2UgaWYoIS9eW1xcdy1cXC5dK0AoW1xcdy1dK1xcLikrW1xcdy1dezIsNH0kLy50ZXN0KGlucHV0RGF0YSkpe1xuICAgICAgICBpc1ZhbGlkID0gXCJJbnZhbGlkIEVtYWlsXCJcbiAgICB9XG4gICAgLy8gRW5kIG9mIGVkaXRhYmxlIGFyZWFcbiAgICByZXR1cm4gaXNWYWxpZDtcbn0ifX0seyJ0eXBlIjoiSW5wdXQiLCJzaXplIjoiY29sLW1kLTYiLCJzdHlsZSI6e30sInByb3BlcnRpZXMiOnsiY2F0ZWdvcnkiOiJudW1iZXIiLCJsYWJlbCI6Ik1vYmlsZSIsInBsYWNlaG9sZGVyIjoiTW9iaWxlIE51bWJlciJ9LCJsYWJlbCI6Ik51bWJlciIsImlkIjoidGFiLTAjbmFtZS0zIiwiZWxlbWVudElkIjoia2ZlNHQ4ZWp6IiwiYmluZCI6Im1vYmlsZSJ9XSwiYmFja2dyb3VuZENvbG9yIjoiI2ZmYmNlMyIsImJhY2tncm91bmRJbWFnZSI6bnVsbH1d";

const fieldsJson2 = "W3siaWQiOiJ0YWItMCIsInR5cGUiOiJUYWJCYXIiLCJuYW1lIjoiVGFiIDEiLCJ0YWJLZXkiOiJ5aTI3ZTVhcGoiLCJ2aXNpYmlsaXR5Ijp0cnVlLCJmaWVsZHMiOlt7InR5cGUiOiJTZWxlY3QiLCJzaXplIjoiY29sLW1kLTYiLCJzdHlsZSI6e30sInByb3BlcnRpZXMiOnsibGFiZWwiOiJHZW5kZXIiLCJwbGFjZWhvbGRlciI6IkdlbmRlciJ9LCJkYXRhIjp7Im9wdGlvbnMiOlt7ImxhYmVsIjoiTWFsZSIsInZhbHVlIjoibWFsZSIsImlkIjoxfSx7ImxhYmVsIjoiRmVtYWxlIiwidmFsdWUiOiJmZW1hbGUiLCJpZCI6Mn0seyJsYWJlbCI6Ik90aGVycyIsInZhbHVlIjoib3RoZXJzIiwiaWQiOjN9XX0sImZpZWxkcyI6W10sImxhYmVsIjoiU2VsZWN0IiwiaWQiOiJ0YWItMCNkcm9wZG93bi0wIiwiZWxlbWVudElkIjoiaTJzYmsxY3h6IiwiYmluZCI6ImdlbmRlciJ9LHsidHlwZSI6IkRhdGVQaWNrZXIiLCJzaXplIjoiY29sLW1kLTQiLCJzdHlsZSI6e30sInByb3BlcnRpZXMiOnsic2hvd0RhdGUiOnRydWUsImxhYmVsIjoiRGF0ZSBvZiBCaXJ0aCIsInBsYWNlaG9sZGVyIjoiRGF0ZSBvZiBCaXJ0aCIsImZvcm1hdCI6ImRkLW1tLXl5eXkifSwibGFiZWwiOiJEYXRlUGlja2VyIiwiaWQiOiJ0YWItMCNkYXRlUGlja2VyLTEiLCJlbGVtZW50SWQiOiJudm5tdmdsemwiLCJiaW5kIjoiZG9iIn0seyJ0eXBlIjoiSW5wdXQiLCJzaXplIjoiY29sLW1kLTQiLCJzdHlsZSI6e30sInByb3BlcnRpZXMiOnsiY2F0ZWdvcnkiOiJudW1iZXIiLCJsYWJlbCI6IkFnZSIsInBsYWNlaG9sZGVyIjoiQWdlIn0sImxhYmVsIjoiTnVtYmVyIiwiaWQiOiJ0YWItMCNuYW1lLTIiLCJlbGVtZW50SWQiOiJqbDl0NDlrb2IiLCJiaW5kIjoiYWdlIn0seyJ0eXBlIjoiSW5wdXQiLCJzaXplIjoiY29sLW1kLTYiLCJzdHlsZSI6e30sInByb3BlcnRpZXMiOnsiY2F0ZWdvcnkiOiJlbWFpbCIsImxhYmVsIjoiRW1haWwiLCJwbGFjZWhvbGRlciI6IkVtYWlsIn0sImxhYmVsIjoiRW1haWwiLCJpZCI6InRhYi0wI2VtYWlsLTQiLCJlbGVtZW50SWQiOiJtcnJreTAybWIiLCJiaW5kIjoiZW1haWwifSx7InR5cGUiOiJJbnB1dCIsInNpemUiOiJjb2wtbWQtMTIiLCJzdHlsZSI6e30sInByb3BlcnRpZXMiOnsiY2F0ZWdvcnkiOiJ0ZXh0YXJlYSIsImxhYmVsIjoiQWRkcmVzcyIsInBsYWNlaG9sZGVyIjoiQWRkcmVzcyJ9LCJsYWJlbCI6Ik11bHRpIExpbmUiLCJpZCI6InRhYi0wI25hbWUtMyIsImVsZW1lbnRJZCI6InRnMDJkMjJvbiIsImJpbmQiOiJhZGRyZXNzIn1dLCJiYWNrZ3JvdW5kQ29sb3IiOiIjYjM5NGY2IiwiYmFja2dyb3VuZEltYWdlIjpudWxsfV0=";
const fieldsJson3 = "W3siaWQiOiJ0YWItMCIsInR5cGUiOiJUYWJCYXIiLCJuYW1lIjoiVGFiIDEiLCJ0YWJLZXkiOiJ0ZGthYXdhZ2ciLCJ2aXNpYmlsaXR5Ijp0cnVlLCJmaWVsZHMiOlt7InR5cGUiOiJJbnB1dCIsInNpemUiOiJjb2wtbWQtNCIsInN0eWxlIjp7fSwicHJvcGVydGllcyI6eyJjYXRlZ29yeSI6InRleHQiLCJsYWJlbCI6IlByZWZpeCIsInBsYWNlaG9sZGVyIjoiTXIuIC8gTXMuIn0sImxhYmVsIjoiU2luZ2xlIExpbmUiLCJpZCI6InRhYi0wI25hbWUtNiIsImVsZW1lbnRJZCI6Im5md2hpZnZxdSIsImJpbmQiOiJwcmVmaXgifSx7InR5cGUiOiJJbnB1dCIsInNpemUiOiJjb2wtbWQtNCIsInN0eWxlIjp7fSwicHJvcGVydGllcyI6eyJjYXRlZ29yeSI6InRleHQiLCJsYWJlbCI6IkZpcnN0IE5hbWUiLCJwbGFjZWhvbGRlciI6IkZpcnN0IE5hbWUifSwibGFiZWwiOiJOYW1lIiwiaWQiOiJ0YWItMCNuYW1lLTEiLCJlbGVtZW50SWQiOiJxNGV6YWpoN3AiLCJiaW5kIjoiZmlyc3ROYW1lIn0seyJ0eXBlIjoiSW5wdXQiLCJzaXplIjoiY29sLW1kLTQiLCJzdHlsZSI6e30sInByb3BlcnRpZXMiOnsiY2F0ZWdvcnkiOiJ0ZXh0IiwibGFiZWwiOiJMYXN0IE5hbWUiLCJwbGFjZWhvbGRlciI6Ikxhc3QgTmFtZSJ9LCJsYWJlbCI6Ik5hbWUiLCJpZCI6InRhYi0wI25hbWUtMiIsImVsZW1lbnRJZCI6Im84bnh6MW8zNyIsImJpbmQiOiJsYXN0TmFtZSJ9LHsidHlwZSI6IklucHV0Iiwic2l6ZSI6ImNvbC1tZC0xMiIsInN0eWxlIjp7fSwicHJvcGVydGllcyI6eyJjYXRlZ29yeSI6ImVtYWlsIiwibGFiZWwiOiJFbWFpbCIsInBsYWNlaG9sZGVyIjoidXNlcm5hbWVAYXV0b25vbTguY29tIn0sImxhYmVsIjoiRW1haWwiLCJpZCI6InRhYi0wI2VtYWlsLTMiLCJlbGVtZW50SWQiOiJxZzJubG5tNGEiLCJ2YWxpZGF0ZSI6IihpbnB1dERhdGEpID0+IHtcbiAgICBsZXQgaXNWYWxpZCA9IFwiXCI7XG4gICAgLy95b3UgY2FuIHJldHVybiBlcnJvciBtZXNzYWdlIGlmIHRoZSB2YWxpZGF0aW9uIGZhaWxzLlxuICAgIC8vIFN0YXJ0IG9mIGVkaXRhYmxlIGFyZWFcbiAgICBjb25zdCBlbWFpbFJlZ2V4ID0gL14oKFtePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSsoXFwuW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKykqKXwoXCIuK1wiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XSl8KChbYS16QS1aXFwtMC05XStcXC4pK1thLXpBLVpdezIsfSkpJC87XG4gICAgaWYoIWVtYWlsUmVnZXgudGVzdChpbnB1dERhdGEpKSB7XG4gICAgICAgIGlzVmFsaWQgPSBcIkVudGVyIGEgdmFsaWQgZW1haWxcIjtcbiAgICB9XG4gICAgLy8gRW5kIG9mIGVkaXRhYmxlIGFyZWFcbiAgICByZXR1cm4gaXNWYWxpZDtcbn0iLCJiaW5kIjoiZW1haWwifSx7InR5cGUiOiJJbnB1dCIsInNpemUiOiJjb2wtbWQtMTIiLCJzdHlsZSI6e30sInByb3BlcnRpZXMiOnsiY2F0ZWdvcnkiOiJudW1iZXIiLCJsYWJlbCI6IlBob25lIiwicGxhY2Vob2xkZXIiOiJFbnRlciB5b3VyIHBob25lIG51bWJlciJ9LCJsYWJlbCI6Ik51bWJlciIsImlkIjoidGFiLTAjbmFtZS00IiwiZWxlbWVudElkIjoiemxjNm43aGVpIiwidmFsaWRhdGUiOiIoaW5wdXREYXRhKSA9PiB7XG4gICAgbGV0IGlzVmFsaWQgPSBcIlwiO1xuICAgIC8veW91IGNhbiByZXR1cm4gZXJyb3IgbWVzc2FnZSBpZiB0aGUgdmFsaWRhdGlvbiBmYWlscy5cbiAgICAvLyBTdGFydCBvZiBlZGl0YWJsZSBhcmVhXG4gICAgY29uc3QgaW5kaWFuUGhvbmVSZWdleCA9IC9eKD86KD86XFwrfDB7MCwyfSk5MShcXHMqW1xcLV1cXHMqKT98WzBdPyk/WzY3ODldXFxkezl9JC87XG4gICAgaWYoIWluZGlhblBob25lUmVnZXgudGVzdChpbnB1dERhdGEpKSB7XG4gICAgICAgIGlzVmFsaWQgPSBcIkVudGVyIGEgdmFsaWQgcGhvbmUgbnVtYmVyXCI7XG4gICAgfVxuICAgIC8vIEVuZCBvZiBlZGl0YWJsZSBhcmVhXG4gICAgcmV0dXJuIGlzVmFsaWQ7XG59IiwiYmluZCI6InBob25lIn0seyJ0eXBlIjoiTGFiZWwiLCJzaXplIjoiY29sLW1kLTEyIiwic3R5bGUiOnt9LCJwcm9wZXJ0aWVzIjp7ImxhYmVsIjoiQWRkcmVzcyJ9LCJmaWVsZHMiOltdLCJsYWJlbCI6IkxhYmVsIiwiaWQiOiJ0YWItMCNsYWJlbC0xMiIsImVsZW1lbnRJZCI6ImJ0aXpuMjdvOSJ9LHsidHlwZSI6IklucHV0Iiwic2l6ZSI6ImNvbC1tZC02Iiwic3R5bGUiOnt9LCJwcm9wZXJ0aWVzIjp7ImNhdGVnb3J5IjoidGV4dCIsImxhYmVsIjoiU3RyZWV0IEFkZHJlc3MifSwibGFiZWwiOiJTaW5nbGUgTGluZSIsImlkIjoidGFiLTAjbmFtZS03IiwiZWxlbWVudElkIjoiYWw0ZGY2cjd2IiwiYmluZCI6ImFkZHJlc3NfbGluZTEifSx7InR5cGUiOiJJbnB1dCIsInNpemUiOiJjb2wtbWQtNiIsInN0eWxlIjp7fSwicHJvcGVydGllcyI6eyJjYXRlZ29yeSI6InRleHQiLCJsYWJlbCI6IlN0cmVldCBBZGRyZXNzIGxpbmUgMiJ9LCJsYWJlbCI6IlNpbmdsZSBMaW5lIiwiaWQiOiJ0YWItMCNuYW1lLTgiLCJlbGVtZW50SWQiOiJ2MGRtb2s4cGQiLCJiaW5kIjoiYWRkcmVzc19saW5lMiJ9LHsidHlwZSI6IklucHV0Iiwic2l6ZSI6ImNvbC1tZC00Iiwic3R5bGUiOnt9LCJwcm9wZXJ0aWVzIjp7ImNhdGVnb3J5IjoidGV4dCIsImxhYmVsIjoiQ2l0eSIsInBsYWNlaG9sZGVyIjoiQ2l0eSJ9LCJsYWJlbCI6IlNpbmdsZSBMaW5lIiwiaWQiOiJ0YWItMCNuYW1lLTkiLCJlbGVtZW50SWQiOiIzdzdhbmJybjgiLCJiaW5kIjoiYWRkcmVzc19jaXR5In0seyJ0eXBlIjoiSW5wdXQiLCJzaXplIjoiY29sLW1kLTQiLCJzdHlsZSI6e30sInByb3BlcnRpZXMiOnsiY2F0ZWdvcnkiOiJ0ZXh0IiwibGFiZWwiOiJTdGF0ZSAvIFByb3ZpbmNlIn0sImxhYmVsIjoiU2luZ2xlIExpbmUiLCJpZCI6InRhYi0wI25hbWUtMTAiLCJlbGVtZW50SWQiOiJzb25iOWRjYXYiLCJiaW5kIjoiYWRkcmVzc19zdGF0ZSJ9LHsidHlwZSI6IklucHV0Iiwic2l6ZSI6ImNvbC1tZC00Iiwic3R5bGUiOnt9LCJwcm9wZXJ0aWVzIjp7ImNhdGVnb3J5IjoidGV4dCIsImxhYmVsIjoiWmlwIn0sImxhYmVsIjoiU2luZ2xlIExpbmUiLCJpZCI6InRhYi0wI25hbWUtMTEiLCJlbGVtZW50SWQiOiI3aG5keGxyeGUiLCJiaW5kIjoiYWRkcmVzc196aXAifSx7InR5cGUiOiJTZWxlY3QiLCJzaXplIjoiY29sLW1kLTQiLCJzdHlsZSI6e30sInByb3BlcnRpZXMiOnsibGFiZWwiOiJNb2RlIG9mIHRyYW5zcG9ydCJ9LCJkYXRhIjp7Im9wdGlvbnMiOlt7ImxhYmVsIjoiQUJDIiwidmFsdWUiOiJhYmNkIiwiaWQiOjF9LHsibGFiZWwiOiJDYXIiLCJ2YWx1ZSI6ImNhciIsImlkIjoyfSx7ImxhYmVsIjoiQmlrZSIsInZhbHVlIjoiYmlrZSIsImlkIjozfV19LCJmaWVsZHMiOltdLCJsYWJlbCI6IlNlbGVjdCIsImlkIjoidGFiLTAjZHJvcGRvd24tMTMiLCJlbGVtZW50SWQiOiJ4Z3lsd3U0OWMiLCJiaW5kIjoidmVoaWNsZSJ9XSwiYmFja2dyb3VuZENvbG9yIjoiI2ZhZmFmYSIsImJhY2tncm91bmRJbWFnZSI6bnVsbH1d"
// const fieldsJson = [
//     {
//         "id": "tab-0",
//         "type": "TabBar",
//         "name": "Tab 1",
//         "visibility": true,
//         "fields": [
//             // {
//             //     "type": "Section",
//             //     "size": "col-md-12",
//             //     "style": {

//             //     },
//             //     "properties": {
//             //         "label": "Basic Details"
//             //     },
//             //     "fields": [
//             {
//                 "type": "Input",
//                 "size": "col-md-4",
//                 "style": {

//                 },
//                 "properties": {
//                     "category": "text",
//                     "label": "Name"
//                 },
//                 "label": "Name",
//                 "id": "tab-0#section-0#name-0"
//             },
//             {
//                 "type": "Input",
//                 "size": "col-md-4",
//                 "style": {

//                 },
//                 "properties": {
//                     "category": "email",
//                     "label": "Email"
//                 },
//                 "label": "Email",
//                 "id": "tab-0#section-0#email-1"
//             },
//             {
//                 "type": "Input",
//                 "size": "col-md-4",
//                 "style": {

//                 },
//                 "properties": {
//                     "category": "email",
//                     "label": "Email - 2"
//                 },
//                 "label": "Email",
//                 "id": "tab-0#section-0#email-2"
//             }
//             //     ],
//             //     "label": "Section",
//             //     "id": "tab-0#section-0"
//             // }
//         ]
//     }
// ]

const Studio = (props) => {
   const [loading, setLoading] = useState(false);
   const handleRenderForms = (jsonObject) => {
      A8FormRenderer("forms", {
         findFields: jsonObject,
         token: "",
         taskVariables: { "firstname": { "type": "String", "value": "Mohamed Nadheem" }, "startedBy": { "type": "String", "value": "superAdmin", "valueInfo": {} }, "funcaddserver": { "type": "String", "value": "serverPradeep", "valueInfo": {} }, "inputserver": { "type": "String", "value": "serverPradeepUPDATE", "valueInfo": {} }, "StartprocessGeolocation": { "type": "String", "value": "{\"user\":\"superAdmin\",\"coords\":{\"latitude\":11.127122499999999,\"longitude\":78.6568942,\"altitude\":null,\"accuracy\":215723,\"altitudeAccuracy\":null,\"heading\":null,\"speed\":null},\"locationName\":\"\",\"timeStamp\":1602486129708,\"date\":\"2020-10-12T07:02:10.064Z\"}", "valueInfo": {} }, "inputclient": { "type": "String", "value": "clientPradeep UPDATE", "valueInfo": {} }, "funcaddclient": { "type": "String", "value": "clientPradeep ", "valueInfo": {} } }
      })
   }
   const handleSubmit = () => {
      setLoading(true);
      // ReactDOM.unmountComponentAtNode(document.getElementById('forms'));
      setTimeout(() => { setLoading(false); handleRenderForms(JSON.parse(window.atob(fieldsJson2))) }, 5000);
   }
   const getAllValues = () => {
      console.log(getValues());
   }
   if (loading) {
      return (<h3>Loading Forms...</h3>)
   }
   return (
      <div className="container content">
         <button onClick={() => handleRenderForms(JSON.parse(window.atob(fieldsJson3)))}>Render</button>
         <br />
         <label>Dynamic Forms</label>
         <br />
         <div id="forms" style={{ height: "400px", overflow: "auto" }}></div>
         <button onClick={() => handleSubmit()}>Submit</button>
         <button onClick={getAllValues}>Get Values</button>
      </div>
   )
}

export default Studio;