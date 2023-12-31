import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { selectCartItems, updateCartAsync, deleteItemsFromCartAsync, fetchCartItemsAsync, selectCartStatus } from "../features/cart/CartSlice";
import { selectLoggedInUserToken } from "../features/auth/authSlice";
import { addToOrderAsync, selectCurrentOrder } from "../features/order/orderSlice";
import { updateUserAsync, fetchLoggedInUserDataAsync, selectLoggedInUserData } from "../features/user/userSlice";
import Modal from "../features/common/Modal";

const products = [
  {
    id: 1,
    name: "Throwback Hip Bag",
    href: "#",
    color: "Salmon",
    price: "$90.00",
    quantity: 1,
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg",
    imageAlt:
      "Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.",
  },
  {
    id: 2,
    name: "Medium Stuff Satchel",
    href: "#",
    color: "Blue",
    price: "$32.00",
    quantity: 1,
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
    imageAlt:
      "Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.",
  },
  // More products...
];

const person = [
  {
    name: "Leslie Alexander",
    email: "leslie.alexander@example.com",
    role: "Co-Founder / CEO",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Michael Foster",
    email: "michael.foster@example.com",
    role: "Co-Founder / CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Dries Vincent",
    email: "dries.vincent@example.com",
    role: "Business Relations",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: null,
  },
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    role: "Front-end Developer",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Courtney Henry",
    email: "courtney.henry@example.com",
    role: "Designer",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Tom Cook",
    email: "tom.cook@example.com",
    role: "Director of Product",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: null,
  },
];

