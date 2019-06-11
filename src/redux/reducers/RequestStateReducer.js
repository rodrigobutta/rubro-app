
const INITIAL_STATE = {
  category: null
};

// Actions
const SET_FORM_CATEGORY = 'RequestState/SET_FORM_CATEGORY';


export function setCategory($category) {   
  return {
    type: SET_FORM_CATEGORY,
    payload: {
        category: $category
    }
  };

}

export default function RequestStateReducer(state = INITIAL_STATE, action = {}) {

  switch (action.type) {
    
    case SET_FORM_CATEGORY:
      return { ...state, 
        category: action.payload.category
      };

    default:
      return state;
  }
}



