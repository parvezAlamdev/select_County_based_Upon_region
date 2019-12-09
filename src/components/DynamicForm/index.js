import React from "react";
import ReactDOM from "react-dom";
import "./form.css";
import { getAllCountries, getCountryInfo } from "../../service/postdata";
import Multiselect from "multiselect-dropdown-react";
import Select from "react-select";

export default class DynamicForm extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      receivedJSONDAsta: null,
      selectedOption: null,
      myError: [],
      selectedRegion: "Africa",
      selectedRegionCountries: null,
      countriesCurrencies: null,
      countriesTimeZone: null,
      countriesISOCode: null
    };
  }

  componentDidMount() {
    let receivedData = this.props && this.props.model;
    getAllCountries(this.state.selectedRegion).then(data => {
      this.setState({
        selectedRegionCountries: data.data,       
        receivedJSONDAsta: receivedData
      });
    });
  }
  loadCountriesOnRegionChange = value => {
    getAllCountries(value).then(data => {
      this.setState({
        selectedRegionCountries: data.data       
      });
    });
  };

  handleChange = (opt, value) => {
    let myVal = opt.value;
    let obj = {
      label: opt.label,
      value: opt.value
    };
    this.setState({
      [value.name]: obj
    });
    if (value.name == "selectCountry") {
      this.setState({
        countriesCurrencies: null,
        countriesTimeZone: null,
        countriesISOCode: null,
      },()=>{
        getCountryInfo(myVal).then(data => {
         this.setState({
          countriesCurrencies: data.data.currencies[0].code,          
          countriesTimeZone: data.data.timezones[0],
          countriesISOCode: data.data.cioc,
          timeZone:{
            name:data.data.timezones[0],
            label:data.data.timezones[0]
          },
          isoCode:{
            name:data.data.cioc,
            label:data.data.cioc
          },
          currency:{
            name:data.data.currencies[0].code,
            label:data.data.currencies[0].code
          }
         })
        });
      })
     
    }
  };

  onChange = (e, key, type = "single") => {
    let searchRegion = e.target.value;
    this.setState(
      {
        selectedRegionCountries: null,
        countriesCurrencies: null,
        countriesTimeZone: null,
        countriesISOCode: null,
        selectCountry: null,
        timeZone:null,
        isoCode:null,
        currency:null
      },
      () => {
        this.forceUpdate();
        this.loadCountriesOnRegionChange(searchRegion);
      }
    );
  };
  renderForm = () => {
    let model = this.state.receivedJSONDAsta;
    let defaultValues = this.props.defaultValues;
    var self = this;
    let formUI =
      model &&
      model.map(m => {
        var myselff = self;
        let key = m.key;
        let type = m.type || "text";
        let props = m.props || {};
        let name = m.name;
        let value = m.value;

        let target = key;
        value = this.state[target] || "";
        let input = (
          <input
            {...props}
            className={
              this.state.myError.indexOf(key) !== -1
                ? "form-input error-field"
                : "form-input "
            }
            type={type}
            key={key}
            name={name}
            value={value}
            onChange={e => {
              this.onChange(e, target);
            }}
          />
        );

        if (type == "select") {
          input = m.options.map(o => {
            return (
              <option
                {...props}
                className="form-input"
                key={o.key}
                value={o.value}
              >
                {o.value}
              </option>
            );
          });

          input = (
            <select
              value={this.state[key]}
              name={name}
              onChange={e => {
                this.onChange(e, m.key);
              }}
            >
              {input}
            </select>
          );
        }
        if (type == "multiselect") {
          let dataForMultipleSelection = [];
          if (m.key == "selectCountry") {
            this.state.selectedRegionCountries &&
              this.state.selectedRegionCountries.map(data => {
                let obj1 = {
                  label: data.name,
                  value: data.cioc
                };
                dataForMultipleSelection.push(obj1);
              });
            let self = this;
            input = (
              <Select
                name={name}
                value={
                  myselff.state.selectCountry
                    ? myselff.state.selectCountry
                    : null
                }
                onChange={(opt, meta) => this.handleChange(opt, meta)}
                options={dataForMultipleSelection}
              />
            );
          } else if (m.key == "currency") {           
                let obj1 = {
                  label: myselff.state.countriesCurrencies&&myselff.state.countriesCurrencies?myselff.state.countriesCurrencies:null,
                  value: myselff.state.countriesCurrencies&&myselff.state.countriesCurrencies?myselff.state.countriesCurrencies:null
                };
                dataForMultipleSelection.push(obj1);                           
            input = (
              <Select
                name={name}
                value={myselff.state.currency ? myselff.state.currency : null}
                onChange={(opt, meta) => this.handleChange(opt, meta)}
                options={dataForMultipleSelection}
              />
            );
          } else if (m.key == "isoCode") {            
                let obj1 = {
                  label: myselff.state.countriesISOCode&&myselff.state.countriesISOCode?myselff.state.countriesISOCode:null,
                  value: myselff.state.countriesISOCode&&myselff.state.countriesISOCode?myselff.state.countriesISOCode:null
                };
                dataForMultipleSelection.push(obj1);              
            input = (
              <Select
                name={name}
                value={myselff.state.isoCode ? myselff.state.isoCode : null}               
                onChange={(opt, meta) => this.handleChange(opt, meta)}
                options={dataForMultipleSelection}
              />
            );
          } else {           
                let obj1 = {
                  label:myselff.state.countriesTimeZone,
                  value:myselff.state.countriesTimeZone
                };
                dataForMultipleSelection.push(obj1);
            
            input = (
              <Select
                name={name}
                value={myselff.state.timeZone ? myselff.state.timeZone : null}
                onChange={(opt, meta) => this.handleChange(opt, meta)}
                options={dataForMultipleSelection}
              />
            );
          }

          let self = this;
          const { key } = self.state;
        }

        return (
          <div key={"g" + key} className="form-group">
            <label className="form-label" key={"l" + key} htmlFor={key}>
              {m.label}
            </label>
            {input}
          </div>
        );
      });
    return formUI;
  };

  render() {
    let title = this.props.title || "Dynamic Form";
    let model = this.state.receivedJSONDAsta;
    let defaultValues = this.props.defaultValues;

    return (
      <div className={this.props.className}>
        <h3 className="form-title text-center">{title}</h3>
        <form className="dynamic-form align-item-center">
          {this.renderForm()}
        </form>
      </div>
    );
  }
}
