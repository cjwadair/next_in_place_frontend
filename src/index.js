import NextInPlaceEditor from './next_in_place_editor';

const NextInPlace = {
  addListeners: (nipSelector=null) => {
    let selector = nipSelector ? nipSelector : 'next-in-place';
    document.addEventListener("click", function(event){
      if (event.target.classList.contains(selector)){

        let nip = new NextInPlaceEditor(event.target.closest('.next-in-place'));

        // submit checkbox form directly - don't display form
        if(nip.formType === 'checkbox'){
          let current_value = nip.value;
          let new_value = nip.collection['false'];
          if (current_value === new_value){
            new_value = nip.collection['true']
          }
          nip.submitForm(new_value);
        } else {
          nip.activateForm();
        }
      }
    });
  }
}

export default NextInPlace;
