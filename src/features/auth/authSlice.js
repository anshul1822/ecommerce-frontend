import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUser, loginUser, signOut, checkAuth } from './authAPI';
// import {updateUser} from '../user/userAPI';

const initialState = {
  loggedInUserToken : null,  // TODO : We want to store only id here, and move other details about user in userSlice
  status: 'idle',
  error : null
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.


export const createUSerAsync = createAsyncThunk(
  'auth/createUser',
  async ({name, email, password, addresses}) => {
    const response = await createUser({name, email, password, addresses});
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

// export const updateUserAsync = createAsyncThunk(
//   'auth/updateUser',
//   async (update) => {
//     const response = await updateUser(update);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );

export const loginUserAsync = createAsyncThunk(
  'auth/loginUser',
  async (loginInfo, {rejectWithValue}) => {

    try{
      const response = await loginUser(loginInfo);
      // console.log('loginUser', response);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }catch(err){
      // console.log(err);
      return rejectWithValue(err);
    }
  }
);

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async () => {

    try{
      const response = await checkAuth();
      // console.log('loginUser', response);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }catch(err){
      console.log(err);
      // return rejectWithValue(err);
    }
  }
);

export const signOutAsync = createAsyncThunk(
  'auth/signOut',
  async (userId) => {
    const response = await signOut(userId);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(createUSerAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUSerAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
      })
      // .addCase(checkAuthAsync.rejected, (state, action) => {
      //   state.status = 'idle';
      //   state.error = action.payload;
      // })
      // .addCase(updateUserAsync.pending, (state) => {
      //   state.status = 'loading';
      // })
      // .addCase(updateUserAsync.fulfilled, (state, action) => {
      //   state.status = 'idle';
      //   state.loggedInUserToken = action.payload; 
      // })
      .addCase(signOutAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signOutAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = null;
      });

  },
});

export const { increment, decrement, incrementByAmount } = authSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state) => state.counter.value;
export const selectLoggedInUserToken = (state) => state.auth.loggedInUserToken;
export const selectError = (state) => state.auth.error;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount) => (dispatch, getState) => {
//   const currentValue = selectCount(getState());
//   if (currentValue % 2 === 1) {
//     dispatch(incrementByAmount(amount));

//   }
// };

export default authSlice.reducer;
