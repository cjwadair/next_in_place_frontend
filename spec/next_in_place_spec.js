import NextInPlaceEditor from '../src/next_in_place_editor';
import NextInPlace from '../src/index';


function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

function click(el){
    var ev = document.createEvent('MouseEvent');
    ev.initMouseEvent(
        'mousedown',
        true /* bubble */, true /* cancelable */,
        window, null,
        0, 0, 0, 0, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null
    );
    el.dispatchEvent(ev);
}

describe("NextInPlace", function() {

  describe('activating the form on click', () =>{

    let nip;
    let element;
    let container;

    beforeEach(() => {
      container = document.createElement('div');
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
      nip = new NextInPlaceEditor(element);
      NextInPlace.addListeners();
    });

    xit('adds correct form element when next-in-place element clicked', () => {
      spyOn(nip, 'activateForm');
      click(element);
      // expect(element.closest('form')).not.toBeNull();
      expect(nip.activateForm).toHaveBeenCalled();
    });

  });
});
