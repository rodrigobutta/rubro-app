
const INITIAL_STATE = {
  category: null,
  expires: null,
  user: null
};

// Actions
const SET_FORM_CATEGORY = 'RequestState/SET_FORM_CATEGORY';
const RESET_TOKEN = 'RequestState/RESET_TOKEN';
const SET_USER = 'RequestState/SET_USER';
const RESET_USER = 'RequestState/RESET_USER';


export function setCategory($category) {   
  return {
    type: SET_FORM_CATEGORY,
    payload: {
        category: $category
    }
  };

}

export function resetToken() {
  return {type: RESET_TOKEN};
}

export function setUser($info) {
  
  return {
    type: SET_USER,
    payload: {
        info: $info        
    }
  };
}

export function resetUser() {
  return {type: RESET_USER};
}


export default function RequestStateReducer(state = INITIAL_STATE, action = {}) {

  switch (action.type) {
    
    case SET_FORM_CATEGORY:
      return { ...state, 
        category: action.payload.category
      };

    case RESET_TOKEN:
      return INITIAL_STATE;

    case SET_USER:         
      return { ...state, 
        user: action.payload.info      
      };

    case RESET_USER:
      return INITIAL_STATE;

        
    default:
      return state;
  }
}



