import React, { Component } from "react";
import DynamicForm from "./components/DynamicForm";
import "./App.css";

class App extends Component {
  state = {    
    current: {}
  }; 
  render() {

    return (
      <div className="App">
       
        <DynamicForm
          key={this.state.current.id}
          className="form"
          title="Registration"
          defaultValues={this.state.current}
          model={[
           
                
            {
              key: "region",
              label: "Select Region",
              type: "select",            
              name:"region",
              options: [
                { key: "Africa", label: "Africa", value: "Africa" },
                { key: "Americas", label: "Americas", value: "Americas" },
                { key: "Asia", label: "Asia", value: "Asia" },
                { key: "Europe", label: "Europe", value: "Europe" },
                { key: "Oceania", label: "Oceania", value: "Oceania" }
              ]
            },
            {
              key: "selectCountry",
              label: "Select Country",
              type: "multiselect",            
              name:"selectCountry"
              
            },
            {
              key: "timeZone",
              label: "Time Zone",
              type: "multiselect",           
              name:"timeZone"
              
            },
            {
              key: "currency",
              label: "Currency",
              type: "multiselect",         
              name:"currency"
             
            },  
            {
              key: "isoCode",
              label: "ISO Code",
              type: "multiselect",         
              name:"isoCode"
             
             }                   
          ]}         
        />
      </div>
    );
  }
}

export default App;
