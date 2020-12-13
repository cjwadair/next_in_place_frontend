import NextInPlaceEditor from '../src/next_in_place_editor';

function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

describe("NextInPlaceEditor", function() {

  describe('the class constructor method', () => {

    let result;
    let element;

    beforeAll(() => {
      element = document.createElement('span');
      setAttributes(element, {
        'id': 'nip-1-product',
        'class':'next-in-place',
        'data-nip-attribute': 'sku',
        'data-nip-type': 'input',
        'data-nip-original-value': '999',
        'data-nip-value': '999',
        'data-nip-object': 'product'
      });
      result = new NextInPlaceEditor(element);
    });

    it('sets attributeName correctly', () => {
      expect(result.attributeName).toBe('sku');
    });

    it('sets objectName correctly', () => {
      expect(result.objectName).toBe('product');
    });

    it('sets value correctly', () => {
      expect(result.value).toBe('999');
    });

    it('sets originalValue correctly', () => {
      expect(result.originalValue).toBe('999');
    });

    it('sets formType correctly when value provided', () => {
      expect(result.formType).toBe('input')
    });

    it('sets element attribute correctly', () => {
      expect(result.element).toEqual(element);
    });

    it('does not create dataAttr attribute when not in dataset', () => {
      expect(result.dataAttrs).toBeUndefined();
    });

    it('does not create collection attribute when not in dataset', () => {
      expect(result.collection).toBeUndefined();
    });
  });

  describe('constructor method with dataAttrs and collection atributes', () => {

    let result;
    let element;

    beforeAll(() => {
      element = document.createElement('span');
      setAttributes(element, {
        'class':'next-in-place',
        'data-nip-attribute': 'sku',
        'data-nip-type': 'input',
        'data-nip-original-value': '999',
        'data-nip-value': '999',
        'data-nip-object': 'product',
        'data-nip-collection': '{"beer":"beer", "wine":"wine"}',
        'data-nip-html-attrs': '{"rows":"5", "cols":"10"}'
      });
      result = new NextInPlaceEditor(element);
    });

    it('creates collection attribute in element attributes', () => {
      expect(result.collection).not.toBeUndefined();
    });

    // TODO: Get test working to ensure values are correctly formatted...
    it('creates htmlAttrs attribute in element attributes', () => {
      // let expected = JSON.parse('{"hello": "hello"}');
      expect(result.htmlAttrs).not.toBeUndefined();
      // expect(result.collection).toBe(expected);
    });
  });

  describe('pathName and formatRequestData methods without a url provided', () => {

    let result;

    beforeAll(() => {
      let element = document.createElement('span');
      setAttributes(element, {
        'id': 'nip-1-product',
        'class':'next-in-place',
        'data-nip-attribute': 'sku',
        'data-nip-type': 'input',
        'data-nip-original-value': '999',
        'data-nip-value': '999',
        'data-nip-object': 'product',
        'data-nip-collection': '{"beer":"beer", "wine":"wine"}',
        'data-nip-html-attrs': '{"rows":"5", "cols":"10"}'
      });
      result = new NextInPlaceEditor(element);
    });

    it('returns correctly formatted path name', () => {
      expect(result.pathName()).toBe('/products/1')
    })

    it('returns correctly formatted request data string', () => {
      expect(result.formatRequestData('202')).toBe('{"product":{"sku":"202"}}')
    })

  });

  describe('pathName with url provided', () => {

    let result;

    beforeAll(() => {
      let element = document.createElement('span');
      setAttributes(element, {
        'id': 'nip-1-product',
        'class':'next-in-place',
        'data-nip-attribute': 'sku',
        'data-nip-type': 'input',
        'data-nip-original-value': '999',
        'data-nip-value': '999',
        'data-nip-object': 'product',
        'data-nip-collection': '{"beer":"beer", "wine":"wine"}',
        'data-nip-html-attrs': '{"rows":"5", "cols":"10"}',
        'data-nip-url': '/not/standard/path/47'
      });
      result = new NextInPlaceEditor(element);
    });

    it('returns correctly formatted path name when url parameter not provided', () => {
      expect(result.pathName()).toBe('/not/standard/path/47');
    })

  });

  describe('submitForm', () => {
    let nip;

    beforeEach(() => {
      let element = document.createElement('span');
      setAttributes(element, {
        'id': 'nip-1-product',
        'class':'next-in-place',
        'data-nip-attribute': 'sku',
        'data-nip-type': 'input',
        'data-nip-original-value': '999',
        'data-nip-value': '999',
        'data-nip-object': 'product',
        'data-nip-collection': '{"beer":"beer", "wine":"wine"}',
        'data-nip-html-attrs': '{"rows":"5", "cols":"10"}'
      });
      nip = new NextInPlaceEditor(element);
      spyOn(nip, 'makeAjaxCall');
    });

    it('should update when value has been edited', () => {
      nip.submitForm('111');
      expect(nip.makeAjaxCall).toHaveBeenCalled();
      expect(nip.makeAjaxCall).toHaveBeenCalledTimes(1);
    });

    it('should not update when value is unchanged', () => {
      nip.submitForm("999");
      expect(nip.makeAjaxCall).not.toHaveBeenCalled();
    });
  });

  describe('stripHtmlTags', () => {

    let nip;
    let element;

    beforeAll(() => {
      element = document.createElement('span');
      setAttributes(element, {
        'id': 'nip-1-product',
        'class':'next-in-place',
        'data-nip-attribute': 'sku',
        'data-nip-type': 'input',
        'data-nip-original-value': '999',
        'data-nip-value': '<p>Some Statement</p>',
        'data-nip-object': 'product',
        'data-nip-collection': '{"beer":"beer", "wine":"wine"}',
        'data-nip-html-attrs': '{"rows":"5", "cols":"10"}'
      });
      nip = new NextInPlaceEditor(element);
    });

    it('strips out html tags from submitted values', () => {
      let result = nip.stripTags(nip.value);
      expect(result).toEqual('Some Statement');
    });
  });

  describe('resetForm', () => {

    let nip;
    let element;

    beforeEach(() => {
      element = document.createElement('span');
      setAttributes(element, {
        'id': 'nip-1-product',
        'class':'next-in-place',
        'data-nip-attribute': 'sku',
        'data-nip-type': 'input',
        'data-nip-original-value': '999',
        'data-nip-value': '999',
        'data-nip-object': 'product',
        'data-nip-collection': '{"beer":"beer", "wine":"wine"}',
        'data-nip-html-attrs': '{"rows":"5", "cols":"10"}'
      });
      nip = new NextInPlaceEditor(element);
    });

    it('should update when value has been edited', () => {
      element.innerHTML = "111"
      nip.resetForm();
      expect(element.innerHTML).toBe("999");
    });
  });

  describe('makeAjaxCall', () => {

    let nip;

    beforeEach(() => {
      let element = document.createElement('span');
      setAttributes(element, {
        'id': 'nip-1-product',
        'class':'next-in-place',
        'data-nip-attribute': 'sku',
        'data-nip-type': 'input',
        'data-nip-original-value': '999',
        'data-nip-value': '999',
        'data-nip-object': 'product',
        'data-nip-collection': '{"beer":"beer", "wine":"wine"}',
        'data-nip-html-attrs': '{"rows":"5", "cols":"10"}'
      });
      nip = new NextInPlaceEditor(element);
    });

    xit("responds correctly on success callback", function() {
      // TODO: MOCK THE AJAX CALL AND ADD TEST
    });

    xit("responds correctly on error callback", function() {
      // TODO: MOCK THE AJAX CALL AND ADD TEST
    });

  });

  describe('emit event method', () => {
    let nip;

    beforeAll(() => {
      let element = document.createElement('span');
      setAttributes(element, {
        'id': 'nip-1-product',
        'class':'next-in-place',
        'data-nip-attribute': 'sku',
        'data-nip-type': 'input',
        'data-nip-original-value': '999',
        'data-nip-value': '999',
        'data-nip-object': 'product',
        'data-nip-collection': '{"beer":"beer", "wine":"wine"}',
        'data-nip-html-attrs': '{"rows":"5", "cols":"10"}'
      });
      nip = new NextInPlaceEditor(element);
    });

    it('emits a custom event with correct event type', () => {
      let eventMessage = 'nip:success';
      let emitEventSpy = spyOn(nip, 'emitEvent').and.returnValue(eventMessage);

      nip.emitEvent(eventMessage)
      expect(emitEventSpy).toHaveBeenCalled();
      expect(emitEventSpy).toHaveBeenCalledWith('nip:success');
    });
  });

  describe('activating form with input element',() => {

    let nip;
    let element;
    let form;

    beforeAll(() => {
      element = document.createElement('span');
      setAttributes(element, {
        'id': 'nip-1-product',
        'class':'next-in-place',
        'data-nip-attribute': 'sku',
        'data-nip-type': 'input',
        'data-nip-original-value': '999',
        'data-nip-value': '999',
        'data-nip-object': 'product',
        'data-nip-collection': '{"beer":"beer", "wine":"wine"}',
        'data-nip-html-attrs': '{"rows":"5", "cols":"10"}'
      });
      nip = new NextInPlaceEditor(element);
      form = nip.activateForm();
    });

    it('adds form to element when element is clicked', () => {
      expect(element.querySelector('.nip-form')).not.toBeNull();
      expect(element.querySelector('.nip-form').nodeName).toBe('FORM');
    })

    it('adds input element to the DOM when activated', () => {
      let expectedNodeValue = nip.formType.toUpperCase();
      expect(element.querySelector('.nip-form-field')).not.toBeNull();
      expect(element.querySelector('.nip-form-field').nodeName).toBe(expectedNodeValue);
    })

    it('set the input element value correctly', () => {
      expect(element.querySelector('.nip-form-field').value).toBe(nip.value);
    })

    it('sets the placeholder attribute correctly', () => {
      expect(element.querySelector('.nip-form-field')['placeholder']).toBe(nip.value);
    })
  });

  describe('activating form with select element',() => {
    let nip;
    let element;
    let form;

    beforeAll(() => {
      element = document.createElement('span');
      setAttributes(element, {
        'id': 'nip-1-product',
        'class':'next-in-place',
        'data-nip-attribute': 'sku',
        'data-nip-type': 'select',
        'data-nip-original-value': 'beer',
        'data-nip-value': 'beer',
        'data-nip-object': 'product',
        'data-nip-collection': '{"beer":"beer", "wine":"wine"}',
        'data-nip-html-attrs': '{"rows":"5", "cols":"10"}'
      });
      nip = new NextInPlaceEditor(element);
      form = nip.activateForm();
    });

    it('adds form to element when element is clicked', () => {
      expect(element.querySelector('.nip-form')).not.toBeNull();
      expect(element.querySelector('.nip-form').nodeName).toBe('FORM');
    })

    it('adds select element to the DOM when activated', () => {
      let expectedNodeValue = nip.formType.toUpperCase();
      expect(element.querySelector('.nip-form-field')).not.toBeNull();
      expect(element.querySelector('.nip-form-field').nodeName).toBe(expectedNodeValue);
    });

    it('sets the value of the select element correctly', () => {
      expect(element.querySelector('.nip-form-field').value).toBe(nip.value);
    });

    it('sets name attribute correctly on select field', () => {
      let expected_name = `${nip.objectName}[${nip.attributeName}]`
      expect(element.querySelector('.nip-form-field')['name']).toBe(expected_name);
    });

    it('sets size attribute correctly on select field', () => {
      let collection_length = Object.keys(nip.collection).length;
      expect(element.querySelector('.nip-form-field')['size']).toBe(collection_length);
    });

    it('adds options to the select element correctly', () =>{
      let options = element.querySelectorAll('.nip-form-field option');
      expect(options.length).toBe(2);
      // TODO: add a test to make sure correct values are set on options...
    });

    it('sets the selected option correctly', () =>{
      let selected_option = element.querySelectorAll('.nip-form-field option[selected="selected"]');
      expect(selected_option.length).toBe(1);
      expect(selected_option[0].value).toBe(nip.value);
    });
  });

  describe('activating form with textarea element',() => {
    let nip;
    let element;
    let form;

    beforeEach(() => {
      element = document.createElement('span');
      setAttributes(element, {
        'id': 'nip-1-product',
        'class':'next-in-place',
        'data-nip-attribute': 'sku',
        'data-nip-type': 'textarea',
        'data-nip-original-value': 'beer is wonderful',
        'data-nip-value': 'beer is wonderful',
        'data-nip-object': 'product',
        'data-nip-html-attrs': '{"rows":"5", "cols":"10"}'
      });
      nip = new NextInPlaceEditor(element);
      form = nip.activateForm();
    });

    it('adds textaea element to the DOM when activated', () => {
      let expectedNodeValue = nip.formType.toUpperCase();
      expect(element.querySelector('.nip-form-field')).not.toBeNull();
      expect(element.querySelector('.nip-form-field').nodeName).toBe(expectedNodeValue);
    });

    it('sets value correctly', () => {
      expect(element.querySelector('.nip-form-field').value).toBe(nip.value);
    });

    it('sets name attribute correctly', () => {
      let expected_name = `${nip.objectName}[${nip.attributeName}]`
      expect(element.querySelector('.nip-form-field')['name']).toBe(expected_name);
    });

    it('sets specified html attributes correctly', () => {
      expect(element.querySelector('.nip-form-field')['rows']).not.toBeNull();
      expect(element.querySelector('.nip-form-field')['rows']).toBe(5);
    });
  });

});