function Checkout() {
  
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartState = useSelector(selectCartStatus);
  // console.log("cartItems at checkout page", cartItems);
  const userToken = useSelector(selectLoggedInUserToken);
  // console.log("user at checkout page", user);
  const currentOrder = useSelector(selectCurrentOrder);
  const userData = useSelector(selectLoggedInUserData);

  const [showModal, setShowModal] = useState(-1);

  console.log("currentOrder at checkout", currentOrder);

  const totalAmount = cartItems.reduce((amount, item) => Math.round(item?.product?.price * (1 - item?.product?.discountPercentage / 100)) * item.quantity + amount, 0)
  const totalItems = cartItems.reduce((amount, item) => item?.quantity + amount, 0)

  const handleQuantity = (e, item) => {
    // e.preventDefault();
    item = {...item, quantity : +e.target.value};
    dispatch(updateCartAsync({item}));
  }

  const handleDelete = (e, product) => {
    // const userId = user.id;
    console.log("handle Delete in Cart", product);
    const productId = product.id;
    dispatch(deleteItemsFromCartAsync(productId));
    dispatch(fetchCartItemsAsync());
  };

  const handleAddress = (e) =>{
    console.log(userData.addresses[e.target.value]);
    setSelectedAddress(userData.addresses[e.target.value]);
  }

  const handlePayment = (e) => {
    setPaymentMethod(e.target.value);
  }

  const handleOrder = (e) => {
    if(selectedAddress){
      // console.log(cartItems);
      // const userId = user.id;
      const order = {items : cartItems  , totalItems, totalAmount, paymentMethod, selectedAddress, status : 'pending'}; //other can be delivered received
      dispatch(addToOrderAsync(order));
    }
  else{
    alert('Please select a address');
  }


    //TODO : redirect to order-success page
    //TODO : clear cart after order
    //TODO : on server change the stock qty
  }

  useEffect(()=>{
    // console.log("Checkout");
    dispatch(fetchCartItemsAsync())
    // selectedAddress(user.addresses[0])
  },[dispatch])

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [open, setOpen] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState();
  const [paymentMethod, setPaymentMethod] = useState('cash');

  return (
    <>
    {!cartItems.length && <Navigate to='/login' replace={true}></Navigate>}
    
    {currentOrder && currentOrder.paymentMethod === 'cash' && <Navigate to={`/order-success/${currentOrder.id}`} replace={true}></Navigate>}

    {currentOrder && currentOrder.paymentMethod === 'card' &&
     <Navigate to={`/stripe-checkout`} replace={true}></Navigate>}

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 mt-10  gap-x-8 gap-y-10 lg:grid-cols-5">
        <div className="lg:col-span-3 bg-white px-4 py-6">
          <form
            noValidate
            onSubmit={handleSubmit((data) => {
              console.log(data);
              console.log("selected Address: ", selectedAddress);
              const newUser = {...userData, addresses : [...userData.addresses, data]};
                dispatch(updateUserAsync(newUser));
                dispatch(fetchLoggedInUserDataAsync());
                reset();              
            })}
          > 
            <h2 className="text-2xl font-semibold leading-7 text-gry-900">Personal Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600"> Use a permanent address where you can receive email</p>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register("name", {
                    required: 'name is required',
                    pattern:{
                      value : /^(([A-Za-z]+)(\s[A-Za-z]+)?)$/gm,
                      message : 'special characters not allowed'
                    }
                  })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.name && (
  <span className="text-red-500">{errors.name.message}</span>
)}
            </div>



            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  {...register("email", {
                    required: "email is required",
                    pattern: {
                      value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                      message: "email not valid",
                    },
                  })}
                  type="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.email && (
  <span className="text-red-500">{errors.email.message}</span>
)}
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone
              </label>
              <div className="mt-2">
              <input
                  id="phone"
                  {...register("phone", {
                    required: "phone is required"
                  })}
                  type="tel"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.phone && (
  <span className="text-red-500">{errors.phone.message}</span>
)}
            </div>

            <div className="col-span-full">
              <label
                htmlFor="street-address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Street address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register("street", {
                    required: 'street is required',
                  })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.street && (
  <span className="text-red-500">{errors.street.message}</span>
)}

            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register("city", {
                    required: 'city is required',
                  })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.city && (
  <span className="text-red-500">{errors.city.message}</span>
)}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="region"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                State / Province
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register("state", {
                    required: 'state is required',
                  })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.state && (
  <span className="text-red-500">{errors.state.message}</span>
)}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="postal-code"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register("pinCode", {
                    required: 'pincode is required',
                  })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.pinCode && (
  <span className="text-red-500">{errors.pinCode.message}</span>
)}
            </div>
            
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              onClick={() => reset()}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Address
            </button>
          </div>
          <p className="mt-1 text-sm leading-6 text-gray-600">
                Choose from existing Address
              </p>
              <ul role="list" className="divide-y divide-gray-100" >
              {/* <li
                    key={person[0].email}
                    className="flex justify-between gap-x-6 py-5"
                  >
                    <div className="flex gap-x-4">
                    <input
                      id={`address-${person[0].email}`}
                      name="address" //if name is same, then only 1 radio buttton is selected
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                      <img
                        className="h-12 w-12 flex-none rounded-full bg-gray-50"
                        src={person[0].imageUrl}
                        alt=""
                      />
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {person[0].name}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {person[0].email}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                      <p className="text-sm leading-6 text-gray-900">
                        {person[0].role}
                      </p>
                      {person.lastSeen ? (
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          Last seen{" "}
                          <time dateTime={person[0].lastSeenDateTime}>
                            {person[0].lastSeen}
                          </time>
                        </p>
                      ) : (
                        <div className="mt-1 flex items-center gap-x-1.5">
                          <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          </div>
                          <p className="text-xs leading-5 text-gray-500">
                            Online
                          </p>
                        </div>
                      )}
                    </div>
                  </li>                 */}
                {userData?.addresses?.map((person, index) => (
                  <li
                    key={person.email}
                    className="flex justify-between gap-x-6 py-5"
                  >
                    <div className="flex gap-x-4">
                    <input
                      id={`address-${person.email}`}
                      name="address" //if name is same, then only 1 radio buttton is selected
                      type="radio"
                      onChange={handleAddress}
                      value={index}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                      <img
                        className="h-12 w-12 flex-none rounded-full bg-gray-50"
                        src={person.imageUrl}
                        alt=""
                      />
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {person.name}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {person.email}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                      <p className="text-sm leading-6 text-gray-900">
                        {person.role}
                      </p>
                      {person.lastSeen ? (
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          Last seen{" "}
                          <time dateTime={person.lastSeenDateTime}>
                            {person.lastSeen}
                          </time>
                        </p>
                      ) : (
                        <div className="mt-1 flex items-center gap-x-1.5">
                          <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          </div>
                          <p className="text-xs leading-5 text-gray-500">
                            Online
                          </p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Notifications
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              We'll always let you know about important changes, but you pick
              what else you want to hear about.
            </p>

            <div className="mt-10 space-y-10">
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">
                  Payment Method
                </legend>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  These are delivered via SMS to your mobile phone.
                </p>
                <div className="mt-6 space-y-6">
                  <div className="flex items-center gap-x-3">
                    <input
                      id="cash-payment"
                      onChange={handlePayment}
                      value="cash"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === "cash"}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="cash-payment"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Cash
                    </label>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="card-payment"
                      onChange={handlePayment}
                      value="card"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === "card"}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="card-payment"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Card
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          </form> 
            

        </div>
        <div className="lg:col-span-2">
        <div className="mx-auto my-5 bg-white max-w-7xl p-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
            Cart
          </h1>
          <div className="mt-4">
            <div className="flow-root">
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                {cartItems.map((product) => (
                  product?.product && 
                  <li key={product.product.id} className="flex py-6 my-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={product.product.thumbnail}
                        alt={product.product.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <a href={product.href}>{product.title}</a>
                          </h3>
                          <span>
                            {" "}
                            <p className="text-sm font-medium text-gray-400 line-through">
                              ${product.product.price}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              $
                              {Math.round(
                                product.product.price *
                                  (1 - product.product.discountPercentage / 100)
                              )}
                            </p>
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.product.color}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex w-32 items-center justify-between text-gray-500 ">
                          Qty:{" "}
                          <select
                            value={product.quantity}
                            onChange={(e) => handleQuantity(e, product)}
                            className="!appearance-none  w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="1">1 </option>
                            <option value="2">2 </option>
                            <option value="3">3 </option>
                            <option value="4">4 </option>
                            <option value="5">5 </option>
                          </select>
                        </div>

                        <Modal
                          title={`Delete Cart Item ${product.product.title}`}
                          message={`Are you sure you want to delete ${product.product.title} ?`}
                          dangerOption="Delete"
                          cancelOption="Cancel"
                          cancelAction={() => setShowModal(-1)}
                          dangerAction={(e) => handleDelete(e, product.product)}
                          showModal={showModal === product.product.id}
                        />
                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => setShowModal(product.product.id)} // Use a function to capture the current product id
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 py-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${totalAmount}</p>
            </div>
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Total Items</p>
              <p>{totalItems}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex justify-around mt-6">
                {/* <Link to='/order-success/:id'> */}
                <Link to='/cart'>
                <button
                  className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Go to Cart
                </button>                
                </Link>
                <button
                  onClick={handleOrder}
                  className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Order Now
                </button>
            </div>    
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                or
                <Link to="/">
                  <button
                    type="button"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                    onClick={() => setOpen(false)}
                  >
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </button>
                </Link>
              </p>
            </div>
          </div>
        </div>

          {/* <div className=" bg-white max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Cart
            </h1>
            <div className="mt-4">
              <div className="flow-root">
              <ul role="list" className="-my-6 divide-y divide-gray-200">
            {cartItems.map((product) => (
              <li key={product.product.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={product.product.thumbnail}
                    alt={product.product.title}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <a href={product.product.href}>{product.product.title}</a>
                      </h3>
                      <span>
                        {" "}
                        <p className="text-sm font-medium text-gray-400 line-through">
                          ${product.product.price}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          $
                          {Math.round(
                            product.product.price *
                              (1 - product.product.discountPercentage / 100)
                          )}
                        </p>
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.color}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="text-gray-500">
                      Qty{" "}
                      <select className="w-24 !appearance-none" onChange={(e) => handleQuantity(e, product)} value={product.quantity}>
                        <option value="1">1 </option>
                        <option value="2">2 </option>
                        <option value="3">3 </option>
                        <option value="4">4 </option>
                        <option value="5">5 </option>
                      </select>{" "}
                    </div>

                    <div className="flex">
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, product.product.id)}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 py-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>${totalAmount}</p>
        </div>
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Total Items</p>
          <p>{totalItems}</p>
        </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="flex justify-around mt-6">
                
                <Link to='/cart'>
                <button
                  className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Go to Cart
                </button>                
                </Link>
                <button
                  onClick={handleOrder}
                  className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Order Now
                </button>
                

              </div>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                  or
                  <Link to="/">
                    <button
                      type="button"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                      onClick={() => setOpen(false)}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
    </>
  );
}

export default Checkout;
