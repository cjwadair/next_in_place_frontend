export default class NextInPlaceEditor{
  constructor(e) {
    this.element = e;
    let data = this.element.dataset;
    this.value = data.nipValue;
    this.originalValue = data.nipOriginalValue;
    this.attributeName = data.nipAttribute;
    this.objectName = data.nipObject;
    this.formType = data.nipType;
    if(data.nipHtmlAttrs){
      this.htmlAttrs = JSON.parse(data.nipHtmlAttrs);
    }
    if(data.nipCollection){
      this.collection = JSON.parse(data.nipCollection);
    }
  }
  activateForm(){
    // submit checkbox form directly - don't display form

    this.form = this.generateForm();
    let formField = this.element.querySelector('.nip-form-field');
    formField.focus();
    if(formField.nodeName !== "SELECT" && formField['type'] !== "checkbox" ){
      this.element.querySelector('.nip-form-field').select();
    }
  }
  generateForm(){
    let form = document.createElement("form");
    form.setAttribute('class',"nip-form");
    form.addEventListener("submit", (ev) => {
      console.log('submit triggered');
      ev.preventDefault();
      document.activeElement.blur();
    });
    // TODO: Add a config option to to allow users to include/exclude this listener based on how they want the update to work...
    form.addEventListener("focusout", (ev) => {
      console.log('focusout triggered');
      ev.preventDefault();
      if(event.target.nodeName !== 'SELECT'){
        this.submitForm(form.firstChild.value);
      }
    });
    form.addEventListener("click", (ev) => {
      ev.preventDefault();
      if(event.target.nodeName === 'OPTION'){
        this.submitForm(form.firstChild.value);
      }
    });
    form.addEventListener("keydown", (ev) => {
      if (event.key === "Enter" && event.target.nodeName === 'TEXTAREA') {
        ev.preventDefault();
        document.activeElement.blur();
      }
      if(event.target.nodeName === 'OPTION'){
        ev.preventDefault();
        document.activeElement.blur();
      }
      if(event.key === "Escape"){
        ev.preventDefault();
        this.resetForm();
      }
    });
    this.element.innerHTML = "";
    this.element.appendChild(form);
    let formField = this.generateFormElement(this.formType);
    form.appendChild(formField);
    return form
  }
  generateFormElement(formType){
    let formElement;
    switch (formType) {
      case 'input':
        formElement = document.createElement("input");
        formElement.setAttribute('class',"nip-form-field");
        formElement.setAttribute('value', this.value);
        formElement.setAttribute('placeholder', this.value);
        break;
      case 'textarea':
        formElement = document.createElement("textarea");
        formElement.setAttribute('name', `${this.objectName}[${this.attributeName}]`);
        formElement.setAttribute('class', 'nip-form-field');
        formElement.value = this.value;
        Object.entries(this.htmlAttrs).forEach(attr => formElement.setAttribute(attr[0], attr[1]));
        break;
      case 'select':
        formElement = document.createElement("select");
        formElement.setAttribute('name', `${this.objectName}[${this.attributeName}]`);
        formElement.setAttribute('class', 'nip-form-field');
        formElement.value = this.value;
        let options = Object.entries(this.collection);
        formElement.setAttribute('size', options.length);
        Object.entries(this.collection).forEach(option =>{
          let el = document.createElement("option");
          el.text = option[0];
          el.value = option[1];
          if(el.value === this.value){
            el.setAttribute('selected', 'selected');
          }
          formElement.appendChild(el);
        })
        break;
      default:
        console.error('bip:error unsupported form field type');
    }
    return formElement
  }
  submitForm(new_value){
    if(this.value !== new_value){
      let value = this.stripTags(new_value)
      this.makeAjaxCall(value);
    } else{
      this.element.innerHTML = this.value;
    }
  }
  stripTags(val){
    // TODO: Add if stmt to only apply for input and textarea tags???
    return val.replace(/<\/?[^>]+(>|$)/g, "");
  }
  resetForm(){
    this.element.innerHTML = this.value;
  }
  makeAjaxCall(new_value){
    let self = this;
    let csrf = document.querySelector("meta[name=csrf-token]").content
    fetch(this.pathName(), {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRF-Token": csrf
      },
      body: this.formatRequestData(new_value),
    })
    .then(function(response){
      if(!response.ok){
        // // TODO: THROW ERROR WITH BETTER MESSAGING BASED ON STATUS CODES...
        throw new Error(`error: responded with code ${response.status}`);
      }
      return response.json();
    })
    .then(function(data){
      self.successHandler(data);
    })
    .catch(function (error) {
      self.errorHandler(error);
    });
  }
  pathName(){
    // TODO: add a url attribute to allow users to submit custom paths and use that in place of below when provided...
    let pathElements = this.element.id.split('-');
    return `/${pathElements[2]}s/${pathElements[1]}`
  }
  formatRequestData(new_value){
    // return `${this.objectName}[${this.attributeName}]=${new_value}`
    let attribute = this.attributeName;
    let model = this.objectName
    let attributes = {}
    attributes[this.attributeName] = new_value;
    let params = {};
    params[this.objectName] = attributes;

    return JSON.stringify(params);
  }
  successHandler(response){
    console.log(`updated ${this.attributeName}`, response);
    this.value = response[this.attributeName];
    this.element.dataset.nipValue = this.value;
    this.element.innerHTML = this.value;
    this.emitEvent('nip:success');
  }
  errorHandler(response){
    let attribute = this.attributeName
    console.error(`unable to update ${attribute}`, response);
    this.element.innerHTML = this.originalValue;
    this.emitEvent('nip:error');
  }
  emitEvent(eventName){
    // TODO: add polyfill to support custom events in ie back to ie9
    // See article saved in pocket for example polyfill
    let event = new CustomEvent(eventName);
    document.dispatchEvent(event);
  }
};
